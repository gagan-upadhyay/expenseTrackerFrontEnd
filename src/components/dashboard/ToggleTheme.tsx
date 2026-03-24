'use client';
import { useEffect } from 'react';
import {useTheme} from '../../context/themeContext';
// import { useUser } from '@/src/context/userContext';

export default function ToggleTheme(){
    const {toggleTheme, theme} = useTheme();
    // const {loading} = useUser();
    useEffect(()=>{
        if(localStorage.getItem('theme')){
            
        }
    })
    // console.log("Value fo theme form toggletheme:", theme);
    return(
        <button onClick={toggleTheme}
            className={ `${theme ==='light'?'bg-gray-400':'bg-neutral-700'} p-2 rounded-full text-black  transition`}
            aria-label="Toggle Theme"
        >
            {theme==='dark'? '🌙' : '🌞'  }
        </button>
    )
}