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
// import { BounceLoader } from 'react-spinners';
import { useTheme } from './themeContext';
import { JwtPayload, AuthContextType } from '../utils/definitions';
import { jwtDecode } from 'jwt-decode';
// import apiFetch from '../utils/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the refresh API inside or import it
const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE;

// ✅ Use raw fetch to avoid circular 401 handling in apiFetch
export const refreshTokenApi = async () => {
    const url = `${AUTH_SERVICE}/api/v1/auth/refresh/`;
    const res = await fetch(url, {
        method: 'POST',
        credentials: 'include', // CRITICAL: This sends the httpOnly refreshToken
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Token refresh failed: ${res.status} ${errorText}`);
    }
    
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return res.json();
    }
    throw new Error('Invalid response from refresh endpoint');
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
  // Replace the initAuth useEffect with this:
useEffect(() => {
  const initAuth = async () => {
    // ✅ Never try getCookie('accessToken') — it's httpOnly, unreliable on iOS
    // Always go straight to the refresh endpoint which uses the httpOnly
    // refreshToken cookie automatically via credentials: 'include'
    try {
      const data = await refreshTokenApi() as { accessToken: string };
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
      }
    } catch (err) {
      // No valid session — stay logged out, don't call logout()
      console.log('No valid session found.');
    }
    setIsReady(true);
  };
  initAuth();
}, []); // ✅ Empty deps — run once on mount only

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

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
