// import CreditCard from "./creditCards";
import TransactionCard from "./transactionCard";

export default async function TransactionCardWrapper({parentClass}:{parentClass?:string}){
    if(process.env.CLIENT_MODE==='development'){
            await new Promise((resolve)=>setTimeout(resolve,4000));
    }
    return (
        <>
            <TransactionCard pageClass={parentClass?? ''}/>
        </>
    )
}