import Image from "next/image";
import clsx from "clsx";
import { fetchedUser } from "@/src/utils/definitions";

interface UserProfileProps {
    className?: string;
    user?:fetchedUser;
    // loading:boolean;
}

export default function UserProfile({ className, user }: UserProfileProps){

// console.log("value of user form sidebar userProfile", user);
const profilePicture=user?.profile_picture;
    return (
        <div className={clsx(className, 'flex flex-row px-5 sm:flex-col sm:w-60 sm:py-2 items-center leading-none ')}>
            <Image src={profilePicture || '/profilePicture.jpg'} alt="Profile Picture" width={50} height={50} className="border border-4 border-blue-800 hover:border-blue-400 transition-all ease-in-out duration-600 focus:border-blue-700 rounded-full sm:w-20 w-12 "/>
            <p className={clsx(className, "sm:mt-3 sm:ml-2 ml-4  transition-all duration-500 ease-in-out")}>{user?`${user?.firstname} ${user?.lastname}`:'Loading...'}</p>
        </div>
    )
}
