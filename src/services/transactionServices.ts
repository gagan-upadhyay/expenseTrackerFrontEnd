import apiFetch from "../utils/apiClient";
import { Transaction, TransacationError } from "../utils/definitions";
import {safeParseJson, safeParseJsonResult} from '../utils/safeParseJSON';
import {TransactionSchema, TransactionsSchema} from '../utils/schemas/transaction';

const TRANSACTION_SERVICE = process.env.NEXT_PUBLIC_TRANSACTION_SERVICE;
console.log(`Value of TRANSACTION_SERVICE:${TRANSACTION_SERVICE} from transactionservice.ts`);

export async function fetchSingleTransaction(id:string):Promise<Transaction|null> {

    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 12_000);
    
    if(!TRANSACTION_SERVICE) throw new Error('Missing Transaction_service Url');

    try{
        const res = await fetch(`${TRANSACTION_SERVICE}/api/v1/transactions/${id}/`,{
            credentials:'include',
            signal:controller.signal,
            // headers:{
            // }
        
        });
        return await safeParseJson(res, TransactionSchema);
    }catch(err){
        console.error(`Error while fetching transaction:\n`, err);
        throw new Error('Error while fetching transaction details');
    }finally{
        clearTimeout(timeout)
    }
}



export async function fetchAllTransactions():Promise<Transaction[]|TransacationError>{
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(), 20_000);
    if(!TRANSACTION_SERVICE) throw new Error('Missing transaction_service URL');

    try{
        const res = await fetch(`${TRANSACTION_SERVICE}/api/v1/transactions/`, {
            credentials:'include',
            signal:controller.signal,
        });

        // console.log('Value of res from fetchAlltransacctions transacService:\n', await res.json());
        const result =  await safeParseJsonResult(res, TransactionsSchema);
        // console.log('Value of result from fetchTransacts function:\n', result);
        if(result.ok){
            return result?.data;
        }
        if(!result.ok){
            return {err:result?.error, zodError:result.zodError ? JSON.stringify(result.zodError) : undefined}
        }
        return result;
    }catch(err){
        console.warn('Error while fetching transactions', err);
        throw new Error('Error while fetching transactions');
    }finally{
        clearTimeout(timeout);
    }
}

export async function saveOneTransaction(amount:number, type:'debit'|'credit', displayname:string, description:string, reference:string, occurredat:Date, categorycode:string):Promise<string|TransacationError>{
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort, 20_000);
    if(!TRANSACTION_SERVICE) throw new Error('Missing Transaction_Service URL');
    
    try{
        const res:{success:boolean, message:string} = await apiFetch(`${TRANSACTION_SERVICE}/api/v1/transactions/`,{
            method:'POST',
            credentials:'include',
            body:JSON.stringify({amount, type, displayname, description, reference, occurredat, categorycode})

        })as {success:boolean, message:string};
        return res?.message
    }catch(err){
        console.warn('Error while saving transaction:', err);
        throw new Error('Error while saving transaction');
    }finally{
        clearTimeout(timeout);
    }
}