'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AddedUser } from "../utils/definitions";
// import { useSession } from "../Hooks/userHooks/userHook";
import { getUserDetails } from "../utils/data";

const UserContext = createContext<{
    user: AddedUser | null;
    setUser: (user: AddedUser | null) => void;
    clearUser: () => void;
    loading:boolean;
}>({
    user: null,
    setUser: () => {},
    clearUser: () => {},
    loading:true,
});

export const UserProvider=({children}:{children:React.ReactNode})=>{
    const [user, setUser] = useState<AddedUser|null>(null);
    const clearUser = ()=> setUser(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        const initUser = async()=>{
            const data = await getUserDetails();
           try{
                if(data?.result){
                    // console.log("Value of user details data.result from userCOntext:\n", data?.result);
                    setUser(data.result);
                    setLoading(false);
                }
           }catch(err){
                console.error('unable to fetch userDetails, error from userCOntext.tsx file', err);
            }
        }
        initUser();
    }, []);



    const contextValue = useMemo(
    ()=>({ 
        user,
        setUser,
        clearUser,
        loading,
        setLoading

    }),[user, setUser, loading]); 
    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

// export const SessionProvider = ({children}:{children:React.ReactNode})=>{
//      const {loading} = useSession();
//      if(loading) return <div>Loading session...</div>
//      return <UserProvider>{children}</UserProvider>
// }

export const useUser=()=> useContext(UserContext);
    
