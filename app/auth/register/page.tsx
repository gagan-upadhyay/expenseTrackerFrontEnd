import RegisterFormSkeleton from "@/app/ui/skeletons/registerSkeleton";
import RegisterFormWrapper from "@/app/wrappers/auth/registerFormWrapper";
import { Suspense } from "react"

const Register = ()=>{


    return(
        <div className="flex  justify-center bg-gray-300 h-screen items-center">
            <div className="mx-auto flex flex-col w-full p-4 max-w-[400px] ">
                <Suspense fallback={<RegisterFormSkeleton/>}>
                    <RegisterFormWrapper/>
                </Suspense>
            </div>
        </div>
    )
}
export default Register;