'use client';
import { useTheme } from "@/src/context/themeContext";
import { useEffect } from "react";

export default function ThemeSync(){
    const {theme} = useTheme();
    console.log('Value of theme from themesync:', theme);

    useEffect(()=>{
        const body=document.body;
        if(theme==='light'){
             body.style.backgroundColor = '#e6edf7';
             body.style.color = '#171717';
        }else{
           body.style.backgroundColor = '#242a38';
            body.style.color = '#ededed'
        }
    },[theme]);
    return null;
}