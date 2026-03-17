import React from 'react';
import { Home, GraduationCap, Calendar, BarChart3, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'academic', label: 'Academic', icon: GraduationCap },
    { id: 'personal', label: 'Personal', icon: Calendar },
    { id: 'progress', label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <nav className="w-20 md:w-64 border-r-2 border-gray-200 bg-white flex flex-col p-4 fixed h-full z-10">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-extrabold text-duo-pink hidden md:block tracking-tight">LIFE TRACKER</h1>
        <div className="md:hidden flex justify-center">
          <div className="w-10 h-10 bg-duo-pink rounded-lg" />
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-4 p-3 rounded-xl border-b-4 transition-all hover:bg-gray-50",
              activeTab === item.id
                ? "border-duo-pink bg-pink-50 text-duo-pink"
                : "border-transparent text-gray-400 hover:border-gray-100"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="font-bold hidden md:inline">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t-2 border-gray-100">
        <div className="flex items-center gap-3 p-2">
          <div className="w-10 h-10 rounded-full border border-slate-300 overflow-hidden">
            <img 
              alt="Profile" 
              src="https://ais-dev-4rhppjd4zjy5nsepwyu2oj-245303485959.asia-northeast1.run.app/api/attachments/1710622542000-0.jpg"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block">
            <p className="font-bold text-sm leading-none">Cheyenne Kung</p>
            <p className="text-xs text-gray-400">Premium User</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
