import { Account, CardDetails } from "../utils/definitions";

const ACCOUNT_SERVICE=process.env.NEXT_PUBLIC_ACCOUNT_SERVICE;

export async function getAccounts(): Promise<Account[]>{
    if(!ACCOUNT_SERVICE) throw new Error('Missing NEXT_PUBLIC_ACCOUNT_SERVICE');

    const res = await fetch(`${ACCOUNT_SERVICE}/api/v1/accounts`, {
        credentials:'include',
    });
    const data = await res.json();
    if(!res.ok) throw new Error(data?.message|| 'Failed to fetch accounts');
    // console.log("Value of data fetched:\n",data);
    return Array.isArray(data?.result)?data.result:data;
}

export async function getAccountById(accountId:string):Promise<Account[]>{
    const res = await fetch(`${ACCOUNT_SERVICE}/api/v1/accounts/:${accountId}`,{
        credentials:'include'
    });

    const data = await res.json();
    if(!res.ok) throw new Error(data?.message || 'Failed to fetch account');
    return data?.result ?? data;
}
// ----------------------------------------------------------------

type GetAccountByuserResult = {
    account: { success: boolean; message: string; data: Account[] } | null;
    cards: { success: boolean; result: CardDetails[] } | null;
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


export async function getAccountByUser(): Promise<GetAccountByuserResult>{
    const controller = new AbortController();
    const timeout = setTimeout(()=> controller.abort(), 12_000);
    const accountUrl = `${ACCOUNT_SERVICE}/api/v1/accounts`;
    const cardsUrl = `${ACCOUNT_SERVICE}/api/v1/accounts/cards/`;
    //will fetch an array of accounts and cards

    try{
        const [resAcc, resCards] = await Promise.all([
            fetch(accountUrl,{
                headers:{   
                    'Content-Type':'application/json'
                },
                credentials:'include',
                signal:controller.signal,
            }),
            fetch(cardsUrl, {
                headers:{'Content-Type':'application/json',
                    // 'Access-Control-Allow-Origin'
                },
                credentials:'include',
                signal:controller.signal,
            }),
        ]);
        // console.log('Value of resAcc and resCards from accountService:\n', resAcc, resCards);
        if(resAcc.ok && resCards.ok){
            const account = await (resAcc.json()??null) as { success: boolean; message: string; data: Account[] } | null;
            const card = await (resCards.json()??null) as { success: boolean; result: CardDetails[] } | null;
            return {account:account, cards:card, cardsErrMsg:null, accountErrMsg:null};
        }else if(!resAcc.ok && resCards.ok){
            const errAccBody = await safeParseJson<{message?:string}>(resAcc);
            const accountErrMsg = errAccBody?.message ?? `Failed to fetch acoount details (${resAcc.status} ${resAcc.statusText})`;
            const cards = await (resCards.json() ?? null) as { success: boolean; result: CardDetails[] };
            return {account: null, cards, accountErrMsg, cardsErrMsg: null}
            
        }
        else if(!resCards.ok && resAcc.ok){
            const errCardBody = await safeParseJson<{message?:string}>(resCards);
            const cardsErrMsg = errCardBody?.message ?? `Failed to fetch cards details (${resCards.status} ${resCards.statusText})`;
            const account = await (resAcc.json() ?? null) as { success: boolean; message: string; data: Account[] } | null;
            console.log('value of account from accountService:\n', account);
            return {account:account, cards:null, accountErrMsg:null, cardsErrMsg:cardsErrMsg}
        }
        else{
            throw new Error('Failed to fetch account details');
        }
    }finally{
        clearTimeout(timeout)
    }
}