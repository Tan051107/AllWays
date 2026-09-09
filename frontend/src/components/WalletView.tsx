import React, { useState } from 'react';
import { ExpenseItem, SettlementDebt, BudgetSubstitution } from '../types';
import { TRAVELERS, BUDGET_SUBSTITUTIONS } from '../data/initialData';

interface WalletViewProps {
  expenses: ExpenseItem[];
  debts: SettlementDebt[];
  onAddExpense: (newExpense: ExpenseItem) => void;
  onSettleDebt: (debtId: string) => void;
  onSettleAll: () => void;
  onMarkDebtSettled: (debtId: string) => void;
  onConfirmReceipt: (debtId: string) => void;
  activeTripId: string;
  onTripChange: (tripId: string) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  expenses,
  debts,
  onAddExpense,
  onSettleDebt,
  onSettleAll,
  onMarkDebtSettled,
  onConfirmReceipt,
  activeTripId,
  onTripChange,
}) => {
  const [subView, setSubView] = useState<'history' | 'expense-details' | 'add-expense' | 'settlement' | 'budget'>('history');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem>(expenses[0]);
  const [settlementTab, setSettlementTab] = useState<'youOwe' | 'owedToYou'>('youOwe');
  const youOwe = debts.filter((debt) => debt.fromName === 'Jason');
  const owedToYou = debts.filter((debt) => debt.toName === 'Jason');
  const activeSettlementDebts = settlementTab === 'youOwe' ? youOwe : owedToYou;
  const walletTrips = [
    { id: 'tokyo', label: 'Tokyo Spring Escape', dates: 'May 12–19', status: 'Confirmed' },
    { id: 'penang', label: 'Penang Food Weekend', dates: 'Jun 7–9', status: 'Draft' },
    { id: 'kyoto', label: 'Kyoto Culture Days', dates: 'Oct 21–24', status: 'Ready to confirm' },
  ];
  const activeWalletTrip = walletTrips.find((trip) => trip.id === activeTripId) ?? walletTrips[0];

  // Add Expense form state
  const [expenseType, setExpenseType] = useState<'personal' | 'shared'>('shared');
  const [title, setTitle] = useState('Dinner at Kanade');
  const [amount, setAmount] = useState('140');
  const [category, setCategory] = useState('🍣 Dining / Meals');
  const [date, setDate] = useState('2026-05-14');
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [paidBy, setPaidBy] = useState('Sarah (Lead)');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(['sarah', 'jason', 'mei', 'ivan']);
  const [splitScope, setSplitScope] = useState<'whole' | 'items'>('whole');
  const [splitMethod, setSplitMethod] = useState<'equal' | 'custom'>('custom');
  const [customShares, setCustomShares] = useState<{ [key: string]: number }>({
    sarah: 30,
    jason: 50,
    mei: 20,
    ivan: 40,
  });
  const [receiptItems, setReceiptItems] = useState([
    { id: 'ramen', label: 'Ramen bowls', amount: 48, memberIds: ['sarah', 'jason'] },
    { id: 'shared-plates', label: 'Shared plates', amount: 52, memberIds: ['sarah', 'jason', 'mei', 'ivan'] },
    { id: 'drinks', label: 'Drinks', amount: 40, memberIds: ['mei', 'ivan'] },
  ]);

  // Budget substitution state
  const [substitutions, setSubstitutions] = useState<BudgetSubstitution[]>(BUDGET_SUBSTITUTIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareChange = (memberId: string, val: number) => {
    setCustomShares(prev => ({
      ...prev,
      [memberId]: isNaN(val) ? 0 : val,
    }));
  };

  const toggleParticipant = (memberId: string) => {
    if (selectedParticipants.includes(memberId)) {
      if (selectedParticipants.length > 1) {
        setSelectedParticipants(selectedParticipants.filter(id => id !== memberId));
      }
    } else {
      setSelectedParticipants([...selectedParticipants, memberId]);
    }
  };

  const toggleReceiptItemMember = (itemId: string, memberId: string) => {
    setReceiptItems((items) => items.map((item) => {
      if (item.id !== itemId) return item;
      const memberIds = item.memberIds.includes(memberId)
        ? item.memberIds.length > 1 ? item.memberIds.filter((id) => id !== memberId) : item.memberIds
        : [...item.memberIds, memberId];
      return { ...item, memberIds };
    }));
  };

  const allocatedTotal = selectedParticipants.reduce((sum, id) => sum + (customShares[id] || 0), 0);
  const targetTotal = parseFloat(amount) || 0;
  const isExactMatch = allocatedTotal === targetTotal;
  const itemizedTotals = receiptItems.reduce<Record<string, number>>((totals, item) => {
    const perPerson = item.amount / item.memberIds.length;
    item.memberIds.forEach((id) => { totals[id] = (totals[id] || 0) + perPerson; });
    return totals;
  }, {});
  const itemizedParticipantIds = Object.keys(itemizedTotals);

  const handleSaveExpense = () => {
    if (!title.trim()) {
      showToast('Please enter an expense title');
      return;
    }
    const totalNum = parseFloat(amount) || 0;
    if (totalNum <= 0) {
      showToast('Please enter a valid amount');
      return;
    }

    const isPersonalExpense = expenseType === 'personal';
    const isItemizedSplit = !isPersonalExpense && splitScope === 'items';
    const participantIds = isPersonalExpense ? ['jason'] : isItemizedSplit ? itemizedParticipantIds : selectedParticipants;
    const expensePaidBy = isPersonalExpense ? 'Jason (You)' : paidBy;
    const shares = participantIds.map(id => {
      const traveler = TRAVELERS.find(t => t.id === id);
      const shareAmount = isPersonalExpense
        ? totalNum
        : isItemizedSplit
        ? Math.round((itemizedTotals[id] || 0) * 100) / 100
        : splitMethod === 'custom'
        ? (customShares[id] || 0)
        : Math.round((totalNum / participantIds.length) * 100) / 100;
      return {
        memberId: id,
        name: traveler ? traveler.name : id,
        amount: shareAmount,
        note: id === 'jason' ? 'Step-free order' : undefined,
      };
    });

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title,
      category: category.replace(/^[^\s]+\s/, ''),
      categoryIcon: category.split(' ')[0] || '💳',
      date: 'May 14, 2026',
      currency: 'RM',
      totalAmount: totalNum,
      paidByMemberId: isPersonalExpense ? 'jason' : paidBy.includes('Sarah') ? 'sarah' : paidBy.toLowerCase(),
      paidByName: expensePaidBy,
      splitType: isPersonalExpense ? 'Personal' : isItemizedSplit ? 'By Item' : splitMethod === 'custom' ? 'Custom Split' : 'Equal Split',
      participatingMemberIds: participantIds,
      shares,
      wayloNote: isPersonalExpense ? 'Recorded as a personal expense.' : isItemizedSplit ? `Paid upfront by ${paidBy}. Split from assigned receipt items.` : `Paid upfront by ${paidBy}. Split recorded across ${participantIds.length} group members.`,
      isVerified: true,
    };

    onAddExpense(newExp);
    setSelectedExpense(newExp);
    setSubView('expense-details');
    showToast('Expense recorded successfully!');
  };

  // Budget calculations
  const baseBudget = 1120000;
  const baseProjected = 1138500;
  const currentSavings = substitutions
    .filter(s => s.selected)
    .reduce((sum, s) => sum + s.savings, 0);
  const newProjected = baseProjected - currentSavings;
  const personalBudget = 1000;
  const personalSpent = 650;
  const personalRemainingPlan = 590;
  const personalRescueSavings = substitutions.filter(s => s.selected).reduce((sum, substitution) => sum + (substitution.id === 'sub-1' ? 90 : 105), 0);
  const personalProjected = personalSpent + personalRemainingPlan;
  const personalAfterRescue = personalProjected - personalRescueSavings;

  const toggleSub = (id: string) => {
    setSubstitutions(prev =>
      prev.map(s => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 1: HISTORY / OVERVIEW (Screen 5)                  */}
      {/* ========================================================= */}
      {subView === 'history' && (
        <div className="p-4 space-y-4 pb-20">
          {/* Top Sub-Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div><span className="font-extrabold text-base text-stone-900 tracking-tight block">Shared Wallet</span><select value={activeTripId} onChange={(event) => onTripChange(event.target.value)} className="mt-0.5 max-w-[185px] bg-transparent text-[10px] font-extrabold uppercase tracking-wider text-[#006c51] outline-none"><option value="tokyo">Tokyo Spring Escape • Confirmed</option><option value="penang">Penang Food Weekend • Draft</option><option value="kyoto">Kyoto Culture Days • Ready to confirm</option></select></div>
            </div>
            <button
              onClick={() => setSubView('budget')}
              className="text-xs font-bold text-[#eb5e49] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">savings</span>
              Budget & Rescue
            </button>
          </div>

          {/* Balance Overview Banner */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white p-4 rounded-3xl shadow-md relative overflow-hidden border border-stone-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-stone-400 text-[11px] font-semibold uppercase tracking-wider block">Group Pool Spent</span>
                <div className="text-2xl font-black tracking-tight">
                  RM 3,420<span className="text-stone-400 text-sm font-normal">.00</span>
                </div>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Budget on track
              </span>
            </div>

            <div className="pt-2.5 border-t border-stone-700/60 flex items-center justify-between text-xs text-stone-300">
              <div>
                <span className="text-[10px] text-stone-400 block">Your Balance (Jason)</span>
                <span className="font-bold text-rose-400">Owes RM50.00</span>
              </div>
              <button
                onClick={() => setSubView('settlement')}
                className="bg-[#eb5e49] hover:bg-[#d94f3b] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-sm flex items-center gap-1 active:scale-95"
              >
                Settle Up →
              </button>
            </div>
          </div>

          <button onClick={() => setSubView('budget')} className="w-full rounded-2xl border border-[#f2c7c1] bg-[#fff3f0] p-3.5 text-left shadow-xs transition hover:bg-[#ffebe6] active:scale-[0.99]">
            <div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#aa2f1f] text-white"><span className="material-symbols-outlined text-[19px]">warning</span></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-[12px] font-extrabold text-stone-900">Budget alert: Jason</p><span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-[#aa2f1f]">RM240 over</span></div><p className="mt-1 text-[11px] font-medium leading-snug text-stone-600">Projected spending exceeds his personal budget after the remaining itinerary costs.</p><p className="mt-2 flex items-center gap-1 text-[11px] font-extrabold text-[#aa2f1f]">Review accessible savings plan <span className="material-symbols-outlined text-[15px]">arrow_forward</span></p></div></div>
          </button>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setSubView('add-expense')}
              className="py-2.5 px-3 bg-[#fff1ef] border border-[#ffe4e0] rounded-2xl flex items-center justify-center gap-2 text-[#eb5e49] font-bold text-xs hover:bg-[#ffe4e0] transition active:scale-95 shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Expense
            </button>
            <button
              onClick={() => setSubView('settlement')}
              className="py-2.5 px-3 bg-white border border-stone-200 rounded-2xl flex items-center justify-center gap-2 text-stone-700 font-bold text-xs hover:bg-stone-50 transition active:scale-95 shadow-xs"
            >
              <span className="material-symbols-outlined text-stone-400 text-[18px]">calculate</span>
              Settlement Hub
            </button>
          </div>

          {/* Expense History List with Badges */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pt-1">
              <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Expense History</h2>
              <span className="text-[10px] text-stone-400 font-medium">Filtered: All Active ({expenses.length})</span>
            </div>

            {expenses.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedExpense(item);
                  setSubView('expense-details');
                }}
                className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-[#eb5e49]/50 transition space-y-1.5 cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#fff1ef] border border-[#ffe4e0] text-xl flex items-center justify-center flex-shrink-0 shadow-xs">
                      {item.categoryIcon}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-stone-900 leading-tight">{item.title}</h3>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {item.date} · Paid by {item.paidByName}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-stone-900">{item.currency} {item.totalAmount.toFixed(2)}</span>
                    <span className="text-[9px] text-stone-400 block">
                      {item.shares.find(s => s.memberId === 'jason')
                        ? `Your share: ${item.currency}${item.shares.find(s => s.memberId === 'jason')?.amount.toFixed(0)}`
                        : 'Not participating'}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-stone-100 text-stone-600">
                    {item.splitType === 'Personal' ? 'Personal' : `Shared · ${item.participatingMemberIds.length} members`}
                  </span>
                  {item.splitType === 'Custom Split' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#fff1ef] text-[#eb5e49] border border-[#ffe4e0]">
                      Custom Split
                    </span>
                  )}
                  {item.splitType === 'Equal Split' && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-[#edfbf7] text-[#006c51] border border-[#daf7ef]">
                      Equal Split
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 2: EXPENSE DETAILS (Screen 1)                     */}
      {/* ========================================================= */}
      {subView === 'expense-details' && selectedExpense && (
        <div className="p-4 space-y-4 pb-20">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubView('history')}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <span className="font-extrabold text-[16px] text-stone-900 tracking-tight">Expense Details</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setTitle(selectedExpense.title);
                  setAmount(selectedExpense.totalAmount.toString());
                  setSubView('add-expense');
                }}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900"
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </button>
              <button
                onClick={() => {
                  showToast('Expense kept in archive');
                }}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-rose-500 hover:bg-rose-50"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
          </div>

          {/* Main Expense Header Card */}
          <div className="bg-gradient-to-br from-[#fef8f4] to-[#fff1ef] p-5 rounded-3xl border border-[#ffe4e0] shadow-sm text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#eb5e49] text-xs font-bold border border-[#ffe4e0] shadow-xs mb-2">
              <span>{selectedExpense.categoryIcon} {selectedExpense.category}</span>
              <span className="w-1 h-1 rounded-full bg-[#eb5e49]/40"></span>
              <span>{selectedExpense.date}</span>
            </div>

            <h1 className="text-xl font-black text-stone-900 tracking-tight">{selectedExpense.title}</h1>
            <div className="mt-2 flex items-baseline justify-center gap-1">
              <span className="text-sm font-extrabold text-[#eb5e49]">{selectedExpense.currency}</span>
              <span className="text-3xl font-black text-stone-900 tracking-tight">
                {selectedExpense.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="mt-3.5 pt-3 border-t border-[#ffe4e0] flex items-center justify-around text-xs">
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Paid By</span>
                <span className="font-extrabold text-stone-900 flex items-center gap-1 justify-center mt-0.5">
                  <span className="w-4 h-4 rounded-full bg-[#eb5e49] text-white text-[9px] font-black flex items-center justify-center">
                    {selectedExpense.paidByName.charAt(0)}
                  </span>
                  {selectedExpense.paidByName}
                </span>
              </div>
              <div className="w-px h-6 bg-stone-200"></div>
              <div>
                <span className="text-stone-400 block text-[10px] font-bold uppercase">Split Type</span>
                <span className="font-extrabold text-[#eb5e49] bg-[#fff1ef] px-2.5 py-0.5 rounded-full inline-block mt-0.5 text-[11px] border border-[#ffe4e0]">
                  {selectedExpense.splitType}
                </span>
              </div>
            </div>
          </div>

          {/* Participating Members Breakdown */}
          <div className="bg-[#f8f2ef]/70 border border-stone-200/80 rounded-3xl p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-stone-900">Participating Members</span>
                <span className="text-[10px] font-bold bg-white text-stone-600 px-2 py-0.5 rounded-full border border-stone-200">
                  {selectedExpense.shares.length} People
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-[#006c51] bg-[#edfbf7] px-2 py-0.5 rounded-full border border-[#daf7ef]">
                100% Accounted
              </span>
            </div>

            {/* Member list */}
            <div className="space-y-2">
              {selectedExpense.shares.map((share) => {
                const isPayer = share.name.toLowerCase().includes(selectedExpense.paidByName.toLowerCase().split(' ')[0]);
                const traveler = TRAVELERS.find(t => t.name.toLowerCase().includes(share.name.toLowerCase()));
                return (
                  <div key={share.memberId} className="flex items-center justify-between p-2.5 rounded-2xl bg-white border border-stone-200/70 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full ${traveler ? traveler.avatarBg : 'bg-stone-300'} ${traveler ? traveler.avatarText : 'text-stone-900'} font-black text-xs flex items-center justify-center shadow-xs`}>
                        {share.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-900">{share.name}</span>
                          {isPayer && (
                            <span className="text-[9px] font-black bg-[#fff1ef] text-[#eb5e49] px-1.5 py-0.5 rounded border border-[#ffe4e0]">
                              PAID {selectedExpense.currency}{selectedExpense.totalAmount}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 block">
                          {share.note || `Share: ${selectedExpense.currency}${share.amount}`}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-stone-900">
                        {selectedExpense.currency} {share.amount.toFixed(2)}
                      </span>
                      {isPayer ? (
                        <span className="text-[9px] text-[#006c51] block font-bold">
                          +{selectedExpense.currency}{(selectedExpense.totalAmount - share.amount).toFixed(0)} net to collect
                        </span>
                      ) : (
                        <span className="text-[9px] text-rose-500 block font-semibold">
                          Owes {selectedExpense.paidByName.split(' ')[0]} {selectedExpense.currency}{share.amount.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setTitle(selectedExpense.title);
                setAmount(selectedExpense.totalAmount.toString());
                setSubView('add-expense');
              }}
              className="flex-1 py-2.5 bg-white hover:bg-stone-50 border border-stone-200 font-bold text-xs rounded-2xl text-stone-700 flex items-center justify-center gap-1.5 transition shadow-xs active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-stone-500">edit</span>
              Edit Expense
            </button>
            <button
              onClick={() => setSubView('settlement')}
              className="flex-1 py-2.5 bg-[#fff1ef] hover:bg-[#ffe4e0] border border-[#ffe4e0] font-bold text-xs rounded-2xl text-[#eb5e49] flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-[#eb5e49]">check_circle</span>
              View in Settlement
            </button>
          </div>

          {/* Waylo AI Tip */}
          <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#eb5e49] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
              W
            </div>
            <div className="text-[11px] text-stone-600 leading-tight">
              <strong className="text-stone-900">Waylo Note:</strong> {selectedExpense.wayloNote || 'Settlements will automatically offset against future transit payments.'}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 3: ADD EXPENSE (Screen 3)                        */}
      {/* ========================================================= */}
      {subView === 'add-expense' && (
        <div className="p-4 space-y-4 pb-20">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubView('history')}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <span className="font-extrabold text-[16px] text-stone-900 tracking-tight">Add Expense</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edfbf7] text-[#006c51] tracking-wider border border-[#daf7ef]">
                {expenseType === 'shared' ? 'SHARED WALLET' : 'PERSONAL EXPENSE'}
              </span>
              <button
                onClick={() => {
                  setTitle('');
                  setAmount('');
                }}
                className="text-xs font-semibold text-stone-400 hover:text-stone-600 px-1"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Expense Type Selector */}
          <div className="bg-stone-100 p-1 rounded-2xl flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setExpenseType('personal')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
                expenseType === 'personal'
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-400'
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => setExpenseType('shared')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 ${
                expenseType === 'shared'
                  ? 'bg-white text-[#eb5e49] shadow-sm'
                  : 'text-stone-400'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">group</span>
              Shared Expense
            </button>
          </div>

          <label className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-3 transition ${receiptName ? 'border-[#b8e8d4] bg-[#edfbf7]' : 'border-[#eb5e49]/50 bg-[#fff7f5] hover:bg-[#fff1ef]'}`}>
            <input type="file" accept="image/*" className="hidden" onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setReceiptName(file.name);
              setExpenseType('shared');
              setTitle('Dinner at Kanade');
              setAmount('140');
              setCategory('🍣 Dining / Meals');
              setDate('2026-05-14');
              setSplitScope('items');
              showToast('Receipt scanned — review the suggested details');
            }} />
            <span className={`material-symbols-outlined flex h-9 w-9 items-center justify-center rounded-xl ${receiptName ? 'bg-white text-[#006c51]' : 'bg-white text-[#eb5e49]'}`}>{receiptName ? 'receipt_long' : 'photo_camera'}</span>
            <span className="min-w-0 flex-1"><span className={`block text-[12px] font-extrabold ${receiptName ? 'text-[#006c51]' : 'text-stone-900'}`}>{receiptName ? 'Receipt ready to review' : 'Scan or upload a receipt'}</span><span className="mt-0.5 block truncate text-[10px] font-medium text-stone-500">{receiptName ?? 'We’ll suggest the title, amount, category, and date.'}</span></span>
            <span className="text-[10px] font-extrabold text-[#eb5e49]">{receiptName ? 'Change' : 'Upload'}</span>
          </label>

          {/* Core Mandatory Fields */}
          <div className="bg-[#f8f2ef]/70 p-3.5 rounded-2xl border border-stone-200/60 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                Expense Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:border-[#eb5e49] text-stone-900"
                placeholder="e.g. Dinner at Kanade, Subway Pass"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Total Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs font-bold text-stone-400">RM</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-2 py-2 bg-white rounded-xl border border-stone-200 text-sm font-black text-stone-900 focus:outline-none focus:border-[#eb5e49]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none"
                >
                  <option>🍣 Dining / Meals</option>
                  <option>🎟️ Attractions</option>
                  <option>🚕 Transit & Taxi</option>
                  <option>🏨 Stay / Lodging</option>
                  <option>🛍️ Shopping / Gear</option>
                </select>
              </div>
            </div>

            <div className={`grid gap-2.5 ${expenseType === 'shared' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-stone-200 text-xs font-medium text-stone-900 focus:outline-none"
                />
              </div>

              {expenseType === 'shared' && <div>
                <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Paid by
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white rounded-xl border border-stone-200 text-xs font-semibold text-stone-900 focus:outline-none"
                >
                  <option>Sarah (Lead)</option>
                  <option>Jason</option>
                  <option>Mei</option>
                  <option>Ivan</option>
                </select>
              </div>}
            </div>
          </div>

          {expenseType === 'shared' && <>
          <div className="space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">How should this be split?</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setSplitScope('whole')} className={`rounded-xl border px-3 py-2 text-left transition ${splitScope === 'whole' ? 'border-[#eb5e49] bg-[#fff1ef] text-[#aa2f1f]' : 'border-stone-200 bg-white text-stone-500'}`}><span className="block text-[11px] font-extrabold">Whole receipt</span><span className="block text-[9px] font-medium">Split the full amount</span></button>
              <button type="button" onClick={() => setSplitScope('items')} className={`rounded-xl border px-3 py-2 text-left transition ${splitScope === 'items' ? 'border-[#eb5e49] bg-[#fff1ef] text-[#aa2f1f]' : 'border-stone-200 bg-white text-stone-500'}`}><span className="block text-[11px] font-extrabold">By item</span><span className="block text-[9px] font-medium">Assign receipt lines</span></button>
            </div>
          </div>

          {splitScope === 'whole' && <>
          {/* Section A: Participants Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-stone-900 tracking-tight">Who is sharing this expense?</h3>
              <span className="text-[11px] text-[#eb5e49] font-bold bg-[#fff1ef] px-2 py-0.5 rounded-full border border-[#ffe4e0]">
                {selectedParticipants.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {TRAVELERS.map((t) => {
                const isSelected = selectedParticipants.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleParticipant(t.id)}
                    className={`p-2 rounded-2xl border-2 text-center flex flex-col items-center relative transition ${
                      isSelected
                        ? 'bg-[#fff1ef] border-[#eb5e49]'
                        : 'bg-white border-stone-200 opacity-60'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full ${t.avatarBg} ${t.avatarText} font-black flex items-center justify-center text-xs mb-1 shadow-xs`}>
                      {t.shortName}
                    </div>
                    <span className="text-[11px] font-bold text-stone-900 truncate w-full">{t.name.split(' ')[0]}</span>
                    <span className="text-[9px] text-[#eb5e49] font-medium">
                      {t.id === 'sarah' ? 'Payer' : 'Active'}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#eb5e49] rounded-full text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section B: Split Method Segmented Control */}
          <div className="space-y-2.5">
            <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Split Method
            </label>
            <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSplitMethod('equal')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  splitMethod === 'equal'
                    ? 'bg-white text-[#eb5e49] shadow-sm font-extrabold'
                    : 'text-stone-400'
                }`}
              >
                Equally
              </button>
              <button
                type="button"
                onClick={() => setSplitMethod('custom')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  splitMethod === 'custom'
                    ? 'bg-white text-[#eb5e49] shadow-sm font-extrabold'
                    : 'text-stone-400'
                }`}
              >
                Custom Amount
              </button>
            </div>

            {/* Custom Split Breakdown Table */}
            {splitMethod === 'custom' && (
              <div className="bg-[#f8f2ef]/60 border border-stone-200/80 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-stone-200/60 text-[11px]">
                  <span className="font-bold text-stone-600">Member Share Breakdown</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                    isExactMatch ? 'text-[#006c51] bg-[#edfbf7]' : 'text-rose-600 bg-rose-50'
                  }`}>
                    Allocated: RM{allocatedTotal} / RM{targetTotal}
                  </span>
                </div>

                {selectedParticipants.map((memberId) => {
                  const traveler = TRAVELERS.find(t => t.id === memberId);
                  return (
                    <div key={memberId} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${traveler ? traveler.avatarBg : 'bg-stone-300'} ${traveler ? traveler.avatarText : 'text-stone-900'} text-[10px] font-black flex items-center justify-center`}>
                          {traveler ? traveler.shortName : memberId.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-stone-800">
                          {traveler ? traveler.name : memberId}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-stone-400">RM</span>
                        <input
                          type="number"
                          value={customShares[memberId] ?? 0}
                          onChange={(e) => handleShareChange(memberId, parseFloat(e.target.value))}
                          className="w-16 px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-bold text-right text-stone-900 focus:outline-none focus:border-[#eb5e49]"
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Validation Banner */}
                {isExactMatch ? (
                  <div className="pt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-[#006c51] bg-[#edfbf7] p-1.5 rounded-lg border border-[#daf7ef]">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                    <span>Exact match: 100% of RM{targetTotal} allocated across {selectedParticipants.length} travelers.</span>
                  </div>
                ) : (
                  <div className="pt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                    <span className="material-symbols-outlined text-[16px] text-rose-600">warning</span>
                    <span>Difference: RM{Math.abs(targetTotal - allocatedTotal)} {targetTotal > allocatedTotal ? 'unallocated' : 'exceeded'}.</span>
                  </div>
                )}
              </div>
            )}
          </div>
          </>}

          {splitScope === 'items' && <div className="space-y-2.5">
            <div><h3 className="text-xs font-extrabold text-stone-900">Assign receipt items</h3><p className="mt-0.5 text-[10px] font-medium text-stone-500">Tap the people sharing each line. AllWays divides that line equally.</p></div>
            <div className="space-y-2">
              {receiptItems.map((item) => <div key={item.id} className="rounded-2xl border border-stone-200 bg-white p-3"><div className="flex items-center justify-between"><span className="text-[12px] font-extrabold text-stone-900">{item.label}</span><span className="text-[12px] font-black text-[#eb5e49]">RM {item.amount}</span></div><div className="mt-2 flex gap-1.5">{TRAVELERS.map((traveler) => { const selected = item.memberIds.includes(traveler.id); return <button key={traveler.id} type="button" onClick={() => toggleReceiptItemMember(item.id, traveler.id)} className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-black transition ${selected ? `${traveler.avatarBg} ${traveler.avatarText} ring-2 ring-[#eb5e49] ring-offset-1` : 'bg-stone-100 text-stone-400'}`}>{traveler.shortName}</button>; })}</div></div>)}
            </div>
          </div>}

          {/* Section C: Share Preview Compact Card */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Share Preview</span>
                <h4 className="text-xs font-bold text-stone-900">{title || 'New Expense'}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">Total Expense</span>
                <span className="text-sm font-black text-[#eb5e49]">RM {targetTotal}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] bg-stone-50 px-2.5 py-1.5 rounded-xl text-stone-600">
              <span>Paid upfront by <strong className="text-stone-900">{paidBy}</strong></span>
              <span className="text-[10px] font-bold text-[#eb5e49] bg-[#fff1ef] px-2 py-0.5 rounded-full border border-[#ffe4e0]">
                {splitScope === 'items' ? 'By Item' : splitMethod === 'custom' ? 'Custom Split' : 'Equal Split'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              {(splitScope === 'items' ? itemizedParticipantIds : selectedParticipants).map((id) => {
                const traveler = TRAVELERS.find(t => t.id === id);
                const shareAmt = splitScope === 'items'
                  ? Math.round((itemizedTotals[id] || 0) * 100) / 100
                  : splitMethod === 'custom'
                  ? (customShares[id] || 0)
                  : Math.round((targetTotal / selectedParticipants.length) * 100) / 100;
                return (
                  <div key={id} className="flex items-center justify-between bg-stone-50/80 px-2 py-1 rounded-lg">
                    <span className="text-stone-600 font-medium">{traveler ? traveler.name.split(' ')[0] : id}</span>
                    <span className="font-extrabold text-stone-900">RM{shareAmt}</span>
                  </div>
                );
              })}
            </div>
          </div>
          </>}

          {/* Save Action */}
          <button
            type="button"
            onClick={handleSaveExpense}
            className="w-full py-3 bg-[#eb5e49] hover:bg-[#d94f3b] active:scale-[0.99] text-white font-extrabold rounded-2xl shadow-md shadow-[#eb5e49]/20 text-sm transition flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            Save Expense
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 4: SETTLEMENT DETAILS (Screen 7 & 27)             */}
      {/* ========================================================= */}
      {subView === 'settlement' && (
        <div className="p-4 space-y-4 pb-20">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubView('history')}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <span className="font-extrabold text-[16px] text-stone-900 tracking-tight">Settlement Details</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 tracking-wider">
              {debts.filter(d => !d.paid).length} PENDING
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-stone-100 p-1.5">
            <button onClick={() => setSettlementTab('youOwe')} className={`rounded-xl px-3 py-2.5 text-[11px] font-extrabold transition ${settlementTab === 'youOwe' ? 'bg-white text-[#aa2f1f] shadow-sm' : 'text-stone-500'}`}>You owe ({youOwe.filter(d => !d.paid).length})</button>
            <button onClick={() => setSettlementTab('owedToYou')} className={`rounded-xl px-3 py-2.5 text-[11px] font-extrabold transition ${settlementTab === 'owedToYou' ? 'bg-white text-[#006c51] shadow-sm' : 'text-stone-500'}`}>Owed to you ({owedToYou.filter(d => !d.paid).length})</button>
          </div>

          {/* Primary Summary Card (Sarah's Upfront Offset) */}
          <div className="bg-gradient-to-br from-[#fef8f4] to-[#fff1ef] p-4 rounded-3xl border border-[#ffe4e0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#eb5e49] text-white font-black flex items-center justify-center text-xs shadow-xs">
                  S
                </div>
                <div>
                  <span className="text-xs font-extrabold text-stone-900 block">{settlementTab === 'youOwe' ? 'Your outstanding transfers' : 'Transfers owed back to you'}</span>
                  <span className="text-[10px] text-stone-400">{settlementTab === 'youOwe' ? 'Mark a payment only after you have paid externally.' : 'Confirm receipt once the payer has completed the transfer.'}</span>
                </div>
              </div>
              <span className="text-xs font-black text-[#006c51] bg-[#edfbf7] border border-[#daf7ef] px-2 py-0.5 rounded-lg">
                RM {(settlementTab === 'youOwe' ? youOwe : owedToYou).filter(d => !d.paid).reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}
              </span>
            </div>

            <div className="bg-white/80 rounded-2xl p-2.5 text-[11px] space-y-1.5 border border-stone-200/50">
              <div className="flex justify-between text-stone-500">
                <span>Open transfers</span>
                <span className="font-bold text-stone-900">{activeSettlementDebts.filter(d => !d.paid).length}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Waiting for confirmation</span>
                <span className="font-bold text-stone-900">{activeSettlementDebts.filter(d => d.settlementStatus === 'marked_paid').length}</span>
              </div>
              <div className="pt-1 border-t border-stone-200/60 flex justify-between font-extrabold text-[#eb5e49]">
                <span>{settlementTab === 'youOwe' ? 'You need to settle' : 'You are due'}</span>
                <span>RM {activeSettlementDebts.filter(d => !d.paid).reduce((sum, debt) => sum + debt.amount, 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Individual Debt Transfers */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider px-1">
              {settlementTab === 'youOwe' ? 'You owe' : 'Owed to you'}
            </h3>

            {activeSettlementDebts.map((debt) => (
              <div
                key={debt.id}
                className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between transition hover:border-[#eb5e49]/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-800 font-bold text-xs flex items-center justify-center border border-stone-200">
                    {debt.fromName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">{debt.fromName}</span>
                      <span className="text-[9px] text-stone-400 font-medium">owes</span>
                      <span className="text-xs font-bold text-[#eb5e49]">{debt.toName}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 block mt-0.5">{debt.reason}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-extrabold block ${debt.paid ? 'line-through text-stone-400' : 'text-rose-500'}`}>
                    {debt.currency} {debt.amount.toFixed(2)}
                  </span>
                  {debt.paid ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">check</span> Receipt confirmed
                    </span>
                  ) : debt.settlementStatus === 'marked_paid' ? (
                    settlementTab === 'owedToYou' ? (
                      <button onClick={() => { onConfirmReceipt(debt.id); showToast(`Receipt from ${debt.fromName} confirmed.`); }} className="text-[10px] font-extrabold text-[#006c51] hover:text-[#00513c] active:scale-95 transition mt-0.5 inline-block">Confirm receipt →</button>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 flex items-center justify-end gap-0.5 mt-0.5"><span className="material-symbols-outlined text-[14px]">schedule</span> Awaiting receipt</span>
                    )
                  ) : (
                    settlementTab === 'youOwe' ? <button onClick={() => { onMarkDebtSettled(debt.id); showToast(`Marked ${debt.currency}${debt.amount} as settled. Waiting for ${debt.toName} to confirm receipt.`); }} className="text-[10px] font-extrabold text-[#aa2f1f] hover:text-[#8b190c] active:scale-95 transition mt-0.5 inline-block">Mark as settled →</button> : <span className="text-[10px] font-bold text-stone-400">Awaiting payment</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Waylo AI Optimized Settlement Note */}
          <div className="p-3.5 bg-[#edfbf7] border border-[#daf7ef] rounded-2xl flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#006c51] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              ✓
            </div>
            <div className="text-[11px] text-stone-600 leading-snug">
              <strong className="text-[#00513c]">Direct Route Minimization:</strong> By pairing dinner custom splits with Ivan's earlier RM320 accessible jumbo van booking, Waylo reduced total inter-member transactions from 12 down to 3 transfers.
            </div>
          </div>

          <div className="rounded-2xl border border-[#eadeda] bg-white p-3 text-[11px] leading-snug text-stone-600"><strong className="text-stone-900">How settlement works:</strong> The payer marks a transfer as settled after paying externally. The receiver then confirms receipt before the debt is closed.</div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-VIEW 5: BUDGET & SAVINGS (Screen 17)                   */}
      {/* ========================================================= */}
      {subView === 'budget' && (
        <div className="p-4 space-y-4 pb-20">
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSubView('history')}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 hover:bg-stone-200 transition"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              </button>
              <div>
                <span className="text-[10px] font-bold text-[#eb5e49] uppercase tracking-wider block">Finances</span>
                <h1 className="font-extrabold text-[16px] text-stone-900 tracking-tight leading-tight">Budget & Savings</h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[#006c51] text-[16px]">verified</span>
              <span className="text-[10px] text-stone-800 font-extrabold">4 TRAVELERS</span>
            </div>
          </div>

          {/* Predictive Warning Banner */}
          <div className="bg-[#ffdad6]/60 p-4 rounded-2xl border border-rose-200 shadow-xs space-y-1">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#eb5e49] flex items-center justify-center text-white shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#eb5e49] tracking-wider">OVERSPENDING RISK</span>
                  <span className="bg-[#eb5e49]/10 text-[#eb5e49] text-[10px] px-2 py-0.5 rounded-full font-bold">+1.6%</span>
                </div>
                <p className="text-xs font-bold text-stone-900 mt-0.5">
                  Projected to exceed budget by <span className="text-[#eb5e49]">+¥18,500</span>
                </p>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Caused by private wheelchair jumbo van booking for the Mount Fuji day transit.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eadeda] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#aa2f1f]">Predictive budget guard</p><h2 className="mt-1 text-[16px] font-extrabold text-stone-900">Jason’s personal forecast</h2></div><span className="material-symbols-outlined text-[24px] text-[#aa2f1f]">monitoring</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center"><div className="rounded-xl bg-[#f8f2ef] p-2"><p className="text-[9px] font-bold text-stone-500">SPENT</p><p className="mt-1 text-[14px] font-extrabold text-stone-900">RM{personalSpent}</p></div><div className="rounded-xl bg-[#f8f2ef] p-2"><p className="text-[9px] font-bold text-stone-500">PLANNED</p><p className="mt-1 text-[14px] font-extrabold text-stone-900">RM{personalRemainingPlan}</p></div><div className="rounded-xl bg-[#fff0ec] p-2"><p className="text-[9px] font-bold text-[#aa2f1f]">PROJECTED</p><p className="mt-1 text-[14px] font-extrabold text-[#aa2f1f]">RM{personalProjected}</p></div></div>
            <p className="mt-3 text-[12px] font-semibold text-stone-600"><span className="font-extrabold text-stone-900">RM{personalSpent} spent</span> + <span className="font-extrabold text-stone-900">RM{personalRemainingPlan} remaining</span> = RM{personalProjected} projected</p>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fff0ec] px-3 py-2.5"><span className="text-[12px] font-bold text-stone-700">RM{personalBudget} personal budget</span><span className="text-[12px] font-extrabold text-[#aa2f1f]">RM{personalProjected - personalBudget} over</span></div>
          </div>

          {/* Main Budget Metric Card */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Group Total Budget</span>
                <span className="text-xl font-black text-stone-900">¥1,120,000</span>
                <span className="text-[10px] text-stone-400 block font-medium">¥280,000 / person</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#eb5e49] uppercase tracking-wider block">Current Forecast</span>
                <span className="text-lg font-black text-[#eb5e49]">¥1,138,500</span>
                <span className="text-[10px] text-stone-400 block font-medium">4 Travelers Active</span>
              </div>
            </div>

            {/* Segmented Multi-Bar Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
                <div className="h-full bg-emerald-300" style={{ width: '45.6%' }} title="Stay"></div>
                <div className="h-full bg-emerald-600" style={{ width: '21.0%' }} title="Dining"></div>
                <div className="h-full bg-[#eb5e49]" style={{ width: '19.2%' }} title="Transit"></div>
                <div className="h-full bg-amber-400" style={{ width: '14.2%' }} title="Activities"></div>
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                <span>¥0</span>
                <span className="text-[#eb5e49]">CAP ¥1.12M</span>
              </div>
            </div>

            {/* Member Avatars */}
            <div className="flex items-center justify-between bg-stone-50 p-2.5 rounded-xl">
              <div className="flex items-center -space-x-2">
                {TRAVELERS.map((t) => (
                  <img
                    key={t.id}
                    src={t.photoUrl}
                    alt={t.name}
                    className="w-7 h-7 rounded-full ring-2 ring-white object-cover shadow-xs"
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-stone-700">Jason, Sarah, Ivan, Mei</span>
            </div>

            {/* Category Breakdown Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-stone-50 p-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                  <span className="text-[11px] font-medium text-stone-600">Stay</span>
                </div>
                <span className="font-extrabold text-stone-900 text-[11px]">¥520,000</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-[11px] font-medium text-stone-600">Dining</span>
                </div>
                <span className="font-extrabold text-stone-900 text-[11px]">¥240,000</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#eb5e49]"></span>
                  <span className="text-[11px] font-medium text-stone-600">Transit</span>
                </div>
                <span className="font-extrabold text-stone-900 text-[11px]">¥218,500</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[11px] font-medium text-stone-600">Activities</span>
                </div>
                <span className="font-extrabold text-stone-900 text-[11px]">¥160,000</span>
              </div>
            </div>
          </div>

          {/* AI Budget Rescue Engine */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-[#006c51] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                </div>
                <h2 className="text-xs font-black text-stone-900 uppercase tracking-wider">AI Budget Rescue</h2>
              </div>
              <span className="bg-[#edfbf7] text-[#006c51] border border-[#daf7ef] px-2 py-0.5 rounded-full text-[10px] font-bold">
                NO COMPROMISES
              </span>
            </div>

            <p className="text-[11px] text-stone-500 leading-snug">
              Accessibility requirements are never sacrificed to cut costs. <strong className="text-stone-800">teamLab Planets</strong> remains protected as a unanimous must-do.
            </p>
            <div className="rounded-xl bg-[#f8f2ef] p-3 text-[12px] font-semibold text-stone-700"><span className="font-extrabold text-[#006c51]">Live personal outcome:</span> RM{personalProjected} projected − RM{personalRescueSavings} selected accessible savings = <span className={personalAfterRescue > personalBudget ? 'font-extrabold text-[#aa2f1f]' : 'font-extrabold text-[#006c51]'}>RM{personalAfterRescue} ({personalAfterRescue > personalBudget ? `RM${personalAfterRescue - personalBudget} over` : 'under budget'})</span></div>

            {/* Substitution 1 & 2 */}
            <div className="space-y-2.5">
              {substitutions.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => toggleSub(sub.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer select-none space-y-2 shadow-xs ${
                    sub.selected
                      ? 'bg-white border-[#eb5e49]'
                      : 'bg-stone-50 border-stone-200 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        sub.selected ? 'bg-[#eb5e49] text-white shadow-xs' : 'bg-stone-200 text-stone-500'
                      }`}>
                        {sub.selected ? '✓' : ''}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#006c51] uppercase tracking-wider">{sub.type}</span>
                        <h3 className="text-xs font-bold text-stone-900">{sub.title}</h3>
                      </div>
                    </div>
                    <span className="bg-[#edfbf7] text-[#006c51] font-extrabold text-[11px] px-2 py-0.5 rounded-full">
                      Save ¥{sub.savings.toLocaleString()}
                    </span>
                  </div>

                  {/* Comparison */}
                  <div className="bg-stone-50 p-2 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 line-through block">{sub.originalName}</span>
                      <span className="font-semibold text-stone-400 line-through">¥{sub.originalCost.toLocaleString()}</span>
                    </div>
                    <span className="material-symbols-outlined text-stone-400 text-[16px]">arrow_forward</span>
                    <div className="text-right">
                      <span className="text-[10px] text-[#006c51] font-bold block">{sub.substituteName}</span>
                      <span className="font-extrabold text-[#006c51]">¥{sub.substituteCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {sub.features.map((feat, idx) => (
                      <span key={idx} className="bg-white border border-stone-200 px-2 py-0.5 rounded-full text-[10px] font-semibold text-stone-700">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {/* Protected Stop: teamLab Planets */}
              <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-stone-700">lock</span>
                    <span className="text-xs font-bold text-stone-900">teamLab Planets Tokyo</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                    ¥15,200 LOCKED
                  </span>
                </div>
                <p className="text-[10px] text-[#eb5e49] font-bold uppercase tracking-wide">
                  MUST-DO PROTECTED • Locked from all budget cuts
                </p>
                <p className="text-[11px] text-stone-500">
                  High group match (98%) and confirmed flat waterproof wheelchair-ramp route.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Rescue Dock */}
          <div className="space-y-2 pt-2">
            <div className="bg-stone-900 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">savings</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Total Savings Available</span>
                  <span className="text-sm font-black text-white">¥{currentSavings.toLocaleString()} Saved</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">New Projected</span>
                <span className="text-sm font-black text-emerald-400">¥{newProjected.toLocaleString()}</span>
                <span className="text-[9px] font-bold text-emerald-300 block">
                  {newProjected <= baseBudget ? 'Under Budget!' : 'Over Budget'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast(`Applied substitutions! ¥${currentSavings.toLocaleString()} saved.`);
              }}
              className="w-full py-3 bg-[#eb5e49] hover:bg-[#d94f3b] text-white font-extrabold rounded-2xl shadow-md text-xs transition flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Apply Selected Substitutions (Save ¥{currentSavings.toLocaleString()})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
