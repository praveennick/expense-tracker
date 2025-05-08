"use client";
// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BalanceEntry from '../components/BalanceEntry';
import ExpenseDeduction from '../components/ExpenseDeduction';

export default function Home() {
  const router = useRouter();
  const [previousTotalBalance, setPreviousTotalBalance] = useState(0); // Store only the previous month's total balance
  const [currentBalances, setCurrentBalances] = useState({});
  const [expenses, setExpenses] = useState({ regularExpenses: [], scExpenses: [] });
  const [transferDetails, setTransferDetails] = useState(null);
  const [rentPaidFromS, setRentPaidFromS] = useState(false); // Track if rent is paid from State Bank

  const calculateTransfers = () => {
    const BASE_S = rentPaidFromS ? 7500 : 22000; // Adjust base for State Bank based on rent payment
    const BASE_K = 12300;

    const currentS = currentBalances.s || 0;
    const currentK = currentBalances.k || 0;
    const currentU = currentBalances.u || 0;

    // Calculate transfers
    const transferToS = Math.max(BASE_S - currentS, 0);
    const kotakExcess = Math.max(currentK - BASE_K - transferToS, 0);

    // Final settlements after transfers
    const settlementS = BASE_S;
    const settlementK = BASE_K;
    const settlementU = currentU + kotakExcess;

    // Prepare transfer details
    setTransferDetails({
      transferToS,
      transferToU: kotakExcess,
      finalSettlements: { s: settlementS, u: settlementU, k: settlementK, i: currentBalances.i, sc: currentBalances.sc },
    });
  };

  const handleSubmit = () => {
    // Calculate totals for expenses
    const regularExpensesTotal = expenses.regularExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const scExpensesTotal = expenses.scExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate current month’s final total after expenses
    const currentFinalTotal = transferDetails.finalSettlements.s + transferDetails.finalSettlements.u + transferDetails.finalSettlements.k + transferDetails.finalSettlements.i + transferDetails.finalSettlements.sc - regularExpensesTotal - scExpensesTotal;

    // Calculate savings or loss
    const savingsOrLoss = currentFinalTotal - previousTotalBalance;

    const data = {
      previousTotalBalance,
      currentBalances,
      expenses,
      transferDetails,
      totals: {
        currentFinalTotal,
        afterRegularExpenses: regularExpensesTotal, // Pass regular expenses total here
        afterScExpenses: scExpensesTotal,           // Pass SC expenses total here
        savingsOrLoss,
      },
    };

    // Encode the data and navigate to the result page
    const encodedData = encodeURIComponent(JSON.stringify(data));
    router.push(`/result?data=${encodedData}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monthly Expense Tracker</h1>

      <h2 className="text-xl font-semibold mb-4">Enter Previous Month's Total Balance</h2>
      <input
        type="number"
        value={previousTotalBalance}
        onChange={(e) => setPreviousTotalBalance(Number(e.target.value))}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Enter previous month's total balance"
      />

      <div className="flex items-center gap-4 mb-4">
        <input
          type="checkbox"
          checked={rentPaidFromS}
          onChange={(e) => setRentPaidFromS(e.target.checked)}
          id="rentPaid"
        />
        <label htmlFor="rentPaid" className="text-gray-700">I have already paid the rent from State Bank</label>
      </div>

      <h2 className="text-xl font-semibold mb-4 mt-6">Enter Current Month Balances</h2>
      <BalanceEntry onBalanceSubmit={setCurrentBalances} />

      <button
        onClick={calculateTransfers}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Calculate Transfers
      </button>

      {transferDetails && (
        <div className="bg-gray-100 p-4 mt-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Suggested Transfers</h2>
          <p className="text-gray-800 mt-2">
            To achieve the base balance of ₹{transferDetails.finalSettlements.s} in State Bank, transfer <span className="font-bold text-blue-600">₹{transferDetails.transferToS}</span> from Kotak Bank.
          </p>
          <p className="text-gray-800 mt-2">
            Transfer the remaining Kotak Bank excess of <span className="font-bold text-blue-600">₹{transferDetails.transferToU}</span> to Union Bank.
          </p>
          <p className="mt-4 text-gray-700">Final Settlement Balances:</p>
          <ul className="mt-2 text-gray-800">
            <li>S Balance (State Bank): ₹{transferDetails.finalSettlements.s}</li>
            <li>U Balance (Union Bank): ₹{transferDetails.finalSettlements.u}</li>
            <li>K Balance (Kotak Bank): ₹{transferDetails.finalSettlements.k}</li>
            <li>I Balance (IndusInd Bank): ₹{transferDetails.finalSettlements.i}</li>
            <li>SC Balance (Standard Chartered): ₹{transferDetails.finalSettlements.sc}</li>
          </ul>
        </div>
      )}

      <ExpenseDeduction onExpensesSubmit={setExpenses} />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
      >
        Submit and View Results
      </button>
    </div>
  );
}
