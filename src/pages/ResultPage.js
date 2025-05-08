"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineBank, AiOutlineCalculator, AiOutlineCheckCircle, AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { toPng } from "html-to-image";

export default function ResultPage() {
    const searchParams = useSearchParams();
    const [data, setData] = useState(null);
    const [isMounted, setIsMounted] = useState(false); // Track if the component is mounted

    useEffect(() => {
        setIsMounted(true); // Set the component as mounted
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

    const { previousTotalBalance, currentBalances, expenses, transferDetails, totals } = data;
    const isSavings = totals.savingsOrLoss >= 0;

    return (
        <div className="p-6 max-w-3xl mx-auto bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg rounded-lg mt-10">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-600 flex items-center justify-center gap-2">
                <AiOutlineBank /> Expense Report
            </h1>

            <div id="result-section">
                {/* Previous Month Total Balance */}
                <section className="mb-8 p-4 rounded-lg border border-blue-200 bg-white shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2 border-b pb-2 border-gray-300">
                        <AiOutlineCalculator className="text-blue-500" /> Previous Month - Total Balance
                    </h2>
                    <p className="text-gray-700 text-lg mt-4">Total: ₹{previousTotalBalance}</p>
                </section>

                {/* Current Month - After Settlement */}
                <section className="mb-8 p-4 rounded-lg border border-blue-200 bg-blue-50 shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2 border-b pb-2 border-gray-300">
                        <AiOutlineCalculator className="text-blue-500" /> Current Month - After Settlement
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-gray-700 text-lg mt-4">
                        <p>S: {transferDetails.finalSettlements.s}</p>
                        <p>U: {transferDetails.finalSettlements.u}</p>
                        <p>K: {transferDetails.finalSettlements.k}</p>
                        <p>I: {transferDetails.finalSettlements.i}</p>
                        <p>SC: {transferDetails.finalSettlements.sc}</p>
                    </div>
                </section>

                {/* Expense Calculations */}
                <section className="mb-8 p-4 rounded-lg border border-blue-200 bg-white shadow-sm">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2 border-b pb-2 border-gray-300">
                        <AiOutlineCalculator className="text-blue-500" /> Expense Calculations
                    </h2>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-blue-600">Regular Expenses</h3>
                        <ul className="mt-2 text-gray-700 text-lg list-disc list-inside">
                            {expenses.regularExpenses.map((exp, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{exp.name}:</span>
                                    <span className="font-semibold">₹{exp.amount}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-3 font-semibold text-gray-800 text-lg">
                            Total of 4 Banks (S, U, K, I) - Regular Expenses: <span className="text-blue-600">₹{totals.afterRegularExpenses}</span>
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-blue-600">SC Bank Expenses</h3>
                        <ul className="mt-2 text-gray-700 text-lg list-disc list-inside">
                            {expenses.scExpenses.map((exp, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{exp.name}:</span>
                                    <span className="font-semibold">₹{exp.amount}</span>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-3 font-semibold text-gray-800 text-lg">
                            SC - Gold Loan and Specific Expenses: <span className="text-blue-600">₹{totals.afterScExpenses}</span>
                        </p>
                    </div>
                </section>

                {/* Final Total */}
                <section className="p-6 rounded-lg border border-green-200 bg-green-50 shadow-sm">
                    <h2 className="text-3xl font-semibold text-green-700 flex items-center gap-2 mb-4">
                        <AiOutlineCheckCircle /> Final Total
                    </h2>
                    <p className="text-4xl font-bold text-center text-green-700">₹{totals.currentFinalTotal}</p>
                </section>

                {/* Savings or Loss */}
                <section className={`p-6 rounded-lg border mt-8 shadow-sm ${isSavings ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                    <h2 className={`text-3xl font-semibold ${isSavings ? "text-green-700" : "text-red-700"} mb-4 flex items-center gap-2`}>
                        {isSavings ? <AiOutlineArrowUp /> : <AiOutlineArrowDown />}
                        {isSavings ? "Total Savings" : "Total Loss"}
                    </h2>
                    <p className={`text-4xl font-bold text-center ${isSavings ? "text-green-700" : "text-red-700"}`}>
                        ₹{Math.abs(totals.savingsOrLoss)}
                    </p>
                </section>
            </div>

            <button
                onClick={downloadAsImage}
                className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 self-center"
            >
                Download Report
            </button>
        </div>
    );
}
