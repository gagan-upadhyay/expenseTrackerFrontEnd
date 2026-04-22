import { useUser } from "@/src/context/userContext";
import Image from "next/image";
import clsx from "clsx";

interface UserProfileProps {
  expanded: boolean;
}

export default function UserProfile({ expanded }: UserProfileProps) {
  const { loading, user } = useUser();

  return (
    <div className={clsx(
      "flex flex-col items-center gap-2 p-4 border-b border-slate-200 dark:border-slate-700",
      "transition-all duration-300"
    )}>
      {loading ? (
        <>
          <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse" />
          {expanded && <div className="w-24 h-3 bg-slate-300 dark:bg-slate-700 rounded animate-pulse mt-2" />}
        </>
      ) : (
        <>
          <Image
            alt="User Profile"
            width={48}
            height={48}
            unoptimized
            src={user?.profile_picture || "/profilePicture.jpg"}
            className="rounded-lg border-2 border-indigo-500 object-cover flex-shrink-0"
          />
          {expanded && (
            <div className="text-center transition-all duration-300">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {user ? `${user.firstname} ${user.lastname}` : "User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email || "email"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}