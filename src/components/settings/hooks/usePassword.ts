'use client';

import { useState } from "react";
import { passwordUtitlity } from "@/src/utils/data";

export function usePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const updatePassword = async () => {
        await passwordUtitlity(oldPassword, "changePassword", newPassword);
    };

    return {
        oldPassword,
        newPassword,
        setOldPassword,
        setNewPassword,
        updatePassword
    };
}