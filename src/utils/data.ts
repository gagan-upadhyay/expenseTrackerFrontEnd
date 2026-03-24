//fetch userData from users table
// import '@dotenvx/dotenvx/config';

// import getLogger from "../services/logger-service";
import apiFetch from "./apiClient";
import { AddedUser } from "./definitions";

const USER_SERVICE = process.env.NEXT_PUBLIC_USER_SERVICE;
const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE;

export const getUserDetails = async () => {
    const data:{result:AddedUser} = await apiFetch(`${USER_SERVICE}/api/v1/user`) as {result:AddedUser};
    console.log('Value of result from getUserDetails , data.ts', data?.result);
    return data?.result ?? null;
};


export const getPasswordType = async () => {
    return apiFetch(`${USER_SERVICE}/api/v1/user/password-type`);
}


//to compare and save password
export const passwordUtitlity = async (
    password: string | undefined,
    action: string,
    newPassword?: string | undefined
) => {
    if (!password) return "No Password received";
    const url = action === 'checkPassword' ? 'check-password' : 'change-password';
    const body =
        action === 'checkPassword'
            ? { password }
            : { oldPassword: password, newPassword };

    if (action === 'checkPassword') {
        const result = await apiFetch(`${USER_SERVICE}/api/v1/user/${url}`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return result;
    } else {
        return apiFetch(`${USER_SERVICE}/api/v1/user/${url}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }
}

export const refreshToken = async (apiBody: string | null) => {
    return apiFetch(`${AUTH_SERVICE}/api/v1/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify(apiBody),
    });
}

export const sendOTP = async (name: string, email: string, type: string) => {
    const result:{success:boolean, message:string} = await apiFetch(`${AUTH_SERVICE}/api/v1/auth/otp/generate`, {
        method: 'POST',
        body: JSON.stringify({ name, email, ...(type === 'emailChange' && { type }) }),
    }) as {success:boolean, message:string};
    return result?.message;
}

export const verifyOTPStatus = async (otp: string, email: string) => {
    const useForLogin = false;
    return apiFetch(`${AUTH_SERVICE}/api/v1/auth/otp/verify`, {
        method: 'POST',
        body: JSON.stringify({ otp, email, useForLogin }),
    });
}