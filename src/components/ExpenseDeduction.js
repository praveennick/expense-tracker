"use client";

import { useEffect, useState } from "react";

export default function ExpenseDeduction({ onExpensesSubmit, expenses: previousExpenses }) {
    const [scExpenses, setScExpenses] = useState([{ name: "", amount: 0 }]);

    useEffect(() => {
        if (previousExpenses?.scExpenses?.length) {
            setScExpenses(previousExpenses.scExpenses);
        }
    }, [previousExpenses]);

    useEffect(() => {
        onExpensesSubmit({ scExpenses });
    }, [scExpenses]);

    const handleChange = (index, field, value) => {
        const updated = [...scExpenses];
        updated[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
        setScExpenses(updated);
    };

    const addExpense = () => {
        setScExpenses([...scExpenses, { name: "", amount: 0 }]);
    };

    const removeExpense = (index) => {
        const updated = [...scExpenses];
        updated.splice(index, 1);
        setScExpenses(updated);
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">🧾 SC Expenses (Gold Loan, Subscriptions)</h2>
            {scExpenses.map((expense, index) => (
                <div key={index} className="flex gap-4 mb-2">
                    <input
                        type="text"
                        placeholder="Expense Name"
                        value={expense.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={expense.amount}
                        onChange={(e) => handleChange(index, "amount", e.target.value)}
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                    />
                    <button
                        onClick={() => removeExpense(index)}
                        className="text-red-500 font-bold px-2"
                        title="Remove"
                    >
                        ×
                    </button>
                </div>
            ))}
            <button onClick={addExpense} className="text-blue-500 mt-2">+ Add SC Expense</button>
        </div>
    );
}
