import { useAuth } from "@/src/context/authContext"
import { loginWithGoogle } from "@/src/services/authService";
import { toastShowError, toastShowLoading, toastShowSuccess } from "@/src/utils/toastUtils";
import { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export const useGoogleOauthHandler =()=>{
    const {setAccessToken, setIsLoggedIn} = useAuth();
    const router = useRouter();
    
    const handleGoogleLoginSuccess = async (credentialResponse:CredentialResponse)=>{
        try{
            toastShowLoading("Logging in...");
            const data = await loginWithGoogle(credentialResponse);
            
            if(data.accessToken){
                setAccessToken(data.accessToken);
                document.cookie = `accessToken=${data.accessToken};path=/;`
            }
            if(data.refreshToken){
                document.cookie = `refreshToken=${data.refreshToken}; path=/;`;
            }
            if(data.accessToken && data.refreshToken){
                setIsLoggedIn(true);
                toastShowSuccess('Login successfull');
                router.push("/dashboard");
            }
        }catch(err: unknown){
            console.error("Oauth login failed", err)
            if (err instanceof Error) {
                toastShowError(err.message || "Something went wrong");
            } else {
                toastShowError("Something went wrong");
            }
        }
    };
    return {handleGoogleLoginSuccess};
}