'use client';
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ToastContainer} from "react-toastify";
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
            setErrors(errorMessage);
            console.warn("value of error from loginForm:", errorMessage);
            toastShowError(errorMessage, Number(1500));
        }
        finally{
            setLoading(false);
        }
    }
    return (  
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
            <ToastContainer />
        </>
    )
}