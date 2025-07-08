// File: components/TotalDisplay.js
"use client";

import { useEffect, useState } from "react";

export default function TotalDisplay({ balances, settlements, expenses }) {
    const [finalTotal, setFinalTotal] = useState(0);
    const [summary, setSummary] = useState({});

    useEffect(() => {
        const balanceTotal = Object.values(balances || {}).reduce((acc, val) => acc + val, 0);
        const settlementTotal = Object.values(settlements || {}).reduce((acc, val) => acc + val, 0);
        const regularExpenses = expenses?.regular || 0;
        const scExpenses = expenses?.gold || 0;
        const totalExpenses = regularExpenses + scExpenses;

        const final = settlementTotal - totalExpenses;
        setFinalTotal(final);
        setSummary({ balanceTotal, settlementTotal, totalExpenses });
    }, [balances, settlements, expenses]);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">🧾 Final Calculation Summary</h2>

            <ul className="text-gray-700 text-md space-y-1">
                <li>🟡 Total Current Balances: ₹{summary.balanceTotal?.toLocaleString("en-IN")}</li>
                <li>🔵 Total After Settlement: ₹{summary.settlementTotal?.toLocaleString("en-IN")}</li>
                <li>🔻 Total Expenses: ₹{summary.totalExpenses?.toLocaleString("en-IN")}</li>
            </ul>

            <p className="mt-4 text-lg text-green-700 font-semibold">
                ✅ Final Total After All Deductions: ₹{finalTotal?.toLocaleString("en-IN")}
            </p>
        </div>
    );
}
