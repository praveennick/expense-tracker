// components/ExpenseDeduction.js
import { useState } from 'react';

export default function ExpenseDeduction({ onExpensesSubmit }) {
    const [regularExpenses, setRegularExpenses] = useState([{ name: '', amount: 0 }]);
    const [scExpenses, setScExpenses] = useState([{ name: '', amount: 0 }]);

    const handleRegularExpenseChange = (index, field, value) => {
        const updatedExpenses = [...regularExpenses];
        updatedExpenses[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
        setRegularExpenses(updatedExpenses);
    };

    const handleScExpenseChange = (index, field, value) => {
        const updatedExpenses = [...scExpenses];
        updatedExpenses[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
        setScExpenses(updatedExpenses);
    };

    const addRegularExpense = () => {
        setRegularExpenses([...regularExpenses, { name: '', amount: 0 }]);
    };

    const addScExpense = () => {
        setScExpenses([...scExpenses, { name: '', amount: 0 }]);
    };

    const handleSubmit = () => {
        onExpensesSubmit({ regularExpenses, scExpenses });
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Enter Expenses</h2>

            <div className="mb-4">
                <h3 className="font-semibold">Regular Expenses (e.g., Rent, Power, etc.)</h3>
                {regularExpenses.map((expense, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                        <input
                            type="text"
                            placeholder="Expense Name"
                            value={expense.name}
                            onChange={(e) => handleRegularExpenseChange(index, 'name', e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={expense.amount}
                            onChange={(e) => handleRegularExpenseChange(index, 'amount', e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}
                <button onClick={addRegularExpense} className="text-blue-500">+ Add Expense</button>
            </div>

            <div className="mb-4">
                <h3 className="font-semibold">SC Expenses (e.g., Gold Loan, Other)</h3>
                {scExpenses.map((expense, index) => (
                    <div key={index} className="flex gap-4 mb-2">
                        <input
                            type="text"
                            placeholder="Expense Name"
                            value={expense.name}
                            onChange={(e) => handleScExpenseChange(index, 'name', e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={expense.amount}
                            onChange={(e) => handleScExpenseChange(index, 'amount', e.target.value)}
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded"
                        />
                    </div>
                ))}
                <button onClick={addScExpense} className="text-blue-500">+ Add Expense</button>
            </div>

            <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Submit Expenses
            </button>
        </div>
    );
}
