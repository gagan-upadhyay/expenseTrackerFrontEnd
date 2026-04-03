import { createCard } from "@/src/services/accountServices";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import CardPreview from "./CardPreview";
import clsx from "clsx";

export default function CreateCreditDebitCard(accountId:string){

    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError]=useState<string|null>(null);
    const [cards, setCards] = useState<typeof card[]>([]);
    const [card, setCard] = useState({
    brand: "" as "visa"|"rupay"|"mastercard",
    holder_name: "",
    expiry_month: 0 as number,
    expiry_year: 0 as number,
    cvv:"",
    cardnumber:"",
    is_active:true,
    type:"" as "credit"|"debit",
    });
    
    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const { name, value } = e.target;

        if (name === "cardnumber") {
            // Remove non-digits
            const rawValue = value.replace(/\D/g, "");

            // Limit to 16 digits
            const limitedValue = rawValue.slice(0, 16);

            // Format with spaces
            const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, "$1 ");

            setCard((prev) => ({
            ...prev,
            [name]: formattedValue,
            }));
        } 

        else if(name==='expiry_month'){
            let val = value.replace(/\D/g, "").slice(0,2);
            let num = parseInt(val);
            if(!isNaN(num)){
            if(num<1) num=1;
            if(num>12) num=12;
            val=num.toString().padStart(2, '0');
            }
            setCard((prev)=>({
            ...prev, 
            expiry_month:Number(val),
            }));
        }else if(name==='expiry_year'){
            let val = value.replace(/\D/g,"").slice(0,2);

            let num = parseInt(val);
            if (!isNaN(num)){
            if(num<26) num=26;
            if(num>45) num=45;
            val=num.toString();
            }
            setCard((prev)=>({
            ...prev,
            expiry_year:Number(val),
            }))
        }else if(name==='cvv'){
            const val = value.replace(/\D/g,"").slice(0,3);
            setCard((prev)=>({
            ...prev, 
            cvv:val,
            }))
        }
        else {
            setCard((prev) => ({
            ...prev,
            [name]: value,
            }));
        }
    };
    try{
        const saveCard = async()=>{
            setSaving(true);
            const result = await Promise.all(
                cards.map((c) =>
                    createCard(accountId, {
                        brand: c.brand,
                        cardnumber: c.cardnumber.replace(/\s/g, ""),
                        holder_name: c.holder_name,
                        expiry_month: Number(c.expiry_month),
                        expiry_year: Number(c.expiry_year),
                        is_active: c.is_active,
                        type: c.type,
                    })
                )
            );

            if(result){
                toastShowSuccess("Card Created successfully", Number(4000));
                console.log(`Value of result from CreateDebitCreditCard.tsx:`, result);
            }
        }

    }catch(err){
        let errorMessage="Something went wrong";
        if(err instanceof Error){
            errorMessage=err.message;
            setError(errorMessage);
        }
    }finally{   
        setSaving(false);
    }

    const addCard = () => {
        const trimmedCardNumber = String(card.cardnumber).trim();
        if (!card.brand.trim() || !card.holder_name.trim() || !trimmedCardNumber) {
          toastShowError("Brand, holder's name and card number are required", Number(3000));
          setError("Brand, holder's name and card number are required")
          return;
        }
    
        // duplicate check in local list and existing server cards
        const alreadyExists = cards.some((c) => c.cardnumber.trim() === trimmedCardNumber);
        if (alreadyExists) {
          toastShowError("Card already registered", Number(3000));
          setError("Card already registered")
          return;
        }
    
        setCards([...cards, { ...card, cardnumber: trimmedCardNumber }]);
        setCard({
          brand: "visa",
          holder_name: "",
          expiry_month: 0,
          expiry_year: 0,
          cvv: "",
          cardnumber: "",
          is_active: true,
          type: "credit",
        });
    
        toastShowSuccess("Card added locally. Save account to persist.", Number(2200));
    };


    return (
        <>
            <div className="mt-6 border-t border-[var(--color-border)] pt-4">
            <h4 className="text-sm opacity-70 mb-3 text-center">Add Card (Optional)</h4>

            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                <input
                name="cardnumber"
                placeholder="0000 0000 0000 0000"
                maxLength={19}
                minLength={19}
                type="text"
                value={card.cardnumber}
                onChange={handleCardChange}
                className="glass px-3 py-2 w-[50%] rounded-xl"
                />

                </div>
                <div className="flex justify-between">
                <input
                    name="brand"
                    placeholder="Card Brand"
                    value={card.brand}
                    onChange={handleCardChange}
                    className="glass px-3 py-2 w-[60%] rounded-xl"
                />
                <div className="flex rounded-xl overflow-hidden border w-fit border-[var(--color-border)]">
                    {["credit", "debit"].map((t) => (
                        <button
                        key={t}
                        onClick={() => setCard({ ...card, type: t as "credit" | "debit" })}
                        className={clsx(
                            "px-4 py-2 text-sm",
                            card.type === t ? "bg-green-500/20" : "glass"
                        )}
                        >
                        {t}
                        </button>
                    ))}
                </div>
                </div>

                <input
                name="holder_name"
                placeholder="Card holder_name"
                value={card.holder_name}
                onChange={handleCardChange}
                className="glass px-3 py-2 rounded-xl"
                />

                <div className="flex gap-3">
                <input
                    name="expiry_month"
                    placeholder="MM"
                    inputMode="numeric"
                    value={card.expiry_month}
                    onChange={handleCardChange}
                    className="glass px-3 py-2 w-[50%] rounded-xl flex-1"
                />
                <input
                    name="expiry_year"
                    placeholder="YY"
                    inputMode="numeric"
                    value={card.expiry_year}
                    onChange={handleCardChange}
                    className="glass px-3 py-2 rounded-xl w-[50%] flex-1"
                />

                
                </div>
                {error&&<p className="text-xs text-red-400">{error}</p>}
                <button
                onClick={addCard}
                className="glass-hover py-2 rounded-xl text-sm"
                >
                Add Card
                </button>
                {/* {cardError &&<p className="text-xs text-red-400">{cardError}</p>} */}
            </div>
            </div>

            <div className="glass p-4 rounded-2xl">
                <h4 className="text-sm opacity-70 mb-3">Saved Cards</h4>
                {cards.length === 0 ? (
                    <p className="text-xs opacity-60">No cards added yet</p>
                ) : (
                    <>
                    
                    <div
                    //   ref={savedCardsRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
                        style={{ scrollSnapType: "x mandatory" }}
                    >
                        {cards.map((c, i) => (
                        <div key={i} className="min-w-[280px] flex-shrink-0 scroll-snap-align-start">
                            <CardPreview card={c} />
                        </div>
                        ))}
                    </div>
                    <ToastContainer/>
                    </>
                    
                )}
            </div>
        </>
    )
}