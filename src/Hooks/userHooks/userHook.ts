// 'use client';

// import { useUser } from "@/src/context/userContext"
// import { getUserDetails, refreshToken } from "@/src/utils/data";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";


// export const useSession = ()=>{
//     const {user, setUser} = useUser();
//     const router = useRouter();
//     const [loading, setLoading] = useState(true);
    

//     useEffect(()=>{
//         const hydrateSession =async ()=>{
//             try{
//                 const userData = await getUserDetails();
//                 if(userData?.result){
//                     console.log("Value of userData.result:\n", userData?.result);
//                     setUser(userData.result);
//                 }else{
//                     const refreshed = await refreshToken();
//                     console.log("Value of refreshed from useSession of userHooks:\n", refreshed);
//                     if(refreshed?.accessToken){
//                         const userData=await getUserDetails();
//                         setUser(userData.result);
//                     }else{
//                         router.replace('/auth/login');
//                     }
//                 }
//             }catch(err){
//                 console.error('Session hydration failed from useSession:\n', err);
//                 router.replace('/auth/login');
//             }finally{
//                 setLoading(false)
//             }
//         }
//         hydrateSession();
//         // console.log("Value of user after hydrateSession from userHooks", user);
//     },[setUser, router]);
//     return {user, loading};
// }