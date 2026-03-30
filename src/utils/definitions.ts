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
    firstname:string;
    lastname:string;
    email:string;
    profile_picture:string|null;
    password:string;
    theme:'light'|'dark';
}

export type AddedUser = {
    id:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    profile_picture:string,
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
export type AccountType = 'savings'| 'credit' | 'wallet';
export interface Account{
    id:string;
    user_id:string;
    account_name:AccountType;
    currency_code:string;
    opening_balance:string;
    total_income:string;
    total_expense:string;
    remaining_balance:string;
    created_at:Timestamp;
}

export interface CardDetails{
    // id:string;
    brand:string;
    cardnumber:string;
    holder_name:string;
    expiry_month:number;
    expiry_year:number;
    cvv?:string;
    is_active:boolean;
    type:'debit'|'credit';
}

export interface Transaction{
    id:string;
    user_id: string;
    account_id: string;
    category_id: string;
    amount: string;
    type: "credit"| "debit";
    description: string;
    reference: string;
    occurred_at: string;
    created_at: string;
    is_active: boolean,
    deleted_at: string | null;
    display_name:string;
    currency_code:string;
}

export type TransacationError={
    err:string;
    zodError:string|undefined;
}