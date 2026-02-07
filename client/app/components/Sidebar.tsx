"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Target,
  BarChart2,
  Settings,
  Zap,
  Sparkles,
  LogOut
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Smart Home", href: "/" },
  { icon: BookOpen, label: "Journal", href: "/journal" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: BarChart2, label: "Analytics", href: "/analytics" },
  { icon: Sparkles, label: "Optimize", href: "/optimize" },
  { icon: Zap, label: "Focus Mode", href: "/focus" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-gray-200 bg-white/50 backdrop-blur-xl md:flex">
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <span className="text-2xl">🧠</span> LifeOS
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${isActive
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-100/80 hover:text-indigo-600"
                }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100/80"
        >
          <Settings className="h-5 w-5 text-gray-400" />
          Settings
        </Link>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 mt-1">
          <LogOut className="h-5 w-5 text-red-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
