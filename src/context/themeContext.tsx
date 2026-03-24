'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUser } from "./userContext";


// enum Theme{
//     Light='light',
//     Dark='dark'
// }

// interface ThemeContextType{
//     toggleTheme: () => void;
// }

// const userTheme = use
// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const ThemeContext = createContext<{ theme: string; toggleTheme: () => void ; clearTheme:()=>void}>({
    theme: '',
    toggleTheme: () => {},
    clearTheme:()=>{},
});

export const ThemeProvider=({children}:{children: ReactNode})=>{
    const { loading, setUserTheme, userTheme, user} = useUser();
    const [theme, setTheme] = useState<string>(userTheme);
    const [mounted, setMounted] = useState(false);
    
    const clearTheme=()=>{
        localStorage.removeItem('theme');
        setTheme('light');
    }

    useEffect(()=>{
        setMounted(true);
        if (user && !loading) {
            // Logged in user: use userTheme
            setTheme(userTheme);
            localStorage.setItem('theme', userTheme);
        } else if (!user) {
            // Not logged in: use localStorage
            const stored = localStorage.getItem('theme');
            if (stored === 'light' || stored === 'dark') {
                setTheme(stored);
            }
        }
    }, [user, userTheme, loading]);

    const toggleTheme = useCallback(() =>{
       const next = theme==='light'?'dark':'light';
       setTheme(next);
       if (user) {
           setUserTheme(next); // Update user context for logged in users
       }
       localStorage.setItem('theme', next); // Always save to localStorage
    }, [setUserTheme, theme, user]);
    
    const contextValue = useMemo(()=>({
        theme, toggleTheme, clearTheme
    }),[theme, toggleTheme])
    
    return (
        <ThemeContext.Provider value={contextValue}>
            {mounted ? children : null}
        </ThemeContext.Provider>
    )
    
}

export const useTheme=()=>{
    const context = useContext(ThemeContext);
    if(!context) throw new Error ('useTheme must be within themeProvider');
    return context;
}