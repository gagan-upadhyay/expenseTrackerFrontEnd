// import AuthGuard from "@/src/components/auth/Guards/AuthGuard";

// export default function SystemSettings() {
//   return (
    
//       <div className="px-6 py-6">
//         <h1 className="text-2xl font-bold">System Settings</h1>
//         <p className="mt-3 text-sm text-gray-500">System-level controls for notifications, security, and integrations.</p>

//         <div className="mt-6 space-y-4">
//           <div className="glass p-4 rounded-xl">
//             <h2 className="font-semibold">Notification Preferences</h2>
//             <p className="text-sm mt-1">Manage global alerts and reminders.</p>
//           </div>

//           <div className="glass p-4 rounded-xl">
//             <h2 className="font-semibold">Security</h2>
//             <p className="text-sm mt-1">Configure 2FA and session timeouts.</p>
//           </div>
//         </div>
//       </div>
    
//   );
// }
// export default function SystemSettings() {
//   return (
//     <div className="px-2 sm:px-4 py-4">

//       <h1 className="text-xl sm:text-2xl font-bold">System Settings</h1>

//       <p className="mt-2 text-xs sm:text-sm opacity-70">
//         Manage notifications, security, and integrations
//       </p>

//       <div className="mt-4 space-y-4">

//         <div className="glass p-4 rounded-xl">
//           <h2 className="font-semibold text-sm sm:text-base">
//             Notification Preferences
//           </h2>
//           <p className="text-xs sm:text-sm mt-1 opacity-70">
//             Manage global alerts and reminders
//           </p>
//         </div>

//         <div className="glass p-4 rounded-xl">
//           <h2 className="font-semibold text-sm sm:text-base">
//             Security
//           </h2>
//           <p className="text-xs sm:text-sm mt-1 opacity-70">
//             Configure 2FA and sessions
//           </p>
//         </div>

//       </div>
//     </div>
//   );
// }

export default function SystemSettings() {
  return (
    <div className="px-2 sm:px-4 py-4">

      <h1 className="text-xl sm:text-2xl font-bold">System Settings</h1>

      <p className="mt-2 text-xs sm:text-sm opacity-70">
        Manage notifications, security, and integrations
      </p>

      <div className="mt-4 space-y-4">

        <div className="glass p-4 rounded-xl">
          <h2 className="font-semibold text-sm sm:text-base">
            Notification Preferences
          </h2>
          <p className="text-xs sm:text-sm mt-1 opacity-70">
            Manage global alerts and reminders
          </p>
        </div>

        <div className="glass p-4 rounded-xl">
          <h2 className="font-semibold text-sm sm:text-base">
            Security
          </h2>
          <p className="text-xs sm:text-sm mt-1 opacity-70">
            Configure 2FA and sessions
          </p>
        </div>

      </div>
    </div>
  );
}