'use client';
import {useTheme} from '../../context/themeContext';

export default function ToggleTheme(){
    const {toggleTheme, theme} = useTheme();
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