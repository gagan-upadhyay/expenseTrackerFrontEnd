// import { useSidebar } from "@/src/context/sidebarContext";
import { useUser } from "@/src/context/userContext";
import clsx from "clsx";
import Image from "next/image";

interface UserProfileInterface{
    expanded:boolean;
}

export default function UserProfile({ expanded }: UserProfileInterface) {
        const {loading, user}=useUser();
  return (
    <div className="flex flex-col items-center mb-6">
      <Image
      alt="User Image"
        width={65}
        height={65}
        src={user?.profile_picture || "/profilePicture.jpg"}
        className=" rounded-full border-2 border-indigo-500"
      />

      <p
        className={clsx(
          "mt-3 text-sm text-white transition-all duration-300",
          expanded ? "opacity-100" : "opacity-0",
          loading?"skeleton":"",
        )}
      >
        {user ? `${user.firstname} ${user.lastname}` : ''}
      </p>
    </div>
  );
}