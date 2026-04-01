'use client';

import { usePassword } from "./hooks/usePassword";
import { Button } from "../ui/buttons/buttons";
import { getPasswordStrength } from "@/src/utils/passwordStrength";
import clsx from "clsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function PasswordChange() {
  const {
    oldPassword,
    newPassword,
    setOldPassword,
    setNewPassword,
    updatePassword,
    passwordError,
    checkPassword,
    passwordStatus,
    loading,
    loadingPassCheck,
    toggleNewEye,
    toggleOldEye,
    oldEyeOpen,
    newEyeOpen,
  } = usePassword();
  // const [passwordStatus, setPasswordStatus] = useState<'Matched'|'!Matched'|'issue'|"">("");
  // const [newPasswordStatus, setNewPasswordStatus] = useState<"Compliant"|"!Compliant"|"">("");


    // -------------------------------------------------------------
  // ✅ CHECK PASSWORD
  // -------------------------------------------------------------
  // const checkPasswordFunction = async (
  //   action: "checkPassword" | "changePassword"
  // ) => {
    

  //   const result =
  //     (await passwordUtility(
  //       oldPassword,
  //       action,
  //       action === "changePassword" ? newPassword : undefined
  //     )) ?? "";

  //   if (action === "checkPassword") {
  //     if (!result || result === "No Password received")
  //       setPasswordStatus("issue");
  //     else if (result === "Wrong Password") setPasswordStatus("!Matched");
  //     else if (result === "Password Matched") setPasswordStatus("Matched");
  //     else setPasswordStatus("");
  //   }

  //   if (action === "changePassword") {
  //     if (typeof result === "object" && result !== null && "message" in result) {
  //       if (result.message === "Password changed")
  //         setNewPasswordStatus("Compliant");
  //       else setNewPasswordStatus("!Compliant");
  //     } else {
  //       setNewPasswordStatus("!Compliant");
  //     }
  //   }
  // };

  const strength = getPasswordStrength(newPassword);
  console.log(`Value of passwordStatus:${passwordStatus}`);

  return (
    <div className="glass glass-hover p-4 sm:p-5 rounded-2xl space-y-4">

      <h2 className="text-base sm:text-lg font-semibold">Change Password</h2>

      {/* OLD PASSWORD */}
      <div className="space-y-1 flex"> 
        <div className="relative w-full flex items-center justify-between">
          <input
            type={oldEyeOpen?"text":"password"}
            placeholder="Current Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            disabled={passwordStatus==='Matched'}
            onBlur={checkPassword}
            className={clsx("w-full bg-transparent border-b  py-2 text-sm focus:outline-none", 
                passwordError?'border-red-500':'border-[var(--color-border)]',

                passwordStatus === 'Matched' && 'border-green-500 ', 
            )}
          />

          {loadingPassCheck && <div className="h-4 w-4 animate-spin transition-all duration-500 rounded-full border-2 border-gray-300/30 border border-t-gray"/>}

          {oldPassword && (
            <button
              onClick={(e) => {
                  e.preventDefault();
                  toggleOldEye();
              }}
              className="absolute mr-2 right-3 top-2.5"
              >
              {oldEyeOpen ? (
                  <EyeIcon className="w-4 h-4 opacity-60" />
              ) : (
                  <EyeSlashIcon className="w-4 h-4 opacity-60" />
              )}
            </button>
          )}
        </div>      
      </div>
            {passwordStatus === 'Matched' && !passwordError && (
        <p className="text-[10px] text-green-500">Current password verified</p>
      )}


      {/* NEW PASSWORD */}
      <div className="relative">
        <input
        type={newEyeOpen?"text":"password"}
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        minLength={8}
        disabled={passwordStatus!=='Matched'}
        className={clsx("w-full bg-transparent border-b py-2 text-sm focus:outline-none",
          passwordError==='Password already in use'?"border-red-400":"border-[var(--color-border)]"
        )}
        />
        {newPassword && (
          <button
            onClick={(e) => {
                e.preventDefault();
                toggleNewEye();
            }}
            className="absolute mr-2 right-3 top-2.5"
            >
            {oldEyeOpen ? (
                <EyeIcon className="w-4 h-4 opacity-60" />
            ) : (
                <EyeSlashIcon className="w-4 h-4 opacity-60" />
            )}
          </button>
        )}
      </div>
      {/* 🔥 STRENGTH BAR */}
      {newPassword && (
        <div>
          <div className="w-full h-2 rounded-full glass-light overflow-hidden">
            <div
              className={clsx("h-full transition-all duration-500", strength.color)}
              style={{ width: strength.width }}
            />
          </div>
          <p className="text-xs mt-1 opacity-70">
            Strength: {strength.label}
          </p>
        </div>
      )}
      
      
      
      {/* BUTTON */}
      <div className="flex justify-between pt-2">
         <div className="">
            {passwordError && <p className="text-xs text-red-500 animate-pulse">{passwordError}</p>}
            {passwordStatus === 'Password changed' && (
                <p className="text-xs text-green-400 font-medium">✨ Updated </p>
            )}
        </div>
        <Button onClick={updatePassword} className="px-4 py-2 text-xs sm:text-sm">
          {loading && <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300/30 border border-t-gray"/>}
          <span>{loading?"Updating":"Update"}</span>
        </Button>
      </div>
    </div>
  );
}
