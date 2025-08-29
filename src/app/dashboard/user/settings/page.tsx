import AuthGuard from "@/src/components/AuthGuard";
import UserProfile from "@/src/components/settings/userprofile";

export default function Page(){
    return(
        <AuthGuard>
            <UserProfile/>
         </AuthGuard>
        
 
    )
}