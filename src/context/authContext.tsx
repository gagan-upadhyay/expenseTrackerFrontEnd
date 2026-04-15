// 'use client';
// import {
//   createContext,
//   ReactNode,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';
// import { toastShowWarning } from '../utils/toastUtils';
// import { refreshToken } from '../utils/data';
// import { BounceLoader } from 'react-spinners';
// import { useTheme } from './themeContext';
// import { JwtPayload } from '../utils/definitions';
// import { jwtDecode } from 'jwt-decode';
// import { AuthContextType } from '../utils/definitions';
// import { getCookie } from '../utils/getCookie';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children, initialToken, }: { children: ReactNode; initialToken:string|null; }) => {
//   const [accessToken, setAccessToken] = useState<string | null>(initialToken);
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!initialToken);
//   const [isReady, setIsReady] = useState<boolean>(false);
//   const {theme, clearTheme} = useTheme()

//   // Centralized logout
  
//   const logout = useCallback(() => {
//     setAccessToken(null);
//     setIsLoggedIn(false);
//     clearTheme(); //if found issue in logout, remove this.
//     console.log(`Value of document.cookie: ${document.cookie}`);
//     // localStorage.setItem('isLoggedIn', 'false');
//     document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
//     document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
//     localStorage.setItem('logout-event', Date.now().toString());
//   }, [clearTheme]);

//   const isTokenValid = useCallback((token: string): boolean => {
//       const now = Date.now();
//       try {
//         const decoded = jwtDecode<JwtPayload>(token);
//         // console.log("isToken Valid?", decoded.exp*1000>now);
//         return decoded.exp * 1000 > now;
//       } catch {
//         return false;
//       }
//   }, []);

//   useEffect(()=>{
//     const syncLogout=(e:StorageEvent)=>{
//       if(e.key==='logout-event')
//         logout();
//     };
//     window.addEventListener('storage', syncLogout);

//   }, [logout]);

// // 1. Wrap initAuth in a proper useEffect with an empty array
//   useEffect(() => {
//     const initAuth = async () => {
//       const token = getCookie('accessToken');
//       if (token && isTokenValid(token)) {
//         setAccessToken(token);
//         setIsLoggedIn(true);
//       } else {
//         const rt = getCookie('refreshToken');
//         if (rt) {
//           try {
//             const data:{accessToken:string} = await refreshToken() as {accessToken:string};
//             if (data?.accessToken) {
//               setAccessToken(data.accessToken);
//               document.cookie = `accessToken=${data.accessToken}; path=/;`;
//               setIsLoggedIn(true);
//             } else {
//               logout();
//             }
//           } catch {
//             logout();
//           }
//         }
//       }
//       setIsReady(true); // Always set ready at the end
//     };
//     initAuth();
//   }, [isTokenValid, logout]); // Added dependencies

//   // 2. Adjust the Timer Logic
//   useEffect(() => {
//     if (!accessToken) return;

//     try {
//       const decoded = jwtDecode<JwtPayload>(accessToken);
//       const timeUntilExpiry = decoded.exp * 1000 - Date.now();

//       // If already expired, don't set timers, just logout or try immediate refresh
//       if (timeUntilExpiry <= 0) {
//         logout();
//         return;
//       }

//       const refreshTime = Math.max(timeUntilExpiry - 30000, 0); // Refresh 30s before
//       const warningTime = Math.max(timeUntilExpiry - 60000, 0); // Warn 60s before

//       const refreshTimeout = setTimeout(async () => {
//         const rt = getCookie('refreshToken');
//         console.log('Value of refeshToken from authCOntext using getCOokie fn:', rt);
//         if(!rt) return logout();
//         try {
//           const data:{accessToken:string} = await refreshToken() as {accessToken:string};
//           if (data?.accessToken) {
//             setAccessToken(data.accessToken);
//             document.cookie = `accessToken=${data.accessToken}; path=/;`; 
//           } else {
//             logout();
//           }
//         } catch(err) {
//           console.warn(`Error1 in the second useEffect in authContext: ${err}`);
//           logout();
//         }
//       }, refreshTime);

//       // Only set warning if there's actually time left
//       let warningTimeout: NodeJS.Timeout;
//       if (timeUntilExpiry > 60000) {
//         warningTimeout = setTimeout(() => {
//           toastShowWarning('Session expiring soon!', 500);
//         }, warningTime);
//       }

//       return () => {
//         clearTimeout(refreshTimeout);
//         if (warningTimeout) clearTimeout(warningTimeout);
//       };
//     } catch (e) {
//       console.warn(`Error2 in the second useEffect in authContext: ${e}`);
//       logout();
//     }
//   }, [accessToken, logout]);


//   // JWT validation


//   const contextValue = useMemo(
//     () => ({
//       accessToken,
//       setAccessToken,
//       isLoggedIn,
//       setIsLoggedIn,
//       isReady,
//       logout,
//       isTokenValid,
//     }),
//     [accessToken, isLoggedIn, isReady, logout, isTokenValid]
//   );

