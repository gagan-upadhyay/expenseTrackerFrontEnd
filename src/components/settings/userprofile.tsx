"use client";

import { useUser } from "@/src/context/userContext";
import { updateUserProfile } from "@/src/services/userService";
import { NewUser } from "@/src/utils/definitions";
import { validateEmail } from "@/src/utils/validators";
import Image from "next/image";
import { useEffect, useState } from "react";
import PencilIcon from "../ui/buttons/pencilIcon";
import {
  getPasswordType,
  passwordUtitlity,
  sendOTP,
  verifyOTPStatus,
} from "@/src/utils/data";
import { MoonLoader } from "react-spinners";
import clsx from "clsx";
import { useDebouncedCallback } from "use-debounce";
import { toastShowError } from "@/src/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import Close from "../ui/Close";
import { Button } from "../ui/buttons/buttons";
import TooltipIcon from "../ui/informationMessage";

// -------------------------------------------------------------
// ✅ MAIN COMPONENT
// -------------------------------------------------------------
export default function UserProfile() {
  const { user } = useUser();

  // -------------------------------------------------------------
  // ✅ STATE
  // -------------------------------------------------------------
  const [localInput, setLocalInput] = useState<Partial<NewUser>>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [otp, setOtp] = useState<string>("");
  const [otpStatus, setOtpStatus] = useState<
    "idle" | "error" | "sending" | "usedEmail" | "sent"
  >("idle");

  const [otpResult, setOTPResult] = useState<
    "fetching" | "matched" | "wrongOTP" | "idle" | "error"
  >("idle");

  const [validEmail, setValidEmail] = useState<boolean | "">("");
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);

  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [eyeOpen, setEyeOpen] = useState(false);

  const [passwordType, setPasswordType] = useState<
    "" | "PASSWORD" | "GOOGLE"
  >("");

  const [passwordStatus, setPasswordStatus] = useState<
    "incorrect" | "Matched" | "" | "issue"
  >("");

  const [newPasswordStatus, setNewPasswordStatus] = useState<
    "compliant" | "non-compliant" | ""
  >("");

  // -------------------------------------------------------------
  // ✅ FORMDATA
  // -------------------------------------------------------------
  const [formData, setFormData] = useState<NewUser>({
    firstname: "",
    lastname: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    profile_picture: undefined,
  });

  // -------------------------------------------------------------
  // ✅ INIT DATA WHEN USER LOADS
  // -------------------------------------------------------------
  useEffect(() => {
    if (user) {
      const data = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile_picture: user.profile_picture,
        oldPassword: "",
        newPassword: "",
      };

      setFormData(data);
      setLocalInput(data);
      setPreview(user.profile_picture ?? null);
    }
  }, [user]);

    const toggleEyeOpen = ()=>{
        console.log("Inside toggleEyeOpen");
        setEyeOpen(!eyeOpen);
    }

  // -------------------------------------------------------------
  // ✅ FETCH PASSWORD TYPE (PASSWORD vs GOOGLE)
  // -------------------------------------------------------------
  useEffect(() => {
    const fetch = async () => {
      try {
        const res:{message:"PASSWORD"|"GOOGLE"} = await getPasswordType() as {message:"PASSWORD"|"GOOGLE"};
        setPasswordType(res.message);
      } catch (err) {
        console.error(err);
      }
    };

    if (localInput.email) fetch();
  }, [localInput.email]);

  // -------------------------------------------------------------
  // ✅ SEND OTP
  // -------------------------------------------------------------
  const sendOTPfunction = async () => {
    try {
      setOTPResult("idle");
      setOtpStatus("sending");
      setValidEmail("");

      const result = await sendOTP(
        `${localInput.firstname}`,
        localInput.email!,
        "emailChange"
      );

      if (result === "Email is not valid") {
        setValidEmail(false);
        setOtpStatus("error");
        return;
      }

      if (result === "Email already in use") {
        setOtpStatus("usedEmail");
        return;
      }

      if (result === "Error" || result === "Failed to send OTP") {
        setOtpStatus("error");
        return;
      }

      setValidEmail(true);
      setOtpStatus("sent");
    } catch (err) {
      console.error(err);
      setOtpStatus("error");
    }
  };

  // -------------------------------------------------------------
  // ✅ VERIFY OTP
  // -------------------------------------------------------------
  const verifyOTP = async (otpNum: number) => {
    try {
      setOTPResult("fetching");
      const result:{message:string} = await verifyOTPStatus(String(otpNum), localInput.email!) as {message:string};

      if (result.message === "Invalid or expired OTP") {
        setOTPResult("wrongOTP");
      }

      if (result.message === "OTP verified successfully") {
        setOTPResult("matched");
      }
    } catch (err) {
      console.error(err);
      setOTPResult("error");
    }
  };

  const OTPInputField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setOtp(raw);
    console.log("OTP set:", otp);
    if (raw.length === 4) verifyOTP(Number(raw));
  };

  // -------------------------------------------------------------
  // ✅ HANDLE INPUT CHANGES
  // -------------------------------------------------------------
  const debouncedUpdate = useDebouncedCallback(
    (name: keyof NewUser, value: string) => {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === "email" && !validateEmail(value)) {
        setValidEmail(false);
      }
    },
    800
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profilePicture" && files?.[0]) {
      setFormData({ ...formData, profile_picture: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      return;
    }

    if (name === "oldPassword" || name === "newPassword") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      debouncedUpdate(name as keyof NewUser, value);
      return;
    }

    if (name === "email") {
      if (otpResult === "matched") {
        setLocalInput((p) => ({ ...p, email: value }));
        debouncedUpdate("email", value);
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    debouncedUpdate(name as keyof NewUser, value);
  };

  // -------------------------------------------------------------
  // ✅ CHECK PASSWORD
  // -------------------------------------------------------------
  const checkPasswordFunction = async (
    action: "checkPassword" | "changePassword"
  ) => {
    if (passwordType !== "PASSWORD") return;

    const result =
      (await passwordUtitlity(
        formData.oldPassword,
        action,
        action === "changePassword" ? formData.newPassword : undefined
      )) ?? "";

    if (action === "checkPassword") {
      if (!result || result === "No Password received")
        setPasswordStatus("issue");
      else if (result === "Wrong Password") setPasswordStatus("incorrect");
      else if (result === "Password Matched") setPasswordStatus("Matched");
      else setPasswordStatus("");
    }

    if (action === "changePassword") {
      if (typeof result === "object" && result !== null && "message" in result) {
        if (result.message === "Password changed")
          setNewPasswordStatus("compliant");
        else setNewPasswordStatus("non-compliant");
      } else {
        setNewPasswordStatus("non-compliant");
      }
    }
  };

  // -------------------------------------------------------------
  // ✅ RESET FIELD
  // -------------------------------------------------------------
  const resetValues = (key: keyof NewUser) => {
    if (key === "email") {
      setOTPResult("idle");
      setOtpStatus("idle");
      setValidEmail("");
    }
    if (key === "oldPassword") setPasswordStatus("");
    if (key === "newPassword") setNewPasswordStatus("");

    setFormData((prev) => ({ ...prev, [key]: "" }));
  };

  // -------------------------------------------------------------
  // ✅ TOGGLE EMAIL / PASSWORD PANELS
  // -------------------------------------------------------------
  const toggleChangeEmail = () => {
    setChangeEmailOpen((prev) => !prev);
    setOtp("");
    setOTPResult("idle");
    setOtpStatus("idle");
    setValidEmail("");
  };

  const toggleChangePassword = () => {
    setChangePasswordOpen((prev) => !prev);
  };

  // -------------------------------------------------------------
  // ✅ SUBMIT FORM
  // -------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpStatus === "sent" && otpResult !== "matched") {
      toastShowError("Please verify the Email before submitting", 500);
      return;
    }

    setLoading(true);

    try {
      const result:{success:boolean} = await updateUserProfile({
        firstName:
          formData.firstname || localInput.firstname || formData.firstname,
        lastName: formData.lastname,
        email: formData.email,
        password: formData.newPassword,
        profilePicture:
          typeof formData.profile_picture === "object"
            ? formData.profile_picture
            : undefined,
      }) as {success:boolean};

      setLoading(false);
      if (result.success) toastShowError("Profile Updated ✅", 500);
      else toastShowError("Error updating profile", 500);
    } catch (err) {
      setLoading(false);
      toastShowError("Something went wrong ❌", 1000);
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // ✅ UI
  // -------------------------------------------------------------
  return (
        <form onSubmit={handleSubmit} className="md:space-y-5 space-y-2 select-none outline-none rounded-md p-2 w-full transition-all ease-in-out duration-500">
            <h1 className="md:text-xl text-md underline px-2"> User settings</h1>
            {/** -----First Row: fName lName Image-------- */}
            <div className="flex w-100 md:mb-0 mb-6 h-10 ">
                {/** User name and last name */}
                <div className="flex xl:flex-row flex-col">
                    {/** ----------First name-------- */}
                    <div className="flex flex-col pl-4 ">
                        <div className="flex">
                            <input id="firstname" 
                            name="firstname" 
                            className='border-b focus:outline-none focus:shadow-lg border-gray-300 rounded-md shadow-md w-40 pr-7 pl-3 text-sm md:text-md md:py-2 py-2 transition-all duration-500 ease-in-out' 
                            placeholder="First name" 
                            value={formData?.firstname}
                            onChange={handleChange}
                            />
                            <Close
                            eyeOpen={false}
                            eye={false}
                            disabled={false}
                            onReset={()=>resetValues('firstname')}
                            onToggleEye={()=>{}}
                            AdjustXClass={'left-[-20] top-2'}
                            />
                            {/* <span className=" relative bg-red-100 w-5 "> */}
                            {formData?.firstname===''?<TooltipIcon classX='top-[-45] ml-[-30] w-40' message="First Name should contain A-Z, a-z and not more than 10 words" />:null}
                        {/* </span> */}
                        </div>
                        {formData.firstname===''&& loading && <p className="text-red-500 text-sm ">First name cannot be blank</p>}
                    </div>
                    {/** ----------End--First name-------- */}

                    {/** ----------last name-------- */}
                    <div className="flex">   
                        <div className="flex px-4  my-1">
                            <input id="lastname"  
                            name="lastname" 
                           className='border-b focus:outline-none focus:shadow-lg border-gray-300 rounded-md shadow-md w-40 pr-7 pl-3 text-sm md:text-md md:py-1 py-2 transition-all duration-500 ease-in-out'
                            placeholder="Last Name" 
                            value={formData?.lastname} 
                            onChange={handleChange} />
                            <Close
                            eyeOpen={false}
                            eye={false}
                            disabled={false}
                            onReset={()=>resetValues('lastname')}
                            onToggleEye={()=>{}}
                            AdjustXClass={'md: left-[-20] top-1'}/>
                        </div>
                    </div> 
                    {/** --------End--Last name-------- */}
                </div>
                 {/** ----End----User name and last name ---*/}

                  {/** -----userImage-------- */}
                <div className="relative transition-all ease-in-out duration-500 md:w-23 md:h-23 h-15 w-15 sm:h-20 sm:w-20 md:top-[-25] sm:left-10 md:left-[-39] lg:left-40 xl:left-3 lg:top-[-20] lg:w-25 lg:h-25 xl:w-40 xl:h-40">
                    <Image
                    src={preview||user?.profile_picture||'/profilePicture.jpg'}
                    alt="UserImage"
                    className="md:w-23 md:h-23 sm:h-20 sm:w-20 lg:w-25 lg:h-25 h-15 w-15 overflow-hidden  rounded-full object-cover hover:border-blue-600 border-2 transition-all ease-in-out duration-500"
                    width={50} height={50}/>

                    <PencilIcon newClass="relative top-[-27] md:top-[-35] md:ml-17 ml-10 transition-all duration-500 ease-in-out" htmlFor="profilePicture"/>
                    <input
                    id="profilePicture"
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    />
                    <label htmlFor="profilePicture" className="flex relative top-[-16] md:left-2 md:text-xs lg:text-lg text-sm whitespace-nowrap items-center ">
                    Profile Picture
                    </label>
                </div>
                {/** ----End----userImage-------- */}

            </div>
            {/** -----First Row: fName lName Image-------- */}

            <div className={clsx(
                "flex relative md:top-0 py-3 top-5  px-4",
                changeEmailOpen===false && 'h-14',
                changeEmailOpen===true && 'h-30'

            )}> {/** second div2: will check email with otp  */}
                <div className="flex flex-col xl:mt-0 md:mt-10">
                    <p className="transition-all ease-in-out duration-500 xl:w-47 w-36 cursor-pointer hover:underline xl:text-lg text-sm" onClick={toggleChangeEmail}>Wanna Change Email?</p>
                        
                        {changeEmailOpen && <div>
                            <input
                            name="email"
                            type="email"
                            id="email"
                            className={clsx(
                                "border-b pr-4 focus:outline-none  focus:shadow-lg border-gray-300 rounded-md shadow-md xl:w-50 xl:pl-3 xl:mt-2 w-40 xl:text-md pr-4 text-sm pl-2 h-9 transition-all duration-500 ease-in-out", 
                                validEmail === false || otpStatus==='usedEmail'  && 'border-red-500',
                                validEmail === true && 'border-green-500'
                            )}
                            placeholder="Email"
                            value={formData?.email }
                            onChange={handleChange}
                            />
                            {/* <button onClick={()=>resetValues('email')} className="relative cursor-pointer outline-none md:w-5 w-4 h-4 md:left-[-25] left-[-18] top-1">
                                <XMarkIcon/>
                            </button>  */}
                            <Close
                            eyeOpen={false}
                            eye={false}
                            disabled={false}
                            onReset={()=>resetValues('email')}
                            onToggleEye={()=>{}}
                            AdjustXClass={'xl:top-[-29] top-[-25] left-35 xl:left-46 '}/>

                        </div>}
                        {otpResult === 'matched' && changeEmailOpen && (
                        <div className="flex  items-center md:w-50 bg-red-800 whitespace-nowrap text-green-600 md:text-sm text-xs font-semibold">
                            ✅ <span>Email verified successfully</span>
                        </div>
                        )}

                        {otpResult === 'wrongOTP' && otpStatus==='sent' && changeEmailOpen && (
                        <div className="flex md:mt-12 md:text-md md:ml-2 text-xs mt-10 ml-2 items-center gap-1 text-red-500 font-semibold  transition-all duration-500 ease-in-out">
                            ❌ <span>Incorrect OTP. Please try again.</span>
                        </div>
                        )}

                        {otpResult === 'error' && changeEmailOpen && (
                        <div className="flex items-center gap-2 text-yellow-600 text-xs font-semibold">
                            ⚠️ <span>Something went wrong while verifying.</span>
                        </div>
                        )}
                        {validEmail===false || otpStatus === 'usedEmail' ? 
                            <div className="relative xl:top-[-1] md:w-50 lg:text-md text-xs top-[-7] text-red-500 transition-all duration -500 ease-in-out">
                                {otpStatus==='usedEmail'? '❌ Email already used' 
                                :
                                otpStatus==='error' && validEmail===false?
                                '❌ Email is not valid':''}
                                {/* {`❌ Email {otpStatus==='usedEmail'? alredy used:is not valid}`} */}
                            </div>:''}
                        {validEmail  && otpStatus !== 'idle' && (
                        
                        <div onClick={sendOTPfunction} className="relative cursor-pointer xl:w-35 xl:top-2 top-1 xl:text-md text-xs whitespace-no-wrap hover:underline transition-all duration-600 ease-in-out">
                             {otpResult==='matched'?'':'🔁Resend OTP?'}
                        </div>
                    )}

                </div>
                {(otpStatus==='idle' && changeEmailOpen || validEmail ===false) ? 
                <button type="button" onClick={sendOTPfunction} className={clsx("xl:w-22 ml-2 xl:h-9 md:mt-15 xl:mt-9 lg:ml-3 xl:px-1 xl:text-md cursor-pointer whitespace-nowrap hover:border-blue-400 focus:outline-none focus:shadow-lg w-15 h-8 md:text-md text-xs mt-5 border-1 rounded-md border-blue-700 transition-all duration-1600 ease-in-out",
    
                    validEmail===false && 'disable'

                )}> 
                
                    {otpStatus==='idle'?'Send OTP':validEmail===false?'Try Again'
                    :
                    // <MoonLoader size={18} className="md:top-1 md:left-4 top-8"/>
                    ''
                    }
                </button>
                :
                otpStatus==="sending" && changeEmailOpen?<MoonLoader size={20} className="md:top-11 md:ml-4 top-8"/>
                :
                otpStatus==='sent'&& changeEmailOpen?
                <div className={`flex transition-all ease-in-out duration-500 h-10 mt-2 items-center justify-center`}> {/*OTP field for verification*/}
                    <input
                    name="email-otp"
                    id="email-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    placeholder="OTP"
                    onChange={OTPInputField}
                    disabled={otpResult==='matched'}
                    className={clsx(
                        "border rounded-md xl:ml-2 md:ml-[10] xl:text-lg lg:text-md lg:mt-26 md:mt-26 xl:mt-14 md:mt-24 mt-7 shadow-md md:w-15 md:h-7 h-6 w-12 text-xs lg:h-8 ml-2 pl-3",
                        "transition-all ease-in-out duration-500",
                        "focus:outline-none",
                        otpResult === 'wrongOTP' && 'border-red-500',
                        otpResult === 'matched' && 'border-green-500'
                    )}

                    />
                    <ToastContainer/>
                </div>
                :
                otpStatus==='error'&& changeEmailOpen?toastShowError('⚠️ Error while sending OTP', Number(600))
                :null
                // validEmail===false && toastShowError('❌ Invalid email')
                
                }
                {/*---------------- Messages for email---------------------------*/ }
            </div>

            {passwordType==='PASSWORD' && <div className="flex flex-col px-4"> 
                 <p className='transition-all  duration-500  whitespace-nowrap mb-3 lg:w-54 w-42 cursor-pointer hover:underline ease-in-out lg:text-lg text-sm' onClick={toggleChangePassword}>Wanna change Password?</p>
                {changePasswordOpen && 
                <div className="flex transition-all ease-in-out duration-500">
                    <div className={clsx("border-b flex focus:shadow-lg border-gray-300 rounded-md shadow-md lg:w-50 w-40 ", 
                            passwordStatus === 'incorrect' && 'border-red-500 block',
                            passwordStatus === 'Matched' && 'border-green-500 hidden',
                            passwordStatus === 'issue' && 'border-orange-500 block',   
                        )}>
                        <input
                        id="oldPassword"
                        type={eyeOpen?"text":"password"}
                        placeholder="Old Password"
                        name="oldPassword"
                        // minLength={6}
                        className='focus:outline-none ml-3 w-29 lg:w-37 py-1'
                        value={formData?.oldPassword}
                        onChange={handleChange}
                        onBlur={() => { checkPasswordFunction('checkPassword'); }}
                        disabled={passwordStatus==='Matched'}
                        aria-label="oldPassword"
                        />
                        <Close
                        AdjustXClass='md:top-2 lg:top-1'
                        onReset={()=>resetValues('oldPassword')}
                        onToggleEye={toggleEyeOpen}
                        eyeOpen={eyeOpen}
                        eye={true}
                        disabled={passwordStatus==='Matched'}
                        />
                    </div>

                </div>}
                {changePasswordOpen && passwordStatus==='Matched' &&
                <div className="flex transition-all ease-in-out duration-500">
                    <div className={clsx("border-b flex focus:shadow-lg border-gray-300 rounded-md shadow-md lg:w-50 w-40",  
                            //need to add if password is compoliant or not for example 8 digit and all
                            newPasswordStatus==='compliant' && 'border-green-500',
                            newPasswordStatus === 'non-compliant' && 'border-red-500'
                    )}>
                        <input
                        id='newPassword'
                        type={eyeOpen?"text":"password"}
                        placeholder="New Password"
                        name="newPassword"
                        className="focus:outline-none ml-3 w-29 lg:w-37 py-1"
                        value={formData.newPassword}
                        onChange={handleChange}
                        // onBlur={()=>{checkPasswordFunction('changePassword');}}
                        disabled={newPasswordStatus==='compliant'}
                        />
                        <Close
                        AdjustXClass='top-2'
                        eye={true}
                        onReset={()=>resetValues('newPassword')}
                        onToggleEye={toggleEyeOpen}
                        eyeOpen={eyeOpen}
                        disabled={newPasswordStatus==='compliant'}
                        />

                    </div>
                </div>}
                
            </div>
}
            <div>
                <Button href="" className="ml-4 w-18">
                    Submit
                </Button>
            </div>
        </form>
    )
}


