import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";

export default function AccountDetailsCard(){
    return (
        <AuthGuard>
            <CardWrapper title='single account detail'/>
        </AuthGuard>
    )
}