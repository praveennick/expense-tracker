"use client";

import { useEffect, useState } from "react";

export default function MonthlyChecklist({ tasks, setTasks, expenses }) {
    const [localTasks, setLocalTasks] = useState([]);

    // Initialize tasks from localStorage or expenses
    useEffect(() => {
        if (tasks?.length > 0) {
            setLocalTasks(tasks);
        } else if (expenses?.regularExpenses?.length > 0) {
            const mapped = expenses.regularExpenses.map((e) => ({
                name: e.name,
                amount: e.amount,
                done: false,
            }));
            setLocalTasks(mapped);
            setTasks(mapped);
        }
    }, [tasks, expenses]);

    // Sync to parent
    useEffect(() => {
        setTasks(localTasks);
    }, [localTasks]);

    const toggleTask = (index) => {
        const updated = [...localTasks];
        updated[index].done = !updated[index].done;
        setLocalTasks(updated);
    };

    const handleChange = (index, field, value) => {
        const updated = [...localTasks];
        if (field === "amount") {
            updated[index][field] = parseFloat(value) || 0;
        } else {
            updated[index][field] = value;
        }
        setLocalTasks(updated);
    };

    const addTask = () => {
        setLocalTasks([...localTasks, { name: "", amount: 0, done: false }]);
    };

    const removeTask = (index) => {
        const updated = [...localTasks];
        updated.splice(index, 1);
        setLocalTasks(updated);
    };

    return (
        <div className="bg-white shadow-md p-4 rounded-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">📋 Monthly Checklist</h2>
            {localTasks.map((task, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                    <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(index)}
                        className="col-span-1 w-5 h-5"
                    />
                    <input
                        type="text"
                        value={task.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        placeholder="Task (e.g. Rent)"
                        className="col-span-6 px-3 py-1 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        value={task.amount}
                        onChange={(e) => handleChange(index, "amount", e.target.value)}
                        placeholder="₹ Amount"
                        className="col-span-4 px-3 py-1 border border-gray-300 rounded"
                    />
                    <button
                        className="col-span-1 text-red-500 font-bold px-2"
                        onClick={() => removeTask(index)}
                        title="Remove"
                    >
                        ×
                    </button>
                </div>
            ))}
            <button onClick={addTask} className="text-blue-500 mt-2">
                + Add New Task
            </button>
        </div>
    );
}