//Work on hanbdle submit............

// 'use client';

// import { useUser } from "@/src/context/userContext";
// import { updateUserProfile } from "@/src/services/userService";
// import { NewUser } from "@/src/utils/definitions";
// import { validateEmail } from "@/src/utils/validators";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import PencilIcon from "../ui/buttons/pencilIcon";
// import { getPasswordType, passwordUtitlity, sendOTP, verifyOTPStatus } from "@/src/utils/data";
// import {MoonLoader} from 'react-spinners'
// import clsx from "clsx";
// import {useDebouncedCallback} from 'use-debounce'
// import { toastShowError } from "@/src/utils/toastUtils";
// import { ToastContainer } from "react-toastify";
// import Close from "../ui/Close";
// import { Button } from "../ui/buttons/buttons";
// // import { InformationCircleIcon } from "@heroicons/react/24/outline";
// // import  from "../informationMessage";../ui/informationMessage
// import TooltipIcon from "../ui/informationMessage";



// export default function UserProfile(){
//     const [localInput, setLocalInput] = useState<Partial<NewUser>>({});
//     const [preview, setPreview] = useState<string | null>(null);
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [otp, setOtp] = useState<string>('');
//     const [otpStatus, setOtpStatus] = useState<'idle'| 'error'|'sending'|'usedEmail'|'sent'>('idle');
//     const [otpResult, setOTPResult] = useState<'fetching'|'matched'| 'wrongOTP'| 'idle'| 'error'>('idle');
//     const [validEmail, setValidEmail] = useState<boolean|''>('');
//     const [changeEmailOpen, setChangeEmailOpen] = useState<boolean>(false);
//     const [changePasswordOpen, setChangePasswordOpen] = useState<boolean>(false);
//     const [eyeOpen, setEyeOpen] = useState<boolean>(false); 
//     const [passwordType, setPasswordType] = useState<''|'PASSWORD'|'GOOGLE'>('');
//     const [passwordStatus, setPasswordStatus] = useState<'incorrect'|'Matched'|''|'issue'>('');
//     const [newPasswordStatus, setNewPasswordStatus] = useState<'compliant'|'non-compliant'|''>('');

