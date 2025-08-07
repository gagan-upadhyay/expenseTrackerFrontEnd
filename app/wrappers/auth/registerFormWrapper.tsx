import RegisterForm from "@/app/ui/auth/signUpForm";

export default async function RegisterFormWrapper(){
    await new Promise((resolve)=>setTimeout(resolve, 4000));
    return <RegisterForm/>;
}