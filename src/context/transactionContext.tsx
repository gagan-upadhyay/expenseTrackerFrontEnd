'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TransacationError, Transaction } from "../utils/definitions";
import { fetchAllTransactions } from "../services/transactionServices";
import { useAuth } from "./authContext";
import getLogger from "../services/logger-service";

interface TransactionContextType{
    transactions: Transaction[]|null;
    loading:boolean;
    errorMsg:TransacationError|null;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({children}:{children:React.ReactNode})=>{
    const [transactions, setTransactions ] = useState<Transaction[]|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<TransacationError|null>(null);
    const {isLoggedIn} = useAuth();

    const fetchTransactions = useCallback(async()=>{
        try{
            setLoading(true);
            setErrorMsg(null);
            const data = await fetchAllTransactions();
            // console.log('Value of data from transaction context:', data);
           if(data && !('error' in data)){
            setLoading(false);
            setTransactions(data as Transaction[]);
           } else if('error' in data){
            setErrorMsg(data as TransacationError);
           }
            // console.log('Value of transactions from transactionContext:\n', transactions);
            // return data;
        }catch(err){
            const errorObj: TransacationError = {
                err: err instanceof Error ? err.message : 'An error occurred',
                zodError: undefined
            };
            setErrorMsg(errorObj);
            // console.error('Value of error form transations context:', err);
            getLogger(`error while fetching transactions:${errorMsg}`);
        }finally{
            setLoading(false);
            
        }
    }, []);

    useEffect(()=>{
        if(isLoggedIn){
            fetchTransactions();
        }
        
    }, [fetchTransactions, isLoggedIn]);

    const contextValue = useMemo(()=>({
        transactions, loading, errorMsg, setTransactions
    }), [transactions, loading, errorMsg, setTransactions]);

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );

};
export const useTransactions=()=>{
    const context = useContext(TransactionContext);
    if(!context){
        throw new Error('useTransaction must be used within Transaction Provider')
    }
    return context;
;}
