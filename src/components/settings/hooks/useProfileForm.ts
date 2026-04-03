'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "@/src/context/userContext";
import { updateUserProfile, uploadProfilePicture } from "@/src/services/userService";
import { fetchedUser } from "@/src/utils/definitions";
import { getUserDetails } from "@/src/utils/data";

export function useProfileForm() {
  const { user, setUser } = useUser();

  console.log('Value of user from userProfile');

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profile_picture_file: null as File | null
  });

  const handleFileChange = (file: File) => {
  setPreview(URL.createObjectURL(file));

  setFormData((prev) => ({
    ...prev,
    profile_picture_file: file
  }));
};

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Populate form
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile_picture_file: null
      });

      setPreview(user.profile_picture ?? null);
    }
  }, [user]);

  // ✅ Cleanup preview URL (important)
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ✅ Handle input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profile_picture" && files?.[0]) {
      const file = files[0];

      setPreview(URL.createObjectURL(file));

      setFormData((prev) => ({
        ...prev,
        profile_picture_file: file
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Submit handler (fixed flow)
  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);


  //   try {
  //     let profileImageUrl: string | undefined;
  //         const payload:any={};
  //     if (formData.firstname?.trim()) payload.firstName = formData.firstname;
  //     if (formData.lastname?.trim()) payload.lastName = formData.lastname;
  //     if (formData.email?.trim()) payload.email = formData.email;
  //     if (profileImageUrl) payload.profile_picture = profileImageUrl;
      
  //     if (Object.keys(payload).length === 0) {
  //       throw new Error("Nothing to update");
  //     }
  //     console.log('payload:', payload);
      
  //     // ✅ 1. Upload image if changed
  //     if (formData.profile_picture_file) {
        
  //       const uploadRes = await uploadProfilePicture(formData.profile_picture_file)

  //       if (!uploadRes?.success) {
  //         throw new Error("Image upload failed");
  //       }

  //       // assuming upload returns updated user or URL
  //       profileImageUrl = uploadRes.blobName;
  //     }

  //     // ✅ 2. Update profile
  //     const res = await updateUserProfile(payload) as {success:boolean,error:null|string, user:fetchedUser};

  //     if(res.success && res.user){
  //       console.log(`User updated from useProfileForm hook`);
  //       setUser(res.user)
  //     }
  //     if (!res.success) {
  //       throw new Error(
  //         typeof res.error ==='string'?res.error:"Profile Update failed"
  //       );
  //     }

  //   } catch (err) {
  //     console.error("Profile update error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = {};

      if (formData.firstname?.trim()) payload.firstName = formData.firstname;
      if (formData.lastname?.trim()) payload.lastName = formData.lastname;
      if (formData.email?.trim()) payload.email = formData.email;

      // ✅ 1. Upload image FIRST
      if (formData.profile_picture_file) {
        const uploadRes = await uploadProfilePicture(formData.profile_picture_file);

        if (!uploadRes?.success) {
          throw new Error("Image upload failed");
        }

        // ✅ IMPORTANT: Add AFTER upload
        payload.profile_picture = uploadRes.blobName;
      }

      if (Object.keys(payload).length === 0) {
        throw new Error("Nothing to update");
      }

      console.log("FINAL payload:", payload);

      // ✅ 2. Update user
      const res = await updateUserProfile(payload) as {
        success: boolean;
        user: fetchedUser;
        error: string | null;
      };

      if (!res.success) {
        throw new Error(res.error || "Profile update failed");
      }

      // ✅ 3. Update UI
      const freshUser = await getUserDetails();
      setUser(freshUser);


    } catch (err) {
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    preview,
    handleChange,
    handleFileChange,
    handleSubmit,
    loading,
  };
}