//     //work to do: set the user details to localInput and then mif there is any change in the localInput feed it to the dormData and send it to the userUpdate api.

//     //otpStatus is sent

//     const {user} = useUser();
//     console.log('Value of user from userProfile of settings:\n', user);
//     console.log('Value of message and otp:\n', message, otp);
//     const [formData, setFormData] = useState<NewUser>({
//         firstname: '',
//         lastname: '',
//         email: '',
//         profile_picture: undefined,
//         // password:'',
//         oldPassword:'',
//         newPassword:''
//     });
//     useEffect(() => {
//         if(user) {
//             setFormData({
//                 firstname: user.firstname,
//                 lastname: user.lastname,
//                 email: user.email,
//                 oldPassword:'',
//                 newPassword:'',
//                 profile_picture: user?.profile_picture,
//             });
//             setLocalInput({
//                 firstname: user.firstname,
//                 lastname: user.lastname,
//                 email: user.email,
//                 profile_picture: user?.profile_picture,
//             })

//             setPreview(user.profile_picture || null);
//         }
//     }, [user]);

//     useEffect(()=>{
//         console.log("Value of FormData:\n",formData);
//         console.log("Value of localInput:\n", localInput);
//     },[formData, localInput]);

//     useEffect(()=>{
//         const fetchUserType = async()=>{
//             try{
//                 const res = await getPasswordType();
//                 console.log("Value of res from userProfile", res.message);
//                 setPasswordType(res?.message);
//                 console.log("value of passwordStatus:\n", passwordType);
//             }catch(err){
//                 console.error(err)
//             }
//         } 
//         if(localInput?.email) fetchUserType();
//     }, [localInput?.email, passwordType]);

