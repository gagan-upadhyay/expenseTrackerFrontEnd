'use client';
import { useAuth } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SyncLoader } from "react-spinners";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if(isReady && isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoggedIn, isReady, router]);

  if(!isReady || isLoggedIn) 
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