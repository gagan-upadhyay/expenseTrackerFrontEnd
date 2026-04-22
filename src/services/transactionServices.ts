import apiFetch from "../utils/apiClient";
import { Transaction, TransacationError, deletePayload } from "../utils/definitions";
import {safeParseJson, safeParseJsonResult} from '../utils/safeParseJSON';
import {TransactionSchema, TransactionsSchema} from '../utils/schemas/transactionSchema';
import imageCompression from "browser-image-compression";

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

export async function fetchAllTransactions(queryString: string = ""): Promise<Transaction[] | TransacationError> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    
    if (!TRANSACTION_SERVICE) throw new Error('Missing transaction_service URL');

    try {
        // Construct URL with the query string
        const url = `${TRANSACTION_SERVICE}/api/v1/transactions${queryString}`;

        const res = await fetch(url, {
            credentials: 'include',
            signal: controller.signal,
        });

        const result = await safeParseJsonResult(res, TransactionsSchema);
        // console.log('value of result:', result);

        if (result.ok) {
            return result?.data;
        }
        
        return {
            err: result?.error || "Failed to parse transactions",
            zodError: result.zodError ? JSON.stringify(result.zodError) : undefined
        };

    } catch (err: any) {
        // Fix: Explicitly add zodError: undefined to satisfy the type requirement
        if (err.name === 'AbortError') {
            return { 
                err: 'Request timed out', 
                zodError: undefined 
            };
        }
        return { 
            err: 'Error while fetching transactions', 
            zodError: undefined 
        };
    } finally {
        clearTimeout(timeout);
    }
}

export async function saveOneTransaction(amount:number, type:'debit'|'credit', displayname:string, description:string, reference:string, occurredat:Date, categorycode:string, accountId:string, isPayable:boolean):Promise<string|TransacationError>{
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort, 20_000);
    if(!TRANSACTION_SERVICE) throw new Error('Missing Transaction_Service URL');
    
    try{
        const res:{success:boolean, message:string} = await apiFetch(`${TRANSACTION_SERVICE}/api/v1/transactions/`,{
            method:'POST',
            credentials:'include',
            body:JSON.stringify({amount, type, displayname, description, reference, occurredat, categorycode, accountId, isPayable})

        })as {success:boolean, message:string};
        return res?.message
    }catch(err){
        console.warn('Error while saving transaction:', err);
        throw new Error('Error while saving transaction');
    }finally{
        clearTimeout(timeout);
    }
}

export async function uploadTransactionReceipt(file:File){
  try{ 
    // ✅ 1. Validate file
    if(!file.type.startsWith("image/")){
      throw new Error("Only image files are allowed");
    }
    if(file.size>2*1024*1024){
      throw new Error("File size should be less than 2MB");
    }

    // ✅ 2. Compress Image
    const compressedFile = await imageCompression(file, {
      maxSizeMB:2,
      maxWidthOrHeight:512,
      useWebWorker:true
    });
    
    // ✅ 3. Get SAS URL
    const res = await apiFetch(`${TRANSACTION_SERVICE}/api/v1/transactions/generate-upload-url`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({fileType:compressedFile.type}),
    credentials:'include',
    }) as {success:boolean, uploadUrl:string, blobName:string|undefined, error:string|null};

    if(!res.success){
      throw new Error(res.error || "Failed to get upload URL");
    }
  // ✅ 4. Upload to Azure Blob
    await fetch(res.uploadUrl, {
      method:"PUT",
      headers:{
        "x-ms-blob-type":"BlockBlob",
        "Content-Type":file.type
      },
      body:compressedFile
    });
    return {success:true, blobName:res.blobName}
    }catch(err){
        return{   
            success: false, 
            blobName: undefined, 
            error: err instanceof Error ? err.message : "Upload failed" 
        }
    }
}



export const deleteTransaction=async (deletePayload:deletePayload)=>{
    const {transactionId} = deletePayload;
    try{
        const res:{success:boolean, message:string|null, error:string|null} = await apiFetch(`${TRANSACTION_SERVICE}/api/v1/transactions/${transactionId}`, {
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(deletePayload)
        });
        if(res.success){
            return res.message;
        }
    }catch(err){
        return {
            success:false,
            error:err instanceof Error ? err.message: "Delete transaction failure"
        }
    }
}

export const updateTransaction = async (transactionId: string, payload: any) => {
    const res = await apiFetch(`${TRANSACTION_SERVICE}/api/v1/transactions/${transactionId}`, {
        method: 'PATCH',
        credentials:'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return res;
};


export const fetchStatsService = async(args:string)=>{
    const res = await apiFetch(`${TRANSACTION_SERVICE}/api/v1/transactions/stats/breakdown${args}`,{
        method:'GET',
        credentials:'include'
    });
    return res;
}
