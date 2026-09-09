import React, { useEffect, useState } from 'react';
import { TRAVELERS } from '../data/initialData';

export const GroupRadarView: React.FC = () => {
  const [sharingEnabled, setSharingEnabled] = useState(true);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [memberOfflineDemo, setMemberOfflineDemo] = useState(false);
  const [demoAlertOpen, setDemoAlertOpen] = useState(false);
  const [demoSecondsLeft, setDemoSecondsLeft] = useState(15);
  const [demoOutcome, setDemoOutcome] = useState<'active' | 'checking' | 'safe' | 'emergency'>('active');

  useEffect(() => {
    if (!demoAlertOpen || demoOutcome !== 'active') return undefined;
    if (demoSecondsLeft === 0) {
      setDemoOutcome('emergency');
      return undefined;
    }
    const timer = window.setTimeout(() => setDemoSecondsLeft((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [demoAlertOpen, demoOutcome, demoSecondsLeft]);

  const startOfflineDemo = () => {
    setMemberOfflineDemo(true);
    setDemoAlertOpen(true);
    setDemoSecondsLeft(15);
    setDemoOutcome('active');
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-[17px] text-stone-900 tracking-tight">Live Group Radar</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#edfbf7] text-[#006c51] tracking-wider border border-[#daf7ef]">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              E2E ENCRYPTED
            </span>
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Tokyo District Convergence • Shibuya & Harajuku</span>
        </div>

      </div>

      <button type="button" onClick={startOfflineDemo} className="w-full rounded-2xl border border-dashed border-[#eb5e49]/50 bg-[#fff7f5] px-3 py-2 text-left text-[11px] font-bold text-[#aa2f1f] transition hover:bg-[#fff1ef]">
        <span className="material-symbols-outlined mr-1 align-[-3px] text-[15px]">science</span>
        Demo: simulate member offline
      </button>

      {/* Interactive Map Visualizer */}
      <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 shadow-md">
        {/* Stylized vector map canvas */}
        <svg className="w-full h-full object-cover opacity-80" viewBox="0 0 400 300">
          <defs>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#eb5e49" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#eb5e49" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="routeLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#eb5e49" />
            </linearGradient>
          </defs>

          {/* Map Grid / City streets */}
          <rect width="400" height="300" fill="#1c1917" />
          {/* Parks & green areas */}
          <path d="M 20 20 Q 80 40 120 100 Q 80 160 30 140 Z" fill="#064e3b" opacity="0.3" />
          <path d="M 280 180 Q 360 200 380 270 Q 300 290 260 230 Z" fill="#064e3b" opacity="0.25" />

          {/* Roads */}
          <path d="M 0 120 L 400 130" stroke="#44403c" strokeWidth="4" />
          <path d="M 160 0 L 220 300" stroke="#44403c" strokeWidth="6" />
          <path d="M 50 250 L 350 70" stroke="#44403c" strokeWidth="3" />
          <path d="M 220 80 L 360 160" stroke="#57534e" strokeWidth="2" strokeDasharray="4 4" />

          {/* Step-free path line between members */}
          <path
            d="M 90 70 Q 180 120 200 160 Q 230 200 310 240"
            stroke="url(#routeLine)"
            strokeWidth="3"
            strokeDasharray="6 4"
            fill="none"
          />

          {/* Step-Free Regroup Hub Radar Pulse (Exit 14 Elevator Plaza) */}
          <circle cx="200" cy="160" r="35" fill="url(#hubGlow)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="200" cy="160" r="14" fill="#eb5e49" opacity="0.9" />
          <circle cx="200" cy="160" r="6" fill="white" />

          {/* Location Labels */}
          <text x="30" y="55" fill="#a8a29e" fontSize="10" fontWeight="bold">Meiji Jingu</text>
          <text x="290" y="270" fill="#a8a29e" fontSize="10" fontWeight="bold">Miyashita Park</text>
          <text x="215" y="165" fill="#fca5a5" fontSize="10" fontWeight="bold">Exit 14 Hub</text>
        </svg>

        {/* Member Floating Markers */}
        {/* Sarah & Mei Marker */}
        <div className="absolute top-10 left-16 flex items-center gap-1 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <img
              src={TRAVELERS[0].photoUrl}
              alt="Sarah"
              className="w-8 h-8 rounded-full ring-2 ring-[#eb5e49] shadow-md object-cover"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-1 ring-black"></span>
          </div>
          <div className="bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-white/20">
            Sarah & Mei (850m)
          </div>
        </div>

        {/* Jason Marker */}
        <div className="absolute top-36 left-44 flex items-center gap-1 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-stone-300 ring-2 ring-white shadow-md text-stone-900 font-extrabold text-xs flex items-center justify-center">
              J
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-1 ring-black"></span>
          </div>
          <div className="bg-black/70 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-white/20">
            You (420m)
          </div>
        </div>

        {/* Ivan Marker */}
        <div className="absolute bottom-8 right-14 flex items-center gap-1 -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            {memberOfflineDemo ? <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white ring-2 ring-rose-200 shadow-md"><span className="material-symbols-outlined text-[17px]">wifi_off</span></div> : <><img src={TRAVELERS[3].photoUrl} alt="Ivan" className="w-8 h-8 rounded-full ring-2 ring-amber-400 shadow-md object-cover" /><span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full ring-1 ring-black animate-ping"></span></>}
          </div>
          <div className={`${memberOfflineDemo ? 'bg-rose-950/80 text-rose-100 border-rose-400/30' : 'bg-amber-950/80 text-amber-200 border-amber-500/30'} backdrop-blur-xs text-[9px] font-bold px-1.5 py-0.5 rounded-md border`}>
            {memberOfflineDemo ? 'Ivan (last seen 3m)' : 'Ivan (2.4km • Tight)'}
          </div>
        </div>

        {/* Hub Badge Overlay */}
        <div className="absolute top-3 right-3 bg-stone-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-stone-700 text-[10px] text-white flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#eb5e49] animate-pulse"></span>
          <span className="font-extrabold">Hub: Exit 14 Elevator</span>
        </div>
      </div>

      {/* Trip Members Telemetry List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">Trip Members (4)</h2>
          <span className="text-[10px] text-stone-400 font-medium">All Devices Connected</span>
        </div>

        {TRAVELERS.map((t) => (
          <div
            key={t.id}
            onClick={() => setSelectedMember(selectedMember === t.id ? null : t.id)}
            className="p-3 bg-white rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between hover:border-[#eb5e49]/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-stone-100 shadow-xs"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full ${t.avatarBg} ${t.avatarText} font-black flex items-center justify-center text-sm shadow-xs`}>
                    {t.shortName}
                  </div>
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                  t.bufferStatus === 'tight' ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900">{t.name}</span>
                  {t.role && (
                    <span className="text-[9px] font-bold bg-[#fff1ef] text-[#eb5e49] px-1.5 py-0.5 rounded border border-[#ffe4e0]">
                      {t.role}
                    </span>
                  )}
                  {t.accessibilityTag && (
                    <span className="text-[9px] font-bold bg-[#edfbf7] text-[#006c51] px-1.5 py-0.5 rounded border border-[#daf7ef]">
                      {t.accessibilityTag}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-stone-400 block mt-0.5">{t.statusText}</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[10px] font-extrabold block ${
                t.bufferStatus === 'tight' ? 'text-amber-600' : 'text-[#006c51]'
              }`}>
                {t.bufferText}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Location Sharing Control */}
      <button
        onClick={() => setSharingEnabled(!sharingEnabled)}
        className={`w-full py-2.5 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
          !sharingEnabled
            ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">
          {sharingEnabled ? 'location_off' : 'location_on'}
        </span>
        <span>{sharingEnabled ? 'Turn off my location sharing' : 'Turn on my location sharing'}</span>
      </button>

      {demoAlertOpen && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-stone-900/70 p-4 backdrop-blur-sm"><section className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl"><div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${demoOutcome === 'safe' ? 'bg-emerald-100 text-emerald-600' : demoOutcome === 'emergency' ? 'bg-rose-100 text-rose-600' : 'bg-rose-100 text-rose-600'}`}><span className="material-symbols-outlined text-[27px]">{demoOutcome === 'safe' ? 'verified_user' : demoOutcome === 'emergency' ? 'emergency' : 'warning'}</span></div>{demoOutcome === 'active' && <><span className="mt-4 inline-flex rounded-full bg-rose-50 px-2 py-1 text-[9px] font-extrabold text-rose-600">DEMO RESPONSE WITHIN 00:{String(demoSecondsLeft).padStart(2, '0')}</span><h2 className="mt-3 text-[17px] font-extrabold text-stone-900">Group member offline</h2><p className="mt-1 text-[12px] font-medium leading-relaxed text-stone-600">Ivan’s location has not updated. Please confirm that he is safe.</p><p className="mt-3 rounded-xl bg-[#f8f2ef] p-2.5 text-left text-[10px] font-medium leading-snug text-stone-500">If no one responds, AllWays contacts emergency services and designated contacts.</p><div className="mt-4 space-y-2"><button type="button" onClick={() => setDemoOutcome('safe')} className="w-full rounded-xl bg-[#006c51] py-3 text-[12px] font-extrabold text-white">They’re safe</button><button type="button" onClick={() => setDemoOutcome('emergency')} className="w-full rounded-xl border border-rose-200 bg-rose-50 py-3 text-[12px] font-extrabold text-rose-600">Contact emergency</button><button type="button" onClick={() => setDemoOutcome('checking')} className="w-full py-2 text-[11px] font-bold text-stone-500">I’ll check on them</button></div></>}{demoOutcome === 'checking' && <><h2 className="mt-4 text-[17px] font-extrabold text-stone-900">Check-in sent</h2><p className="mt-2 text-[12px] font-medium leading-relaxed text-stone-600">Ivan has been pinged and the group can meet at Exit 14 Elevator Hub.</p><button type="button" onClick={() => setDemoAlertOpen(false)} className="mt-5 w-full rounded-xl bg-stone-900 py-3 text-[12px] font-extrabold text-white">Continue monitoring</button></>}{demoOutcome === 'safe' && <><h2 className="mt-4 text-[17px] font-extrabold text-stone-900">Ivan is safe</h2><p className="mt-2 text-[12px] font-medium leading-relaxed text-stone-600">Location sharing is restored and the group has been updated.</p><button type="button" onClick={() => { setMemberOfflineDemo(false); setDemoAlertOpen(false); }} className="mt-5 w-full rounded-xl bg-[#006c51] py-3 text-[12px] font-extrabold text-white">Back to group</button></>}{demoOutcome === 'emergency' && <><h2 className="mt-4 text-[17px] font-extrabold text-stone-900">Emergency contacts notified</h2><p className="mt-2 text-[12px] font-medium leading-relaxed text-stone-600">The emergency flow has started. Keep trying to contact Ivan and go to the step-free hub.</p><button type="button" onClick={() => setDemoAlertOpen(false)} className="mt-5 w-full rounded-xl bg-rose-600 py-3 text-[12px] font-extrabold text-white">Continue</button></>}</section></div>}
    </div>
  );
};
