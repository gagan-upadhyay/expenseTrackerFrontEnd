'use client';

import { useUser } from "@/src/context/userContext";
import { updateUserProfile } from "@/src/services/userService";
import { NewUser } from "@/src/utils/definitions";
import { validateEmail } from "@/src/utils/validators";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import PencilIcon from "../ui/buttons/pencilIcon";
import { sendOTP, verifyOTPStatus } from "@/src/utils/data";
import {MoonLoader} from 'react-spinners'
import clsx from "clsx";
// import { toastShowError, toastShowWarning } from "@/src/utils/toastUtils";
import {useDebouncedCallback} from 'use-debounce'
import { toastShowError } from "@/src/utils/toastUtils";
import { ToastContainer } from "react-toastify";




export default function UserProfile(){

    const {user} = useUser();
    const [formData, setFormData] = useState<NewUser>({
        firstname: '',
        lastname: '',
        email: '',
        profile_picture: undefined,
    });
    useEffect(() => {
        if(user) {
            setFormData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            profile_picture: user?.profile_picture,
            });
            setPreview(user.profile_picture || null);
        }
    }, [user]);

    const [localInput, setLocalInput] = useState<Partial<NewUser>>({});
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [otp, setOtp] = useState<string>('');
    const [otpStatus, setOtpStatus] = useState<'idle'| 'error'|'sending'|'wrongEmail'|'sent'>('idle');
    const [otpResult, setOTPResult] = useState<'fetching'|'matched'| 'wrongOTP'| 'idle'| 'error'>('idle');
    const [validEmail, setValidEmail] = useState<boolean|''>('');

    const sendOTPfunction = async()=>{
        try{
            setOTPResult('idle');
            setOtpStatus("sending")
            const result = await sendOTP(`${formData?.firstname}`, formData?.email)
            // console.log("Value of result from sendOTP:\n", result);
            
            if(result==='Email is not valid'){
                setValidEmail(false);
                setOtpStatus('error');
                
                console.log('Invalid email', otpStatus)
                return;
            }else{
                setValidEmail(true);
            }
            if(result==='Error' || result ==='Failed to send OTP'){
                setOtpStatus("error");
                // console.log("OTP Status after error:\n", otpStatus);
                return;
            }   
            // console.log("value of result:", result);
            setOtpStatus('sent');
            return;
        }catch(err){
            console.error(err);
            setOtpStatus('error');
        }
    }

    const OTPInputField = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const raw = e.target.value;
        const digitsOnly = raw.replace(/\D/g, '');
        setOtp(digitsOnly);

        if(digitsOnly.length===4) 
            verifyOTP(Number(digitsOnly));

    }
    const verifyOTP = async(otp:number)=>{
        // console.log("Inside verifyOTP", typeof(otp)); //string
        try{
            setOTPResult('fetching');
            const result = await verifyOTPStatus(String(otp), formData?.email);
            console.log("Value of result from verifyOTP:\n", result);
            if(result.message=='Invalid or expired OTP'){
                
                setOTPResult('wrongOTP');
                
                console.log('value of result.message from wrong one:', result.message);
            }
            if(result.message==='OTP verified successfully')
            setOTPResult('matched');
            
        }catch(err){
            console.error("OTP verification error:\n", err);
            setOtpStatus("error");
        }
    }
    const debouncedUpdate = useDebouncedCallback(
        (name:keyof NewUser, value:string)=>{
            setFormData(prev=>({
                ...prev,
                [name]:value
            }));
            console.log("Value of debounced value:", value)
            if(name==='email' && !validateEmail(value) && !validEmail){
                setMessage('Invalid email');
            }
        },
        300
    );

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value, files} = e.target;
        if(name ==='profilePicture' && files?.[0]){
            setFormData({...formData, profile_picture:files[0]});
            setPreview(URL.createObjectURL(files[0]));
        }else{
            setLocalInput(prev=>({...prev, [name]:value}));
            debouncedUpdate(name as keyof NewUser, value);
        }
        
    };

    const resetValues = (key: keyof NewUser)=>{
        setFormData(prev=>({
            ...prev,
            [key]:'',
        }));
    }
    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        const result = await updateUserProfile({
            firstName: formData.firstname,
            lastName: formData.lastname,
            email: formData.email,
            // password: formData.password,
            profilePicture: typeof formData.profile_picture === "object" && formData.profile_picture instanceof File
                ? formData.profile_picture
                : undefined,
        });
        setLoading(false);
        setMessage(result?.success ? 'Profile updated ✅' : 'Error while updating');
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-400/20 rounded-md p-2 w-full">
            <h1 className="text-xl underline"> User settings</h1>
            {/** -----First Row: fName lName Image-------- */}
            <div className="flex w-100 h-10">
                {/** User name and last name */}
                <div className="flex">
                    {/** ----------First name-------- */}
                    <div className="flex flex-col md:px-4 px-2">
                        <div className="flex">
                            <input id="firstname" name="firstname" className='border-b focus:outline-none focus:shadow-lg border-gray-300 rounded-md shadow-md md:text-md md:w-40 md:pr-7 md:pl-3 text-sm w-25 pr-5 pl-2 py-1 transition-all duration-500 ease-in-out' placeholder="First name" value={localInput.firstname ?? formData.firstname}
                            onChange={handleChange}/>
                            <button type="button" onClick={()=>resetValues('firstname')} className="relative md:w-5 w-4 h-4 left-[-20] md:left-[-26] top-2">
                                <XMarkIcon/>
                            </button>
                        </div>
                    </div>
                    {/** ----------End--First name-------- */}

                    {/** ----------last name-------- */}
                    <div className="flex flex-col md:px-4 px-2"> 
                        <div className="flex">
                            <input id="lastname"  name="lastname" className='border-b focus:outline-none focus:shadow-lg border-gray-300 rounded-md shadow-md md:text-md md:w-40 md:pr-7 md:pl-3 text-sm w-25 pr-5 pl-2 py-1 transition-all duration-500 ease-in-out' placeholder="Last Name" value={localInput.lastname?? formData.lastname} onChange={handleChange} />
                            <button onClick={()=>resetValues('lastname')} className="relative md:w-5 md:h-4 md:left-[-26] md:top-2 w-4 left-[-20]">
                                <XMarkIcon/>
                            </button>
                        </div>
                    </div> 
                    {/** --------End--Last name-------- */}
                </div>
                 {/** ----End----User name and last name ---*/}

                  {/** -----userImage-------- */}
                <div className="relative top-[-30] md:left-10">
                    <Image
                    src={preview||user?.profile_picture||'/backgroundImage.png'}
                    alt="UserImage"
                    className="md:w-25 w-20 overflow-hidden  rounded-full object-cover hover:border-blue-600 border-2  transition-all ease-in-out duration-500"
                    width={50} height={50}/>

                    <PencilIcon newClass="relative top-[-35] md:ml-17 ml-13 transition-all duration-500 ease-in-out" htmlFor="profilePicture"/>
                    <input
                    id="profilePicture"
                    type="file"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                    />
                    <label htmlFor="profilePicture" className="flex relative top-[-16] md:text-lg text-sm whitespace-nowrap items-center ">
                    Profile Picture
                    </label>
                </div>
                {/** ----End----userImage-------- */}

            </div>
            {/** -----First Row: fName lName Image-------- */}

            <div className="flex relative h-30  px-3"> {/** second div2: will check email with otp  */}
                <div className="flex flex-col ">
                    <p className="transition-all duration-500 ease-in-out md:text-lg text-md">Wanna Change Email?</p>
                        <div>
                            <input
                            name="email"
                            type="email"
                            id="email"
                            className={clsx(
                                "border-b focus:outline-none focus:shadow-lg border-gray-300 rounded-md shadow-md md:w-50 md:pr-5 md:pl-3 py-1 md:mt-2 w-35 text-sm pl-2 pr-4 h-10 transition-all duration-500 ease-in-out", 
                                validEmail === false && 'border-red-500',
                                validEmail === true && 'border-green-500'
                                // validEmail
                            )}
                            placeholder="Email"
                            value={localInput.email ?? formData?.email}
                            onChange={handleChange}
                            />
                            <button onClick={()=>resetValues('email')} className="relative md:w-5 w-4 h-4 md:left-[-25] left-[-18] top-1">
                                <XMarkIcon/>
                            </button> 
                        </div>
                        {!validEmail && 
                            <div className="relative md:top-2 md:w-50 md:text-md text-xs top-1 text-red-400">
                                ❌ Email address not found
                            </div>}
                    {validEmail && otpStatus !== 'idle' && (
                        
                        <div onClick={sendOTPfunction} className="relative cursor-pointer md:w-35 md:top-2 top-1 md:text-md text-xs whitespace-no-wrap hover:underline">
                             {otpResult==='matched'?'':'🔁Resend OTP?'}
                        </div>
                    )}

                </div>
                {(otpStatus==='idle' || validEmail===false) ? <button type="button" onClick={sendOTPfunction} className={clsx(
                    "md:w-20 md:h-8 md:mt-10 md:px-1 md:text-md cursor-pointer whitespace-nowrap hover:border-blue-400 focus:outline-none focus:shadow-lg w-15 h-8 text-xs mt-7 border-1 rounded-md border-blue-700  transition-all duration-500 ease-in-out")}>Send OTP</button>
                :
                otpStatus==="sending"?<MoonLoader size={20} className="md:top-10 top-8"/>
                :
                otpStatus==='sent'?
                <div className={`flex h-10 mt-2 items-center justify-center`}> {/*OTP field for verification*/}
                    <input
                    name="email-otp"
                    id="email-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                    placeholder="OTP"
                    onChange={OTPInputField}
                    className={clsx(
                        "border rounded-md md:text-md md:mt-15 mt-10 shadow-md md:w-15 md:h-8 w-12 text-xs h-7 pl-3",
                        "focus:outline-none",
                        otpResult === 'wrongOTP' && 'border-red-500',
                        otpResult === 'matched' && 'border-green-500'
                    )}

                    />
                    <ToastContainer/>
                </div>
                :
                otpStatus==='error'?toastShowError('⚠️ Error while sending OTP')
                :''
                // validEmail===false && toastShowError('❌ Invalid email')
                
                }
                <div>
                    {otpResult === 'matched' && (
                        <div className="flex md:mt-12 mt-10  ml-3 items-center  text-green-600 md:text-sm text-xs font-semibold">
                            ✅ <span>Email verified successfully</span>
                        </div>
                        )}

                        {otpResult === 'wrongOTP' && otpStatus==='sent' && (
                        <div className="flex md:mt-12 md:text-md md:ml-2 text-xs mt-10 ml-2 items-center gap-1 text-red-500 font-semibold  transition-all duration-500 ease-in-out">
                            ❌ <span>Incorrect OTP. Please try again.</span>
                        </div>
                        )}

                        {otpResult === 'error' && (
                        <div className="flex items-center gap-2 text-yellow-600 text-xs font-semibold">
                            ⚠️ <span>Something went wrong while verifying.</span>
                        </div>
                        )}
                </div>
            </div>
            <div> {/*div3: will check password with current password and new password, current password with check if it matches and then after match, it will match if new password is compliant under the password rules */}

            </div>

            <div> {/*Error screen*/}

            </div>
        </form>
    )
}

