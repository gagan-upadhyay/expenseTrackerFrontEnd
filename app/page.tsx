import Footer from "./ui/footer";
import Navbar from "./ui/navbar";
import WelcomePage from "./ui/welcomePage";

export default function Home(){
  return(
    <div className="bg-gradient-to-b from-blue-900 to-teal-500">
      <Navbar/>
      <WelcomePage/>
      <Footer/>    
    </div>

    
  )
}