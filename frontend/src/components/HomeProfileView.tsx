import React, { useEffect, useState } from 'react';
import type { TabType } from '../types';
import wayloMascot from '../assets/waylo-mascot.png';
import { TripCreationFlow } from './TripCreationFlow';

type PulseProps = { icon: string; tone: string; badge: string; badgeTone: string; label: string; title: string; copy: string; action: string; actionTone: string; onClick: () => void };

const PulseCard: React.FC<PulseProps> = ({ icon, tone, badge, badgeTone, label, title, copy, action, actionTone, onClick }) => (
  <button type="button" onClick={onClick} className="min-h-[228px] rounded-2xl border border-[#e8ddd8] bg-white p-4 text-left shadow-[0_3px_10px_rgba(60,42,37,0.05)] transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]">
    <div className="flex items-center justify-between gap-2"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}><span className="material-symbols-outlined text-[19px]">{icon}</span></span><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold tracking-wide ${badgeTone}`}>{badge}</span></div>
    <div className="mt-5"><p className="text-[11px] font-extrabold uppercase tracking-wide text-[#6c5550]">{label}</p><h2 className="mt-2 text-[16px] font-extrabold leading-tight tracking-tight text-stone-900">{title}</h2><p className="mt-1.5 text-[13px] font-medium leading-snug text-[#725d58]">{copy}</p></div>
    <div className={`mt-4 border-t border-[#eee5e1] pt-3 text-[12px] font-extrabold ${actionTone}`}>{action}</div>
  </button>
);

