import RegisterForm from "@/app/ui/auth/signUpForm"
import { Suspense } from "react"

const Register = async()=>{
    return(
        <div className="flex justify-center bg-gray-300 h-screen items-center">
            <div className="relative mx-auto flex flex-col w-full p-4 md:mt-15 max-w-[400px] space-y-2.5">
                <Suspense>
                    <RegisterForm/>
                </Suspense>
            </div>

        </div>
    )
}

export default Register;