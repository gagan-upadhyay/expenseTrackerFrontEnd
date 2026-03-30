import { CredentialResponse } from "@react-oauth/google";
import apiFetch from "@/src/utils/apiClient";

const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_SERVICE;
// console.log(`Vlaue of AUTH_SERVICE:${AUTH_SERVICE} from authservice.ts`);
export const loginWithGoogle = async (credentialResponse: CredentialResponse) => {
  if (!credentialResponse.credential) throw new Error("No credential received");

  // auth endpoint is external, so give full URL
  return apiFetch(`${AUTH_SERVICE}/api/v1/auth/login/OAuth/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentialResponse.credential}`,
    },
  });
};


export const loginWithEmail = async (email: string, password: string) => {
  return apiFetch(`${AUTH_SERVICE}/api/v1/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const logoutUser = async () => {
  // if you need the raw response, call apiFetch and ignore return value
  return apiFetch(`${AUTH_SERVICE}/api/v1/auth/logout`, { method: 'POST' });
};

export const forgotPassword = async (email: string) => {
  return apiFetch(`${AUTH_SERVICE}/api/v1/auth/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};
