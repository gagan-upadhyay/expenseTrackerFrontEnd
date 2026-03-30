// 'use client';
// import { useState } from "react";
// import Switch from 'react-switch';
// import { IoIosSunny } from "react-icons/io";
// import { MdNightlightRound } from "react-icons/md";


// export default function SettingThemes(){
//     const [isChecked, setIsChecked] = useState<boolean>(false);
//     const handleToggleChange = ()=>{
//         setIsChecked(!isChecked);
//     }
//     console.log('Value of isCheked from themeSetting:\n', isChecked);
//     return(
//         <div className="'w-3/4 text-md md:text-xl px-4 py-2 font-medium border rounded-xl flex justify-between items-center transition-transform duration-100 ease-in-out ">
//             {/*   items-center mb-4 justify-center  transform-all ease-in-out duration-1500 */}
//             <div><p>Theme</p></div>
//             {/* <div><ToggleButton offColor='#f4f4f2ff' onColor="'#373737ff'" usedFor={'theme'} isChecked={isChecked} handleChange={handleToggleChange}/></div> */}
//             <div>
//                 <Switch offColor='#F2F4F3' onColor='#35363A' checked={isChecked} onChange={handleToggleChange} uncheckedIcon="" uncheckedHandleIcon={<IoIosSunny className="h-3 w-3 ml-1.5  sm:h-4 sm:w-4 sm:mt-1 mt-1.5 text-orange-400/70"/>} checkedHandleIcon={<MdNightlightRound className="h-3 w-3 ml-2 sm:h-4 sm:w-4 sm:mt-1 mt-1.5"/>} checkedIcon="" onHandleColor="#454343ff"/>
//             </div>
//         </div>
//     )
// }

// //35363A
// // 494a4fff

'use client';

import { useTheme } from "@/src/context/themeContext";

export default function SettingThemes() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center">
      <span>Theme</span>

      <button
        onClick={toggleTheme}
        className="px-3 py-1 rounded-md border"
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}