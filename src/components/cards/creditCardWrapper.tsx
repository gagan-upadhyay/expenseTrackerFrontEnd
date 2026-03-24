import CreditCard from "./creditCards";

export default async function CreditCardWrapper({parentClass}:{parentClass?:string}){
    if(process.env.CLIENT_MODE==='development'){
            await new Promise((resolve)=>setTimeout(resolve,4000));
    }
    return (
        <>
            <CreditCard parentClass={parentClass?? ''}/>
        </>
    )
}