'use client';

import { createContext, ReactNode, useContext, useState } from "react";


enum Theme{
    Light='light',
    Dark='dark'
}

interface ThemeContextType{
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider=({children}:{children: ReactNode})=>{
    const [theme, setTheme] = useState<Theme>(Theme.Dark);
    
    const toggleTheme = () =>{
        setTheme(prev=>prev===Theme.Dark ? Theme.Light: Theme.Dark);
    };
    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
    
}

export const useTheme=()=>{
    const context = useContext(ThemeContext);
    if(!context) throw new Error ('useTheme must be within themeProvider');
    return context;
}