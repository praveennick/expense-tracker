"use client";

import moment from "moment";

export default function HistoryList({ history = [], onView, onDelete, onClear }) {
    if (!history?.length) return null;

    // Sort latest first (by monthKey if exists else by month text)
    const sorted = [...history].sort((a, b) => {
        const ak = a.monthKey || moment(a.month, "MMM YYYY").format("YYYY-MM");
        const bk = b.monthKey || moment(b.month, "MMM YYYY").format("YYYY-MM");
        return bk.localeCompare(ak);
    });

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">🗓️ Saved Months</h2>
                <button
                    onClick={onClear}
                    className="text-red-600 font-semibold hover:underline"
                    title="Clear all history"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-2">
                {sorted.map((item, idx) => (
                    <div
                        key={item.id || item.monthKey || item.month || idx}
                        className="flex items-center justify-between border rounded p-3 bg-gray-50"
                    >
                        <div>
                            <p className="font-semibold">{item.month || "Unknown Month"}</p>
                            <p className="text-xs text-gray-500">
                                {item.createdAt ? `Saved: ${moment(item.createdAt).format("DD MMM YYYY, hh:mm A")}` : ""}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => onView(item)}
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            >
                                View
                            </button>
                            <button
                                onClick={() => onDelete(item)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
