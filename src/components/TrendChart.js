"use client";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function TrendChart({ history }) {
    const chartData = useMemo(() => {
        const labels = history.map((entry) => entry.month);
        const savings = history.map((entry) => entry.savingsOrLoss);
        const expenses = history.map((entry) => entry.totalExpenses);
        const income = history.map((entry) => entry.income?.total || 0);

        return {
            labels,
            datasets: [
                {
                    label: "Savings / Loss (₹)",
                    data: savings,
                    fill: false,
                    borderColor: "#22c55e",
                    backgroundColor: "#22c55e",
                    tension: 0.3,
                },
                {
                    label: "Total Expenses (₹)",
                    data: expenses,
                    borderColor: "#ef4444",
                    backgroundColor: "#ef4444",
                    tension: 0.3,
                },
                {
                    label: "Total Income (₹)",
                    data: income,
                    borderColor: "#3b82f6",
                    backgroundColor: "#3b82f6",
                    tension: 0.3,
                },
            ],
        };
    }, [history]);

    if (!history || history.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-center">Monthly Trends</h2>
                <p className="text-gray-500 text-center mt-2">No history to show yet</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-center mb-4">📈 Monthly Trends</h2>
            <Line data={chartData} />
        </div>
    );
}
