'use client';

import { useRef, useState } from "react";
import clsx from "clsx";
import { useAccounts } from "@/src/context/accountContext";
import {  CreateAccountWithCards, NewAccountPayload, NewCardPayload } from "@/src/services/accountServices";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
import { ToastContainer } from "react-toastify";
import CardPreview from "./CardPreview";
import { useRouter } from "next/navigation";


interface Props {
  parentClass: string;
}

const ACCOUNT_TYPES = ["SAVINGS", "LOAN", "CREDITS"];
const CURRENCIES = ["USD", "INR", "GBP", "YEN", "EUR"];

export default function AddAccountCard({ parentClass }: Props) {
  const { accounts, refreshAccounts } = useAccounts();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [cardError, setCardError]=useState<string|null>(null);
  // const [cardSaving, setCardSaving]=useState<boolean>(false);
  const router = useRouter();

  const resetErrors=()=>{
    setError(null);
    setCardError(null);
  }

  const [form, setForm] = useState({
    accountName: "",
    currency: "INR",
    openingBalance: "",
    totalIncome: "",
    totalExpense: "",
  });

  const [cards, setCards] = useState<typeof card[]>([]);
  const [card, setCard] = useState({
    brand: "" as "Visa"|"Rupay"|"Mastercard",
    holder_name: "",
    expiry_month: 0 as number,
    expiry_year: 0 as number,
    cvv:"",
    cardnumber:"",
    is_active:true,
    type:"" as "credit"|"debit",
  });
  
  // id, holder_name, expiry_month, expiry_year, is_active
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const brandRef = useRef<HTMLInputElement>(null);
  const holderRef = useRef<HTMLInputElement>(null);

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    resetErrors();
  };

