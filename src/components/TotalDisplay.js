// components/TotalDisplay.js
import { useEffect, useState } from 'react';

export default function TotalDisplay({ balances, settlements, expenses }) {
    const [finalTotal, setFinalTotal] = useState(0);

    useEffect(() => {
        const balanceTotal = Object.values(balances).reduce((acc, val) => acc + val, 0);
        const settlementTotal = Object.values(settlements).reduce((acc, val) => acc + val, 0);
        const afterExpenses = settlementTotal - expenses.regular;
        const goldTotal = balances.sc - expenses.gold;

        setFinalTotal(afterExpenses + goldTotal);
    }, [balances, settlements, expenses]);

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Final Total</h2>
            <div className="text-gray-700 text-lg">
                Final Total After All Expenses: <span className="font-bold">{finalTotal}</span>
            </div>
        </div>
    );
}
