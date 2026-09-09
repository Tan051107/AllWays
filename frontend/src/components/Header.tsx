import React from 'react';

interface HeaderProps {
  onOpenSos: () => void;
  onOpenAlertModal: () => void;
  onProfileClick: () => void;
  onAccountClick: () => void;
  accountName: string;
  accountInitial: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSos, onOpenAlertModal, onProfileClick, onAccountClick, accountName, accountInitial }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fef8f4]/90 backdrop-blur-xl border-b border-stone-200/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 cursor-pointer" onClick={onProfileClick}>
          <div className="w-8 h-8 rounded-full bg-[#eb5e49] flex items-center justify-center text-white font-extrabold text-sm shadow-sm">
            A
          </div>
          <span className="font-extrabold text-[17px] text-stone-900 tracking-tight">
            AllWays
          </span>
        </div>
        <div className="flex items-center gap-1 bg-[#f8f2ef] px-2.5 py-1 rounded-full shadow-[0_2px_4px_rgba(36,34,32,0.04)] border border-stone-200/50">
          <span className="material-symbols-outlined text-[#006c51] text-[16px]">location_on</span>
          <span className="text-[11px] text-stone-600 font-extrabold tracking-wider">TOKYO</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Test Alert Simulator Button */}
        <button
          onClick={onOpenAlertModal}
          title="Simulate Off-Route Alert"
          className="hidden sm:flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition"
        >
          <span className="material-symbols-outlined text-[14px]">sensors</span>
          <span>Test Alert</span>
        </button>

        {/* SOS Button */}
        <button
          onClick={onOpenSos}
          aria-label="Emergency SOS"
          className="px-3 py-1.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffcdcd] flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
          <span className="text-[13px] font-extrabold">SOS</span>
        </button>

        {/* User Avatar */}
        <button
          onClick={onAccountClick}
          className="w-8 h-8 rounded-full bg-stone-300 text-stone-900 font-bold text-xs flex items-center justify-center ring-2 ring-white shadow-xs hover:ring-[#eb5e49] transition"
          title={`${accountName}'s account`}
        >
          {accountInitial}
        </button>
      </div>
    </header>
  );
};
