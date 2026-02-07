"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Calendar, Battery, Brain } from "lucide-react";
import api from "../../lib/api";
import ProductivityChart from "../../components/ProductivityChart";

interface WeeklyAnalytics {
    startDate: string;
    endDate: string;
    averageProductivity: number;
    totalTasksCompleted: number;
    totalFocusHours: number;
    consistencyScore: number;
    burnoutRisk: 'low' | 'medium' | 'high';
    dailyBreakdown: any[];
    moodTrend: { mood: string; count: number }[];
    energyTrend: { energy: string; count: number }[];
}

const moodEmojis: Record<string, string> = {
    great: '🤩',
    good: '🙂',
    neutral: '😐',
    bad: '🙁',
    terrible: '😫'
};

const energyEmojis: Record<string, string> = {
    high: '⚡',
    medium: '🔋',
    low: '📉'
};

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<WeeklyAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get("/analytics/weekly");
            setAnalytics(res.data);
        } catch (error) {
            console.error("Error fetching analytics", error);
        } finally {
            setLoading(false);
        }
    };

    const getBurnoutStyles = (risk: string) => {
        if (risk === 'high') return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
        if (risk === 'medium') return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="flex h-96 flex-col items-center justify-center text-gray-500">
                <p>Unable to load analytics.</p>
                <p className="text-sm text-gray-400 mt-2">Please make sure the server is running.</p>
            </div>
        );
    }

    const burnoutStyles = getBurnoutStyles(analytics.burnoutRisk);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Analytics</h2>
                <p className="text-sm text-gray-500">
                    {analytics.startDate} — {analytics.endDate}
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">Avg Productivity</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.averageProductivity}%</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">Tasks Completed</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.totalTasksCompleted}</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Battery className="h-4 w-4" />
                        <span className="text-sm font-medium">Focus Hours</span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{analytics.totalFocusHours}h</p>
                </div>

                <div className={`rounded-xl border ${burnoutStyles.border} ${burnoutStyles.bg} p-6 shadow-sm`}>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Brain className="h-4 w-4" />
                        <span className="text-sm font-medium">Burnout Risk</span>
                    </div>
                    <p className={`mt-2 text-3xl font-bold capitalize ${burnoutStyles.text}`}>
                        {analytics.burnoutRisk}
                    </p>
                </div>
            </div>

            {/* Productivity Chart */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">7-Day Productivity Trend</h3>
                </div>
                <div className="p-6">
                    <ProductivityChart data={analytics.dailyBreakdown} />
                </div>
            </div>

            {/* Mood & Energy Trends */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Mood Trend */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Mood Distribution</h3>
                    </div>
                    <div className="p-6">
                        {analytics.moodTrend.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {analytics.moodTrend.map(({ mood, count }) => (
                                    <div key={mood} className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                                        <span className="text-xl">{moodEmojis[mood] || '😶'}</span>
                                        <div>
                                            <p className="text-sm font-medium capitalize text-gray-900">{mood}</p>
                                            <p className="text-xs text-gray-500">{count} day{count > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No mood data logged this week.</p>
                        )}
                    </div>
                </div>

                {/* Energy Trend */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Energy Distribution</h3>
                    </div>
                    <div className="p-6">
                        {analytics.energyTrend.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {analytics.energyTrend.map(({ energy, count }) => (
                                    <div key={energy} className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                                        <span className="text-xl">{energyEmojis[energy] || '⚡'}</span>
                                        <div>
                                            <p className="text-sm font-medium capitalize text-gray-900">{energy}</p>
                                            <p className="text-xs text-gray-500">{count} day{count > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No energy data logged this week.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Consistency Score */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900">Consistency Score</h3>
                        <p className="text-sm text-gray-500">How regularly you've been logging data</p>
                    </div>
                    <span className="text-3xl font-bold text-indigo-600">{analytics.consistencyScore}%</span>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-gray-100">
                    <div
                        className="h-2 rounded-full bg-indigo-600 transition-all"
                        style={{ width: `${analytics.consistencyScore}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
