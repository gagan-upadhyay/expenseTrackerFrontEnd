// import { useSidebar } from "@/src/context/sidebarContext";
import { useUser } from "@/src/context/userContext";
import Image from "next/image";

interface UserProfileInterface{
    expanded:boolean;
}

export default function UserProfile({ expanded }: UserProfileInterface) {
        const {loading, user}=useUser();
        console.log('Value of expanded:', expanded);
        console.log(`value of user:${user}`);
        console.log(' typeof user from UserProfile:', typeof(user?.updated_at));
  return (
    <div className="flex flex-col items-center mb-6">
      {loading ? (
        <>
      <div className="w-[65px] h-[65px] rounded-full skeleton" />
      <div className="w-30 mt-3 h-4  skeleton"></div>
      </>
      ) : (
        <>
      <Image
        alt="User Image"
        width={65}
        height={65}
        unoptimized
        src={

          user?.profile_picture

          || "/profilePicture.jpg"
        }
        className="rounded-full border-2 border-indigo-500 object-cover"
      />
      <p className=
        "mt-3 text-sm text-white transition-all duration-300"
      >
        {user ? `${user.firstname} ${user.lastname}` : ''}
      </p>
      </>
      )}
    </div>
  );
}