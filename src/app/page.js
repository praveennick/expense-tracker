// File: pages/index.js

"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import moment from "moment";
import BalanceEntry from "../components/BalanceEntry";
import ExpenseDeduction from "../components/ExpenseDeduction";
import IncomeEntry from "../components/IncomeEntry";
import BudgetAlert from "../components/BudgetAlert";
import ExpenseCategoryChart from "../components/ExpenseCategoryChart";
import MonthlyChecklist from "../components/MonthlyChecklist";
import TrendChart from "../components/TrendChart";
import BaseBankEditor from "@/components/BaseBankEditor";
import HistoryList from "@/components/HistoryList";

export default function Home() {
  const router = useRouter();
  const fileInputRef = useRef();

  const [history, setHistory] = useState([]);
  const [income, setIncome] = useState({ total: 0, sources: [] });
  const [monthlyTasks, setMonthlyTasks] = useState([]);
  const [budgetLimit, setBudgetLimit] = useState(50000);
  const [previousTotalBalance, setPreviousTotalBalance] = useState(null);
  const [currentBalances, setCurrentBalances] = useState({});
  const [expenses, setExpenses] = useState({ regularExpenses: [], scExpenses: [] });
  const [transferDetails, setTransferDetails] = useState(null);
  const [rentPaidFromS, setRentPaidFromS] = useState(false);
  const [bankBaseBalances, setBankBaseBalances] = useState({ S: 22000, K: 12300 });
  const [bankAccounts, setBankAccounts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
    console.log("saved", saved)
    if (saved.bankBaseBalances) setBankBaseBalances(saved.bankBaseBalances);
  }, []);

  // Load on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
    if (saved.bankAccounts?.length) setBankAccounts(saved.bankAccounts);
    else setBankAccounts(["s", "u", "k", "i", "sc"]); // default
  }, []);


  // Save to localStorage on update
  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
    localStorage.setItem(
      "expenseTrackerData",
      JSON.stringify({
        ...existing,
        bankAccounts,
      })
    );
  }, [bankAccounts]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
    if (saved.previousTotalBalance) setPreviousTotalBalance(saved.previousTotalBalance);
    if (saved.monthlyTasks) setMonthlyTasks(saved.monthlyTasks);
    if (saved.budgetLimit) setBudgetLimit(saved.budgetLimit);
    if (saved.bankBaseBalances) setBankBaseBalances(saved.bankBaseBalances);

    const savedHistory = JSON.parse(localStorage.getItem("expenseHistory") || "[]");
    setHistory(savedHistory);
  }, []);

  // keep regularExpenses in sync with monthlyTasks for charts/budget
  useEffect(() => {
    setExpenses((prev) => ({ ...prev, regularExpenses: monthlyTasks || [] }));
  }, [monthlyTasks]);

  const handleBaseBalanceChange = (key, value) => {
    const updated = { ...bankBaseBalances, [key]: parseFloat(value) || 0 };
    setBankBaseBalances(updated);
    localStorage.setItem("expenseTrackerData", JSON.stringify({ ...getCurrentStorage(), bankBaseBalances: updated }));
  };

  const getCurrentStorage = () => {
    return JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
  };

  const calculateTransfers = () => {
    const base = bankBaseBalances || {};
    const current = Object.fromEntries(
      bankAccounts.map((k) => [k, Number(currentBalances?.[k] || 0)])
    );

    if (!bankAccounts.includes("k")) return;

    const transfers = [];
    let kotakSurplus = (current.k || 0) - (Number(base.k || 0));

    // ✅ targets are only banks that have base defined (except k & sc)
    const eligibleTargets = Object.keys(base).filter(
      (key) => key !== "k" && key !== "sc" && bankAccounts.includes(key)
    );

    // 1) First satisfy base targets
    for (const key of eligibleTargets) {
      if (kotakSurplus <= 0) break;

      const required = Math.max(Number(base[key] || 0) - (current[key] || 0), 0);
      const toTransfer = Math.min(required, kotakSurplus);

      if (toTransfer > 0) {
        current.k -= toTransfer;
        current[key] += toTransfer;
        kotakSurplus -= toTransfer;
        transfers.push({ from: "k", to: key, amount: toTransfer });
      }
    }

    // 2) ✅ remaining surplus → sc
    if (kotakSurplus > 0 && bankAccounts.includes("sc")) {
      current.k -= kotakSurplus;
      current.sc = (current.sc || 0) + kotakSurplus;
      transfers.push({ from: "k", to: "sc", amount: kotakSurplus });
      kotakSurplus = 0;
    }

    setTransferDetails({
      transfers,
      // ✅ store BOTH for result page (before/after)
      beforeBalances: { ...Object.fromEntries(bankAccounts.map((k) => [k, Number(currentBalances?.[k] || 0)])) },
      finalSettlements: Object.fromEntries(bankAccounts.map((k) => [k, Number(current[k] || 0)])),
    });
  };




  const handleSubmit = () => {
    if (!previousTotalBalance || !monthlyTasks || !currentBalances || !transferDetails) {
      alert("Please complete all fields before submitting.");
      return;
    }

    // 🧮 Calculate checklist and SC expenses
    const checklistExpenses = monthlyTasks
      .filter((task) => !task.done)
      .reduce((sum, task) => sum + (task.amount || 0), 0);

    const scTotal = expenses.scExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalExpenses = checklistExpenses + scTotal;

    const rawCurrentTotal = Object.values(currentBalances).reduce((sum, val) => sum + (val || 0), 0);
    const netAfterExpenses = rawCurrentTotal - totalExpenses;

    const currentFinalTotal = Object.values(transferDetails?.finalSettlements || {}).reduce(
      (sum, val) => sum + (val || 0),
      0
    );
    const finalAfterExpenses = currentFinalTotal - totalExpenses;

    const savingsOrLoss = finalAfterExpenses - (previousTotalBalance || 0);

    // 🧾 Build payload
    const payload = {
      month: moment().format("MMM YYYY"),
      previousTotalBalance,
      currentBalances,
      expenses: {
        regularExpenses: monthlyTasks, // 👈 now sourced from checklist
        scExpenses: expenses.scExpenses,
      },
      income,
      budgetLimit,
      monthlyTasks,
      bankBaseBalances,
      transferDetails,
      totals: {
        savingsOrLoss,
        totalExpenses,
        rawCurrentTotal,
        currentFinalTotal,
        finalAfterExpenses,
      },
    };

    const updatedHistory = [...history, payload];
    setHistory(updatedHistory);
    localStorage.setItem("expenseHistory", JSON.stringify(updatedHistory));

    localStorage.setItem(
      "expenseTrackerData",
      JSON.stringify({
        ...getCurrentStorage(),
        previousTotalBalance,
        monthlyTasks,
        budgetLimit,
        bankBaseBalances,
      })
    );

    // ✅ Go to result page with payload
    const encodedData = encodeURIComponent(JSON.stringify(payload));
    router.push(`/result?data=${encodedData}`);
  };


  const handleLocalImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const json = JSON.parse(e.target.result);
      localStorage.setItem("expenseTrackerData", JSON.stringify(json.data));
      localStorage.setItem("expenseHistory", JSON.stringify(json.history));
      window.location.reload();
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const data = localStorage.getItem("expenseTrackerData") || "{}";
    const history = localStorage.getItem("expenseHistory") || "[]";
    const blob = new Blob([JSON.stringify({ data: JSON.parse(data), history: JSON.parse(history) }, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `expense_backup_${moment().format("YYYY_MM_DD_HH_mm")}.json`;
    link.click();
  };


  const saveHistoryToStorage = (updated) => {
    setHistory(updated);
    localStorage.setItem("expenseHistory", JSON.stringify(updated));
  };

  const handleViewMonth = (entry) => {
    const encoded = encodeURIComponent(JSON.stringify(entry));
    router.push(`/result?data=${encoded}`);
  };

  const handleDeleteMonth = (entry) => {
    const confirmDelete = window.confirm(`Delete ${entry.month}?`);
    if (!confirmDelete) return;

    const key = entry.monthKey || entry.month;
    const updated = history.filter((h) => (h.monthKey || h.month) !== key);
    saveHistoryToStorage(updated);
  };

  const handleClearAllHistory = () => {
    const confirmClear = window.confirm("Clear ALL saved months?");
    if (!confirmClear) return;
    saveHistoryToStorage([]);
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">💰 Advanced Expense Tracker</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => fileInputRef.current?.click()}
          >
            📥 Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleLocalImport}
          />
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={handleExport}
          >
            📤 Export
          </button>
        </div>
      </div>
      <HistoryList
        history={history}
        onView={handleViewMonth}
        onDelete={handleDeleteMonth}
        onClear={handleClearAllHistory}
      />

      <IncomeEntry onIncomeSubmit={setIncome} />
      <BudgetAlert budgetLimit={budgetLimit} setBudgetLimit={setBudgetLimit} expenses={expenses} />
      <ExpenseCategoryChart expenses={expenses} />
      <MonthlyChecklist tasks={monthlyTasks} setTasks={setMonthlyTasks} expenses={expenses} />
      <TrendChart history={history} />
      <ExpenseDeduction
        expenses={expenses}
        onExpensesSubmit={(v) =>
          setExpenses((prev) => ({ ...prev, ...v }))
        }
      />

      <h2 className="text-xl font-semibold mb-2 mt-6">Enter Previous Month's Total Balance</h2>
      <input
        type="number"
        value={previousTotalBalance ?? ""}
        onChange={(e) => setPreviousTotalBalance(+e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Enter previous month's total balance"
      />

      {/* <h2 className="text-xl font-semibold mb-2">Base Bank Balances (For Settlement)</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {Object.entries(bankBaseBalances).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <label className="w-8 font-semibold">{key}</label>
            <input
              type="number"
              value={val}
              onChange={(e) => handleBaseBalanceChange(key, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
          </div>
        ))}
      </div> */}

      <div className="p-4">
        <BaseBankEditor
          bankAccounts={bankAccounts}
          setBankAccounts={setBankAccounts}
          bankBaseBalances={bankBaseBalances}
          onUpdate={(updated) => {
            setBankBaseBalances(updated);

            const current = JSON.parse(localStorage.getItem("expenseTrackerData") || "{}");
            localStorage.setItem(
              "expenseTrackerData",
              JSON.stringify({ ...current, bankBaseBalances: updated })
            );
          }}
        />

      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="checkbox"
          checked={rentPaidFromS}
          onChange={(e) => setRentPaidFromS(e.target.checked)}
          id="rentPaid"
        />
        <label htmlFor="rentPaid" className="text-gray-700">I have already paid the rent from State Bank</label>
      </div>

      <BalanceEntry bankAccounts={bankAccounts} onBalanceSubmit={setCurrentBalances} />

      <button onClick={calculateTransfers} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">
        Calculate Transfers
      </button>

      {transferDetails && (
        <div className="bg-gray-100 p-4 mt-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Suggested Transfers</h2>
          {transferDetails?.transfers?.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-800">Transfer Suggestions:</p>
              {transferDetails.transfers.map((t, index) => (
                <p key={index}>
                  • Transfer ₹{t.amount} from {t.from.toUpperCase()} to {t.to.toUpperCase()}
                </p>
              ))}
            </div>
          )}
          {transferDetails?.finalSettlements && (
            <ul className="mt-2 text-sm text-gray-700">
              {Object.entries(transferDetails.finalSettlements).map(([bank, val]) => (
                <li key={bank}>{bank.toUpperCase()} Balance: ₹{val}</li>
              ))}
            </ul>
          )}
        </div>
      )}


      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded shadow-md hover:bg-green-700"
      >
        ✅ Submit and View Results
      </button>
    </div>
  );
}
