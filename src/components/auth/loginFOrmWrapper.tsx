// 'use client'
// import { useAuth } from "@/src/context/authContext";
import LoginForm from "./loginForm";
// import LoginSkeleton from "./loginSkeleton";

export default function LoginFormWrapper(){
    // if(process.env.CLIENT_MODE==='development'){
    //     await new Promise((resolve)=>setTimeout(resolve,4000));
    // }
    //intentional delay to show skeleton 
    // const {isReady}= useAuth();
    // if(isReady) return <LoginSkeleton/>  //skeleton
    return(        
        <LoginForm/>
    )
}