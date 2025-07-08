import { useState, useEffect } from "react";

export default function BaseBankEditor({
    bankBaseBalances,
    onUpdate,
    bankAccounts,
    setBankAccounts
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempBalances, setTempBalances] = useState(bankBaseBalances);
    const bankNameMap = {
        s: "State Bank",
        u: "Union Bank",
        k: "Kotak Bank",
        i: "IndusInd Bank",
        sc: "Standard Chartered",
        hdfc: "HDFC Bank",
    };


    useEffect(() => {
        const newObj = bankAccounts.reduce((acc, key) => ({
            ...acc,
            [key]: tempBalances[key] ?? 0,
        }), {});
        setTempBalances(newObj);
    }, [bankAccounts]);

    const handleChange = (key, value) => {
        setTempBalances({ ...tempBalances, [key]: parseFloat(value) || 0 });
    };

    const handleAddBank = () => {
        const newBank = prompt("Enter new bank name (e.g. HDFC):")?.trim();
        if (!newBank) return;

        const key = newBank.toLowerCase().replace(/\s+/g, "");
        if (tempBalances[key]) {
            alert("Bank already exists!");
            return;
        }

        const updated = { ...tempBalances, [key]: 0 };
        setTempBalances(updated);
        onUpdate(updated);
        setBankAccounts((prev) => [...prev, key]);
    };

    const handleRemoveBank = (key) => {
        const updated = { ...tempBalances };
        delete updated[key];
        onUpdate(updated);
        setBankAccounts((prev) => prev.filter((b) => b !== key));
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
                        <label className="w-40 font-semibold">
                            {bankNameMap[key.toLowerCase()] || key.toUpperCase()}
                        </label>

                        {isEditing ? (
                            <>
                                <input
                                    type="number"
                                    value={val}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded"
                                />
                                <button
                                    onClick={() => handleRemoveBank(key)}
                                    className="text-red-600 font-bold px-2"
                                    title="Remove Bank"
                                >
                                    ×
                                </button>
                            </>
                        ) : (
                            <div className="text-gray-800">₹{val}</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-2 flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="bg-green-600 text-white px-4 py-1 rounded shadow hover:bg-green-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleAddBank}
                            className="bg-blue-500 text-white px-4 py-1 rounded shadow hover:bg-blue-600"
                        >
                            + Add Bank
                        </button>
                    </>
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