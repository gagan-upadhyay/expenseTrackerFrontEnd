'use client';
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
// import { ToastContainer} from "react-toastify";
// import { Button } from "../ui/buttons/buttons";
import {AtSymbolIcon, EyeIcon, EyeSlashIcon, KeyIcon} from '@heroicons/react/24/outline'
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useAuth } from "@/src/context/authContext";
import { useGoogleOauthHandler } from "@/src/Hooks/authHooks/useGoogleAuthHandler";
import { loginWithEmail } from "@/src/services/authService";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import clsx from "clsx";
// import { FcGoogle } from "react-icons/fc";
// import { useEffect, useRef } from "react";
import { gsap } from "gsap";




export default function LoginForm(){
    const emailRef = useRef<HTMLInputElement>(null);
    const {handleGoogleLoginSuccess} = useGoogleOauthHandler();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    const {setAccessToken, setIsLoggedIn, logout} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const [eyeOpen, setEyeOpen] = useState<boolean>(false);
    const [errors, setErrors] = useState<string|null>(null);

    // const {user} = useUser();
    // console.log('Value of user form loginFormtsx:\n', user);

    // type USER={
    //     email:string;
    //     password:string;
    // }
    useEffect(()=>{

        if (emailRef.current) {
            emailRef.current.focus();
        }
    },[]);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
    if (!formRef.current) return;

    gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        }
    );
    }, []);

    const toggleEyeOpen = ()=>{
        setEyeOpen(!eyeOpen);
    }

    // const resetValues = (key: keyof USER)=>{
    //     if(key==='password'){
    //         setPassword('');
    //     }
    // }

    const handleLogin=async(e:React.FormEvent)=>{
        e.preventDefault();
        logout();
        if(loading) return;
        setLoading(true);
        try{
            const data:{success:boolean, message:string|null, error:string|null, accessToken:string|null, refreshToken:string|null} = await loginWithEmail(email, password) as {success:boolean, message:string, error:string|null, accessToken:string|null, refreshToken:string|null};

            console.log("Value of data from try block:", data);
            if(data?.error){
                setErrors(data?.error);
            }
            if(data.accessToken) {
                setAccessToken(data.accessToken);
                document.cookie=`accessToken=${data.accessToken}; path=/;`;
            }
            if(data.refreshToken) document.cookie = `refreshToken=${data.refreshToken}; path=/;`
            setIsLoggedIn(true);
            toastShowSuccess('Login Successful', Number(600));
            router.replace('/dashboard');
        }
        catch(e: unknown){
            let errorMessage="An unexpected Error occurred";
            if (e instanceof Error){
                errorMessage=e.message;
            }else if(typeof e==='string'){
                errorMessage=e;
            }
            const htmlMatch = errorMessage.match(/502\s+(Bad Gateway)/i);
            if (htmlMatch) {
                errorMessage = htmlMatch[1]; // Sets errorMessage to exactly "Bad Gateway"
            }
            setErrors(errorMessage);
            console.warn("value of error from loginForm:", errorMessage);
            toastShowError(errorMessage, Number(1500));
        }
        finally{
            setLoading(false);
        }
    }
    return (
        
        
        //     <form onSubmit={handleLogin} className="w-full px-6 transition-all ease-in-out duration-400 md:ml-0 ml-4 pb-4 pt-8 bg-gray-50 rounded-lg mb-30 max-w-xs md:max-w-sm">
        //         <h1 className="text-2xl ml-1 text-gray-400 font-bold mb-4">
        //             Login
        //         </h1>
        //         <div className="flex-1">                
                
        //             <div>
        //                 <label htmlFor="email" className=" hidden md:block text-sm font-medium text-gray-700">Email</label>

        //                 <input type="email" 
        //                 onChange={(e)=>{
        //                     setEmail(e.target.value);
        //                     if(errors) setErrors(null);}}
        //                     ref={emailRef} id="email" placeholder='Enter Email' name="email" required className={clsx("py-[9px] placeholder:text-gray-500 pl-10 text-sm mt-1 w-full px-3 border border-gray-300 rounded-md shadow-md focus:outline-none focus:shadow-xl focus:ring-blue-500 text-black",
        //                     errors==="User doesn't exist, register first"? "border-2 border-red-400/40 animate-shake":"border-gray-300"
        //                 )} />
        //                 <AtSymbolIcon className="pointer-events-none top-[-27] text-gray-500 relative ml-2 h-[18px] w-[18px]"/>
        //             </div>
        //             <div className="transition-all ease-in-out duration-500">
        //                 <label htmlFor="password" className="hidden md:block text-sm font-medium text-gray-700">Password</label>
        //                 <input 
        //                 onChange={(e)=>
        //                     {setPassword(e.target.value); 
        //                     if(errors) setErrors(null);}}
        //                      id="password" name="password" type={eyeOpen?'text':'password'} placeholder="Enter password" required className={clsx("w-full border py-2  focus:shadow-xl rounded-md shadow-md text-black pl-10 focus:outline-none text-sm placeholder:text-gray-500",
        //                     errors? "border-2 border-red-400/40 animate-shake":"border-gray-300"
        //                 )} />
        //                 <div className="flex">
        //                 <KeyIcon className=" pointer-events-none mr-3 h-[18px] w-[18px] relative text-gray-500 top-[-27] ml-3"/>
                            
        //                 {password.length!==0 &&    
        //                 <button onClick={(e)=>{e.preventDefault(); toggleEyeOpen()}} className=" w-5 h-5  focus:outline-none cursor-pointer mt-[-27] relative md:left-60 left-50">
        //                     {eyeOpen?<EyeIcon className="text-gray-400"/>:<EyeSlashIcon className="text-gray-400"/>}
        //                 </button>
        //                 }    
        //                 </div>
        //             </div>
        //             <Button disabled={loading} className='relative left-49 px-4 py-3 md:left-60  
        //             md:top-[-4] text-xs md:text-sm' href=''>Submit</Button>

        //             {errors && <div className="absolute text-sm font-medium py-1 text-red-400">{errors}</div>}
                    
        //             {/* <div  className="w-auto"> */}
        //             <p className="transition-all w-fit whitespace-nowrap duration-400 ease-in-out text-gray-500 text-xs md:left-1 top-[-44] relative">Not Registered? <Link className="text-blue-400" href={'/auth/register'}>Register here</Link></p>
        //         {/* </div> */}
        //         {/* <div className="w-auto bg-red-400"> */}
        //             <p className="transition-all duration-400 ease-in-out text-gray-500 text-xs w-fit md:left-1 top-[-44] relative">
        //                 <Link className="text-blue-400" href={'/auth/forgot-password'}>Forgot Password?</Link>
        //             </p>
        //         {/* </div> */}
        //             <div className="relative flex justify-center top-4" >
        //                 <Suspense fallback="Loading...">
        //                     <GoogleLogin onSuccess={handleGoogleLoginSuccess}/>
        //                 </Suspense>
        //                 <ToastContainer/>
        //             </div>
        //         <div>
        //         </div>
        //     </div>
            
        // </form>   
        <>
            <form
                onSubmit={handleLogin}
                className="glass glass-hover relative w-full px-6 py-8 rounded-2xl transition-all duration-500"
                ref={formRef}
                >
                {/* Glow */}
                <div className="glow glow-indigo -top-10 -right-10"></div>
                <div className="glow glow-purple -bottom-10 -left-10"></div>

                <h1 className="text-xl md:text-2xl font-bold text-center opacity-80 mb-6">
                    Login
                </h1>

                <div className="flex flex-col gap-4">

                    {/* EMAIL */}
                    <div className="relative">
                    <input
                        type="email"
                        ref={emailRef}
                        placeholder="Enter Email"
                        required
                        onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors) setErrors(null);
                        }}
                        className={clsx(
                        "glass px-3 py-2 rounded-xl w-full pl-10 text-sm",
                        errors && "border-red-400/40 animate-shake"
                        )}
                    />
                    <AtSymbolIcon className="absolute left-3 top-2.5 w-4 h-4 opacity-60" />
                    </div>

                    {/* PASSWORD */}
                    <div className="relative">
                    <input
                        type={eyeOpen ? "text" : "password"}
                        placeholder="Enter password"
                        required
                        onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors) setErrors(null);
                        }}
                        className={clsx(
                        "glass px-3 py-2 rounded-xl w-full pl-10 text-sm",
                        errors && "border-red-400/40 animate-shake",
                        " focus:scale-[1.02] focus:ring-2 focus:ring-indigo-400/40"
                        )}
                    />
                    <KeyIcon className="absolute left-3 top-2.5 w-4 h-4 opacity-60" />

                    {password && (
                        <button
                        onClick={(e) => {
                            e.preventDefault();
                            toggleEyeOpen();
                        }}
                        className="absolute right-3 top-2.5"
                        >
                        {eyeOpen ? (
                            <EyeIcon className="w-4 h-4 opacity-60" />
                        ) : (
                            <EyeSlashIcon className="w-4 h-4 opacity-60" />
                        )}
                        </button>
                    )}
                    </div>

                    {/* ERROR */}
                    {errors && (
                    <p className="text-red-400 text-xs ">{errors}</p>
                    )}

                    {/* BUTTON */}
                    <button
                    disabled={loading}
                    className="glass-hover py-2 active:scale-95 rounded-xl text-sm font-medium mt-2"
                    >
                    {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* LINKS */}
                    <div className="text-xs flex justify-between opacity-70">
                    <Link href="/auth/register">Register</Link>
                    <Link href="/auth/forgot-password">Forgot?</Link>
                    </div>

                    {/* GOOGLE */}
                    {/* <button
                        className="glass glass-hover flex items-center justify-center gap-3 py-2 rounded-xl w-full mt-2"
                        >
                        <FcGoogle size={18} />
                        <span className="text-sm">Continue with Google</span>
                        </button> */}
                    <div className="flex justify-center  mt-2 ">
                    <GoogleLogin shape="pill" size="large" type="icon" theme="filled_black" onSuccess={handleGoogleLoginSuccess} />
                    </div>
                </div>
            </form>
            {/* <ToastContainer /> */}
        </>
    )
}