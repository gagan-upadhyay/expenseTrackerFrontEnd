// import AuthGuard from "../components/auth/Guards/AuthGuard";
import GuestGuard from "../components/auth/Guards/GuestGuard";
import WelcomePage from "../components/pages/Home/welcomePage";

export default function Home(){
  return(
    // <AuthGuard>
    <GuestGuard>
    <div className="bg-gradient-to-b from-blue-900 to-teal-500">
      {/* <div className="relative"> */}
        <WelcomePage/>
      {/* </div> */}
      
    </div>
    </GuestGuard>
  )
}