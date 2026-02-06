import TaskList from "../components/TaskList";

export default function DashboardPage() {
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
                        <span className="text-xs font-medium text-gray-400">Not calculated</span>
                    </div>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">--</span>
                        <span className="ml-1 text-sm text-gray-500">/ 100</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">No data available</p>
                </div>

                {/* Focus Hours */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Focus Hours</h3>
                        <span className="text-xs font-medium text-indigo-600">Target: --</span>
                    </div>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">--</span>
                        <span className="ml-1 text-sm text-gray-500">hrs</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
                        <div className="h-1.5 w-0 rounded-full bg-indigo-600"></div>
                    </div>
                </div>

                {/* Mood/Energy */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-500">Energy Level</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-2xl text-gray-400">?</span>
                        <span className="text-gray-500">No entry yet</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Log your status</p>
                </div>

                {/* Next Priority */}
                <div className="rounded-xl border border-indigo-50 bg-indigo-50/50 p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-indigo-900">Next Priority</h3>
                    <p className="mt-2 text-lg font-bold text-indigo-700">No tasks</p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600">
                        <span className="rounded-md bg-indigo-100 px-2 py-1">--:--</span>
                        <span>Est. --m</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Today's Tasks */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                        <h3 className="font-semibold text-gray-900">Today's Tasks</h3>
                    </div>
                    <div className="p-6">
                        <TaskList />
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
                    <div className="flex h-48 flex-col items-center justify-center p-6 text-center text-gray-500">
                        <p className="text-sm">Not enough data to generate insights.</p>
                        <p className="mt-1 text-xs">Keep using LifeOS to unlock predictions.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
