'use client';

import { useTheme } from "@/src/context/themeContext"
import Image from "next/image"

export default function ImageComponent(){
    const {theme} = useTheme();
    return(
        <Image src={theme==='light'? '/logo.png':'/logo_new.png'} className="rounded-4xl" alt="Image" width={400} height={300}/>
    )
}