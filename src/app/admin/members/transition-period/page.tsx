"use client";

import { useEffect, useState, ChangeEvent } from "react";

/* =======================
   TYPES
======================= */

interface Member {
    id: number;
    name: string;
}

interface TransitionPeriod {
    id: number;
    name?: string | null;
    start_date: number;
    end_date: number;
    member?: Member;
    created_at?: string;
    updated_at?: string;
}

interface TransitionPeriodForm {
    id: number | null;
    name: string;
    start_date: number | null;
    end_date: number | null;
}

/* =======================
   YEAR PICKER COMPONENT
======================= */

interface YearPickerProps {
    value: string;
    onChange: (year: string) => void;
    label: string;
    required?: boolean;
}

function YearPicker({ value, onChange, label, required = false }: YearPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const endYear = currentYear + 10;

    const selectedYear = value ? Number(value) : null;

    const years = [];
    for (let year = endYear; year >= startYear; year--) {
        years.push(year);
    }

    const handleYearSelect = (year: number) => {
        onChange(`${year}`);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border border-gray-300 p-2 bg-white cursor-pointer rounded hover:border-blue-400 flex justify-between items-center"
            >
                <span className={selectedYear ? "text-gray-900" : "text-gray-400"}>
                    {selectedYear || "Select Year"}
                </span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-64 overflow-y-auto">
                        {!required && selectedYear && (
                            <div
                                onClick={handleClear}
                                className="px-4 py-2 hover:bg-red-50 cursor-pointer text-red-600 border-b"
                            >
                                Clear Selection
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-1 p-2">
                            {years.map((year) => (
                                <button
                                    key={year}
                                    type="button"
                                    onClick={() => handleYearSelect(year)}
                                    className={`p-2 text-center rounded transition-colors ${year === selectedYear
                                        ? "bg-blue-500 text-white font-bold"
                                        : year === currentYear
                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

/* =======================
   CONFIG
======================= */

const API_URL = "http://localhost:8000/api/transition-periods";

/* =======================
   PAGE
======================= */

export default function TransitionPeriodsPage() {
    const [transitionPeriods, setTransitionPeriods] = useState<TransitionPeriod[]>([]);
    const [form, setForm] = useState<TransitionPeriodForm>({
        id: null,
        name: "",
        start_date: null,
        end_date: null,
    });

    const isEditing: boolean = form.id !== null;

    /* =======================
       FETCH DATA
    ======================= */

    useEffect(() => {
        fetchTransitionPeriods();
    }, []);

    const fetchTransitionPeriods = async (): Promise<void> => {
        const res = await fetch(API_URL);
        const data: TransitionPeriod[] = await res.json();
        setTransitionPeriods(data);
    };

    /* =======================
       FORM HANDLERS
    ======================= */

    const handleChange = (
        e: ChangeEvent<HTMLInputElement>
    ): void => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleYearChange = (field: "start_date" | "end_date", value: string): void => {
        setForm((prev) => ({
            ...prev,
            [field]: value ? parseInt(value) : "",
        }));
    };

    const resetForm = (): void => {
        setForm({
            id: null,
            name: "",
            start_date: null,
            end_date: null,
        });
    };

    /* =======================
       CREATE / UPDATE
    ======================= */

    const handleSubmit = async (): Promise<void> => {
        if (!form.start_date) {
            alert("Please fill in start date");
            return;
        }

        const url: string = isEditing
            ? `${API_URL}/${form.id}`
            : API_URL;

        const method: "POST" | "PUT" = isEditing ? "PUT" : "POST";

        const payload = {
            name: form.name || null,
            start_date: form.start_date,
            end_date: form.end_date || null,
        };

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            alert("Request failed");
            return;
        }

        const response: {
            data: TransitionPeriod;
            message?: string;
        } = await res.json();

        if (isEditing) {
            setTransitionPeriods((prev) =>
                prev.map((item) =>
                    item.id === form.id ? response.data : item
                )
            );
        } else {
            setTransitionPeriods((prev) => [response.data, ...prev]);
        }

        resetForm();
    };

    /* =======================
       EDIT
    ======================= */

    const handleEdit = (item: TransitionPeriod): void => {
        setForm({
            id: item.id,
            name: item.name ?? "",
            start_date: item.start_date,
            end_date: item.end_date ?? "",
        });
    };

    /* =======================
       DELETE
    ======================= */

    const handleDelete = async (id: number): Promise<void> => {
        if (!confirm("Delete this transition period?")) return;

        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"

        });

        setTransitionPeriods((prev) =>
            prev.filter((item) => item.id !== id)
        );
    };

    /* =======================
       DISPLAY HELPERS
    ======================= */

    const formatYear = (dateValue: string | number | null): string => {
        if (!dateValue) return "Active";
        return dateValue.toString();
    };

    /* =======================
       UI
    ======================= */

    return (
        <div className="flex gap-6 p-6 font-sans bg-gray-50 min-h-screen">
            {/* LEFT TABLE */}
            <div className="w-2/3">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Transition Periods
                </h2>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-3 text-left font-semibold text-gray-700">Name</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Start Year</th>
                                <th className="p-3 text-left font-semibold text-gray-700">End Year</th>
                                <th className="p-3 text-left font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transitionPeriods.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{item.name || "—"}</td>
                                    <td className="p-3">{item.start_date || "Active"}</td>
                                    <td className="p-3">{item.end_date || "Active"}</td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {transitionPeriods.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RIGHT FORM */}
            <div className="w-1/3">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {isEditing
                        ? "Edit Transition Period"
                        : "Create Transition Period"}
                </h2>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Transition Period Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter period name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <YearPicker
                            label="Start Year"
                            value={form.start_date}
                            onChange={(year) => handleYearChange("start_date", year)}
                            required
                        />

                        <YearPicker
                            label="End Year"
                            value={form.end_date}
                            onChange={(year) => handleYearChange("end_date", year)}
                        />

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
                            >
                                {isEditing ? "Update" : "Create"}
                            </button>

                            {isEditing && (
                                <button
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}