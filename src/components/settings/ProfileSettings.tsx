// 'use client';

// import { useProfileForm } from "./hooks/useProfileForm";
// import Image from "next/image";

// export default function ProfileSettings() {
//   const { formData, preview, handleChange, handleSubmit, loading } =
//     useProfileForm();

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="glass glass-hover w-full rounded-2xl p-5 space-y-6"
//     >
//       <h2 className="text-lg font-semibold">Profile</h2>

//       {/* Avatar */}
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Image
//             src={preview || "/profilePicture.jpg"}
//             alt="profile"
//             width={80}
//             height={80}
//             className="rounded-full object-cover border border-[var(--color-border)]"
//           />
//         </div>

//         <div className="text-sm">
//           <input
//             type="file"
//             name="profilePicture"
//             onChange={handleChange}
//             className="cursor-pointer"
//           />
//           <p className="text-xs opacity-70 mt-1">
//             JPG/PNG up to 2MB
//           </p>
//         </div>
//       </div>

//       {/* Names */}
//       <div className="grid md:grid-cols-2 gap-4">
//         <input
//           name="firstname"
//           value={formData.firstname}
//           onChange={handleChange}
//           placeholder="First Name"
//           className="bg-transparent border-b border-[var(--color-border)] focus:outline-none py-2"
//         />

//         <input
//           name="lastname"
//           value={formData.lastname}
//           onChange={handleChange}
//           placeholder="Last Name"
//           className="bg-transparent border-b border-[var(--color-border)] focus:outline-none py-2"
//         />
//       </div>

//       <div className="flex justify-end">
//         <button
//           className="px-4 py-2 rounded-lg border border-[var(--color-border)] hover:bg-white/10 transition"
//           disabled={loading}
//         >
//           {loading ? "Saving..." : "Save"}
//         </button>
//       </div>
//     </form>
//   );
// }

'use client';

import { useProfileForm } from "./hooks/useProfileForm";
import Image from "next/image";
import clsx from "clsx";
import { Button } from "../ui/buttons/buttons";

export default function ProfileSettings() {
  const { formData, preview, handleChange, handleSubmit, loading } =
    useProfileForm();

  const inputClass =
    "w-full bg-transparent border-b border-[var(--color-border)] py-2 text-sm focus:outline-none focus:border-indigo-400 transition";

  return (
    <form
      onSubmit={handleSubmit}
      className="glass glass-hover w-full rounded-2xl p-4 sm:p-6 space-y-6"
    >
      {/* TITLE */}
      <h2 className="text-base sm:text-lg font-semibold">Profile</h2>

      {/* AVATAR SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">

        {/* IMAGE */}
        <div className="relative group w-fit">
          <Image
            src={preview || "/profilePicture.jpg"}
            alt="profile"
            width={80}
            height={80}
            className="rounded-full object-cover border border-[var(--color-border)]"
          />

          {/* 🔥 HOVER OVERLAY */}
          <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs text-white">
            Change
            <input
              type="file"
              name="profilePicture"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* INFO */}
        <div className="text-xs sm:text-sm opacity-70">
          <p>Upload a profile picture</p>
          <p>JPG or PNG • Max 2MB</p>
        </div>
      </div>

      {/* NAME FIELDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          placeholder="First Name"
          className={inputClass}
        />

        <input
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          placeholder="Last Name"
          className={inputClass}
        />
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className={clsx(
            "px-4 py-2 text-xs sm:text-sm",
            loading && "opacity-60 cursor-not-allowed"
          )}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}