//     const sendOTPfunction = async()=>{
//         try{
//             setOTPResult('idle');
//             setOtpStatus("sending")
//             setValidEmail('');
//             const result = await sendOTP(`${localInput?.firstname}`, localInput!.email!, 'emailChange');
//             console.log("Value of result from sendOTP:\n", result);
            
//             if(result==='Email is not valid'){
//                 setValidEmail(false);
//                 setOtpStatus('error');
                
//                 console.log('Invalid email', otpStatus)
//                 return;
//             }else if(result ==='Email already in use'){
//                 setOtpStatus('usedEmail');
//                 return;
//             }else{
//                 setValidEmail(true);
//             }
//             if(result==='Error' || result ==='Failed to send OTP'){
//                 setOtpStatus("error");
//                 // console.log("OTP Status after error:\n", otpStatus);
//                 return;
//             }   
//             // console.log("value of result:", result);
//             setOtpStatus('sent');
//             return;
//         }catch(err){
//             console.error(err);
//             setOtpStatus('error');
//         }
//     }

//     const toggleEyeOpen = ()=>{
//         console.log("Inside toggleEyeOpen");
//         setEyeOpen(!eyeOpen);
//     }


//     const OTPInputField = (e:React.ChangeEvent<HTMLInputElement>)=>{
//         const raw = e.target.value;
//         const digitsOnly = raw.replace(/\D/g, '');
//         setOtp(digitsOnly);

