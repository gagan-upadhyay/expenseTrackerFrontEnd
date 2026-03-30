// 'use client';

// import { usePassword } from "./hooks/usePassword";

// export default function PasswordChange() {
//   const {
//     oldPassword,
//     newPassword,
//     setOldPassword,
//     setNewPassword,
//     updatePassword
//   } = usePassword();

//   return (
//     <div className="glass glass-hover p-5 rounded-2xl space-y-4">
//       <h2 className="text-lg font-semibold">Security</h2>

//       <input
//         type="password"
//         placeholder="Current Password"
//         value={oldPassword}
//         onChange={(e) => setOldPassword(e.target.value)}
//         className="w-full bg-transparent border-b border-[var(--color-border)] py-2 focus:outline-none"
//       />

//       <input
//         type="password"
//         placeholder="New Password"
//         value={newPassword}
//         onChange={(e) => setNewPassword(e.target.value)}
//         className="w-full bg-transparent border-b border-[var(--color-border)] py-2 focus:outline-none"
//       />
      

//       <div className="flex justify-end">
//         <button
//           onClick={updatePassword}
//           className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-white/10 transition"
//         >
//           Update
//         </button>
//       </div>
//     </div>
//   );
// }

'use client';

import { usePassword } from "./hooks/usePassword";
import { Button } from "../ui/buttons/buttons";
import { getPasswordStrength } from "@/src/utils/passwordStrength";
import clsx from "clsx";

export default function PasswordChange() {
  const {
    oldPassword,
    newPassword,
    setOldPassword,
    setNewPassword,
    updatePassword,
  } = usePassword();

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="glass glass-hover p-4 sm:p-5 rounded-2xl space-y-4">

      <h2 className="text-base sm:text-lg font-semibold">Security</h2>

      {/* OLD PASSWORD */}
      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-sm focus:outline-none"
      />

      {/* NEW PASSWORD */}
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-sm focus:outline-none"
      />

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
      <div className="flex justify-end">
        <Button onClick={updatePassword} className="px-4 py-2 text-xs sm:text-sm">
          Update
        </Button>
      </div>
    </div>
  );
}