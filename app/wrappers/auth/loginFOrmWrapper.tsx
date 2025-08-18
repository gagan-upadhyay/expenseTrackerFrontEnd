import LoginForm from "@/app/ui/auth/loginForm";

export default async function LoginFormWrapper(){
    if(process.env.CLIENT_MODE==='development'){
        await new Promise((resolve)=>setTimeout(resolve,4000));
    }
    return <LoginForm/>;
}