//         if(digitsOnly.length===4) 
//             verifyOTP(Number(digitsOnly));
//     }
//     const verifyOTP = async(otp:number)=>{
//         // console.log("Inside verifyOTP", typeof(otp)); //string
//         try{
//             setOTPResult('fetching');
//             const result = await verifyOTPStatus(String(otp), localInput!.email!);
//             console.log("Value of result from verifyOTP:\n", result);
//             if(result.message=='Invalid or expired OTP'){
                
//                 setOTPResult('wrongOTP');
                
//                 console.log('value of result.message from wrong one:', result.message);
//             }
//             if (result.message==='OTP verified successfully') setOTPResult('matched');
            
//         }catch(err){
//             console.error("OTP verification error:\n", err);
//             setOtpStatus("error");
//         }
//     }
//     const debouncedUpdate = useDebouncedCallback(
//         (name:keyof NewUser, value:string)=>{
//             setFormData(prev=>({
//                 ...prev,
//                 [name]:value
//             }));
//             console.log("Value of debounced value:", value)
//             if(name==='email' && !validateEmail(value) && !validEmail){
//                 setMessage('Invalid email');
//             }
//         },
//         800
//     );


//     const checkPasswordFunction = async(action: 'checkPassword' | "changePassword")=>{
//         console.log('Value of passwordStatus from checkPassswordFUnction:', passwordStatus);
//         console.log("Value of passwordType inside checkPasswordFUnctions:", passwordType);
//         if(passwordType==='PASSWORD'){
//             const result:string|{message:string} = await passwordUtitlity(formData?.oldPassword, action, action==='changePassword'?formData?.newPassword:undefined) as string|{message:string};
//             console.log("Value of result:\n", result);
//             if(action==='checkPassword'){
                
//                 if(!result||result==='No Password received'){
//                     setPasswordStatus('issue');
//                 }else if(result ==='Wrong Password'){
//                     setPasswordStatus('incorrect');
//                 }else if(result === 'Password Matched'){
//                     setPasswordStatus('Matched');
//                 }else{
//                     setPasswordStatus('');
//                 }
//             }else{
//                 if(result.message==='Password changed'){
//                     setNewPasswordStatus('compliant');
//                 }
//                 else{
//                     setNewPasswordStatus('non-compliant');
//                 }

//                 console.log("value of res form usrprofile:", result);
//             }
//         }
//         console.log("Value of passwordStatus:", passwordStatus);
//     }

