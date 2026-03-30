'use client';
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isReady, accessToken, isTokenValid } = useAuth();
  const [isloading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  console.log("From GuestGuard, isLoggedIn:", isLoggedIn);

  useEffect(() => {
    if(isReady && isLoggedIn) {
      console.log('redirecting to dashboard')
      router.replace('/dashboard');
    }

    const initGuestGuard = ()=>{
      // console.log('inside initGuestGiard')
      if(!accessToken){
        console.warn('No access token available. Skipping redirecting to dashboard');
        setIsLoading(false);
        return;
      }
      if(!isTokenValid(accessToken)){
        console.warn('Access token is invalid. Waiting for refresh or Aborting..');
        setIsLoading(false);
        // logout();
        console.log("Waiting for token refresh")
        return;
      }
    }
    initGuestGuard();
  });

  if(!isReady && isLoggedIn || isloading ) 
    return 
    <SyncLoader
      color="#ffff12"
      loading={!isReady}
      size={100}
      aria-label="loading-spinner"
      data-testid='loader'
    /> ;

  
  return <>{children}</>;
}