// File: components/BaseBankEditor.js
"use client";

import { useState, useEffect } from "react";

export default function BaseBankEditor({ bankBaseBalances, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempBalances, setTempBalances] = useState(bankBaseBalances);

    useEffect(() => {
        setTempBalances(bankBaseBalances);
    }, [bankBaseBalances]);

    const handleChange = (key, value) => {
        setTempBalances({ ...tempBalances, [key]: parseFloat(value) || 0 });
    };

    const handleSave = () => {
        onUpdate(tempBalances);
        setIsEditing(false);
    };

    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Base Bank Balances (For Settlement)</h2>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(tempBalances).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                        <label className="w-8 font-semibold">{key}</label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={val}
                                onChange={(e) => handleChange(key, e.target.value)}
                                className="flex-1 p-2 border border-gray-300 rounded"
                            />
                        ) : (
                            <div className="text-gray-800">₹{val}</div>
                        )}
                    </div>
                ))}
            </div>
            <div className="mt-2">
                {isEditing ? (
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-1 rounded shadow hover:bg-green-700"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
}