//     const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
//         const {name, value, files} = e.target;
//         if(name ==='profilePicture' && files?.[0]){
//             setFormData({...formData, profile_picture:files[0]});
//             setPreview(URL.createObjectURL(files[0]));
        
//         }else if( name === 'old password' || 'new Pasword'){
//             console.log("Inside checkPassword");
//             console.log("Value of name and value", name, value);            
//             const type = passwordType;
//             console.log("Value of type from client:\n it should be password or OAuth", type);

//             setFormData(prev=>({...prev,[name]:value}));
//             debouncedUpdate(name as keyof NewUser, value);
//             console.log("Value of password from check password function\n", formData.oldPassword);
//             // checkPasswordFunction();

//         }else if(name==='email'){
//             if(otpResult==='matched'){
//                 setLocalInput(prev=>({...prev, [name]:value}));
//                 debouncedUpdate(name as keyof NewUser, value);
//             }else{
//                 return
//             }
//         }
//         else{
//             setFormData(prev=>({...prev, [name]:value}));
//             debouncedUpdate(name as keyof NewUser, value);
//         }
//     };
  

//     const toggleChangeEmail = ()=>{
//         console.log("inside toggleChangeEmail");
//         setChangeEmailOpen(!changeEmailOpen);
//         //below statement will change the email back to the previous one if the change email is closed
//         if(changeEmailOpen){
//             setFormData(prev => ({
//                 ...prev,
//                 email: localInput.email ?? prev.email
//             }));
//             console.log("Closed email");
//             console.log('Value of email inside:', formData.email);
//         }
//         console.log('Value of email outside:', formData.email);
//     }

//     const toggleChangePassword=()=>{
//         console.log("Inside change Password toggle");
//         setChangePasswordOpen(!changePasswordOpen);
//     }
//     const resetValues = (key: keyof NewUser)=>{
//         if(key==='email'){
//             setOtpStatus('idle');
//             setOTPResult('idle');
//             setValidEmail("");
//             console.log("Inside key===email");
//         }
//         if(key==='oldPassword'){
//             setPasswordStatus('');
//         }
//         if(key==='newPassword'){setNewPasswordStatus('');}
//         console.log("value of key:\n", key);
//         setFormData(prev=>({
//             ...prev,
//             [key]:'',
//         }));
//         // setLocalInput(prev=>({
//         //     ...prev,
//         //     [key]:'',
//         // }));
//         console.log("outside of resetValues");
//     }

   
    

    

//     const handleSubmit = async(e:React.FormEvent)=>{
//         e.preventDefault();
//         console.log("Inside submit");
//         console.log("Value of FOrmData from handlesubmit", formData);
//         setLoading(true);
//         try{
//             if(otpStatus==='sent' && otpResult!=='matched'){
//                 toastShowError('Please verify the Email before submitting', Number(500));
//                 return;
//             }
//             console.log('Value of formData and localInput:', 'formData:',formData, '\n','localInput:', localInput);
//             // formData?.newPassword?


//             const result = await updateUserProfile({
//             firstName: (formData.firstname === '' ? (localInput.firstname ?? '') : (formData.firstname ?? '')),
//             lastName: formData?.lastname,
//             email: formData?.email,
//             password:formData?.newPassword,
//             profilePicture: typeof formData?.profile_picture === "object" && formData?.profile_picture instanceof File
//                 ? formData.profile_picture
//                 : undefined,
//             });
//             setLoading(false);
//             setMessage(result?.success ? 'Profile updated ✅' : 'Error while updating');
//         }catch(err){
//             setLoading(false);
//             toastShowError('Something went wrong while updating profile', Number(1000));
//             console.error(err);
//         }
        
//     };
//     // console.log("Value of loading message and otp:", loading, message, otp);
//     return (
//         <form onSubmit={handleSubmit} className="md:space-y-5 space-y-2 select-none outline-none rounded-md p-2 w-full transition-all ease-in-out duration-500">
//             <h1 className="md:text-xl text-md underline px-2"> User settings</h1>
//             {/** -----First Row: fName lName Image-------- */}
//             <div className="flex w-100 md:mb-0 mb-6 h-10 ">
//                 {/** User name and last name */}
//                 <div className="flex xl:flex-row flex-col">
//                     {/** ----------First name-------- */}
//                     <div className="flex flex-col pl-4 ">
//                         <div className="flex">
//                             <input id="firstname" 
//                             name="firstname" 
//                             className='border-b focus:outline-none focus:shadow-lg border-gray-300 rounded-md shadow-md w-40 pr-7 pl-3 text-sm md:text-md md:py-2 py-2 transition-all duration-500 ease-in-out' 
//                             placeholder="First name" 
//                             value={formData?.firstname}
//                             onChange={handleChange}
//                             />
//                             <Close
//                             eyeOpen={false}
//                             eye={false}
//                             disabled={false}
//                             onReset={()=>resetValues('firstname')}
//                             onToggleEye={()=>{}}
//                             AdjustXClass={'left-[-20] top-2'}
//                             />
//                             {/* <span className=" relative bg-red-100 w-5 "> */}
//                             {formData?.firstname===''?<TooltipIcon classX='top-[-45] ml-[-30] w-40' message="First Name should contain A-Z, a-z and not more than 10 words" />:null}
//                         {/* </span> */}
//                         </div>
//                         {formData.firstname===''&& loading && <p className="text-red-500 text-sm ">First name cannot be blank</p>}
//                     </div>
//                     {/** ----------End--First name-------- */}

