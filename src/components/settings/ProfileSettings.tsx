'use client';

import { useProfileForm } from "./hooks/useProfileForm";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "../ui/buttons/buttons";
import { getInitials } from "@/src/utils/getInitials";

export default function ProfileSettings() {
  const {
    formData,
    preview,
    handleChange,
    handleFileChange,
    handleSubmit,
    loading,
  } = useProfileForm();

  const [dragActive, setDragActive] = useState(false);

  const inputClass =
    "w-full bg-transparent border-b border-[var(--color-border)] text-sm focus:outline-none focus:border-indigo-400 transition";

  const completion =
    ((formData.firstname ? 1 : 0) +
      (formData.lastname ? 1 : 0) +
      (preview ? 1 : 0)) /
    3 *
    100;

  return (
    <form
      onSubmit={handleSubmit}
      className="glass glass-hover w-full rounded-2xl p-4 sm:p-6 space-y-6 relative overflow-hidden"
    >
      {/* 🔮 Glow */}
      <div className="glow glow-indigo -top-10 -right-10 pointer-events-none" />
      <div className="glow glow-purple -bottom-10 -left-10 pointer-events-none" />

      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h2 className="text-base sm:text-lg font-semibold">Profile</h2>

        {/* COMPLETION */}
        <span className="text-xs opacity-70">
          {Math.round(completion)}% complete
        </span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-2 rounded-full glass-light overflow-hidden">
        <div
          className="h-full bg-indigo-500 transition-all duration-700"
          style={{ width: `${completion}%` }}
        />
      </div>

      {/* AVATAR */}
      <div
        className={clsx(
          "flex flex-col sm:flex-row gap-4 items-center sm:items-start",
          dragActive && "scale-[1.02]"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);

          const file = e.dataTransfer.files[0];
          if (file) {
            handleFileChange(file);
          }
        }}
      >
        {/* IMAGE / INITIALS */}
        <div className="relative group">
          {preview ? (
            <Image
              src={preview}
              alt="profile"
              width={90}
              height={90}
              className="rounded-full object-cover border border-[var(--color-border)]"
            />
          ) : (
            <div className="w-[90px] h-[90px] rounded-full flex items-center justify-center text-lg font-semibold border border-[var(--color-border)]">
              {getInitials(formData.firstname, formData.lastname) || "U"}
            </div>
          )}

          {/* OVERLAY */}
          <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs text-white">
            Upload
            <input
              type="file"
              name="profilePicture"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileChange(file); // ✅ CLEAN
                }
              }}
              className="hidden"
            />
          </label>
        </div>

        {/* TEXT */}
        <div className="text-xs sm:text-sm opacity-70 text-center sm:text-left">
          <p>Click or drag & drop</p>
          <p>JPG / PNG • Max 2MB</p>
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

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className={clsx(
            "px-4 py-2 text-xs sm:text-sm relative",
            loading && "opacity-60 cursor-not-allowed"
          )}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* SUCCESS FEEDBACK */}
      {!loading && completion === 100 && (
        <p className="text-green-400 text-xs text-right">
          ✅ Profile complete
        </p>
      )}
    </form>
  );
}