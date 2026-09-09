import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'explore' },
    { id: 'itinerary', label: 'Itinerary', icon: 'route' },
    { id: 'today', label: 'Today', icon: 'event_available' },
    { id: 'wallet', label: 'Wallet', icon: 'account_balance_wallet' },
    { id: 'group', label: 'Group', icon: 'groups_2' },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 py-2 px-3 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[58px] py-1 transition-all ${
                isActive
                  ? 'text-[#eb5e49] scale-105 font-bold'
                  : 'text-stone-400 hover:text-stone-600 font-medium'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${isActive ? 'material-symbols-filled text-[#eb5e49]' : ''}`}>
                {tab.icon}
              </span>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-[#eb5e49]' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
