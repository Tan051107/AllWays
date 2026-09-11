import React, { useState } from 'react';
import { TabType, ExpenseItem, SettlementDebt } from './types';
import { INITIAL_EXPENSES, INITIAL_DEBTS } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WalletView } from './components/WalletView';
import { TodayView } from './components/TodayView';
import { ItineraryView } from './components/ItineraryView';
import { GroupRadarView } from './components/GroupRadarView';
import { HomeProfileView } from './components/HomeProfileView';
import { EmergencySosModal } from './components/EmergencySosModal';
import { OffRouteModal } from './components/OffRouteModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [itineraryViewMode, setItineraryViewMode] = useState<'overview' | 'details'>('overview');
  const [activeTripId, setActiveTripId] = useState('tokyo');
  const [planningTravelerCount, setPlanningTravelerCount] = useState(3);
  const [accountRole, setAccountRole] = useState<'host' | 'participant'>('host');
  const [isAccountPickerOpen, setIsAccountPickerOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [debts, setDebts] = useState<SettlementDebt[]>(INITIAL_DEBTS);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showTripCreator, setShowTripCreator] = useState(false);

  const handleSelectTab = (tab: TabType) => {
    // Entering the itinerary via navigation should show the list of travel plans,
    // not jump straight into a single trip's schedule.
    if (tab === 'itinerary') {
      setItineraryViewMode('overview');
    }
    setCurrentTab(tab);
  };

  const openTripItinerary = (tripId: string) => {
    setActiveTripId(tripId);
    setItineraryViewMode('details');
    setCurrentTab('itinerary');
  };

  const handleAddExpense = (newExpense: ExpenseItem) => {
    setExpenses([newExpense, ...expenses]);
  };

  const handleSettleDebt = (debtId: string) => {
    setDebts(prev =>
      prev.map(d => (d.id === debtId ? { ...d, paid: true } : d))
    );
  };

  const handleMarkDebtSettled = (debtId: string) => {
    setDebts(prev => prev.map(d => (d.id === debtId ? { ...d, settlementStatus: 'marked_paid' } : d)));
  };

  const handleConfirmReceipt = (debtId: string) => {
    setDebts(prev => prev.map(d => (d.id === debtId ? { ...d, paid: true, settlementStatus: 'confirmed' } : d)));
  };

  const handleSettleAll = () => {
    setDebts(prev => prev.map(d => ({ ...d, paid: true })));
  };

  return (
    <div className="min-h-screen bg-[#f5efe9] flex flex-col items-center justify-start text-stone-900 selection:bg-rose-100 selection:text-rose-900">
      {/* Centered Mobile App Container */}
      <div className="w-full max-w-md min-h-screen bg-[#fef8f4] flex flex-col shadow-2xl relative border-x border-stone-200/60">
        {/* Persistent Top Header */}
        <Header
          onOpenSos={() => setIsSosOpen(true)}
          onOpenAlertModal={() => setIsAlertOpen(true)}
          onProfileClick={() => setCurrentTab('home')}
          onAccountClick={() => setIsAccountPickerOpen(true)}
          accountName={accountRole === 'host' ? 'Sarah' : 'Mei'}
          accountInitial={accountRole === 'host' ? 'S' : 'M'}
        />

        {/* Tab Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {currentTab === 'home' && <HomeProfileView onDraftCreated={setPlanningTravelerCount} onOpenPlanning={() => openTripItinerary('penang')} onOpenTokyoItinerary={() => openTripItinerary('tokyo')} onNavigate={handleSelectTab} showTripCreator={showTripCreator} onTripCreatorShown={() => setShowTripCreator(false)} />}
          {currentTab === 'itinerary' && <ItineraryView activeTripId={activeTripId} onTripChange={setActiveTripId} planningTravelerCount={planningTravelerCount} viewerRole={accountRole} onCreateTrip={() => { setShowTripCreator(true); setCurrentTab('home'); }} initialViewMode={itineraryViewMode} />}
          {currentTab === 'today' && <TodayView />}
          {currentTab === 'wallet' && (
            <WalletView
              expenses={expenses}
              debts={debts}
              onAddExpense={handleAddExpense}
              onSettleDebt={handleSettleDebt}
              onSettleAll={handleSettleAll}
              onMarkDebtSettled={handleMarkDebtSettled}
              onConfirmReceipt={handleConfirmReceipt}
              activeTripId={activeTripId}
              onTripChange={setActiveTripId}
            />
          )}
          {currentTab === 'group' && <GroupRadarView />}
        </main>

        {/* Persistent Bottom Navigation */}
        <BottomNav currentTab={currentTab} onSelectTab={handleSelectTab} />

        {/* Emergency Assistance Modal */}
        <EmergencySosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />

        {/* Off-Route Alert & PIN Verification Modal */}
        <OffRouteModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />
        {isAccountPickerOpen && <div className="fixed inset-0 z-[80] flex items-end bg-stone-900/30 md:left-1/2 md:w-[448px] md:-translate-x-1/2" onClick={() => setIsAccountPickerOpen(false)}><section className="w-full rounded-t-[28px] bg-[#fef8f4] p-5 shadow-[0_-12px_36px_rgba(38,27,23,0.24)]" onClick={(event) => event.stopPropagation()}><div className="mx-auto h-1.5 w-11 rounded-full bg-stone-300" /><p className="mt-4 text-[10px] font-extrabold uppercase tracking-wide text-[#aa2f1f]">Prototype accounts</p><h2 className="mt-1 text-[18px] font-extrabold text-stone-900">Choose an account</h2><div className="mt-4 space-y-2"><button type="button" onClick={() => { setAccountRole('host'); setIsAccountPickerOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${accountRole === 'host' ? 'border-[#aa2f1f] bg-[#fff6f3]' : 'border-[#eadeda] bg-white'}`}><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eb5e49] text-[13px] font-extrabold text-white">S</span><span><span className="block text-[13px] font-extrabold text-stone-900">Sarah · Host</span><span className="block text-[11px] font-medium text-stone-500">Can edit and confirm the shared itinerary</span></span></button><button type="button" onClick={() => { setAccountRole('participant'); setIsAccountPickerOpen(false); }} className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${accountRole === 'participant' ? 'border-[#006c51] bg-[#edfbf7]' : 'border-[#eadeda] bg-white'}`}><span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-[13px] font-extrabold text-white">M</span><span><span className="block text-[13px] font-extrabold text-stone-900">Mei · Participant</span><span className="block text-[11px] font-medium text-stone-500">Can comment and submit change requests</span></span></button></div></section></div>}
      </div>
    </div>
  );
}
