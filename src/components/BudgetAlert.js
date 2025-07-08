"use client";
import { useMemo } from "react";

export default function BudgetAlert({ budgetLimit, setBudgetLimit, expenses }) {
    const totalExpenses = useMemo(() => {
        const regular = expenses.regularExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
        const sc = expenses.scExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
        return regular + sc;
    }, [expenses]);

    const isExceeded = totalExpenses > budgetLimit;

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Monthly Budget</h2>
                <input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(+e.target.value)}
                    className="w-1/3 px-3 py-1 border border-gray-300 rounded text-right"
                    placeholder="Enter limit (e.g. 50000)"
                />
            </div>

            <div className={`p-3 rounded ${isExceeded ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                {isExceeded ? (
                    <p>⚠️ You've exceeded your budget by ₹{(totalExpenses - budgetLimit).toLocaleString("en-IN")}!</p>
                ) : (
                    <p>✅ You're within your budget. Remaining: ₹{(budgetLimit - totalExpenses).toLocaleString("en-IN")}</p>
                )}
            </div>
        </div>
    );
}
