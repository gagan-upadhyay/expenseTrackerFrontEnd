// 'use client';

// import { useState } from "react";

// export default function SecuritySettings() {
//   const [changeEmailOpen, setChangeEmailOpen] = useState(false);
//   const [changePasswordOpen, setChangePasswordOpen] = useState(false);

//   return (
//     <div className="flex flex-col gap-6">

//       {/* EMAIL CHANGE */}
//       <div>
//         <button
//           onClick={() => setChangeEmailOpen(!changeEmailOpen)}
//           className="font-medium hover:underline"
//         >
//           Change Email
//         </button>

//         {changeEmailOpen && (
//           <div className="mt-3">
//             {/* 🔥 Move your OTP UI here */}
//             <p className="text-sm text-gray-500">
//               Verify your new email using OTP
//             </p>

//             {/* your existing OTP UI */}
//           </div>
//         )}
//       </div>

//       {/* PASSWORD CHANGE */}
//       <div>
//         <button
//           onClick={() => setChangePasswordOpen(!changePasswordOpen)}
//           className="font-medium hover:underline"
//         >
//           Change Password
//         </button>

//         {changePasswordOpen && (
//           <div className="mt-3">
//             {/* 🔥 Move password UI here */}
//             <p className="text-sm text-gray-500">
//               Enter your old password and set a new one
//             </p>

//             {/* your existing password UI */}
//           </div>
//         )}
//       </div>

//       {/* 🔥 BONUS (Industry Feature) */}
//       <div>
//         <button className="text-red-500 hover:underline">
//           Logout from all devices
//         </button>
//       </div>

//     </div>
//   );
// }

// 'use client';

// import { Button } from "../ui/buttons/buttons";
// import EmailChange from "./EmailChange";
// import PasswordChange from "./PasswordChange";
// import SystemSettings from "./SystemSettings";

// export default function SecuritySettings() {
//   return (
//     <div className="space-y-6">

//       <EmailChange />

//       <PasswordChange />
//       <SystemSettings/>

//       <Button className="text-red-500">
//         Logout from all devices
//       </Button>

//     </div>
//   );
// }
'use client';

import { Button } from "../ui/buttons/buttons";
import EmailChange from "./EmailChange";
import PasswordChange from "./PasswordChange";
import SystemSettings from "./SystemSettings";

export default function SecuritySettings() {
  return (
    <div className="max-w-2xl mx-auto sm:px-6 py-6 space-y-6">

      <EmailChange />

      <PasswordChange />

      <SystemSettings />

      {/* LOGOUT */}
      <div className="flex justify-center">
        <Button className="text-red-400 border border-red-400/30 px-4 py-2">
          Logout from all devices
        </Button>
      </div>
    </div>
  );
}