//                     {/** ----------last name-------- */}
//                     <div className="flex">   
//                         <div className="flex px-4  my-1">
//                             <input id="lastname"  
//                             name="lastname" 
//                            className='border-b focus:outline-none focus:shadow-lg border-gray-300 rounded-md shadow-md w-40 pr-7 pl-3 text-sm md:text-md md:py-1 py-2 transition-all duration-500 ease-in-out'
//                             placeholder="Last Name" 
//                             value={formData?.lastname} 
//                             onChange={handleChange} />
//                             <Close
//                             eyeOpen={false}
//                             eye={false}
//                             disabled={false}
//                             onReset={()=>resetValues('lastname')}
//                             onToggleEye={()=>{}}
//                             AdjustXClass={'md: left-[-20] top-1'}/>
//                         </div>
//                     </div> 
//                     {/** --------End--Last name-------- */}
//                 </div>
//                  {/** ----End----User name and last name ---*/}

//                   {/** -----userImage-------- */}
//                 <div className="relative transition-all ease-in-out duration-500 md:w-23 md:h-23 h-15 w-15 sm:h-20 sm:w-20 md:top-[-25] sm:left-10 md:left-[-39] lg:left-40 xl:left-3 lg:top-[-20] lg:w-25 lg:h-25 xl:w-40 xl:h-40">
//                     <Image
//                     src={preview||user?.profile_picture||'/profilePicture.jpg'}
//                     alt="UserImage"
//                     className="md:w-23 md:h-23 sm:h-20 sm:w-20 lg:w-25 lg:h-25 h-15 w-15 overflow-hidden  rounded-full object-cover hover:border-blue-600 border-2 transition-all ease-in-out duration-500"
//                     width={50} height={50}/>

//                     <PencilIcon newClass="relative top-[-27] md:top-[-35] md:ml-17 ml-10 transition-all duration-500 ease-in-out" htmlFor="profilePicture"/>
//                     <input
//                     id="profilePicture"
//                     type="file"
//                     name="profilePicture"
//                     accept="image/*"
//                     onChange={handleChange}
//                     className="hidden"
//                     />
//                     <label htmlFor="profilePicture" className="flex relative top-[-16] md:left-2 md:text-xs lg:text-lg text-sm whitespace-nowrap items-center ">
//                     Profile Picture
//                     </label>
//                 </div>
//                 {/** ----End----userImage-------- */}

//             </div>
//             {/** -----First Row: fName lName Image-------- */}

//             <div className={clsx(
//                 "flex relative md:top-0 py-3 top-5  px-4",
//                 changeEmailOpen===false && 'h-14',
//                 changeEmailOpen===true && 'h-30'

//             )}> {/** second div2: will check email with otp  */}
//                 <div className="flex flex-col xl:mt-0 md:mt-10">
//                     <p className="transition-all ease-in-out duration-500 xl:w-47 w-36 cursor-pointer hover:underline xl:text-lg text-sm" onClick={toggleChangeEmail}>Wanna Change Email?</p>
                        
//                         {changeEmailOpen && <div>
//                             <input
//                             name="email"
//                             type="email"
//                             id="email"
//                             className={clsx(
//                                 "border-b pr-4 focus:outline-none  focus:shadow-lg border-gray-300 rounded-md shadow-md xl:w-50 xl:pl-3 xl:mt-2 w-40 xl:text-md pr-4 text-sm pl-2 h-9 transition-all duration-500 ease-in-out", 
//                                 validEmail === false || otpStatus==='usedEmail'  && 'border-red-500',
//                                 validEmail === true && 'border-green-500'
//                             )}
//                             placeholder="Email"
//                             value={formData?.email }
//                             onChange={handleChange}
//                             />
//                             {/* <button onClick={()=>resetValues('email')} className="relative cursor-pointer outline-none md:w-5 w-4 h-4 md:left-[-25] left-[-18] top-1">
//                                 <XMarkIcon/>
//                             </button>  */}
//                             <Close
//                             eyeOpen={false}
//                             eye={false}
//                             disabled={false}
//                             onReset={()=>resetValues('email')}
//                             onToggleEye={()=>{}}
//                             AdjustXClass={'xl:top-[-29] top-[-25] left-35 xl:left-46 '}/>

//                         </div>}
//                         {otpResult === 'matched' && changeEmailOpen && (
//                         <div className="flex  items-center md:w-50 bg-red-800 whitespace-nowrap text-green-600 md:text-sm text-xs font-semibold">
//                             ✅ <span>Email verified successfully</span>
//                         </div>
//                         )}

//                         {otpResult === 'wrongOTP' && otpStatus==='sent' && changeEmailOpen && (
//                         <div className="flex md:mt-12 md:text-md md:ml-2 text-xs mt-10 ml-2 items-center gap-1 text-red-500 font-semibold  transition-all duration-500 ease-in-out">
//                             ❌ <span>Incorrect OTP. Please try again.</span>
//                         </div>
//                         )}

//                         {otpResult === 'error' && changeEmailOpen && (
//                         <div className="flex items-center gap-2 text-yellow-600 text-xs font-semibold">
//                             ⚠️ <span>Something went wrong while verifying.</span>
//                         </div>
//                         )}
//                         {validEmail===false || otpStatus === 'usedEmail' ? 
//                             <div className="relative xl:top-[-1] md:w-50 lg:text-md text-xs top-[-7] text-red-500 transition-all duration -500 ease-in-out">
//                                 {otpStatus==='usedEmail'? '❌ Email already used' 
//                                 :
//                                 otpStatus==='error' && validEmail===false?
//                                 '❌ Email is not valid':''}
//                                 {/* {`❌ Email {otpStatus==='usedEmail'? alredy used:is not valid}`} */}
//                             </div>:''}
//                         {validEmail  && otpStatus !== 'idle' && (
                        
//                         <div onClick={sendOTPfunction} className="relative cursor-pointer xl:w-35 xl:top-2 top-1 xl:text-md text-xs whitespace-no-wrap hover:underline transition-all duration-600 ease-in-out">
//                              {otpResult==='matched'?'':'🔁Resend OTP?'}
//                         </div>
//                     )}

