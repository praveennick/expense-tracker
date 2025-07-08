"use client";

import { useState, useEffect } from "react";

export default function IncomeEntry({ onIncomeSubmit }) {
    const [incomes, setIncomes] = useState([{ name: "", amount: 0 }]);

    // ✅ Load income from localStorage on mount
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
        if (saved.income?.sources?.length) {
            setIncomes(saved.income.sources);
        }
    }, []);

    // ✅ Save income to localStorage and update parent on change
    useEffect(() => {
        const total = incomes.reduce((sum, income) => sum + (income.amount || 0), 0);
        const incomeData = { total, sources: incomes };

        // Notify parent
        onIncomeSubmit(incomeData);

        // Save to localStorage
        const current = JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
        localStorage.setItem("expenseTrackerData", JSON.stringify({
            ...current,
            income: incomeData,
        }));
    }, [incomes]);

    const handleChange = (index, field, value) => {
        const updated = [...incomes];
        updated[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
        setIncomes(updated);
    };

    const addIncome = () => {
        setIncomes([...incomes, { name: "", amount: 0 }]);
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Enter Monthly Income</h2>
            {incomes.map((income, index) => (
                <div key={index} className="flex gap-4 mb-2">
                    <input
                        type="text"
                        placeholder="Source"
                        value={income.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={income.amount}
                        onChange={(e) => handleChange(index, "amount", e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
            ))}
            <button onClick={addIncome} className="text-blue-500 mt-2">
                + Add Income Source
            </button>
        </div>
    );
}
