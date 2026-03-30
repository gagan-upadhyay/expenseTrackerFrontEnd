'use client'
import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";

export default function Page(){
    return(
        <AuthGuard>
            <CardWrapper title="add transaction"/>
        </AuthGuard>
    )
}