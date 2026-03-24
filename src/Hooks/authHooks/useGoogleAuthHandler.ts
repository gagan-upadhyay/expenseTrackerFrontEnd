import { useAuth } from "@/src/context/authContext"
import { loginWithGoogle } from "@/src/services/authService";
import { toastShowError, toastShowLoading, toastShowSuccess } from "@/src/utils/toastUtils";
import { CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";

interface AuthTokens{
    accessToken?:string,
    refreshToken?:string,
}

interface LoginResponse{
    tokens:AuthTokens;
}

export const useGoogleOauthHandler =()=>{
    const {setAccessToken, setIsLoggedIn} = useAuth();
    const router = useRouter();
    
    const handleGoogleLoginSuccess = async (credentialResponse:CredentialResponse)=>{
        try{
            const toastId = toastShowLoading("Logging in...");
            console.log('value of toasID', toastId, typeof(toastId));
            const {tokens}:LoginResponse = await loginWithGoogle(credentialResponse) as LoginResponse;
            console.log("value of data from client:\n", tokens.accessToken)
            
            if(tokens.accessToken){
                setAccessToken(tokens.accessToken);
                document.cookie = `accessToken=${tokens.accessToken};path=/;`
            }
            if(tokens.refreshToken){
                document.cookie = `refreshToken=${tokens.refreshToken}; path=/;`;
            }
            if(tokens.accessToken && tokens.refreshToken){
                setIsLoggedIn(true);
                toastShowSuccess('Login successful', Number(600), String(toastId));
                router.push("/dashboard");
            }
        }catch(err: unknown){
            console.error("Oauth login failed", err)
            if (err instanceof Error) {
                toastShowError(err.message || "Something went wrong", Number(600));
            } else {
                toastShowError("Something went wrong", Number(600));
            }
        }
    };
    return {handleGoogleLoginSuccess};
}