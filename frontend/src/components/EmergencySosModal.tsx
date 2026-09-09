import React, { useState } from 'react';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({ isOpen, onClose }) => {
  const [broadcasted, setBroadcasted] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSpeak = (text: string, jaText: string) => {
    setSpeakingText(jaText);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(jaText);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.9;
      utterance.onend = () => setSpeakingText(null);
      utterance.onerror = () => setSpeakingText(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setSpeakingText(null), 2500);
    }
  };

  const handleBroadcast = () => {
    setBroadcasted(true);
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#1c1917] text-white w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-rose-900/60 shadow-2xl p-5 space-y-4 max-h-[92vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-5">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <div>
              <span className="text-[10px] font-black tracking-widest text-rose-400 uppercase block">
                PRIORITY SAFETY MODE
              </span>
              <h2 className="text-base font-black text-white tracking-tight">Emergency Assistance</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center text-sm"
          >
            ✕
          </button>
        </div>

        {/* Big Crimson SOS Broadcast Trigger */}
        <div className="text-center space-y-2">
          <button
            onClick={handleBroadcast}
            className={`w-full py-4 px-4 rounded-2xl font-black text-sm tracking-wide uppercase transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 ${
              broadcasted
                ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/50 animate-pulse'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {broadcasted ? 'check_circle' : 'cell_tower'}
            </span>
            <span>
              {broadcasted ? 'LIVE GPS BROADCAST ACTIVE' : 'SHARE MY LIVE LOCATION NOW'}
            </span>
          </button>
          <span className="text-[10px] text-stone-400 block font-medium">
            Transmits high-precision step-free coordinates and battery status to group & local responders.
          </span>
        </div>

        {/* Precision Location Card */}
        <div className="bg-stone-900/90 rounded-2xl p-3.5 border border-stone-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-400 text-[10px] font-bold uppercase">Current Ground Location</span>
            <span className="text-emerald-400 text-[10px] font-bold">Accuracy ±3m</span>
          </div>
          <div className="font-bold text-white text-sm">
            JR Shinjuku Station South Gate (Elevator Bay 4)
          </div>
          <div className="text-[11px] text-stone-400 font-mono">
            35.6896° N, 139.7006° E • Platform 4 Upper Mezzanine
          </div>
          <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px]">
            <span className="text-stone-400">Emergency Contact:</span>
            <span className="text-white font-bold">David K. (+60 12-345 6789)</span>
          </div>
        </div>

        {/* Japan Direct Emergency Contacts */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block px-1">
            Direct Emergency Services (Tokyo)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:110"
              className="p-3 bg-stone-900 hover:bg-stone-800 rounded-2xl border border-stone-800 flex items-center gap-2.5 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">local_police</span>
              </div>
              <div>
                <span className="text-xs font-black text-white block">Police</span>
                <span className="text-[10px] text-blue-400 font-bold">Dial 110</span>
              </div>
            </a>

            <a
              href="tel:119"
              className="p-3 bg-stone-900 hover:bg-stone-800 rounded-2xl border border-stone-800 flex items-center gap-2.5 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">emergency</span>
              </div>
              <div>
                <span className="text-xs font-black text-white block">Ambulance</span>
                <span className="text-[10px] text-rose-400 font-bold">Dial 119</span>
              </div>
            </a>

            <a
              href="tel:0355550199"
              className="p-3 bg-stone-900 hover:bg-stone-800 rounded-2xl border border-stone-800 flex items-center gap-2.5 transition active:scale-95"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">accessible</span>
              </div>
              <div>
                <span className="text-xs font-black text-white block">Accessible Taxi</span>
                <span className="text-[10px] text-amber-400 font-bold">03-5555-0199</span>
              </div>
            </a>

            <button
              onClick={() => alert('Connected to AllWays 24/7 Barrier-Free Concierge operator.')}
              className="p-3 bg-stone-900 hover:bg-stone-800 rounded-2xl border border-stone-800 flex items-center gap-2.5 transition active:scale-95 text-left"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
              </div>
              <div>
                <span className="text-xs font-black text-white block">AllWays Support</span>
                <span className="text-[10px] text-emerald-400 font-bold">24/7 Concierge</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bilingual Visual First-Responder Cards with Audio Speech */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block px-1">
            First Responder Japanese Phrase Cards (Tap to Speak)
          </span>

          <div
            onClick={() => handleSpeak(
              'Wheelchair user needing step free route',
              '車椅子の利用者のため、階段を使えません。エレベーターへの案内をお願いします。'
            )}
            className="p-3 bg-stone-900 hover:bg-stone-800/90 rounded-2xl border border-stone-800 cursor-pointer space-y-1 transition active:scale-99"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300">Wheelchair User — Need Elevator</span>
              <span className="material-symbols-outlined text-[18px] text-rose-400">
                {speakingText ? 'volume_up' : 'volume_up'}
              </span>
            </div>
            <div className="text-sm font-black text-white">
              車椅子の利用者のため、階段を使えません。エレベーターへの案内をお願いします。
            </div>
            <div className="text-[10px] text-stone-400 italic">
              "Kurumaisu no riyousha no tame, kaidan o tsukaemasen. Erebētā e no annai o onegaishimasu."
            </div>
          </div>

          <div
            onClick={() => handleSpeak(
              'Where is the nearest elevator?',
              '一番近いエレベーターはどこですか？'
            )}
            className="p-3 bg-stone-900 hover:bg-stone-800/90 rounded-2xl border border-stone-800 cursor-pointer space-y-1 transition active:scale-99"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">Where is the nearest elevator?</span>
              <span className="material-symbols-outlined text-[18px] text-amber-400">volume_up</span>
            </div>
            <div className="text-sm font-black text-white">
              一番近いエレベーターはどこですか？
            </div>
            <div className="text-[10px] text-stone-400 italic">
              "Ichiban chikai erebētā wa doko desu ka?"
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-2xl transition"
        >
          I am safe — Return to Trip Assistant
        </button>
      </div>
    </div>
  );
};
