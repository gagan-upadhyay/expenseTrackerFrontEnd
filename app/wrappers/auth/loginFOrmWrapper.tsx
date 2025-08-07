import LoginForm from "@/app/ui/auth/loginForm";

export default async function LoginFormWrapper(){
    await new Promise((resolve)=>setTimeout(resolve,4000));
    return <LoginForm/>;
}