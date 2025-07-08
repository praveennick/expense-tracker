"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseCategoryChart({ expenses }) {
    const data = useMemo(() => {
        const regular = expenses.regularExpenses || [];
        const sc = expenses.scExpenses || [];

        const categoryMap = {};

        [...regular, ...sc].forEach((exp) => {
            if (!exp.name) return;
            const name = exp.name.trim().toLowerCase();
            categoryMap[name] = (categoryMap[name] || 0) + exp.amount;
        });

        const labels = Object.keys(categoryMap).map((label) =>
            label.charAt(0).toUpperCase() + label.slice(1)
        );
        const values = Object.values(categoryMap);

        return {
            labels,
            datasets: [
                {
                    label: "Expense Breakdown",
                    data: values,
                    borderWidth: 1,
                },
            ],
        };
    }, [expenses]);

    if (!data || data.labels.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-semibold text-center">Expense Categories</h2>
                <p className="text-gray-500 text-center mt-2">No data to show</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold text-center mb-4">Expense Categories</h2>
            <Pie data={data} />
        </div>
    );
}
