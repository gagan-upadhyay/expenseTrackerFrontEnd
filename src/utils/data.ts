
import apiFetch from "./apiClient";
import { fetchedUser } from "./definitions";

const USER_SERVICE =
  process.env.NEXT_PUBLIC_USER_SERVICE ||
  "https://expensetrackerapi.duckdns.org";
const AUTH_SERVICE =
  process.env.NEXT_PUBLIC_AUTH_SERVICE ||
  "https://expensetrackerapi.duckdns.org";

// export const getUserDetails = async () => {
//     const data:{result:AddedUser} = await apiFetch(`${USER_SERVICE}/api/v1/user/`) as {result:AddedUser};
//     return data?.result ?? null;
// };

export const getUserDetails = async () => {
  const data: { result: fetchedUser } = await apiFetch(
    `${USER_SERVICE}/api/v1/user/`,{
        method:'GET',
        credentials:'include',
        headers:{
            'Content-Type':'application/json',
        },
    }
  ) as { result: fetchedUser };

  const user = data?.result ?? null;

  if (!user) return null;
//   console.log('Value of fetcheduser:', user);
  // ✅ Normalize profile_picture
  return {
    ...user,
    profile_picture:
      user.profile_picture && user.profile_picture.startsWith("http")
        ? user.profile_picture
        : null, // ❗ fallback if backend sends blobName
  };
};


// console.log(`Value of user_service: ${USER_SERVICE} and AUTH_SERVICE: ${AUTH_SERVICE} from data.ts`);

export const getPasswordType = async () => {
    return apiFetch(`${USER_SERVICE}/api/v1/user/password-type/`);
}
export const passwordUtility = async (
    password: string | undefined,
    action: "checkPassword" | "changePassword",
    newPassword?: string
    ) => {
    if (!password) {
    return { success: false, error: "No password received" };
    }
    // console.log(`Value of password, action and newPassword:${password}, ${action}, ${newPassword}`);
// 🔹 STEP 1: Check password
    if (action === "checkPassword") {
        return await apiFetch(
        `${USER_SERVICE}/api/v1/user/check-password`,
        {
            method: "POST",
            body: JSON.stringify({ password }),
            credentials: "include",
        }
        );

    }

    // 🔹 STEP 2: Change password
    if (action === "changePassword") {
        // console.log(`Inside changePassword `);
        // First verify old password
        return await apiFetch(
        `${USER_SERVICE}/api/v1/user/change-password`,
        {
            method: "PUT",
            body: JSON.stringify({
            oldPassword: password,
            newPassword,
            }),
            credentials: "include",
        }
        ) as {success:boolean, message:string|null, error:string|null};
        // console.log(`After calling chaangePassowrd`);
    }
};



//------------------------Refresh Token------------------------------------
export const refreshToken = async () => {
    return apiFetch(`${AUTH_SERVICE}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials:'include',
    });
}



//----------------OTP -------------------------------
export const sendOTP = async (name: string, email: string, type: string) => {
    try{
        const result:{success:boolean, message:string} = await apiFetch(`${AUTH_SERVICE}/api/v1/auth/otp/generate/`, {
        method: 'POST',
        credentials:'include',
        body: JSON.stringify({ name, email, ...(type === 'emailChange' && { type }) }),
        }) as {success:boolean, message:string};
        return result;
    }catch(err){
        let errorMessage = 'Something went wrong! Try again later.'
        console.warn(`error while fetching OTP: ${err}`);

        if(err instanceof Error){
            errorMessage=err.message;
        }
        return {success:false, message:errorMessage};
    }
}

export const verifyOTPStatus = async (otp: string, email: string) => {
    try{
        // console.log(`value of otp from dfata.ts: ${otp}`);
        const useForLogin = false;
        return apiFetch(`${AUTH_SERVICE}/api/v1/auth/otp/verify/`, {
        method: 'POST',
        body: JSON.stringify({ otp, email, useForLogin }),
        credentials:'include'
    });

    }catch(err){
        let errorMessage='Something went wrong! Try again later';
        if(err instanceof Error){
            errorMessage=err.message;
        }
        return{success:false, message:errorMessage};
    }
}
