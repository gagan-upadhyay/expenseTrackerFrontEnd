export type NewUser = {
    firstname: string;
    lastname: string;
    email: string;
    password?: string;
    oldPassword?:string,
    profile_picture?: string | File;
};

export type AddedUser = {
    id:string,
    firstname:string,
    lastname:string,
    email:string,
    password:string,
    profile_picture:string
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