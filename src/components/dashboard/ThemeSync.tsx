'use client';
import { useTheme } from "@/src/context/themeContext";
import { useEffect } from "react";

export default function ThemeSync(){
    const {theme} = useTheme();

    useEffect(()=>{
        const root = document.documentElement;
        // The theme is already applied to the DOM via applyTheme() in themeContext
        // CSS variables in globals.css handle all color changes
        // This component just ensures the theme stays in sync during navigation
        console.log('[Theme] Current theme:', theme);
    },[theme]);
    return null;
}