const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  resetErrors();
  const { name, value } = e.target;
  const digitsOnly = value.replace(/\D/g,"");
  if (name === "cardnumber") {
    // Limit to 16 digits
    const limitedValue = digitsOnly.slice(0, 16);

    // Format with spaces
    const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    if(limitedValue.length===16) brandRef.current?.focus();
    setCard((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  } 

  else if(name==='expiry_month'){
    let val = digitsOnly.slice(0,2);
    let num = parseInt(val);
    if(val.length===2){
      if(num<1) num=1;
      if(num>12) num=12;
      yearRef.current?.focus();
      val=num.toString().padStart(2, '0');
      
    }
    
    setCard((prev)=>({
      ...prev, 
      expiry_month:Number(val),
    }));
    
  }
  else if(name==='expiry_year'){
    const val = digitsOnly.slice(0,2);

    if(val===""){
      setCard(prev=>({...prev, expiry_year:0}));
      return;
    }
    let num = parseInt(val);
    if (val.length===2){
      if(num<26) num=26;
      if(num>45) num=45;
      addCardRef.current?.focus();
    }
    setCard((prev)=>({
      ...prev,
      expiry_year:num,
    }))
  }

  else if(name==='cvv'){
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
  const savedCardsRef = useRef<HTMLDivElement>(null);
  const addCardRef = useRef<HTMLButtonElement>(null);


  const saveAccount = async () => {
    if (!form.accountName.trim()) {
      toastShowError("Account type is required", Number(3000));
      setError("Account type is required");
      return;
    }
    // if(form.)

    const accountExists = accounts?.some(
      (acc) => acc.account_type.toLowerCase() === form.accountName.trim().toLowerCase()
        && acc.currency_code.toLowerCase() === form.currency.toLowerCase()
    );
    if (accountExists) {
      toastShowError("Account already registered", Number(3000));
      setError("Account already registered");
      return;
    }

    setSaving(true);
    try {
      const accountPayload:NewAccountPayload = {
        accountType: form.accountName.trim().toLowerCase(),
        currencyCode: form.currency.toLowerCase(),
        openingBalance: Number(form.openingBalance) || 0,
        totalIncome: Number(form.totalIncome) || 0,
        totalExpense: Number(form.totalExpense) || 0,
      };

        const cardsPayload: NewCardPayload[] = cards.map((c) => ({
          brand: c.brand,
          cardnumber: c.cardnumber.replace(/\s/g, ""),
          holder_name: c.holder_name,
          expiry_month: Number(c.expiry_month),
          expiry_year: Number(c.expiry_year),
          is_active: c.is_active,
          type: c.type as 'credit' | 'debit' | 'loan',
        }));

        const result = await CreateAccountWithCards(accountPayload, cardsPayload);
        console.log("Success! Created Account and Cards:", result);

      // console.log(`Value of accountPayload: ${accountPayload}`);
      // console.log(`Value of cards: ${cards}`);
      // const savedAccount = await createAccount(accountPayload);
      
      // if(savedAccount?.id){
      //   console.log(`value of savedAccount: ${saveAccount}`)
      //   await Promise.all(
      //     cards.map((c) =>
      //       createCard(savedAccount.id, {
      //         brand: c.brand,
      //         cardnumber: c.cardnumber.replace(/\s/g, ""),
      //         holder_name: c.holder_name,
      //         expiry_month: Number(c.expiry_month),
      //         expiry_year: Number(c.expiry_year),
      //         is_active: c.is_active,
      //         type: c.type,
      //       })
      //     )
      //   );
      // }
      
      toastShowSuccess("Account and cards saved successfully", Number(1500));
      router.replace('/account');

      setForm({
        accountName: "",
        currency: "INR",
        openingBalance: "",
        totalIncome: "",
        totalExpense: "",
      });
      setCards([]);

      refreshAccounts?.();

    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to save account";
      toastShowError(msg, Number(4000));
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const addCard = () => {
    const trimmedCardNumber = String(card.cardnumber).trim();
    if (!card.brand.trim() || !card.holder_name.trim() || !trimmedCardNumber) {
      toastShowError("Brand, holder's name and card number are required", Number(3000));
      setCardError("Brand, holder's name and card number are required")
      return;
    }

    // duplicate check in local list and existing server cards
    const alreadyExists = cards.some((c) => c.cardnumber.trim() === trimmedCardNumber);
    if (alreadyExists) {
      toastShowError("Card already registered", Number(3000));
      setCardError("Card already registered")
      return;
    }

    setCards([...cards, { ...card, cardnumber: trimmedCardNumber }]);
    setCard({
      brand: "Visa",
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
    <div className={clsx(parentClass, "w-full mt-6 relative")}>

      {/* Glow */}
      <div className="glow glow-indigo -top-10 -right-10"></div>
      <div className="glow glow-purple -bottom-10 -left-10"></div>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-center opacity-80">
        Add Account
      </h3>

      {/* ACCOUNT FORM + PREVIEW */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT: editable form */}
        <div className="flex flex-col gap-4">

          {/* TYPE + CURRENCY */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              name="accountName"
              value={form.accountName}
              onChange={handleAccountChange}
              className="glass px-3 py-2 rounded-xl flex-1"
            >
              <option value="">Account Type</option>
              {ACCOUNT_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              name="currency"
              value={form.currency}
              onChange={handleAccountChange}
              className="glass px-3 py-2 rounded-xl flex-1"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur}>{cur}</option>
              ))}
            </select>
          </div>

          {/* BALANCES */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              name="openingBalance"
              placeholder="Opening Balance"
              className="glass px-3 py-2 w-[50%] rounded-xl flex-1 no-spinner"
              onChange={handleAccountChange}
            />

            <input
              type="number"
              name="totalIncome"
              placeholder="Total Income"
              className="glass px-3 py-2 w-[50%] rounded-xl w-fit flex-1 no-spinner"
              onChange={handleAccountChange}
            />
          </div>

          <input
            type="number"
            name="totalExpense"
            placeholder="Total Expense"
            className="glass px-3 py-2 rounded-xl w-full no-spinner"
            onChange={handleAccountChange}
          />

          {/* CARD INPUTS */}
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
              <div className="flex justify-between gap-2">
                <input
                  name="brand"
                  placeholder="Card Brand"
                  value={card.brand}
                  ref={brandRef}
                  onChange={handleCardChange}
                  className="glass px-3 py-2 w-[60%] rounded-xl"
                />
                <div className="flex rounded-xl overflow-hidden border w-fit border-[var(--color-border)]">
                    {["credit", "debit"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setCard({ ...card, type: t as "credit" | "debit" })}
                        className={clsx(
                          "px-3 py-2 text-sm",
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
                ref={holderRef}
                className="glass px-3 py-2 rounded-xl"
              />

              <div className="flex gap-3">
                <input
                  name="expiry_month"
                  placeholder="MM"
                  ref={monthRef}
                  // inputMode="numeric"
                  value={card.expiry_month===0?"":card.expiry_month}
                  onChange={handleCardChange}
                  className="glass px-3 py-2 w-[50%] rounded-xl flex-1"
                />
                <input
                  name="expiry_year"
                  placeholder="YY"
                  ref={yearRef}
                  // inputMode="numeric"
                  value={card.expiry_year===0?"":card.expiry_year}
                  onChange={handleCardChange}
                  className="glass px-3 py-2 rounded-xl w-[50%] flex-1"
                />

                
              </div>
              {cardError&&<p className="text-xs text-red-400">{cardError}</p>}
              <button
                onClick={addCard}
                ref={addCardRef}
                className="glass-hover py-2 rounded-xl text-sm"
              >
                Add Card
              </button>
              {/* {cardError &&<p className="text-xs text-red-400">{cardError}</p>} */}
            </div>
          </div>

          <button
            onClick={saveAccount}
            disabled={saving}
            className="glass-hover py-2 rounded-xl text-sm font-medium mt-4"
          >
            {saving ? "Saving..." : "Save Account"}
          </button>

          {error&&<p className="text-xs text-red-400">{error}</p>}

        </div>

        {/* RIGHT: preview pane */}
        <div className="space-y-4">
          <div className="glass p-4 rounded-2xl">
            <h4 className="text-sm opacity-70">Account Preview</h4>
            <p className="font-semibold mt-2">{form.accountName || "No type selected"}</p>
            <p className="text-sm">Currency: {form.currency}</p>
            <p className="text-sm">Opening: {form.openingBalance || "0"}</p>
            <p className="text-sm">Income: {form.totalIncome || "0"}</p>
            <p className="text-sm">Expense: {form.totalExpense || "0"}</p>
          </div>

          <div className="glass p-4 rounded-2xl">
            <h4 className="text-sm opacity-70 mb-3">Current Card Preview</h4>
            <CardPreview card={card} />
          </div>

          <div className="glass p-4 rounded-2xl">
            <h4 className="text-sm opacity-70 mb-3">Saved Cards</h4>
            {cards.length === 0 ? (
              <p className="text-xs opacity-60">No cards added yet</p>
            ) : (
              <>
                
                <div
                  ref={savedCardsRef}
                  className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {cards.map((c, i) => (
                    <div key={i} className="min-w-[280px] flex-shrink-0 scroll-snap-align-start">
                      <CardPreview card={c} />
                    </div>
                  ))}
                </div>
                {/* <ToastContainer/> */}
              </>
              
            )}
          </div>
          {/* <ToastContainer/> */}
        </div>
        {/* <ToastContainer/> */}
      </div>
      <ToastContainer/>
    </div>
  );
}