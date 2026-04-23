"use client";

import clsx from "clsx";
import { useEffect, useState } from "react";

function CountUp({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = value / (duration / 16);

    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <>{Math.floor(count).toLocaleString()}</>;
}

export function FinancialSummary({
  income,
  expenses,
}: {
  income: number;
  expenses: number;
}) {
  const net = income - expenses;
  const margin = (net / Math.max(income, 1)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      {/* Income */}
      <div className="glass glass-md glass-rounded glass-hover">
        <p className="text-[10px] uppercase opacity-40 mb-2">
          Total Income
        </p>

        <p className="text-2xl font-bold text-green-400">
          ₹<CountUp value={income} />
        </p>

        <p className="text-[10px] opacity-40 mt-2">
          Cash inflow
        </p>
      </div>

      {/* Expenses */}
      <div className="glass glass-md glass-rounded glass-hover">
        <p className="text-[10px] uppercase opacity-40 mb-2">
          Total Expenses
        </p>

        <p className="text-2xl font-bold text-red-400">
          ₹<CountUp value={expenses} />
        </p>

        <p className="text-[10px] opacity-40 mt-2">
          Cash outflow
        </p>
      </div>

      {/* Net */}
      <div className="glass glass-md glass-rounded glass-hover">
        <p className="text-[10px] uppercase opacity-40 mb-2">
          Net Balance
        </p>

        <p
          className={clsx(
            "text-2xl font-bold",
            net >= 0 ? "text-green-400" : "text-red-400"
          )}
        >
          ₹<CountUp value={net} />
        </p>

        <p className="text-[10px] opacity-40 mt-2">
          {margin.toFixed(1)}% margin
        </p>
      </div>

    </div>
  );
}