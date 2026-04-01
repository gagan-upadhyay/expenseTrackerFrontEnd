'use client';

import { useEffect, useState } from "react";
import { passwordUtility } from "@/src/utils/data";

export function usePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string|null>(null);
    const [loadingPassCheck, setLoadingPassCheck]=useState<boolean>(false);
    const [loading, setLoading] =useState<boolean>(false);
    const [passwordStatus, setPasswordStatus] = useState<'Matched'|'Password changed'|null>(null);
    const [eyeOpen, setEyeOpen] = useState<boolean>(false);

    const toggleEyeOpen = ()=>{
        setEyeOpen(!eyeOpen);
    }

    useEffect(()=>{
        if(passwordError) setPasswordError(null);
    },[oldPassword, newPassword])



    const checkPassword = async ()=>{
        if(!oldPassword) return ;
        setLoadingPassCheck(true);
        try{
            console.log(`inside passwordCheck`);
            const result:{success:boolean, message:string, error:string} = await passwordUtility(oldPassword, 'checkPassword') as {success:boolean, message:string, error:string};
            if(result.success){
                setPasswordStatus('Matched');
            }else{
                setPasswordError(result.error|| "Incorrect current password");
            }
        }catch(err){
            let errorMessage="Something went wrong";
            if(err instanceof Error){
                errorMessage=err.message;
                setPasswordError(errorMessage);

                console.log(`value of errorMessage for musePassword hook:${errorMessage}`);
            }
        }finally{
            setLoadingPassCheck(false);
        }
    }

    const updatePassword = async () => {
        setLoading(true);
        if(!newPassword) return "New Password is Required!";
        try{
            const result:{success:boolean, message:string, error:string} = await passwordUtility(oldPassword, 'changePassword', newPassword) as {success:boolean, message:string, error:string};

            if(result.success){
                console.log(`Password changed inside result.success`);
                setPasswordStatus('Password changed');    
                setOldPassword('');
                setNewPassword('');
                setTimeout(()=>setPasswordStatus(null), 5000);
            }else{
                setPasswordError(result.error|| "Failed to update password");
            }
        }catch(err){
            let errorMessage="Something went wrong";
            if(err instanceof Error){
                errorMessage=err.message;
                setPasswordError(errorMessage);
                console.log(`value of errorMessage for musePassword hook:${errorMessage}`);
            }
        }finally{
            setLoading(false);
        }
    };

    return {
        oldPassword,
        newPassword,
        setOldPassword,
        setNewPassword,
        updatePassword,
        passwordError,
        checkPassword,
        passwordStatus,
        loading,
        loadingPassCheck,
        eyeOpen,
        toggleEyeOpen,
    };
}