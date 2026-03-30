'use client';

import { useRef, useState } from "react";
import clsx from "clsx";

import AddCardDetails from "./addCard";
import { useAccounts } from "@/src/context/accountContext";
import { createAccount, createCard } from "@/src/services/accountServices";
import { toastShowError, toastShowSuccess } from "@/src/utils/toastUtils";
// import { CardDetails } from "@/src/utils/definitions";
// import { useAccounts } from "@/src/context/accountContext";

interface Props {
  parentClass: string;
}

const ACCOUNT_TYPES = ["SAVINGS", "LOAN", "CREDIT"];
const CURRENCIES = ["USD", "INR", "GBP", "YEN", "EUR"];

export default function AddAccountCard({ parentClass }: Props) {
  const { accounts, refreshAccounts } = useAccounts();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    accountName: "",
    currency: "INR",
    openingBalance: "",
    totalIncome: "",
    totalExpense: "",
  });

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

  // id, holder_name, expiry_month, expiry_year, is_active

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.name==='cardnumber'){
      const {name, value} = e.target;
      console.log("Inside cardnumber");

      // 1. Remove all non-digit characters (including existing spaces)
    const rawValue = value.replace(/\D/g, "");

    // 2. Limit to 16 digits (standard card length)
    const limitedValue = rawValue.slice(0, 16);

    // 3. Add a space after every 4 digits using regex
    const formattedValue = limitedValue.replace(/(\d{4})(?=\d)/g, "$1 ");

    // 4. Update state with the formatted string
    setCard((prev) => ({ ...prev, [name]: formattedValue }));
    console.log(`value of cardnumber: ${card.cardnumber}`);
  } else {
    // Standard handling for other fields
    setCard((prev) => ({ ...prev, [e.target.name]: value }));
    
  }
    const value = ["expiry_month", "expiry_year"].includes(e.target.name) 
      ? parseInt(e.target.value) || 0 
      : e.target.value;
    setCard({ ...card, [e.target.name]: value });
  };

  const savedCardsRef = useRef<HTMLDivElement>(null);

  const scrollSavedCards = (direction: 1 | -1) => {
    if (!savedCardsRef.current) return;
    savedCardsRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  };

  const saveAccount = async () => {
    if (!form.accountName.trim()) {
      toastShowError("Account type is required", 3000);
      return;
    }

    const accountExists = accounts?.some(
      (acc) => acc.account_name.toLowerCase() === form.accountName.trim().toLowerCase()
        && acc.currency_code.toLowerCase() === form.currency.toLowerCase()
    );
    if (accountExists) {
      toastShowError("Account already registered", 3000);
      return;
    }

    setSaving(true);
    try {
      const accountPayload = {
        account_name: form.accountName.trim(),
        currency_code: form.currency,
        opening_balance: Number(form.openingBalance) || 0,
        total_income: Number(form.totalIncome) || 0,
        total_expense: Number(form.totalExpense) || 0,
      };

      const savedAccount = await createAccount(accountPayload);

      for (const c of cards) {
        // If card already exists in card list, skip duplicates by number
        if (c.cardnumber && cards.filter((x) => x.cardnumber === c.cardnumber).length > 1) continue;

        await createCard({
          account_id: String(savedAccount.id),
          brand: c.brand,
          cardnumber: c.cardnumber,
          holder_name: c.holder_name,
          expiry_month: Number(c.expiry_month),
          expiry_year: Number(c.expiry_year),
          cvv: c.cvv,
          is_active: c.is_active,
          type: c.type,
        });
      }

      toastShowSuccess("Account and cards saved successfully", 3000);

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
      toastShowError(msg, 4000);
    } finally {
      setSaving(false);
    }
  };

  const addCard = () => {
    const trimmedCardNumber = String(card.cardnumber).trim();
    if (!card.brand.trim() || !card.holder_name.trim() || !trimmedCardNumber) {
      toastShowError("Brand, holder and card number are required", 3000);
      return;
    }

    // duplicate check in local list and existing server cards
    const alreadyExists = cards.some((c) => c.cardnumber.trim() === trimmedCardNumber);
    if (alreadyExists) {
      toastShowError("Card already registered", 3000);
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

    toastShowSuccess("Card added locally. Save account to persist.", 2200);
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
                  value={card.expiry_month}
                  min={1}
                  max={12}
                  minLength={2}
                  maxLength={2}
                  onChange={handleCardChange}
                  className="glass px-3 py-2 w-[50%] rounded-xl flex-1"
                />
                <input
                  name="expiry_year"
                  placeholder="YY"
                  value={card.expiry_year}
                  min={26}
                  max={45}
                  minLength={2}
                  maxLength={2}
                  onChange={handleCardChange}
                  className="glass px-3 py-2 rounded-xl w-[50%] flex-1"
                />

                
              </div>

              <button
                onClick={addCard}
                className="glass-hover py-2 rounded-xl text-sm"
              >
                Add Card
              </button>
            </div>
          </div>

          <button
            onClick={saveAccount}
            disabled={saving}
            className="glass-hover py-2 rounded-xl text-sm font-medium mt-4"
          >
            {saving ? "Saving..." : "Save Account"}
          </button>
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
            <AddCardDetails card={card} />
          </div>

          <div className="glass p-4 rounded-2xl">
            <h4 className="text-sm opacity-70 mb-3">Saved Cards</h4>
            {cards.length === 0 ? (
              <p className="text-xs opacity-60">No cards added yet</p>
            ) : (
              <>
                <div className="mb-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => scrollSavedCards(-1)}
                    className="glass hover:bg-gray-200 px-2 py-1 rounded"
                    aria-label="Scroll left"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => scrollSavedCards(1)}
                    className="glass hover:bg-gray-200 px-2 py-1 rounded"
                    aria-label="Scroll right"
                  >
                    ▶
                  </button>
                </div>
                <div
                  ref={savedCardsRef}
                  className="flex gap-4 overflow-x-auto no-scrollbar pb-2"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {cards.map((c, i) => (
                    <div key={i} className="min-w-[280px] flex-shrink-0 scroll-snap-align-start">
                      <AddCardDetails card={c} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}