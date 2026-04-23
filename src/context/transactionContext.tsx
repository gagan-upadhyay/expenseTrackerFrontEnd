'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { deletePayload, TransacationError, Transaction } from "../utils/definitions";
import { 
    deleteTransaction as deleteTransactionService, 
    fetchAllTransactions, 
    // fetchStatsService,
    updateTransaction as updateTransactionApiService 
} from "../services/transactionServices";
import { useAuth } from "./authContext";
import { useUser } from "./userContext";
import getLogger from "../services/logger-service";

interface TransactionContextType {
    transactions: Transaction[] | null;
    loading: boolean;
    errorMsg: TransacationError | null;
    fetchTransactions: (filters?: Record<string, string>) => Promise<void>;
    deleteTransaction: (transactionId: string) => Promise<void>;
    updateTransaction: (transactionId: string, accountId:string,  updates: Partial<Transaction>) => Promise<void>;
    removeReceiptOnly: (transactionId: string, accountId:string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<TransacationError | null>(null);
    // const [stats, setStats] = useState(null);
    // const []
    
    const { isLoggedIn } = useAuth();
    const { user } = useUser();
    // const baseCurrency = user?.base_currency;

    const fetchTransactions = useCallback(async (filters?: Record<string, string>) => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const queryString = filters ? '?' + new URLSearchParams(filters).toString() : '';
            const data = await fetchAllTransactions(queryString);

            if (data && !('error' in data)) {
                setTransactions(data as Transaction[]);
            } else if (data && 'error' in data) {
                setErrorMsg(data as TransacationError);
            }
        } catch (err) {
            const errorObj:TransacationError={
                err:err instanceof Error? err.message:'An error occurred', 
                zodError:undefined
            }
            setErrorMsg(errorObj);
            getLogger(`Error while fetching transactions:${errorObj.err}`)
        } finally {
            setLoading(false);
        }
    }, []);

    // const fetchStats = useCallback(async()=>{
    //     try{
    //         const data = await fetchStatsService(`?base_currency=${baseCurrency}`);
    //         if(data){
    //             console.log('value of data', data);
    //             setStats(data);
    //         }
            
    //     }catch(err){
    //         const errorObj:TransacationError={
    //             err:err instanceof Error? err.message:'An error occurred', 
    //             zodError:undefined
    //         }
    //         getLogger(errorObj);
    //     }
    // },[]);

    const deleteTransactionHandler = useCallback(async (transactionId: string) => {
        const target = transactions?.find(t => t.id === transactionId);
        if (!target || !user?.id) return;

        const payload: deletePayload = {
            transactionId,
            userId: user.id,
            accountId: target.account_id // Use account_id from the transaction itself
        };

        try {
            const success = await deleteTransactionService(payload);
            if (success) {
                setTransactions((prev) => prev ? prev.filter(t => t.id !== transactionId) : null);
            }
        } catch (err) {
            getLogger(`Delete error: ${err}`);
        }
    }, [transactions, user]);

    const updateTransactionHandler = useCallback(async (transactionId: string, accountId:string, updates: Partial<Transaction>) => {
        // if (!user?.id) return console.error("No user ID found");
        const payload = {
            ...updates,
            
            accountId: accountId
        };

        try {
            console.log("4. Checks passed. Sending PATCH to backend...");
            // console.log('Value of transactionIdL', transac)
            const res:{success:boolean, error:null|string, message:string|null} = await updateTransactionApiService(transactionId, payload) as {success:boolean, error:null|string, message:string|null};
            console.log("Value of res:", res);
            if (res.success) {
                setTransactions(prev => prev?.map(t => 
                    t.id === transactionId ? { ...t, ...updates } : t
                ) ?? null);
            }
        } catch (err) {
            getLogger(`Update error: ${err}`);
        }
    }, [user?.id]);

    const removeReceiptOnlyHandler = useCallback(async (transactionId: string, accountId:string) => {
        await updateTransactionHandler(transactionId, accountId,{ reference: null });
    }, [updateTransactionHandler]);

    useEffect(() => {
        if (isLoggedIn) fetchTransactions();
    }, [fetchTransactions, isLoggedIn]);

    const contextValue = useMemo(() => ({
        transactions,
        loading,
        errorMsg,
        fetchTransactions,
        deleteTransaction: deleteTransactionHandler,
        updateTransaction: updateTransactionHandler,
        removeReceiptOnly: removeReceiptOnlyHandler,
        // fetchStats,
    }), [transactions, loading, errorMsg, 
        // fetchStats,
        fetchTransactions, deleteTransactionHandler, updateTransactionHandler, removeReceiptOnlyHandler]);

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) throw new Error('useTransaction must be used within Transaction Provider');
    return context;
};
