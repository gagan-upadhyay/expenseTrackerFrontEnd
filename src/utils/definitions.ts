import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export type NewUser = {
    firstname: string;
    lastname: string;
    email: string;
    // password:string;
    newPassword?: string;
    oldPassword?:string,
    profile_picture?: string | File | null;
};

export type fetchedUser={
    id:string;
    firstname:string;
    lastname:string;
    email:string;
    profile_picture:string|null;
    password:string;
    theme:'light'|'dark';
    updated_at:string;
    base_currency:string
}

export type AddedUser = {
    id:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    profile_picture:string |null,
    theme:string
}



export interface JwtPayload {
exp: number;
[key: string]: unknown;
}

export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  isReady: boolean;
  logout: () => void;
  isTokenValid:(token:string)=>boolean;
}

export type NavbarProps={
    theme:string;
}


export interface AccountTotals {
    netWorth: string;
    income: string;
    expense: string;
    currency: string;
}

export type AccountType = 'savings'| 'credit' | 'wallet';
export interface Account{
    id:string;
    user_id:string;
    account_type:AccountType;
    currency_code:string;
    opening_balance:string;
    total_income:string;
    total_expense:string;
    remaining_balance:string;
    created_at:Timestamp;
    is_liability:boolean
}
export interface AccountContextType {
    accounts: Account[] | undefined;
    totals:AccountTotals|null;
    loading: boolean;
    error: string | null;
    cards:fetchedCardsDetails[] | null;
    refreshAccounts: () => Promise<void>;
    setAccounts:React.Dispatch<React.SetStateAction<Account[] | undefined>>;
}

export interface CardDetails{
    brand:string;
    cardnumber:string;
    holder_name:string;
    expiry_month:number;
    expiry_year:number;
    cvv?:string;
    is_active:boolean;
    type:'debit'|'credit';
}

export interface fetchedCardsDetails extends CardDetails{
    id:string;
    account_id:string;
    created_at?:string;
}

export interface Transaction{
    id:string;
    user_id: string;
    account_id: string;
    category_id: string;
    amount: string;
    type: "credit"| "debit";
    description: string;
    reference: string|null;
    occurred_at: string;
    created_at: string;
    is_active: boolean,
    deleted_at: string | null;
    display_name:string;
    currency_code:string;
    category_code:string;
    is_payable:boolean;
}

export type TransacationError={
    err:string;
    zodError:string|undefined;
}

export interface deletePayload{
    accountId:string;
    userId:string, 
    transactionId:string
}

export interface SwipeableProps {
   onDone?: () => void;
   onDelete: () => void;
   id?:string;
   swipeFor:string;
   children: React.ReactNode;
 }