//   if (!isReady) return 
//   <div className="text-center text-blue-500 flex flex-col items-center justify-center  mt-50">
//     Checking Authentication from authcontext... 
//     <BounceLoader className='relative top-10'  size={70}  color={theme ==='dark' ?'#0F172B':'#779dffff'} speedMultiplier={2}/>
//   </div>; 
    
//   return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

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
import { toastShowWarning } from '../utils/toastUtils';
import { BounceLoader } from 'react-spinners';
import { useTheme } from './themeContext';
import { JwtPayload, AuthContextType } from '../utils/definitions';
import { jwtDecode } from 'jwt-decode';
import apiFetch from '../utils/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the refresh API inside or import it
const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL;

// export const apiFetch = async (url: string, options: any) => {
//     const res = await fetch(url, options);
//     if (!res.ok) throw new Error('Fetch failed');
//     return res.json();
// };

export const refreshTokenApi = async () => {
    return apiFetch(`${AUTH_SERVICE}/api/v1/auth/refresh/`, {
        method: 'POST',
        credentials: 'include', // CRITICAL: This sends the httpOnly refreshToken
    });
};

export const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    } catch (err) {
        console.error(`Error reading the cookie "${name}"`, err);
    }
    return null;
};

export const AuthProvider = ({ children, initialToken }: { children: ReactNode; initialToken: string | null; }) => {
  const [accessToken, setAccessToken] = useState<string | null>(initialToken);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!initialToken);
  const [isReady, setIsReady] = useState<boolean>(false);
  const { theme, clearTheme } = useTheme();

  const isTokenValid = useCallback((token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    // Only update state if we are currently logged in to prevent render loops
    setAccessToken((prev) => {
        if (prev === null) return null;
        return null;
    });
    setIsLoggedIn((prev) => {
        if (prev === false) return false;
        return false;
    });
    
    clearTheme();
    // Clear cookies (Note: httpOnly cookies won't be cleared by JS, 
    // but clearing the paths helps prevent client-side confusion)
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.setItem('logout-event', Date.now().toString());
  }, [clearTheme]);

  // 1. Initial Authentication Logic (Fixes the iPhone Loop)
  useEffect(() => {
    const initAuth = async () => {
      const token = getCookie('accessToken');
      
      if (token && isTokenValid(token)) {
        setAccessToken(token);
        setIsLoggedIn(true);
      } else {
        // iPhone Fix: Don't check for 'refreshToken' cookie in JS. 
        // It's httpOnly, so getCookie will return null. Just try the API.
        try {
          const data = await refreshTokenApi() as { accessToken: string };
          if (data?.accessToken) {
            setAccessToken(data.accessToken);
            setIsLoggedIn(true);
          }
        } catch (err) {
          // If refresh fails, we do nothing. We stay logged out.
          // Do NOT call logout() here; it triggers the dependency loop.
          console.log("No valid session found.");
        }
      }
      setIsReady(true);
    };
    initAuth();
  }, [isTokenValid]); // Removed logout from dependencies

  // 2. Token Expiry & Silent Refresh Logic
  useEffect(() => {
    if (!accessToken || !isLoggedIn) return;

    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();

      if (timeUntilExpiry <= 0) {
        logout();
        return;
      }

      const refreshTime = Math.max(timeUntilExpiry - 30000, 0); 
      const warningTime = Math.max(timeUntilExpiry - 60000, 0);

      const refreshTimeout = setTimeout(async () => {
        try {
          const data = await refreshTokenApi() as { accessToken: string };
          if (data?.accessToken) {
            setAccessToken(data.accessToken);
          } else {
            logout();
          }
        } catch (err) {
          logout();
        }
      }, refreshTime);

      let warningTimeout: NodeJS.Timeout;
      if (timeUntilExpiry > 60000) {
        warningTimeout = setTimeout(() => {
          toastShowWarning('Session expiring soon!', 500);
        }, warningTime);
      }

      return () => {
        clearTimeout(refreshTimeout);
        if (warningTimeout) clearTimeout(warningTimeout);
      };
    } catch (e) {
      logout();
    }
  }, [accessToken, isLoggedIn, logout]);

  // Sync logout across tabs
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === 'logout-event') logout();
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, [logout]);

  const contextValue = useMemo(() => ({
    accessToken,
    setAccessToken,
    isLoggedIn,
    setIsLoggedIn,
    isReady,
    logout,
    isTokenValid,
  }), [accessToken, isLoggedIn, isReady, logout, isTokenValid]);

  if (!isReady) {
    return (
      <div className="text-center text-blue-500 flex flex-col items-center justify-center mt-50">
        Checking Authentication...
        <BounceLoader className='relative top-10' size={70} color={theme === 'dark' ? '#0F172B' : '#779dffff'} speedMultiplier={2} />
      </div>
    );
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
