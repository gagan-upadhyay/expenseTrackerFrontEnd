'use client';

import { useState } from "react";
import { sendOTP, verifyOTPStatus } from "@/src/utils/data";
import { useUser } from "@/src/context/userContext";

interface errorTypes{
    type:string,
    error:string
}

export function useOTP() {
    const {user} = useUser();
    const userEmail = user?.email ?? '';
    const [email, setEmail] = useState<string>(userEmail);
    const [otp, setOtp] = useState("");
    const [status, setStatus] = useState<"idle" | "sent" | "verified"|"error">("idle");
    const [error, setError] = useState<errorTypes|null>(null);
    const [loading, setLoading] =useState<boolean>(false);
  

    const sendOTPHandler = async () => {
        try{
            setLoading(true)
            const sentStatus:{message:string, success:boolean} = await sendOTP("User", email, "emailChange") as {message:string, success:boolean};
            console.log('Valiue of sentStatus from useOtp:', sentStatus);

            if(sentStatus.success){
                setStatus("sent");
            }else{
                setStatus('error')
                setError({type:'sendOTP', error:sentStatus.message});
            }
        
        

        }catch(err){
            console.warn(`Error while sending OTP: ${err}`);
            setError({type:"sendOTP", error:"Something went wrong"});
        }finally{
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        const res:{message:string, success:boolean} = await verifyOTPStatus(otp, email) as {message:string, success:boolean};
        console.log(`Value of otp;${otp} and email: ${email} from useOTP`);
        if (res.success) {
        setStatus("verified");
        }else{
            setStatus('error');
            setError({type:'verifyOTP',error:res.message});
        }
    };

    return {
        email,
        setEmail,
        otp,
        setOtp,
        setError,
        sendOTP: sendOTPHandler,
        error,
        verifyOTP,
        status,
        setStatus,
        loading,
        
        userEmail,
        
    };
}