import apiFetch from "../utils/apiClient";
import { Account, AccountTotals, CardDetails, fetchedCardsDetails } from "../utils/definitions";

const ACCOUNT_SERVICE=process.env.NEXT_PUBLIC_ACCOUNT_SERVICE;
console.log(`Value of ACCOUNT_SERVICE: ${ACCOUNT_SERVICE} from accountService.ts file`);

export async function getAccounts(): Promise<Account[]>{
    if(!ACCOUNT_SERVICE) throw new Error('Missing NEXT_PUBLIC_ACCOUNT_SERVICE');

    const res = await fetch(`${ACCOUNT_SERVICE}/api/v1/accounts/`, {
        credentials:'include',
    });
    const data = await res.json();
    console.log('value of data that should be accounts:', data);
    if(!res.ok) throw new Error(data?.message|| 'Failed to fetch accounts');
    // console.log("Value of data fetched:\n",data);
    return Array.isArray(data?.result)?data.result:data;
}

export async function getAccountById(accountId:string):Promise<Account[]>{
    const res = await fetch(`${ACCOUNT_SERVICE}/api/v1/accounts/:${accountId}/`,{
        credentials:'include'
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data?.message || 'Failed to fetch account');
    return data?.result ?? data;
}
// ----------------------------------------------------------------

type GetAccountByuserResult = {
    account:  Account[] | undefined;
    totals:AccountTotals | undefined;
    cards: { success: boolean; result: fetchedCardsDetails[] } | null;
    accountErrMsg: string | null;
    cardsErrMsg: string | null;
    
}

const safeParseJson = async <T=unknown>(res:Response): Promise<T | null> =>{
    try{
        return await res.json() as T;
    }catch{
        return null;
    }
}


// export async function getAccountByUser(args:string): Promise<GetAccountByuserResult>{
//     const controller = new AbortController();
//     const timeout = setTimeout(()=> controller.abort(), 12_000);
//     const accountUrl = `${ACCOUNT_SERVICE}/api/v1/accounts${args}`;
//     const cardsUrl = `${ACCOUNT_SERVICE}/api/v1/accounts/cards/`;
//     //will fetch an array of accounts and cards

//     try{
//         const [resAcc, resCards] = await Promise.all([
//             fetch(accountUrl,{
//                 headers:{   
//                     'Content-Type':'application/json'
//                 },
//                 credentials:'include',
//                 signal:controller.signal,
//             }),
//             fetch(cardsUrl, {
//                 headers:{'Content-Type':'application/json',
//                     // 'Access-Control-Allow-Origin'
//                 },
//                 credentials:'include',
//                 signal:controller.signal,
//             }),
//         ]);
//         // console.log('Value of resAcc and resCards from accountService:\n', resAcc, resCards);
//         if(resAcc.ok && resCards.ok){
//             const account = await (resAcc.json()??null) as { success: boolean; message: string; data: Account[] } | undefined;
//             const card = await (resCards.json()??null) as { success: boolean; result: fetchedCardsDetails[] } | null;
//             return {account:account, cards:card, cardsErrMsg:null, accountErrMsg:null};
//         }else if(!resAcc.ok && resCards.ok){
//             const errAccBody = await safeParseJson<{message?:string}>(resAcc);
//             const accountErrMsg = errAccBody?.message ?? `Failed to fetch acoount details (${resAcc.status} ${resAcc.statusText})`;
//             const cards = await (resCards.json() ?? null) as { success: boolean; result: fetchedCardsDetails[] };
//             return {account: undefined, cards, accountErrMsg, cardsErrMsg: null}
            
//         }
//         else if(!resCards.ok && resAcc.ok){
//             const errCardBody = await safeParseJson<{message?:string}>(resCards);
//             const cardsErrMsg = errCardBody?.message ?? `Failed to fetch cards details (${resCards.status} ${resCards.statusText})`;
//             const account = await (resAcc.json() ?? undefined) as { success: boolean; message: string; data: Account[] } | undefined;
//             console.log('value of account from accountService:\n', account);
//             return {account:account, cards:null, accountErrMsg:null, cardsErrMsg:cardsErrMsg}
//         }
//         else{
//             throw new Error('Failed to fetch account details');
//         }
//     }finally{
//         clearTimeout(timeout)
//     }
// }

export async function getAccountByUser(args: string): Promise<GetAccountByuserResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    
    // Fix: Ensure URL construction doesn't double-slash before query params
    const accountUrl = `${ACCOUNT_SERVICE}/api/v1/accounts${args}`; 
    const cardsUrl = `${ACCOUNT_SERVICE}/api/v1/accounts/cards/`;

    try {
        const [resAcc, resCards] = await Promise.all([
            fetch(accountUrl, { credentials: 'include', signal: controller.signal }),
            fetch(cardsUrl, { credentials: 'include', signal: controller.signal }),
        ]);

        // Parse bodies immediately to avoid "body already used" errors
        const accountData = resAcc.ok ? await resAcc.json() : null;
        const cardData = resCards.ok ? await resCards.json() : null;
        console.log('Value of accoutnData:', accountData);
        let accountErrMsg = null;
        let cardsErrMsg = null;

        if (!resAcc.ok) {
            const err = await safeParseJson<{message?: string}>(resAcc);
            accountErrMsg = err?.message ?? `Account Error: ${resAcc.status}`;
        }

        if (!resCards.ok) {
            const err = await safeParseJson<{message?: string}>(resCards);
            cardsErrMsg = err?.message ?? `Cards Error: ${resCards.status}`;
        }

        return {
            account: accountData?.accounts,
            totals:accountData?.totals,
            cards: cardData,
            accountErrMsg,
            cardsErrMsg
        };
    } catch (err) {
        throw err;
    } finally {
        clearTimeout(timeout);
    }
}


