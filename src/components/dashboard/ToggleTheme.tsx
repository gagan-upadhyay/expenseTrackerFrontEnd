'use client';
import {useTheme} from '../../context/themeContext';

export default function ToggleTheme(){
    const {toggleTheme, theme} = useTheme();
    return(
        <button onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition"
            aria-label="Toggle Theme"
        >
            {theme==='dark'? '🌙' : '🌞'  }
        </button>
    )
}