'use client';

import clsx from "clsx";
import { useOTP } from "./hooks/useOTP";
import { Button } from "../ui/buttons/buttons";
import { useEffect, useRef, useState } from "react";
import { updateUserProfile } from "@/src/services/userService";

export default function EmailChange() {
  const {
    email,
    setEmail,
    sendOTP,
    verifyOTP,
    otp,
    setOtp,
    status,
    error,
    setError,
    setStatus,
    loading,
    userEmail,
  } = useOTP();
  const [emailChanged, setEmailChanged]=useState<boolean>(false);
  const [emailChangeLoading, setEmailChangeLoading]=useState<boolean|null>(null);
  
    //--------retry limit brute force----
    
    const [attempts, setAttempts] = useState(0);
    const MAX_ATTEMPTS = 3;
    const isLocked = attempts >= MAX_ATTEMPTS;

    useEffect(() => {
    if (otp.length === 4 && attempts < MAX_ATTEMPTS) {
        verifyOTP();
        setAttempts((prev) => prev + 1);
    }
    }, [otp]);

    const handleReset = () => {
        setEmail(userEmail);
        setOtp("");
        setError(null);
        setStatus("idle");
        setAttempts(0);
        setTimer(30);
        // setEmailChangeLoading(false);
        

        inputsRef.current.forEach((input) => {
            if (input) input.value = "";
        });
    };

    const handleResetErrormsgs=()=>{
        setEmailChanged(false);
    }

    const changeEmail = async () => {
        console.log("Value of newEmail:", email);
        try{
            setEmailChangeLoading(true);
            const result = await updateUserProfile({
            email: email,
            firstName: null,
            lastName: null,
            });

            if (result?.success) {
                
                setEmailChanged(true);
                handleReset();
                setTimeout(()=>{
                    handleResetErrormsgs();
                }, 4000);
                
            }
        }catch(err){
            let errorMessage="Something went wrong."
            if(err instanceof Error){
                errorMessage=err.message;
                setError({type:"changeEmail", error:errorMessage});
            }

        }finally{
            setEmailChangeLoading(false);
            
        }
    };
    //OTP UI UPGRADE
    const OTP_LENGTH = 4;

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleOTPChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // allow only single digit

    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("");

    setOtp(updatedOtp);

    // move focus forward
    if (value && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
    }
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
    }
    };
    //-----------------------------------------

    //pastge full otp support:

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

        if (!pasted) return;

        setOtp(pasted);

        pasted.split("").forEach((digit, i) => {
            if (inputsRef.current[i]) {
            inputsRef.current[i]!.value = digit;
            }
        });

        inputsRef.current[pasted.length - 1]?.focus();
    };

    //------resend OTP timer

    const [timer, setTimer] = useState(30);
    useEffect(() => {
        if (status !== "sent") return;

        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer, status]);

    const handleSendOTP = () => {
        sendOTP();
        setError(null);
        setTimer(30);
        setAttempts(0);
        setOtp("");
    };
    //----------------------------




  return (
    <div className="glass glass-hover p-4 sm:p-5 rounded-2xl space-y-4">

      <h2 className="text-base sm:text-lg font-semibold">Change Email</h2>

      {/* EMAIL INPUT */}
      <input
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setError(null);
            if (status !== "idle") {
                setStatus("idle");
                setOtp("");
            }
        }}
        disabled={status === "sent" || status === "verified"}
        placeholder="Enter new email"
        className={clsx(
          "w-full bg-transparent border-b py-2 text-sm focus:outline-none transition",
          error?.type === "sendOTP"
            ? "border-red-400"
            : status === "sent"
            ? "border-green-400"
            : "border-[var(--color-border)]"
        )}
      />

      {/* STATUS */}
      {status === "sent" && (
        <p className="text-green-400 text-xs">OTP sent successfully</p>
      )}

      {error?.type === "sendOTP" && (
        <p className="text-red-400 text-xs">{error.error}</p>
      )}

    {status === "sent" && (
        <div className="space-y-3">
            <div
            className={clsx("flex gap-2 justify-between",
                
            )}
            onPaste={handlePaste}
            >
                {[...Array(OTP_LENGTH)].map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        maxLength={1}
                        ref={(el) => {
                            inputsRef.current[i] = el;
                        }}
                        value={otp[i] || ""}
                        disabled={isLocked}
                        onChange={(e) => handleOTPChange(e.target.value, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className={clsx("w-12 h-12 text-center text-lg rounded-lg border  focus:border-blue-400 focus:outline-none",
                            error?.type==="verifyOTP"? 'border-red-400 bg-red-700':'border border-[var(--color-border)]'
                        )}
                    />
                ))}
            </div>
            {error?.type==='verifyOTP'?<p>{error?.error}</p>:''}

            {/* ERROR / INFO */}
            {isLocked ? (
                <p className="text-red-400 text-xs">
                    Too many attempts. Please request a new OTP.
                </p>
                ) : error?.type === "verifyOTP" ? (
                <p className="text-red-400 text-xs">{error.error}</p>
                ) : (
                <p className="text-xs opacity-70">Enter 4-digit OTP</p>
            )}

            <div className="flex justify-between items-center text-xs">
                {isLocked && timer > 0 ? (
                    <p className="opacity-60">Resend in {timer}s</p>
                ) : (
                    <button
                    onClick={handleSendOTP}
                    className="text-blue-400 hover:underline"
                    >
                    Resend OTP
                    </button>
                )}

                <p className="opacity-60">
                    Attempts: {attempts}/{MAX_ATTEMPTS}
                </p>
            </div>
        </div>
    )}

    <div className="flex justify-end gap-2">

    {/* ✅ VERIFIED */}
        {status === "verified" ? (
            <>
            <Button
                onClick={changeEmail}
                className="px-4 py-2 text-xs sm:text-sm"
                disabled={loading}
            >
                {emailChangeLoading ?
                (
                    <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Changing..
                    </>
                    
                ):(
                    "Change Email?"
                )

                }
            </Button>

            <Button
                onClick={handleReset}
                className="px-4 py-2 text-xs sm:text-sm bg-red-500/20 hover:bg-red-500/30"
            >
                Reset
            </Button>
            

            </>
        ) : status === "idle" ? (
            <Button
                onClick={handleSendOTP}
                disabled={!email || loading}
                className="px-4 py-2 text-xs sm:text-sm flex items-center gap-2"
                >
                {loading ? (
                    <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                    </>
                ) : (
                    "Send OTP"
                )}
            </Button>

        ) : (

            /* ✅ SENT / LOCKED STATE */
            <>
            {/* Cancel always available */}
            <Button
                onClick={handleReset}
                className="px-4 py-2 text-xs sm:text-sm bg-red-500/20 hover:bg-red-500/30"
            >
                Cancel
            </Button>
            </>
        )}
    </div>
        {error?.type==='changeEmail'?<p className="text-xs text-red-400">{error.error}</p>:''}
        {emailChanged?<p className="text-xs text-green-400">Email changed Successfully</p>:""}


</div>
  );
}