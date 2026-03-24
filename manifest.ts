import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest{
    return {
        name: 'expenseTracker PWA',
        short_name: 'AppPWA',
        description:'PWA for expense tracker App',
        start_url:'/',
        display:'standalone',
        background_color:'#ffffff',
        theme_color:'#000000',
        icons:[
            {
                src:"public/logo_192.png",
                sizes:'192x192',
                type:'image/png',
            },
            {
                src:'public/logo_512.png',
                sizes:'512x512',
                type:'image/png',
            }
        ]
    }
}