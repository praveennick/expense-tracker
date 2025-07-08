// File: pages/result.js
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    AiOutlineBank,
    AiOutlineCalculator,
    AiOutlineCheckCircle,
    AiOutlineArrowUp,
    AiOutlineArrowDown,
    AiOutlineSetting,
} from "react-icons/ai";
import { toPng } from "html-to-image";

export default function ResultPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            const encodedData = searchParams.get("data");
            if (encodedData) {
                try {
                    const decodedData = JSON.parse(decodeURIComponent(encodedData));
                    setData(decodedData);
                } catch (error) {
                    console.error("Error parsing data:", error);
                }
            }
        }
    }, [isMounted, searchParams]);

    const downloadAsImage = () => {
        const resultSection = document.getElementById("result-section");
        if (!resultSection) return;

        toPng(resultSection)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "Expense_Report.png";
                link.click();
            })
            .catch((error) => {
                console.error("Error generating image:", error);
            });
    };

    if (!data) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

    if (!data.totals) {
        return (
            <div className="text-center mt-10 text-red-600 font-semibold">
                🚫 Unable to read submitted totals. Please go back and submit again.
            </div>
        );
    }


    const {
        month,
        previousTotalBalance,
        currentBalances,
        expenses,
        transferDetails,
        totals,
        bankBaseBalances,
        income,
        budgetLimit,
    } = data;


    const isSavings = totals?.savingsOrLoss >= 0;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            <h1 className="text-4xl font-bold text-center mb-6 text-blue-600 flex items-center gap-2">
                <AiOutlineBank /> {month} Expense Summary
            </h1>

            <div id="result-section" className="space-y-6">
                <section className="p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-2">
                        <AiOutlineCalculator className="text-blue-500" /> Balances & Transfers
                    </h2>
                    <p className="text-gray-700">Previous Month Total Balance: ₹{previousTotalBalance}</p>
                    <p className="text-gray-700 mt-2">Base Balances:</p>
                    <ul className="text-gray-800 text-sm ml-4 list-disc">
                        {Object.entries(bankBaseBalances).map(([key, val]) => (
                            <li key={key}>
                                {key} → ₹{val}
                            </li>
                        ))}
                    </ul>

                    {transferDetails && (
                        <div className="mt-4">
                            <p className="text-gray-800">Transfer Suggestions:</p>
                            <p>• Transfer ₹{transferDetails.transferToS} from Kotak to State Bank</p>
                            <p>• Transfer ₹{transferDetails.transferToU} from Kotak to Union Bank</p>
                        </div>
                    )}


                    {transferDetails?.finalSettlements && (
                        <div className="mt-2">
                            <p className="text-gray-800 font-semibold">Final Balances:</p>
                            <ul className="ml-4 list-disc">
                                {Object.entries(transferDetails.finalSettlements).map(([k, v]) => (
                                    <li key={k}>{k.toUpperCase()}: ₹{v}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                </section>

                <section className="p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-xl font-semibold mb-2 text-blue-600">💸 Income & Expenses</h2>
                    <p>💰 Total Income: ₹{income.total}</p>
                    <p>📉 Total Expenses: ₹{totals.totalExpenses}</p>
                    <p className="text-sm text-gray-500 mt-1">(Budget Limit: ₹{budgetLimit})</p>

                    <h3 className="text-md font-semibold mt-4">Regular Expenses</h3>
                    <ul className="text-gray-700 text-sm list-disc ml-5">
                        {expenses.regularExpenses.map((e, i) => (
                            <li key={i}>{e.name}: ₹{e.amount}</li>
                        ))}
                    </ul>

                    <h3 className="text-md font-semibold mt-4">SC Expenses</h3>
                    <ul className="text-gray-700 text-sm list-disc ml-5">
                        {expenses.scExpenses.map((e, i) => (
                            <li key={i}>{e.name}: ₹{e.amount}</li>
                        ))}
                    </ul>
                </section>

                <section className="p-4 border rounded-lg shadow-md bg-green-50">
                    <h2 className="text-2xl font-semibold flex items-center gap-2 text-green-700">
                        <AiOutlineCheckCircle /> Net Result
                    </h2>
                    <p className="text-xl mt-2">Final Total After Expenses: ₹{totals.currentFinalTotal}</p>
                </section>

                <section
                    className={`p-4 rounded-lg border mt-4 ${isSavings ? "bg-green-100 border-green-300 text-green-700" : "bg-red-100 border-red-300 text-red-700"
                        }`}
                >
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        {isSavings ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                        {isSavings ? "Savings" : "Loss"}
                    </h2>
                    <p className="text-3xl font-bold mt-2">₹{Math.abs(totals.savingsOrLoss)}</p>
                </section>
            </div>

            <button
                onClick={downloadAsImage}
                className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
            >
                📥 Download This Report
            </button>
        </div>
    );
}