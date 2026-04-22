'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { Account, AccountContextType, AccountTotals, fetchedCardsDetails } from '../utils/definitions';
import { getAccountByUser } from '../services/accountServices';
import { useUser } from './userContext';



const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider=({ children}:{ children:React.ReactNode }) => {
    const [accounts, setAccounts] = useState<Account[] | undefined>(undefined);
    const [cards, setCard] = useState<fetchedCardsDetails[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {user} = useUser();
    const [totals, setTotals] = useState<AccountTotals|null>(null);
    // const {setIsLoggedIn, logout} = useAuth();

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const baseCurrency = user?.base_currency || 'INR';
            const data = await getAccountByUser(`?base_currency=${baseCurrency}`);
            
            if(data?.account){
                // console.log("value of data.account", data);
            setTotals(data?.totals ?? null);
            setAccounts(data?.account ?? undefined);
            }
            // console.log('Value of data?.account', data);
            setCard(data?.cards?.result ?? null);

            
        } catch (err) {
            // setIsLoggedIn(false);
            // logout();
            console.error(`Error occured while fetching accounts details:\n ${err}`);
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [user?.base_currency]);

    useEffect(() => {
        fetchAccounts();
        // console.log(`value of accounts and card: ${accounts}, ${cards}`);
    }, [fetchAccounts]);

    const contextValue = useMemo(()=>({
        accounts, setAccounts, cards, totals, loading, error, refreshAccounts:fetchAccounts
    }),[accounts, setAccounts, cards, totals, loading, error, fetchAccounts])

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