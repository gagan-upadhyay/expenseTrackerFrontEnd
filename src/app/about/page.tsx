'use client';
import Image from "next/image";
import { aboutContent } from "./about.config";
import { useTheme } from "@/src/context/themeContext";
export default function Page(){
    const {theme} = useTheme();
    return(
        <div className="flex items-center justify-center">
            <section className={`${theme==='light'?'text-gray-900':'text-neutral-300'}max-w-4xl mx-auto px-6 py-12`}>
                <h2 className="text-3xl font-bold mb-4">{aboutContent.title}</h2>
                <p className="text-lg mb-6">{aboutContent.description}</p>

                <ul className="list-disc list-inside space-y-2 mb-6">
                    {aboutContent.features.map((feature, idx) => (
                        <li key={idx} className={`${theme==='light'?'text-gray-900':'text-neutral-300'}`}>
                            {feature}
                        </li>
                    ))}
                </ul>

                <p className="italic text-gray-600">{aboutContent.mission}</p>
            </section>
            <div className="absolute">
                <Image src='/logo-removebg-preview.png' className={`${theme ==='light'? 'opacity-20':'opacity-10' }`} alt="Image" width={600} height={300}/>
            </div>
        </div>
    )
}

// "use client";



// export default function AboutSection() {
//   return (
//     
//   );
// }