import RegisterForm from "@/app/ui/auth/signUpForm";

export default async function RegisterFormWrapper(){
    if(process.env.CLIENT_MODE==='development'){
        await new Promise((resolve)=>setTimeout(resolve, 4000));
    }
    return <RegisterForm/>;
}