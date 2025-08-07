'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType{
    accessToken:string|null;
    setAccessToken:(token:string|null)=>void;
    isLoggedIn:boolean;
    setIsLoggedIn:(loggedIn:boolean)=>void;
}   

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider=({children}:{children: ReactNode})=>{
    const [accessToken, setAccessToken] = useState<string| null>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const cookieToken = document.cookie.split('; ').find(row=>row.startsWith('accessToken='))?.split('=')[1];

        if(cookieToken){
            setAccessToken(cookieToken);
            setIsReady(true);
        }else{
            const refreshToken = getCookie('refreshToken');
            if (refreshToken) {
                fetch('http://localhost:5000/api/v1/auth/refresh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ refreshToken })
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.accessToken) {
                            setAccessToken(data.accessToken);
                            setIsLoggedIn(true);
                            document.cookie = `accessToken=${data.accessToken}; path=/;`;
                        }
                    })
                    .finally(() => setIsReady(true));
            } else {
                setIsReady(true);
            }
        }
    }, []);

    function getCookie(name:string){
        if(typeof document==='undefined') return null;
        const value =`; ${document.cookie}`;
        const parts = value.split(`; ${name}=`)
        if(parts.length===2) return parts.pop()?.split(';').shift()||null
        return null;
    }

    if(!isReady) return null;

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth=()=>{
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}