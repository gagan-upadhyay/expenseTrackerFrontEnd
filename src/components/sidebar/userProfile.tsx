import Image from "next/image";
import clsx from "clsx";
import { AddedUser } from "@/src/utils/definitions";

interface UserProfileProps {
    className?: string;
    user?:AddedUser;
    // loading:boolean;
}

export default function UserProfile({ className, user }: UserProfileProps){

// console.log("value of user form sidebar userProfile", user);
const profilePicture=user?.profile_picture;
    return (
        <div className={clsx(className, 'flex flex-row px-5 md:flex-col md:w-60 md:py-2 items-center leading-none ')}>
            <Image src={profilePicture || '/backgroundImage.png'} alt="Profile Picture" width={50} height={50} className="border border-4 border-blue-800 hover:border-blue-400 transition-all ease-in-out duration-600 focus:border-blue-700 rounded-full md:w-20 w-12 "/>
            <p className={clsx(className, "md:mt-3 md:ml-2 ml-4  transition-all duration-500 ease-in-out")}>{user?`${user?.firstname} ${user?.lastname}`:'Loading...'}</p>
        </div>
    )
}
