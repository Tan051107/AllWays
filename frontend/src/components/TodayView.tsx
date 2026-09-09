import React, { useState } from 'react';

export const TodayView: React.FC = () => {
  const [routeApplied, setRouteApplied] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [pendingBufferMinutes, setPendingBufferMinutes] = useState<number | null>(null);
  const [pendingTodayAdjustment, setPendingTodayAdjustment] = useState<'Add rest' | 'Find food' | 'Easier route' | null>(null);
  const [appliedTodayAdjustment, setAppliedTodayAdjustment] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  // Calculate adjusted departure time based on base 14:02 + delayMinutes
  const baseMinutesFromMidnight = 14 * 60 + 2;
  const currentMinutesFromMidnight = baseMinutesFromMidnight + delayMinutes;
  const depHours = Math.floor(currentMinutesFromMidnight / 60);
  const depMins = currentMinutesFromMidnight % 60;
  const formattedDeparture = `${String(depHours).padStart(2, '0')}:${String(depMins).padStart(2, '0')}`;
  const formatTime = (minutesFromMidnight: number) => `${String(Math.floor(minutesFromMidnight / 60)).padStart(2, '0')}:${String(minutesFromMidnight % 60).padStart(2, '0')}`;
  const todaySchedule = [
    { time: formattedDeparture, title: 'Leave Meiji Jingu', detail: appliedTodayAdjustment === 'Easier route' ? 'Rerouted via the easier step-free transfer' : 'Head to Shibuya via the step-free route', isNext: true },
    { time: formatTime(14 * 60 + 30 + delayMinutes), title: 'Shibuya Sky', detail: 'Step-free route planned', isNext: false },
    ...(appliedTodayAdjustment === 'Add rest' ? [{ time: formatTime(15 * 60 + 15 + delayMinutes), title: 'Quiet café rest', detail: '15-minute seated break before the next stop', isNext: false }] : []),
    ...(appliedTodayAdjustment === 'Find food' ? [{ time: formatTime(15 * 60 + 45 + delayMinutes), title: 'Accessible food stop', detail: 'Nearby step-free seating and flexible meal options', isNext: false }] : []),
    { time: formatTime(17 * 60 + delayMinutes), title: 'Kanade Japanese Dining', detail: 'Quiet dinner • step-free seating', isNext: false },
  ];

  return (
    <div className="flex-1 w-full max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-[17px] text-stone-900 tracking-tight">Today • May 12</h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">13:45 JST • Live Transit Sync Active</span>
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#d8e9e2] bg-[#edfbf7] px-2.5 py-1 text-[10px] font-extrabold text-[#006c51]"><span className="material-symbols-outlined text-[14px]">luggage</span><span>Tokyo Accessible Spring Journey</span><span className="text-[#4f8d78]">• Day 1 of 7</span></div>
        </div>
        <div className="flex items-center gap-1 bg-stone-100 px-2.5 py-1 rounded-full text-stone-700 font-bold text-xs">
          <span className="material-symbols-outlined text-[15px] text-[#eb5e49]">wb_sunny</span>
          <span>22°C</span>
        </div>
      </div>

      {/* Today's Schedule */}
      <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#aa2f1f]">Today’s schedule</p><h2 className="mt-1 text-[15px] font-extrabold text-stone-900">What’s next</h2></div><span className="rounded-full bg-[#edfbf7] px-2.5 py-1 text-[10px] font-extrabold text-[#006c51]">Day 1 of 7</span></div>
        <div className="mt-3 space-y-3">{todaySchedule.map(({ time, title, detail, isNext }) => <div key={time} className={`flex gap-3 rounded-xl p-2.5 ${isNext ? 'bg-[#fff1ef]' : 'bg-[#f8f2ef]'}`}><div className={`w-11 shrink-0 pt-0.5 text-[12px] font-extrabold ${isNext ? 'text-[#aa2f1f]' : 'text-stone-700'}`}>{time}</div><div className="min-w-0 flex-1"><p className="text-[12px] font-extrabold text-stone-900">{title}</p><p className="mt-0.5 text-[10px] font-medium text-stone-500">{detail}</p></div>{isNext && <span className="self-start rounded-full bg-white px-2 py-1 text-[9px] font-extrabold text-[#aa2f1f]">NEXT</span>}</div>)}</div>
      </section>

      {/* Disruption Alert Card */}
      <div className="p-4 rounded-3xl bg-rose-50 border-2 border-rose-200 shadow-xs space-y-2.5 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">report</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-rose-700 tracking-wider">
                ACTIVE DISRUPTION
              </span>
              <span className="text-[9px] font-bold bg-rose-200/80 text-rose-800 px-2 py-0.5 rounded-full">
                Until 16:00
              </span>
            </div>
            <h2 className="text-xs font-black text-stone-900 leading-snug mt-0.5">
              Elevator Outage at Shinjuku Station
            </h2>
            <p className="text-[11px] text-stone-600 mt-1 leading-snug">
              Platform 4 elevator #3 is out of service for unscheduled maintenance. Original route now contains 24 stairs.
            </p>
          </div>
        </div>

        {/* AI Re-Route Guarantee */}
        <div className="bg-white rounded-2xl p-3 border border-rose-200/70 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c51]"></span>
              <span className="text-xs font-bold text-stone-900">Recommended Alternative</span>
            </div>
            <span className="text-[10px] font-extrabold text-[#006c51] bg-[#edfbf7] border border-[#daf7ef] px-2 py-0.5 rounded-full">
              100% Step-Free
            </span>
          </div>

          <div className="bg-[#f8f2ef] p-2.5 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-900">
              <span>South Gate via Yoyogi Station</span>
              <span className="text-stone-500 font-semibold">+12 min</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-snug">
              Board Car 4 (wheelchair bay) at Harajuku → Yoyogi transfer. Level boarding gap 2.5cm, double operational lifts.
            </p>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
              <span>Buffer intact (Arrive 14:15)</span>
            </div>
            <button
              onClick={() => setRouteApplied(!routeApplied)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 active:scale-95 ${
                routeApplied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#eb5e49] hover:bg-[#d94f3b] text-white shadow-xs'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {routeApplied ? 'check' : 'alt_route'}
              </span>
              <span>{routeApplied ? 'Route Broadcasted' : 'Apply New Route'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pacing & Delay Assistant */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#eb5e49] text-white text-[10px] font-black flex items-center justify-center">
              W
            </div>
            <span className="text-xs font-black text-stone-900 uppercase tracking-wider">
              Waylo: Adjust today
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#eb5e49] bg-[#fff1ef] border border-[#ffe4e0] px-2 py-0.5 rounded-full">
            ADAPTIVE
          </span>
        </div>

        <div className="p-3 bg-[#fef8f4] border border-[#ffe4e0] rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Recommended Departure</span>
            <div className="text-xl font-black text-stone-900">
              Leave Meiji by <span className="text-[#eb5e49]">{formattedDeparture}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-400 block font-medium">14:30 Sky Entry</span>
            <span className={`text-[10px] font-bold ${delayMinutes > 30 ? 'text-amber-600' : 'text-[#006c51]'}`}>
              {delayMinutes > 30 ? 'Tight Margin' : '15 min buffer safe'}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
            Need a rest break? Add extra buffer:
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[0, 15, 30, 45].map((mins) => (
              <button
                key={mins}
                onClick={() => mins === 0 ? setDelayMinutes(0) : setPendingBufferMinutes(mins)}
                className={`py-2 text-xs font-bold rounded-xl border transition ${
                  delayMinutes === mins
                    ? 'bg-[#eb5e49] text-white border-[#eb5e49] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {mins === 0 ? 'On Time' : `+${mins}m`}
              </button>
            ))}
          </div>
        </div>

        <div><span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">Quick adjustments</span><div className="flex gap-2 overflow-x-auto pb-1">{(['Add rest', 'Find food', 'Easier route'] as const).map((adjustment) => <button key={adjustment} type="button" onClick={() => setPendingTodayAdjustment(adjustment)} className="shrink-0 rounded-full border border-[#b8e8d4] bg-[#edfbf7] px-3 py-1.5 text-[10px] font-extrabold text-[#006c51]">{adjustment}</button>)}</div></div>

        <p className="text-[11px] text-stone-500 leading-snug bg-stone-50 p-2.5 rounded-xl border border-stone-100">
          Waylo dynamically recalculated walking and rolling speed considering gravel at Meiji Shrine south paths.
        </p>
      </div>

      {pendingBufferMinutes !== null && <div className="fixed inset-0 z-[70] flex items-end bg-stone-900/30 md:left-1/2 md:w-[448px] md:-translate-x-1/2" onClick={() => setPendingBufferMinutes(null)}><section className="w-full rounded-t-[28px] bg-[#fef8f4] p-5 shadow-[0_-12px_36px_rgba(38,27,23,0.24)]" onClick={(event) => event.stopPropagation()}><div className="mx-auto h-1.5 w-11 rounded-full bg-stone-300" /><p className="mt-4 text-[10px] font-extrabold uppercase tracking-wide text-[#aa2f1f]">Add buffer</p><h2 className="mt-1 text-[18px] font-extrabold text-stone-900">Add {pendingBufferMinutes} minutes?</h2><p className="mt-2 text-[12px] font-medium leading-relaxed text-stone-600">This shifts the remaining schedule later: Shibuya Sky moves to {formatTime(14 * 60 + 30 + pendingBufferMinutes)} and dinner moves to {formatTime(17 * 60 + pendingBufferMinutes)}.</p><div className="mt-5 flex gap-3"><button type="button" onClick={() => setPendingBufferMinutes(null)} className="flex-1 rounded-full border border-[#d9ccc7] py-3 text-[12px] font-extrabold text-stone-700">Cancel</button><button type="button" onClick={() => { setDelayMinutes(pendingBufferMinutes); setPendingBufferMinutes(null); }} className="flex-1 rounded-full bg-[#aa2f1f] py-3 text-[12px] font-extrabold text-white">Add buffer</button></div></section></div>}

      {pendingTodayAdjustment !== null && <div className="fixed inset-0 z-[70] flex items-end bg-stone-900/30 md:left-1/2 md:w-[448px] md:-translate-x-1/2" onClick={() => setPendingTodayAdjustment(null)}><section className="w-full rounded-t-[28px] bg-[#fef8f4] p-5 shadow-[0_-12px_36px_rgba(38,27,23,0.24)]" onClick={(event) => event.stopPropagation()}><div className="mx-auto h-1.5 w-11 rounded-full bg-stone-300" /><p className="mt-4 text-[10px] font-extrabold uppercase tracking-wide text-[#006c51]">Waylo adjustment</p><h2 className="mt-1 text-[18px] font-extrabold text-stone-900">{pendingTodayAdjustment === 'Add rest' ? 'Add a rest break?' : pendingTodayAdjustment === 'Find food' ? 'Add a food stop?' : 'Use the easier route?'}</h2><p className="mt-2 text-[12px] font-medium leading-relaxed text-stone-600">{pendingTodayAdjustment === 'Add rest' ? 'Waylo will add a 15-minute seated break after Shibuya Sky and shift dinner later.' : pendingTodayAdjustment === 'Find food' ? 'Waylo will add an accessible food stop between Shibuya Sky and dinner.' : 'Waylo will update the next transfer to the lower-effort, step-free route.'}</p><div className="mt-5 flex gap-3"><button type="button" onClick={() => setPendingTodayAdjustment(null)} className="flex-1 rounded-full border border-[#d9ccc7] py-3 text-[12px] font-extrabold text-stone-700">Cancel</button><button type="button" onClick={() => { const adjustment = pendingTodayAdjustment; if (adjustment === 'Add rest') setDelayMinutes((current) => current + 15); setAppliedTodayAdjustment(adjustment); setPendingTodayAdjustment(null); }} className="flex-1 rounded-full bg-[#006c51] py-3 text-[12px] font-extrabold text-white">Apply change</button></div></section></div>}

      {false && <>{/* Shibuya Sky Admission Passes */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-4 rounded-3xl shadow-md border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              RESERVED PASSES READY (4)
            </span>
            <h3 className="text-sm font-black text-white">Shibuya Sky Observation Deck</h3>
          </div>
          <span className="text-xs font-bold text-stone-300 bg-stone-800 px-2.5 py-1 rounded-xl border border-stone-700">
            14:30 Slot
          </span>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-stone-300 block">Priority Lift Fast-Track</span>
            <span className="text-xs font-bold text-white">Wheelchair & Companion Pass #8921-A</span>
          </div>
          <button
            onClick={() => setShowQrModal(true)}
            className="px-3 py-1.5 bg-[#eb5e49] hover:bg-[#d94f3b] text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1 shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code</span>
            Show QR
          </button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-stone-500">Fast-Track Pass</span>
              <button
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                ✕
              </button>
            </div>
            <h3 className="font-extrabold text-base text-stone-900">Shibuya Sky (Group 4)</h3>
            <div className="p-4 bg-stone-50 border-2 border-dashed border-stone-200 rounded-2xl inline-block">
              {/* Scalable Vector QR Code Graphic */}
              <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                {/* Outer corners */}
                <rect x="5" y="5" width="30" height="30" fill="#1c1917" rx="4" />
                <rect x="10" y="10" width="20" height="20" fill="white" rx="2" />
                <rect x="15" y="15" width="10" height="10" fill="#eb5e49" rx="2" />

                <rect x="65" y="5" width="30" height="30" fill="#1c1917" rx="4" />
                <rect x="70" y="10" width="20" height="20" fill="white" rx="2" />
                <rect x="75" y="15" width="10" height="10" fill="#eb5e49" rx="2" />

                <rect x="5" y="65" width="30" height="30" fill="#1c1917" rx="4" />
                <rect x="10" y="70" width="20" height="20" fill="white" rx="2" />
                <rect x="15" y="75" width="10" height="10" fill="#eb5e49" rx="2" />

                {/* Random QR pixels for realistic appearance */}
                <rect x="42" y="10" width="6" height="6" fill="#1c1917" />
                <rect x="50" y="18" width="8" height="8" fill="#1c1917" />
                <rect x="40" y="32" width="6" height="12" fill="#1c1917" />
                <rect x="12" y="45" width="8" height="6" fill="#1c1917" />
                <rect x="25" y="42" width="12" height="6" fill="#1c1917" />
                <rect x="48" y="48" width="10" height="10" fill="#eb5e49" />
                <rect x="65" y="42" width="14" height="6" fill="#1c1917" />
                <rect x="85" y="50" width="8" height="12" fill="#1c1917" />
                <rect x="45" y="65" width="8" height="8" fill="#1c1917" />
                <rect x="60" y="68" width="12" height="6" fill="#1c1917" />
                <rect x="78" y="75" width="8" height="12" fill="#1c1917" />
                <rect x="45" y="82" width="14" height="6" fill="#1c1917" />
              </svg>
            </div>
            <div className="text-[11px] text-stone-500 font-medium">
              Present at North Elevator Staff Desk for priority boarding.
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 bg-stone-900 text-white font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}</>}
    </div>
  );
};
