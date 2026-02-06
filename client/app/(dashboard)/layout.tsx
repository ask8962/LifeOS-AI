import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Providers } from "../providers";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Providers>
            <div className="flex h-screen w-full bg-gray-50">
                <Sidebar />
                <main className="flex flex-1 flex-col overflow-hidden">
                    <Navbar />
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </Providers>
    );
}
