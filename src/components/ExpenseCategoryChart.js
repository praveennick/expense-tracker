"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

// Simple palette (extend if you like)
const PALETTE = [
    "#3b82f6", "#22c55e", "#ef4444", "#f59e0b", "#8b5cf6",
    "#06b6d4", "#e11d48", "#10b981", "#a855f7", "#f97316",
    "#14b8a6", "#0ea5e9", "#84cc16", "#f43f5e", "#fde047",
];

export default function ExpenseCategoryChart({ expenses }) {
    const { data, hasData } = useMemo(() => {
        const regular = expenses?.regularExpenses || [];
        const sc = expenses?.scExpenses || [];

        const categoryMap = {};

        [...regular, ...sc].forEach((exp) => {
            if (!exp?.name) return;
            const key = String(exp.name).trim().toLowerCase();
            const amt = Number(exp.amount || 0);
            if (!amt) return;
            categoryMap[key] = (categoryMap[key] || 0) + amt;
        });

        const labels = Object.keys(categoryMap).map(
            (l) => l.charAt(0).toUpperCase() + l.slice(1)
        );
        const values = Object.values(categoryMap);

        // map colors deterministically to labels
        const backgroundColor = labels.map((_, i) => PALETTE[i % PALETTE.length]);
        const borderColor = backgroundColor.map((c) => c);

        return {
            data: {
                labels,
                datasets: [
                    {
                        label: "Expense Breakdown",
                        data: values,
                        backgroundColor,
                        borderColor,
                        borderWidth: 1,
                    },
                ],
            },
            hasData: labels.length > 0,
        };
    }, [expenses]);

    if (!hasData) {
        return (
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <h2 className="text-lg font-semibold text-center">Expense Categories</h2>
                <p className="text-gray-500 text-center mt-2">No data to show</p>
            </div>
        );
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false, // let the parent control height
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const label = ctx.label || "";
                        const value = Number(ctx.parsed) || 0;
                        return `${label}: ₹${value.toLocaleString("en-IN")}`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h2 className="text-lg font-semibold text-center mb-4">Expense Categories</h2>
            {/* fixed height keeps it from growing huge, width stays responsive */}
            <div className="h-80">
                <Pie data={data} options={options} />
            </div>
        </div>
    );
}
