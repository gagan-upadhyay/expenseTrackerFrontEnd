'use client';

import { useUser } from "@/src/context/userContext";
import { updateUserProfile } from "@/src/services/userService";
import { NewUser } from "@/src/utils/definitions";
// import { getUserDetails } from "@/src/utils/data";
// import { User } from "@/src/utils/definitions";
import { validateEmail, validatePassword } from "@/src/utils/validators";
import Image from "next/image";
import { useEffect, useState } from "react";



export default function UserProfile(){

    const {user} = useUser();
    // console.log("Value of user form upserProfile of settings:\n", user);

    const [formData, setFormData] = useState<NewUser>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        profile_picture: undefined,
    });

    useEffect(() => {
        if(user) {
            setFormData({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            password: '',
            profile_picture: user?.profile_picture,
            });
            setPreview(user.profile_picture || null);
        }
    }, [user]);

    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name, value, files} = e.target;
        if(name ==='profilePicture' && files?.[0]){
            setFormData({...formData, profile_picture:files[0]});
            setPreview(URL.createObjectURL(files[0]));
        }else{
            setFormData({... formData, [name]:value});
        }
    }

    const handleSubmit = async(e:React.FormEvent)=>{
        e.preventDefault();
        // console.log("Value of formData", formData);
        // const isEmailValid = validateEmail(formData.email);
        // console.log("value of isEmailValid", isEmailValid);
        if(!validateEmail(formData.email)) return setMessage('Invalid email');
        
        if(formData.password && !validatePassword(formData.password)){
            return setMessage('Password must be 8+ characters with atleast 1 number');
        }
        setLoading(true);
        const result = await updateUserProfile({
            firstName: formData.firstname,
            lastName: formData.lastname,
            email: formData.email,
            password: formData.password,
            profilePicture: typeof formData.profile_picture === "object" && formData.profile_picture instanceof File
                ? formData.profile_picture
                : undefined,
        });
        console.log("value of result from updateUserprofile client side", result);
        
        setLoading(false);
        setMessage(result?.success ? 'Profile updated ✅' : 'Error while updating');
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div className="flex items-center gap-4">
                <Image 
                src={preview||user?.profile_picture||'/backgroundImage.png'}
                alt="UserImage"
                className="w-16 h-16 rounded-full object-cover"
                width={50} height={50}/>
                
                <input type="file" name="profilePicture" accept="image/*" onChange={handleChange} />
            </div>

            <input name="firstname" placeholder="first name" value={formData.firstname || ''} onChange={handleChange} />
            <input name="lastname" placeholder="Last Name" value={formData.lastname||''} onChange={handleChange} />
            <input name="email" placeholder="Email" value={formData.email||''} onChange={handleChange} />
            <input name="password" type="password" value={formData.password|| ''} placeholder="New Password" onChange={handleChange} />

            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Update Profile'}
            </button>
            {message && <p className="text-sm text-gray-600">{message}</p>}
        </form>
    )
}