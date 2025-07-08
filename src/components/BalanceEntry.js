import { useState, useEffect } from 'react';

export default function BalanceEntry({ bankAccounts = [], onBalanceSubmit }) {
    const initial = bankAccounts.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
    const [balances, setBalances] = useState(initial);
    const bankNameMap = {
        s: "State Bank",
        u: "Union Bank",
        k: "Kotak Bank",
        i: "IndusInd Bank",
        sc: "Standard Chartered",
        hdfc: "HDFC Bank",
    };


    useEffect(() => {
        onBalanceSubmit(balances);
    }, [balances]);

    useEffect(() => {
        const newObj = bankAccounts.reduce((acc, key) => ({ ...acc, [key]: balances[key] || 0 }), {});
        setBalances(newObj);
    }, [bankAccounts]);

    const handleChange = (e) => {
        setBalances({ ...balances, [e.target.name]: parseFloat(e.target.value) || 0 });
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Enter Account Balances</h2>
            <div className="grid grid-cols-2 gap-4">
                {bankAccounts.map((key) => (
                    <div key={key}>
                        <label className="block text-gray-700 mb-1">
                            {bankNameMap[key] || key.toUpperCase()} Balance
                        </label>
                        <input
                            type="number"
                            name={key}
                            value={balances[key] ?? 0}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}