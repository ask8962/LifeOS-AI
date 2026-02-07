"use client";

import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Clock, Zap, Target } from "lucide-react";
import api from "../lib/api";
import TaskList from "../components/TaskList";
import InsightsCard from "../components/InsightsCard";
import ProductivityChart from "../components/ProductivityChart";

interface TodayStats {
    productivityScore: number;
    tasksCompleted: number;
    totalTasks: number;
    focusHours: number;
    mood: string | null;
    energyLevel: string | null;
    nextPriorityTask: {
        title: string;
        duration: number;
        scheduledFor: string;
    } | null;
}

interface WeeklyAnalytics {
    averageProductivity: number;
    totalTasksCompleted: number;
    totalFocusHours: number;
    consistencyScore: number;
    burnoutRisk: 'low' | 'medium' | 'high';
    dailyBreakdown: any[];
}

export default function DashboardPage() {
    const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
    const [weeklyData, setWeeklyData] = useState<WeeklyAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [todayRes, weeklyRes] = await Promise.all([
                api.get("/analytics/today"),
                api.get("/analytics/weekly")
            ]);
            setTodayStats(todayRes.data);
            setWeeklyData(weeklyRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const getEnergyEmoji = (level: string | null) => {
        if (level === 'high') return '⚡';
        if (level === 'medium') return '😐';
        if (level === 'low') return '🔋';
        return '?';
    };

    const getBurnoutColor = (risk: string) => {
        if (risk === 'high') return 'text-red-600';
        if (risk === 'medium') return 'text-orange-600';
        return 'text-green-600';
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Good Morning</h2>
                <p className="text-sm text-gray-500">Here's your behavioral overview for today.</p>
            </div>

            {/* Top Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Productivity Score */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Productivity Score</h3>
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">
                            {todayStats?.productivityScore ?? '--'}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">/ 100</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        {todayStats?.tasksCompleted ?? 0}/{todayStats?.totalTasks ?? 0} tasks completed
                    </p>
                </div>

                {/* Focus Hours */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Focus Hours</h3>
                        <Clock className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">
                            {todayStats?.focusHours ?? '--'}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">hrs</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
                        <div
                            className="h-1.5 rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${Math.min((todayStats?.focusHours || 0) / 6 * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Energy Level */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Energy Level</h3>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-2xl">{getEnergyEmoji(todayStats?.energyLevel ?? null)}</span>
                        <span className="capitalize text-gray-700">
                            {todayStats?.energyLevel || 'No entry'}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        Mood: {todayStats?.mood || 'Not logged'}
                    </p>
                </div>

                {/* Next Priority */}
                <div className="rounded-xl border border-indigo-50 bg-indigo-50/50 p-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-indigo-600" />
                        <h3 className="text-sm font-medium text-indigo-900">Next Priority</h3>
                    </div>
                    <p className="mt-2 text-lg font-bold text-indigo-700 truncate">
                        {todayStats?.nextPriorityTask?.title || 'No tasks'}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600">
                        <span className="rounded-md bg-indigo-100 px-2 py-1">
                            {todayStats?.nextPriorityTask?.duration
                                ? `${todayStats.nextPriorityTask.duration}m`
                                : '--'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Weekly Stats Bar */}
            {weeklyData && (
                <div className="flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Weekly Avg:</span>
                        <span className="font-semibold text-gray-900">{weeklyData.averageProductivity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Tasks Done:</span>
                        <span className="font-semibold text-gray-900">{weeklyData.totalTasksCompleted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Focus:</span>
                        <span className="font-semibold text-gray-900">{weeklyData.totalFocusHours}h</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Consistency:</span>
                        <span className="font-semibold text-gray-900">{weeklyData.consistencyScore}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Burnout Risk:</span>
                        <span className={`font-semibold capitalize ${getBurnoutColor(weeklyData.burnoutRisk)}`}>
                            {weeklyData.burnoutRisk}
                        </span>
                    </div>
                </div>
            )}

            {/* Charts and Tasks Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Productivity Chart */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Weekly Productivity</h3>
                    </div>
                    <div className="p-4">
                        {weeklyData?.dailyBreakdown ? (
                            <ProductivityChart data={weeklyData.dailyBreakdown} />
                        ) : (
                            <div className="flex h-64 items-center justify-center text-gray-400">
                                No data available
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Insights */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">✨</span>
                            <h3 className="font-semibold text-gray-900">AI Insights</h3>
                        </div>
                    </div>
                    <InsightsCard />
                </div>
            </div>

            {/* Tasks Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h3 className="font-semibold text-gray-900">Today's Tasks</h3>
                </div>
                <div className="p-6">
                    <TaskList />
                </div>
            </div>
        </div>
    );
}
