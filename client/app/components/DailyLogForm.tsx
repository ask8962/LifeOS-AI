"use client";

import { useState } from "react";
import api from "../lib/api";
import { Loader2, Moon, Book, Battery, Smile } from "lucide-react";

export default function DailyLogForm() {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        sleepHours: "",
        studyHours: "",
        mood: "neutral",
        energyLevel: "medium",
        notes: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            await api.post("/logs", {
                ...formData,
                sleepHours: Number(formData.sleepHours),
                studyHours: Number(formData.studyHours)
            });
            setMessage({ type: 'success', text: 'Daily log saved successfully!' });
        } catch (error) {
            console.error("Error saving log", error);
            setMessage({ type: 'error', text: 'Failed to save daily log.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                {/* Sleep Hours */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Moon className="h-4 w-4 text-indigo-500" />
                        Sleep Hours
                    </label>
                    <input
                        type="number"
                        step="0.5"
                        required
                        value={formData.sleepHours}
                        onChange={(e) => setFormData({ ...formData, sleepHours: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* Study Hours */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Book className="h-4 w-4 text-indigo-500" />
                        Study Hours
                    </label>
                    <input
                        type="number"
                        step="0.5"
                        required
                        value={formData.studyHours}
                        onChange={(e) => setFormData({ ...formData, studyHours: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* Energy Level */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Battery className="h-4 w-4 text-green-500" />
                        Energy Level
                    </label>
                    <select
                        value={formData.energyLevel}
                        onChange={(e) => setFormData({ ...formData, energyLevel: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="high">High ⚡</option>
                        <option value="medium">Medium 😐</option>
                        <option value="low">Low 🔋</option>
                    </select>
                </div>

                {/* Mood */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Smile className="h-4 w-4 text-yellow-500" />
                        Mood
                    </label>
                    <select
                        value={formData.mood}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="great">Great 🤩</option>
                        <option value="good">Good 🙂</option>
                        <option value="neutral">Neutral 😐</option>
                        <option value="bad">Bad 🙁</option>
                        <option value="terrible">Terrible 😫</option>
                    </select>
                </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Daily Notes</label>
                <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    placeholder="What went well? What distracted you?"
                />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
                {message && (
                    <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message.text}
                    </span>
                )}
                <button
                    type="submit"
                    disabled={submitting}
                    className="ml-auto rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Log
                </button>
            </div>
        </form>
    );
}
