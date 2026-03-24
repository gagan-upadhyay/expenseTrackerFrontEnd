'use server';

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function  getInitialAuth(){
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value || null;
    if(!accessToken) return null;
    try{
        const decoded = jwtDecode<{exp:number}>(accessToken);
        const isValid = decoded.exp*1000>Date.now();
        return isValid?accessToken:null;
    }catch{
        return null;
    }
}