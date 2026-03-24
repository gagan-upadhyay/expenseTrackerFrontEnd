import LoginForm from "./loginForm";

export default async function LoginFormWrapper(){
    // if(process.env.CLIENT_MODE==='development'){
    //     await new Promise((resolve)=>setTimeout(resolve,4000));
    // }
    //intentional delay to show skeleton 
    return(
        <div className="relative top-[-50] md:top-20">
            <LoginForm/>
        </div>
    )
}