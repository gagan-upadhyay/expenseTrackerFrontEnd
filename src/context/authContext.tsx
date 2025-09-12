'use client';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toastShowError, toastShowWarning } from '../utils/toastUtils';
import { refreshToken } from '../utils/data';
import { BounceLoader } from 'react-spinners';
import { useTheme } from './themeContext';
import { JwtPayload } from '../utils/definitions';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType } from '../utils/definitions';
import { getCookie } from '../utils/getCookie';

// import { SyncLoader } from 'react-spinners';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children, initialToken, }: { children: ReactNode; initialToken:string|null; }) => {
  const [accessToken, setAccessToken] = useState<string | null>(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!initialToken);
  const [isReady, setIsReady] = useState<boolean>(false);
  const {theme} = useTheme()
  
  
  //moved to getCookie in utility
  // Cookie reader
  // const getCookie = useCallback((name: string): string | null => {
  //   if (typeof document === 'undefined') return null;
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  //   return null;
  // }, [])

  // Centralized logout
  const logout = useCallback(() => {
    setAccessToken(null);
    setIsLoggedIn(false);
    // localStorage.setItem('isLoggedIn', 'false');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  }, []);

  const isTokenValid = useCallback((token: string): boolean => {
      const now = Date.now();
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log("isToken Valid?", decoded.exp*1000>now);
        return decoded.exp * 1000 > now;
      } catch {
        return false;
      }
  }, []);



  useEffect(() => {
  const initAuth = async () => {

    const accessToken = getCookie('accessToken');
    if (accessToken && isTokenValid(accessToken)) {
      // console.log("Inside initAuth with accessToken and token is valid", isLoggedIn);
      setAccessToken(accessToken);
      setIsLoggedIn(true);
      setIsReady(true);
      return;
    }
    else if(accessToken && !isTokenValid(accessToken)){
      // Try silent refresh
      const refreshTokenCookie = getCookie('refreshToken');
      if(refreshTokenCookie) {
        try{  
          const data = await refreshToken(refreshTokenCookie);
          if (data.accessToken && isTokenValid(data.accessToken)) {
            setAccessToken(data.accessToken);
            document.cookie = `accessToken=${data.accessToken}; path=/;`;
            setIsLoggedIn(true);
            setIsReady(true);
            console.log('🔄 Silent refresh succeeded on init');
            return;
          }
        } catch (err) {
          console.error('Silent refresh failed on init:', err);
        }
        // If all fails
        logout();
        setIsReady(true);
      };
    }else{
      setIsReady(true);
    }
  }
  initAuth();
  });

//silent refresh and session expiry warning
  useEffect(()=>{
    if(!accessToken) return;
    const decoded = jwtDecode<JwtPayload>(accessToken);
    const expirtyTime= decoded.exp*1000;
    const timeUntilExpiry = expirtyTime-Date.now();

    const refreshTime = timeUntilExpiry-30*1000 // refresh 30s before expiry;
    const warningTime = timeUntilExpiry-60*1000 //warn 60s before expiry;

    if(refreshTime<=0){
        logout();
        return;
    }
    const refreshTimeout = setTimeout(async()=>{
        try{
            const data = await refreshToken(getCookie('refreshToken'));;
            if(data.accessToken){
                setAccessToken(data.accessToken);
                document.cookie=`accessToken=${data.accessToken}; path=/;`;
                console.log('🔄 Access token refreshed silently');
            }else{
                toastShowError("Session Expired, login again");
                logout();
            }
        }catch(err){
            console.error('Silent refresh Error:\n', err);
            toastShowError('Session Expired, Please log in again');
            logout();
        }

    }, refreshTime);

    const warningTimeout = setTimeout(()=>{
        toastShowWarning('Your session will expire soon. Stay active to remain logged in.');
    }, warningTime);

    return()=>{
        clearTimeout(refreshTimeout);
        clearTimeout(warningTimeout)
    };

  }, [accessToken, logout])

  // JWT validation


  const contextValue = useMemo(
    () => ({
      accessToken,
      setAccessToken,
      isLoggedIn,
      setIsLoggedIn,
      isReady,
      logout,
      isTokenValid,
    }),
    [accessToken, isLoggedIn, isReady, logout, isTokenValid]
  );

  if (!isReady) return <div className="text-center text-blue-500 flex flex-col items-center justify-center  mt-50">
    Checking Authentication from authcontext... 
    <BounceLoader  size={70}  color={theme ==='dark' ?'#0F172B':'#779dffff'} speedMultiplier={2}/>
    </div>; //add a spinning animation ...... DOne

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};