import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";

export default function cards(){
    return (
        <AuthGuard>
            <CardWrapper title="single card details"/>
        </AuthGuard>
    )
}