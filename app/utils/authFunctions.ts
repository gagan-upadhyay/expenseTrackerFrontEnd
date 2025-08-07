// import { useRouter } from "next/navigation";

// export const Logout = async( accessToken: string, setIsLoggedIn: (value: boolean) => void)=>{
//     const router = useRouter();
//         try{
//             await fetch('http://localhost:5000/api/v1/auth/logout', {
//                 method:'POST',
//                 headers:{'Authorization': `Bearer ${accessToken || ''}`},
//                 credentials:'include'
//             });

//             document.cookie=`accessToken=; path=/; Max-Age=0`;
//             document.cookie = `refreshToken=;Max-Age=0; path=/`;
//             setIsLoggedIn(false);
//             console.log("logout successful, cookies cleared");
//             setTimeout(()=>router.replace('/'), 5000);
        
//         }catch(err){
//             if(err instanceof Error) console.error(err.stack)
//             console.error(err);
//         }
//     }
    
// export const GoToLogin = ()=>{
//         router.replace('/dashboard');
//     }