//                 </div>
//                 {(otpStatus==='idle' && changeEmailOpen || validEmail ===false) ? 
//                 <button type="button" onClick={sendOTPfunction} className={clsx("xl:w-22 ml-2 xl:h-9 md:mt-15 xl:mt-9 lg:ml-3 xl:px-1 xl:text-md cursor-pointer whitespace-nowrap hover:border-blue-400 focus:outline-none focus:shadow-lg w-15 h-8 md:text-md text-xs mt-5 border-1 rounded-md border-blue-700 transition-all duration-1600 ease-in-out",
    
//                     validEmail===false && 'disable'

//                 )}> 
                
//                     {otpStatus==='idle'?'Send OTP':validEmail===false?'Try Again'
//                     :
//                     // <MoonLoader size={18} className="md:top-1 md:left-4 top-8"/>
//                     ''
//                     }
//                 </button>
//                 :
//                 otpStatus==="sending" && changeEmailOpen?<MoonLoader size={20} className="md:top-11 md:ml-4 top-8"/>
//                 :
//                 otpStatus==='sent'&& changeEmailOpen?
//                 <div className={`flex transition-all ease-in-out duration-500 h-10 mt-2 items-center justify-center`}> {/*OTP field for verification*/}
//                     <input
//                     name="email-otp"
//                     id="email-otp"
//                     type="text"
//                     inputMode="numeric"
//                     pattern="\d{4}"
//                     maxLength={4}
//                     placeholder="OTP"
//                     onChange={OTPInputField}
//                     disabled={otpResult==='matched'}
//                     className={clsx(
//                         "border rounded-md xl:ml-2 md:ml-[10] xl:text-lg lg:text-md lg:mt-26 md:mt-26 xl:mt-14 md:mt-24 mt-7 shadow-md md:w-15 md:h-7 h-6 w-12 text-xs lg:h-8 ml-2 pl-3",
//                         "transition-all ease-in-out duration-500",
//                         "focus:outline-none",
//                         otpResult === 'wrongOTP' && 'border-red-500',
//                         otpResult === 'matched' && 'border-green-500'
//                     )}

//                     />
//                     <ToastContainer/>
//                 </div>
//                 :
//                 otpStatus==='error'&& changeEmailOpen?toastShowError('⚠️ Error while sending OTP', Number(600))
//                 :null
//                 // validEmail===false && toastShowError('❌ Invalid email')
                
//                 }
//                 {/*---------------- Messages for email---------------------------*/ }
//             </div>

//             {passwordType==='PASSWORD' && <div className="flex flex-col px-4"> 
//                  <p className='transition-all  duration-500  whitespace-nowrap mb-3 lg:w-54 w-42 cursor-pointer hover:underline ease-in-out lg:text-lg text-sm' onClick={toggleChangePassword}>Wanna change Password?</p>
//                 {changePasswordOpen && 
//                 <div className="flex transition-all ease-in-out duration-500">
//                     <div className={clsx("border-b flex focus:shadow-lg border-gray-300 rounded-md shadow-md lg:w-50 w-40 ", 
//                             passwordStatus === 'incorrect' && 'border-red-500 block',
//                             passwordStatus === 'Matched' && 'border-green-500 hidden',
//                             passwordStatus === 'issue' && 'border-orange-500 block',   
//                         )}>
//                         <input
//                         id="oldPassword"
//                         type={eyeOpen?"text":"password"}
//                         placeholder="Old Password"
//                         name="oldPassword"
//                         // minLength={6}
//                         className='focus:outline-none ml-3 w-29 lg:w-37 py-1'
//                         value={formData?.oldPassword}
//                         onChange={handleChange}
//                         onBlur={() => { checkPasswordFunction('checkPassword'); }}
//                         disabled={passwordStatus==='Matched'}
//                         aria-label="oldPassword"
//                         />
//                         <Close
//                         AdjustXClass='md:top-2 lg:top-1'
//                         onReset={()=>resetValues('oldPassword')}
//                         onToggleEye={toggleEyeOpen}
//                         eyeOpen={eyeOpen}
//                         eye={true}
//                         disabled={passwordStatus==='Matched'}
//                         />
//                     </div>

//                 </div>}
//                 {changePasswordOpen && passwordStatus==='Matched' &&
//                 <div className="flex transition-all ease-in-out duration-500">
//                     <div className={clsx("border-b flex focus:shadow-lg border-gray-300 rounded-md shadow-md lg:w-50 w-40",  
//                             //need to add if password is compoliant or not for example 8 digit and all
//                             newPasswordStatus==='compliant' && 'border-green-500',
//                             newPasswordStatus === 'non-compliant' && 'border-red-500'
//                     )}>
//                         <input
//                         id='newPassword'
//                         type={eyeOpen?"text":"password"}
//                         placeholder="New Password"
//                         name="newPassword"
//                         className="focus:outline-none ml-3 w-29 lg:w-37 py-1"
//                         value={formData.newPassword}
//                         onChange={handleChange}
//                         // onBlur={()=>{checkPasswordFunction('changePassword');}}
//                         disabled={newPasswordStatus==='compliant'}
//                         />
//                         <Close
//                         AdjustXClass='top-2'
//                         eye={true}
//                         onReset={()=>resetValues('newPassword')}
//                         onToggleEye={toggleEyeOpen}
//                         eyeOpen={eyeOpen}
//                         disabled={newPasswordStatus==='compliant'}
//                         />

//                     </div>
//                 </div>}
                
//             </div>
// }
//             <div>
//                 <Button href="" className="ml-4 w-18">
//                     Submit
//                 </Button>
//             </div>
//         </form>
//     )
// }


// //Work on hanbdle submit............