export const HomeProfileView: React.FC<{ onDraftCreated: (travelerCount: number) => void; onOpenPlanning: () => void; onOpenTokyoItinerary: () => void; onNavigate: (tab: TabType) => void; showTripCreator: boolean; onTripCreatorShown: () => void }> = ({ onDraftCreated, onOpenPlanning, onOpenTokyoItinerary, onNavigate, showTripCreator, onTripCreatorShown }) => {
  const [configured, setConfigured] = useState(false);
  const [tripCreated, setTripCreated] = useState(false);
  const [tripStatus, setTripStatus] = useState<'Planning' | 'Confirmed'>('Planning');
  const [isTripCreatorOpen, setIsTripCreatorOpen] = useState(false);
  const [isWayloTalking, setIsWayloTalking] = useState(false);
  const [isWayloOpen, setIsWayloOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [wayloReply, setWayloReply] = useState('');
  const [typedQuestion, setTypedQuestion] = useState('');
  useEffect(() => {
    if (!showTripCreator) return;
    setIsTripCreatorOpen(true);
    onTripCreatorShown();
  }, [showTripCreator, onTripCreatorShown]);
  const talkToWaylo = () => {
    const message = "Hi Jason! Your Tokyo journey is all set. The Meiji Jingu ramp has been verified step-free for today.";
    setIsWayloTalking(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(message);
      speech.rate = 1;
      speech.onend = () => setIsWayloTalking(false);
      speech.onerror = () => setIsWayloTalking(false);
      window.speechSynthesis.speak(speech);
    }
  };
  const askWaylo = (question: string) => {
    setIsListening(false);
    setWayloReply('Waylo is checking your trip…');
    window.setTimeout(() => {
      const isElevator = question.toLowerCase().includes('elevator');
      const isBudget = question.toLowerCase().includes('budget');
      setWayloReply(isElevator ? 'The nearest verified elevator is at Harajuku Station, 280m ahead.' : isBudget ? 'Your group is ¥18,500 over budget. I found two accessible options that can rebalance it.' : 'Your next stop is the Meiji Jingu Ramp, 12 minutes away on a verified step-free route.');
    }, 850);
  };
  const startListening = () => {
    setIsListening(true);
    setWayloReply('');
    window.setTimeout(() => askWaylo('What is next?'), 1400);
  };
  return <div className="w-full px-5 pb-28 pt-5">
    <section role="button" tabIndex={0} onClick={onOpenTokyoItinerary} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onOpenTokyoItinerary(); }} className="cursor-pointer overflow-hidden rounded-[22px] border border-[#eadeda] bg-white shadow-[0_10px_25px_rgba(51,35,31,0.06)]">
      <button type="button" onClick={onOpenTokyoItinerary} className="relative block h-52 w-full overflow-hidden text-left">
        <img className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArsIyOgaOOBR23X1TkfYe6GL3Up85Bio0PyuL9xmNxFX-1fM3hF17edx5TE2OaiCoI4pyN-T_ANfY7G3281dNFwyiKNFWPhoTWXCT-uG1NFFEBE28s3GNxNkKdsTGVW3T50JNnxH13zBGsJXXIEw4BxTqluMssOEWInYQ1B9iYOdG-cQPHzqH87vKMbUsFXCD9pqlOfh2Lfy8Iy0ohpZ4rFqae_KJgPq0gtT-HYiIjmKOVWdyQ8ihF" alt="Tokyo cityscape at sunset" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#332b28]/95 via-[#332b28]/35 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-extrabold text-[#006c51] shadow-sm"><span className="material-symbols-outlined text-[16px]">check_circle</span> ACTIVE ITINERARY</div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#87f7ce] px-2.5 py-1 text-[10px] font-extrabold text-[#00513c] shadow-sm"><span className="material-symbols-outlined text-[14px]">accessible</span> 100% Step-Free</div>
        <div className="absolute bottom-4 left-4 right-4 text-white"><p className="text-[10px] font-extrabold tracking-[0.13em]">TOKYO SPRING EXPEDITION</p><h1 className="mt-1 text-[20px] font-extrabold leading-tight tracking-tight">Tokyo Accessible Spring Journey</h1></div>
      </button>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2"><span className="inline-flex items-center gap-1 rounded-full bg-[#f3ede9] px-3 py-2 text-[12px] font-bold text-stone-800"><span className="material-symbols-outlined text-[16px] text-[#aa2f1f]">calendar_today</span> May 12–19 (7 Days)</span><span className="inline-flex items-center gap-1 rounded-full bg-[#f3ede9] px-3 py-2 text-[12px] font-bold text-stone-800"><span className="material-symbols-outlined text-[16px] text-[#006c51]">group</span> 4 Travelers Synced</span><span className="inline-flex items-center gap-1 rounded-full bg-[#dffbed] px-3 py-2 text-[12px] font-bold text-[#006c51]"><span className="material-symbols-outlined text-[16px]">verified</span> Triple-Audited</span></div>
        <button onClick={(event) => { event.stopPropagation(); setConfigured(!configured); }} className="flex w-full items-center gap-3 rounded-2xl border border-[#ecd9d3] bg-[#faf4f1] p-3.5 text-left transition hover:bg-[#f8efeb]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f7dfd9] text-[#c34736]"><span className="material-symbols-outlined text-[19px]">tune</span></span><span className="min-w-0 flex-1"><span className="block text-[12px] font-extrabold text-stone-900">Accessibility Specs (3 Verified Filters)</span><span className="mt-1 block truncate text-[12px] font-medium text-[#725d58]">{configured ? 'Settings saved for this journey' : 'Doorways >85cm • Roll-in W/C • EV Power'}</span></span><span className="material-symbols-outlined text-[#8c716c]">chevron_right</span></button>
      </div>
    </section>
    <button onClick={() => setIsTripCreatorOpen(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#aa2f1f] bg-white px-5 py-3.5 text-[14px] font-extrabold text-[#aa2f1f] shadow-sm transition hover:bg-[#fff0ec] active:scale-[0.98]">
      <span className="material-symbols-outlined text-[19px]">add_circle</span>
      {tripCreated ? `New trip • ${tripStatus}` : 'Create another trip'}
    </button>
    <div className="mt-12 flex items-center justify-between"><h2 className="text-[20px] font-extrabold tracking-tight text-stone-900">Trip Pulse</h2><span className="flex items-center gap-1 text-[17px] font-extrabold text-[#006c51]"><span className="h-2.5 w-2.5 rounded-full bg-[#59a38e]" /> Live Status</span></div>
    <section className="mt-10 grid grid-cols-2 gap-4">
      <PulseCard onClick={() => onNavigate('today')} icon="near_me" tone="bg-[#f9e9e6] text-[#c34736]" badge="DAY 1 OF 7" badgeTone="bg-[#dffbed] text-[#006c51]" label="Today's Focus" title="Meiji Jingu Ramp" copy="Smooth gradient entry verified step-free." action="Timeline →" actionTone="text-[#c34736]" />
      <PulseCard onClick={() => onNavigate('group')} icon="verified_user" tone="bg-[#86efc9] text-[#006c51]" badge="UNANIMOUS" badgeTone="bg-[#e2f8ef] text-[#006c51]" label="Consensus" title="4 / 4 Ready" copy="Zero conflicting physical access requirements." action="View group →" actionTone="text-[#006c51]" />
      <PulseCard onClick={() => onNavigate('wallet')} icon="receipt_long" tone="bg-[#ffe1df] text-[#c81e1e]" badge="ALERT" badgeTone="bg-[#c91c25] text-white" label="Budget Alert" title="+¥18,500 Over" copy="Accessible jumbo van hire adjustment." action="Rebalance ›" actionTone="text-[#c81e1e]" />
      <PulseCard onClick={() => onNavigate('itinerary')} icon="elevator" tone="bg-[#dfc204] text-[#4c3e00]" badge="PRE-CLEARED" badgeTone="bg-[#dffbed] text-[#006c51]" label="Verification" title="18 Elevators" copy="Tokyo Metro transit hubs tested & certified." action="View itinerary →" actionTone="text-[#006c51]" />
    </section>
    {isTripCreatorOpen && <TripCreationFlow onClose={() => setIsTripCreatorOpen(false)} onDraftCreated={(travelerCount) => { setTripCreated(true); setTripStatus('Planning'); onDraftCreated(travelerCount); }} onOpenPlanning={() => { setIsTripCreatorOpen(false); onOpenPlanning(); }} />}
    <section className="fixed bottom-24 right-3 z-40 isolate w-48 overflow-visible md:right-[calc(50%-13rem)]">
      <div className="relative z-10 mr-8 rounded-[20px] rounded-br-md bg-[#dff5ff] p-3 text-[#273d49] shadow-[0_8px_18px_rgba(51,35,31,0.14)] before:absolute before:-bottom-2 before:right-4 before:h-5 before:w-5 before:bg-[#dff5ff] before:[clip-path:polygon(0_0,100%_0,100%_100%)]">
        <div className="flex items-center gap-1"><h2 className="text-[12px] font-extrabold">Waylo</h2><span className="rounded-full bg-white/70 px-1.5 py-0.5 text-[8px] font-extrabold tracking-wide text-[#006c51]">GUIDE</span></div>
        <p className="mt-1 text-[11px] font-semibold leading-snug">{isWayloTalking ? 'I’m speaking…' : 'Your route is ready!'}</p>
        <button onClick={() => { setIsWayloOpen(true); talkToWaylo(); }} className="mt-2 flex items-center gap-1 rounded-full bg-[#aa2f1f] px-2.5 py-1.5 text-[10px] font-extrabold text-white shadow-sm transition hover:bg-[#8b190c] active:scale-95"><span className="material-symbols-outlined text-[14px]">volume_up</span>{isWayloTalking ? 'Talking' : 'Talk to Waylo'}</button>
      </div>
      <button aria-label="Open Waylo" onClick={() => setIsWayloOpen(true)} className="absolute -bottom-3 right-0 z-20 h-[88px] w-[76px] overflow-visible">
        <img src={wayloMascot} alt="Waylo, the AllWays travel guide" className="absolute bottom-0 right-[-9px] h-[96px] max-w-none object-contain" />
        <span className={`absolute bottom-[19px] left-[7px] h-2 w-2 rounded-full bg-[#006c51] ring-4 ring-white/90 ${isWayloTalking ? 'animate-ping' : ''}`} />
      </button>
    </section>
    {isWayloOpen && <div className="fixed inset-x-0 bottom-0 z-50 flex h-screen items-end bg-stone-900/25 md:left-1/2 md:right-auto md:w-[448px] md:-translate-x-1/2" onClick={() => setIsWayloOpen(false)}>
      <section aria-label="Talk to Waylo" className="max-h-[86dvh] w-full overflow-y-auto rounded-t-[30px] bg-[#fef8f4] px-5 pb-6 pt-3 shadow-[0_-12px_36px_rgba(38,27,23,0.22)]" onClick={(event) => event.stopPropagation()}>
        <div className="mx-auto h-1.5 w-11 rounded-full bg-stone-300" />
        <div className="mt-4 flex items-center justify-between"><div className="flex items-center gap-3"><div className="h-12 w-12 overflow-hidden rounded-2xl bg-[#ffe4dc]"><img src={wayloMascot} alt="" className="h-14 max-w-none object-contain" /></div><div><h2 className="text-[18px] font-extrabold tracking-tight text-stone-900">Talk to Waylo</h2><p className="text-[11px] font-bold text-[#006c51]">YOUR ACTIVE TRIP GUIDE</p></div></div><button onClick={() => setIsWayloOpen(false)} aria-label="Close Waylo" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3ede9] text-stone-600"><span className="material-symbols-outlined">close</span></button></div>
        <div className="mt-5 rounded-2xl rounded-tl-sm bg-[#dff5ff] p-4 text-[14px] font-semibold leading-relaxed text-[#273d49]">{isListening ? 'I’m listening… tell me what you need.' : wayloReply || 'Hi Jason! I can help you navigate, adjust your day, or check on the group.'}</div>
        {wayloReply && !isListening && <div className="mt-3 rounded-2xl border border-[#d7e9df] bg-white p-3.5 shadow-sm"><p className="text-[10px] font-extrabold uppercase tracking-wide text-[#006c51]">Trip update</p><p className="mt-1 text-[13px] font-semibold leading-snug text-stone-800">{wayloReply.includes('elevator') ? 'Accessible route confirmed — elevator status is live.' : wayloReply.includes('budget') ? 'Two accessible alternatives are ready for review.' : 'No stairs, escalators, or steep curbs on this route.'}</p><button className="mt-3 flex items-center gap-1 text-[12px] font-extrabold text-[#aa2f1f]">Open details <span className="material-symbols-outlined text-[15px]">arrow_forward</span></button></div>}
        <div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => askWaylo('What is next?')} className="rounded-xl border border-[#eadeda] bg-white px-3 py-2.5 text-left text-[11px] font-bold text-stone-700">What’s next?</button><button onClick={() => askWaylo('Nearest elevator')} className="rounded-xl border border-[#eadeda] bg-white px-3 py-2.5 text-left text-[11px] font-bold text-stone-700">Find an elevator</button><button onClick={() => askWaylo('Make today easier')} className="rounded-xl border border-[#eadeda] bg-white px-3 py-2.5 text-left text-[11px] font-bold text-stone-700">Make today easier</button><button onClick={() => askWaylo('Check budget')} className="rounded-xl border border-[#eadeda] bg-white px-3 py-2.5 text-left text-[11px] font-bold text-stone-700">Check budget</button></div>
        <button onClick={startListening} className={`mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full text-white shadow-[0_6px_16px_rgba(170,47,31,0.3)] transition active:scale-95 ${isListening ? 'bg-[#006c51] animate-pulse' : 'bg-[#aa2f1f]'}`}><span className="material-symbols-outlined text-[29px]">{isListening ? 'graphic_eq' : 'mic'}</span></button><p className="mt-2 text-center text-[11px] font-bold text-stone-500">{isListening ? 'Listening…' : 'Tap to start talking'}</p>
        <form onSubmit={(event) => { event.preventDefault(); if (typedQuestion.trim()) { askWaylo(typedQuestion); setTypedQuestion(''); } }} className="mt-4 flex items-center gap-2 rounded-full border border-[#e4d8d4] bg-white px-3 py-1.5"><input value={typedQuestion} onChange={(event) => setTypedQuestion(event.target.value)} placeholder="Type instead…" className="min-w-0 flex-1 bg-transparent py-1 text-[13px] text-stone-800 outline-none placeholder:text-stone-400" /><button type="submit" aria-label="Send question" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#aa2f1f] text-white"><span className="material-symbols-outlined text-[17px]">arrow_upward</span></button></form>
      </section>
    </div>}
  </div>;
};
