// components/BalanceEntry.js
import { useState, useEffect } from 'react';

export default function BalanceEntry({ onBalanceSubmit }) {
    const [balances, setBalances] = useState({ s: 0, u: 0, k: 0, i: 0, sc: 0 });

    useEffect(() => {
        onBalanceSubmit(balances);
    }, [balances]);

    const handleChange = (e) => {
        setBalances({ ...balances, [e.target.name]: parseFloat(e.target.value) || 0 });
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Enter Account Balances</h2>
            <div className="grid grid-cols-2 gap-4">
                {Object.keys(balances).map((key) => (
                    <div key={key}>
                        <label className="block text-gray-700 mb-1">{key.toUpperCase()} Balance</label>
                        <input
                            type="number"
                            name={key}
                            value={balances[key]}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
