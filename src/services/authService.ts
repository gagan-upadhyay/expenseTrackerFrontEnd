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
  return apiFetch(`${AUTH_SERVICE}/api/v1/auth/login/`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};


export const logoutUser = async () => {
  try {
    // Try to logout via API, but don't fail if it doesn't work
    await apiFetch(`${AUTH_SERVICE}/api/v1/auth/logout`, { method: 'POST' });
  } catch (error) {
    // If logout fails (e.g., token expired), just continue with client-side cleanup
    console.warn('API logout failed, proceeding with client-side logout:', error);
  }
  return { success: true, message: 'Logged out successfully' };
};

export const forgotPassword = async (email: string) => {
  return apiFetch(`${AUTH_SERVICE}/api/v1/auth/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};
