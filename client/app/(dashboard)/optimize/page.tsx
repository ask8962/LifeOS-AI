"use client";

import { useState, useEffect } from "react";
import { Loader2, Zap, Moon, AlertTriangle, Target, Clock, Heart, CheckCircle } from "lucide-react";
import api from "../../lib/api";

interface Recommendation {
    type: 'schedule' | 'habit' | 'recovery' | 'focus';
    priority: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    action?: string;
}

interface OptimizationData {
    recommendations: Recommendation[];
    optimalFocusTime: string;
    suggestedSleepTarget: number;
    riskFactors: string[];
}

const iconMap = {
    schedule: Clock,
    habit: Heart,
    recovery: Moon,
    focus: Target
};

const priorityStyles = {
    high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
    medium: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700' },
    low: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' }
};

export default function OptimizePage() {
    const [data, setData] = useState<OptimizationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOptimizations();
    }, []);

    const fetchOptimizations = async () => {
        try {
            const res = await api.get("/optimize");
            setData(res.data);
        } catch (error) {
            console.error("Error fetching optimizations", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex h-96 flex-col items-center justify-center text-gray-500">
                <p>Unable to load recommendations.</p>
                <p className="text-sm text-gray-400 mt-2">Please ensure the server is running.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Optimize</h2>
                <p className="text-sm text-gray-500">Personalized recommendations based on your patterns.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Zap className="h-5 w-5" />
                        <span className="font-medium">Optimal Focus Time</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{data.optimalFocusTime}</p>
                </div>

                <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-600">
                        <Moon className="h-5 w-5" />
                        <span className="font-medium">Sleep Target</span>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{data.suggestedSleepTarget} hours/night</p>
                </div>
            </div>

            {/* Risk Factors */}
            {data.riskFactors.length > 0 && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-700">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Risk Factors Detected</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                        {data.riskFactors.map((risk, idx) => (
                            <li key={idx} className="text-sm text-orange-600">• {risk}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Recommendations */}
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Recommendations</h3>

                {data.recommendations.map((rec, idx) => {
                    const Icon = iconMap[rec.type];
                    const styles = priorityStyles[rec.priority];

                    return (
                        <div key={idx} className={`rounded-xl border ${styles.border} ${styles.bg} p-5 shadow-sm`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-white p-2 shadow-sm">
                                        <Icon className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles.badge}`}>
                                                {rec.priority}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">{rec.description}</p>
                                    </div>
                                </div>
                            </div>

                            {rec.action && (
                                <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2">
                                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm font-medium text-gray-700">{rec.action}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
