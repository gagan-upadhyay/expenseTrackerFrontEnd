'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useUser } from "@/src/context/userContext";
import { updateUserProfile } from "@/src/services/userService";

export function useProfileForm() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profile_picture: undefined as File | undefined
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        profile_picture: undefined
      });
      setPreview(user.profile_picture ?? null);
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "profilePicture" && files?.[0]) {
      setPreview(URL.createObjectURL(files[0]));
      setFormData((p) => ({ ...p, profile_picture: files[0] }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    await updateUserProfile({
      firstName: formData.firstname,
      lastName: formData.lastname,
      email: formData.email,
      profilePicture: formData.profile_picture,
    });

    setLoading(false);
  };

  return { formData, preview, handleChange, handleSubmit, loading };
}