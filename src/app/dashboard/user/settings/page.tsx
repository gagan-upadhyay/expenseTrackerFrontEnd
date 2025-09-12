import AuthGuard from "@/src/components/auth/Guards/AuthGuard"
import Accordion from "@/src/components/ui/accordion"
import UserProfile from "@/src/components/settings/userprofile";

export default function Page(){
    return(
        <AuthGuard>
            <div className="flex flex-col items-center  md:px-1 md:py-2">
                <Accordion title="User Profile">
                    <UserProfile/> 
                </Accordion>
            </div>
            
         </AuthGuard>
        
 
    )
}




// include Account >> user profile change like fname, lname, profilePicture. also change in email/phone_number with otp verification.
// notifications >> notification alert toggle on off
// appearance >> light/dark mode
// privacy and security if there is a change in privacy and security policy then show it at the top of settings
// help and support
// about
// logout
//promotional/ integration like "checkout our other apps"
