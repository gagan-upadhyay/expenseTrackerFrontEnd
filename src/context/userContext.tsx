'use client';

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AddedUser } from "../utils/definitions";
// import { useSession } from "../Hooks/userHooks/userHook";
import { getUserDetails } from "../utils/data";
import { useAuth } from "./authContext";

// import {} from 'use-debounce'

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
    const {accessToken, logout, isTokenValid} = useAuth();
    
    
    const fetchUserWithRetry = async (maxRetries = 3, delay = 500): Promise<AddedUser | null> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
        const data = await getUserDetails();
        if (data?.result) return data.result;
        } catch (err) {
        console.warn(`User fetch attempt ${attempt + 1} failed`, err);
        await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt))); // exponential backoff
        }
    }
    return null;
    };

    // const debouncedLogout = debounce(()=>{

    // })

    useEffect(()=>{
        const initUser = async()=>{
            if(!accessToken){
                console.warn('No access token available. Skipping userDetails fetch');
                setLoading(false);
                return;
            }
            if(!isTokenValid(accessToken)){
                console.warn('Access token is invalid. Waiting for refresh or Aborting..');
                setLoading(false);
                logout();
                return;
            }
            const userData = await fetchUserWithRetry();
            if(userData) setUser(userData);
            setLoading(false);
        }
        initUser();
    }, [accessToken, isTokenValid, logout]);


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
    
