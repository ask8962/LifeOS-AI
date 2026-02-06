export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Good Morning, Guest</h2>
                <p className="text-sm text-gray-500">Here's your behavioral overview for today.</p>
            </div>

            {/* Top Stats Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Productivity Score */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Productivity Score</h3>
                        <span className="text-xs font-medium text-green-600">+12%</span>
                    </div>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">84</span>
                        <span className="ml-1 text-sm text-gray-500">/ 100</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Based on task velocity</p>
                </div>

                {/* Focus Hours */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Focus Hours</h3>
                        <span className="text-xs font-medium text-indigo-600">Target: 6h</span>
                    </div>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">3.5</span>
                        <span className="ml-1 text-sm text-gray-500">hrs</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
                        <div className="h-1.5 w-[58%] rounded-full bg-indigo-600"></div>
                    </div>
                </div>

                {/* Mood/Energy */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Energy Level</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-2xl">⚡ High</span>
                    </div>
                    <p className="mt-1 text-xs text-green-600">Peak performance window</p>
                </div>

                {/* Next Priority */}
                <div className="rounded-xl border border-indigo-50 bg-indigo-50/50 p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-indigo-900">Next Priority</h3>
                    <p className="mt-2 text-lg font-bold text-indigo-700">System Architecture</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600">
                        <span className="rounded-md bg-indigo-100 px-2 py-1">Due 2:00 PM</span>
                        <span>Est. 45m</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Today's Tasks (Left 2 cols) */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Today's Tasks</h3>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View All
                        </button>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded border border-gray-300"></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Complete Phase {i} Documentation</p>
                                        <p className="text-xs text-gray-500">Development • High Priority</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* AI Insights (Right col) */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">✨</span>
                            <h3 className="font-semibold text-gray-900">AI Insights</h3>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="rounded-lg bg-indigo-50 p-3">
                                <p className="text-sm text-indigo-900">
                                    <span className="font-semibold">Observation:</span> Your focus tends to drop after 3 PM.
                                </p>
                                <p className="mt-2 text-xs text-indigo-700">
                                    Suggestion: Schedule deep work sessions before 1 PM today.
                                </p>
                            </div>

                            <div className="rounded-lg bg-orange-50 p-3">
                                <p className="text-sm text-orange-900">
                                    <span className="font-semibold">Sleep Pattern:</span> You slept 6h last night.
                                </p>
                                <p className="mt-2 text-xs text-orange-700">
                                    Suggestion: Reduce cognitive load tasks in the evening.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
