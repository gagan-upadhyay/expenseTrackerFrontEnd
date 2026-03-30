'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchedUser } from "../utils/definitions";
// import { useSession } from "../Hooks/userHooks/userHook";
import { getUserDetails } from "../utils/data";
import { useAuth } from "./authContext";
import { toastShowError } from "../utils/toastUtils";

// import {} from 'use-debounce'

const UserContext = createContext<{
    user: fetchedUser | null;
    setUser: (user: fetchedUser | null) => void;
    clearUser: () => void;
    loading:boolean;
    userTheme:'light'|'dark';
    setUserTheme:(theme:'light'|'dark')=>void;
}>({
    user: null,
    setUser: () => {},
    clearUser: () => {},
    loading:true,
    userTheme:'light',
    setUserTheme:()=>{},
});

export const UserProvider=({children}:{children:React.ReactNode})=>{
    const [user, setUser] = useState<fetchedUser|null>(null);
    // const clearUser = ()=> setUser(null);
    const [loading, setLoading] = useState(true);
    const [userTheme, setUserTheme] = useState<'light'|'dark'>('light');

    const {accessToken, logout, isTokenValid} = useAuth();
    

    // console.log('Value of userTheme from userCOntext:\n', userTheme);
    
    
    const fetchUserWithRetry = useCallback(async (maxRetries:number,delay:number ): Promise<fetchedUser | null> => {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const data = await getUserDetails();
                // console.log(`value of data from userCOntext:${data}`);
                if (data) return data as fetchedUser;
            }catch(err) {
                console.error('Error fetching user:\n', err)
                console.warn(`User fetch attempt ${attempt + 1} failed`, err);
                await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt))); // exponential backoff
                // }
            }
        }
        return null;
    },[]);

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
            try{
                const userData = await fetchUserWithRetry(10, 2);
                if(userData){
                    setUser(userData);
                    if(userData?.theme === 'light' || userData?.theme === 'dark'){
                        setUserTheme(userData.theme);
                    }
                // console.log('Value of userTheme from userContext:\n', userTheme);
                }
            }catch(err){
                console.error('error fetching user details:', err)
                toastShowError(err instanceof Error? err.message: 'Error fetching user', Number(500));
            }finally{
                setLoading(false);
            }
        }
        initUser();
    }, [accessToken, isTokenValid, fetchUserWithRetry, logout]);


    const contextValue = useMemo(
    ()=>({ 
        user,
        setUser,
        clearUser:()=>setUser(null),
        loading,
        userTheme,
        setUserTheme
    }),[user, setUser, loading, userTheme, setUserTheme]);
     
    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUser=()=> useContext(UserContext);