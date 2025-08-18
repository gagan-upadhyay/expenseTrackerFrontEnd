import Image from "next/image";
import clsx from "clsx";


interface User {
    firstname?: string;
    lastname?: string;
    profile_picture?: string;
}

interface UserProfileProps {
    className?: string;
    user?: User;
}

export default function UserProfile({ className, user }: UserProfileProps){

console.log("value of user form userProfile", user);
const profilePicture=user?.profile_picture;
    return (
        <div className={clsx(className, 'flex flex-row px-5 md:flex-col md:w-60 md:py-2  items-center leading-none')}>
        <Image src={profilePicture || '/backgroundImage.png'} alt="Profile Picture" width={50} height={50} className="border-none rounded-4xl md:w-20 w-12"/>
        <p className={clsx(className, "md:mt-3 md:ml-2 ml-4")}>{`${user?.firstname} ${user?.lastname}`}</p>
        </div>
    )
}

// Object { message: "User Details fetched successfully.", user: {…} }
// message: "User Details fetched successfully."
// user: Object { id: "3d44b896-be46-421b-9c79-b929a0bfab66", firstname: "Gagan", lastname: "Upadhyay", … }
// auth_type: "GOOGLE"
// created_at: "2025-08-17T10:10:27.546Z"
// email: "gaganupadhyay.karan@gmail.com"
// firstname: "Gagan"
// id: "3d44b896-be46-421b-9c79-b929a0bfab66"
// lastname: "Upadhyay"
// password: null
// profile_picture: "https://lh3.googleusercontent.com/a/ACg8ocK2Y7pAW1RJxdDX6LsvFdSgpnq9KeDwVlyu6WTv_MMoHgm0EdxsTg=s96-c"
// updated_at: "2025-08-17T10:10:27.546Z"