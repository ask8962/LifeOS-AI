"use client";

import { useState, useEffect } from "react";
import { Loader2, Lightbulb, AlertTriangle, TrendingUp, Eye } from "lucide-react";
import api from "../lib/api";

interface Insight {
    type: 'observation' | 'suggestion' | 'warning' | 'prediction';
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high';
}

const iconMap = {
    observation: Eye,
    suggestion: Lightbulb,
    warning: AlertTriangle,
    prediction: TrendingUp
};

const colorMap = {
    observation: { bg: 'bg-blue-50', text: 'text-blue-900', icon: 'text-blue-500' },
    suggestion: { bg: 'bg-indigo-50', text: 'text-indigo-900', icon: 'text-indigo-500' },
    warning: { bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-500' },
    prediction: { bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-500' }
};

export default function InsightsCard() {
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            const res = await api.get("/insights");
            setInsights(res.data.insights || []);
        } catch (error) {
            console.error("Error fetching insights", error);
            // Set default insights on error
            setInsights([
                {
                    type: 'suggestion',
                    title: 'Start Logging',
                    content: 'Log your daily tasks and metrics to unlock AI insights.',
                    priority: 'medium'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-48 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (insights.length === 0) {
        return (
            <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-gray-500">
                <p className="text-sm">Not enough data to generate insights.</p>
                <p className="mt-1 text-xs">Keep using LifeOS to unlock predictions.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 p-4">
            {insights.slice(0, 3).map((insight, idx) => {
                const Icon = iconMap[insight.type];
                const colors = colorMap[insight.type];

                return (
                    <div key={idx} className={`rounded-lg ${colors.bg} p-3`}>
                        <div className="flex items-start gap-2">
                            <Icon className={`h-4 w-4 mt-0.5 ${colors.icon}`} />
                            <div>
                                <p className={`text-sm font-medium ${colors.text}`}>{insight.title}</p>
                                <p className={`mt-1 text-xs ${colors.text} opacity-80`}>{insight.content}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
