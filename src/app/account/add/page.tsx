import AuthGuard from "@/src/components/auth/Guards/AuthGuard";
import CardWrapper from "@/src/components/cards/cardDetails";

export default function AccountSection() {
  return(
    <AuthGuard>
      <CardWrapper title="add account"/> 
   </AuthGuard>
  )
}