export type NewAccountPayload = {
    accountType: string;
    currencyCode: string,
    openingBalance:number,
    totalIncome: number,
    totalExpense: number,
};

export async function createAccount(payload: NewAccountPayload): Promise<Account>{
    if(!ACCOUNT_SERVICE) throw new Error('Missing NEXT_PUBLIC_ACCOUNT_SERVICE');
    console.log(`Value of payload: ${payload}`);
    const res = await fetch(`${ACCOUNT_SERVICE}/api/v1/accounts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data?.message || 'Failed to create account');

    return data?.result ?? data;
}

export type NewCardPayload = {
    // account_id: string;
    brand: string;
    cardnumber: string;
    holder_name: string;
    expiry_month: number;
    expiry_year: number;
    cvv?: string;
    is_active: boolean;
    type: 'credit' | 'debit'|'loan';
};

export async function createCard(accountId:string, payload: NewCardPayload): Promise<CardDetails> {
    if(!ACCOUNT_SERVICE) throw new Error('Missing NEXT_PUBLIC_ACCOUNT_SERVICE');

    const res = await fetch(`${ACCOUNT_SERVICE}/api/v1/accounts/${accountId}/cards/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data?.message || 'Failed to create card');

    return data?.result ?? data;
}


export async function deleteAccountDetails(id:string){
    if(!id) throw new Error('Missing accountId');

    return await apiFetch(`${ACCOUNT_SERVICE}/api/v1/accounts/${id}`, {
        method:'DELETE',
        credentials:'include'
    }) as {success:boolean, message:string|null, error:string|null};

}

export async function CreateAccountWithCards(
    accountPayload:NewAccountPayload,
    cardsPayload:NewCardPayload[]
):Promise<{account:Account, cards:CardDetails[]}>{
    
    // 1. create account
    const account = await createAccount(accountPayload);
    console.log('Value of account:', account);
    const accountId = account.id;
    console.log(`value of accountId: ${accountId}`);
    
    if(!accountId){
        throw new Error("Account created but no ID was returned to save and link cards");
    }

    // 2. Create card and link them
    
    const cardPromises=cardsPayload.map(card=>createCard(accountId, card));
    const cards = await Promise.all(cardPromises);
    return {
        account, cards
    };

}