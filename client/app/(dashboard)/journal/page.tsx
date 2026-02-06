import DailyLogForm from "../../components/DailyLogForm";

export default function JournalPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Daily Journal</h2>
                <p className="text-sm text-gray-500">Log your daily metrics to help the AI optimize your routine.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <DailyLogForm />
            </div>
        </div>
    );
}
