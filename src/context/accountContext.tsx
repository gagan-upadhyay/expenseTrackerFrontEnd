'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { Account, fetchedCardsDetails } from '../utils/definitions';
import { getAccountByUser } from '../services/accountServices';
// import { useAuth } from './authContext';
// import { useUser } from './userContext';

interface AccountContextType {
    accounts: Account[] | undefined;
    loading: boolean;
    error: string | null;
    cards:fetchedCardsDetails[] | null;
    refreshAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider=({ children}:{ children:React.ReactNode }) => {
    const [accounts, setAccounts] = useState<Account[] | undefined>(undefined);
    const [cards, setCard] = useState<fetchedCardsDetails[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // const {setIsLoggedIn, logout} = useAuth();

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAccountByUser();
            if(data?.account){
            }
            setCard(data?.cards?.result ?? null);
            setAccounts(data.account?.data ?? undefined);
        } catch (err) {
            // setIsLoggedIn(false);
            // logout();
            console.error(`Error occured while fetching accounts details:\n ${err}`);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const contextValue = useMemo(()=>({
        accounts, cards, loading, error, refreshAccounts:fetchAccounts
    }),[accounts, cards, loading, error, fetchAccounts])

    return (
        <AccountContext.Provider value={contextValue}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccounts = () => {
    const context = useContext(AccountContext);
    if (!context) {
        throw new Error('useAccounts must be used within AccountProvider');
    }
    return context;
};