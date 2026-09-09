import React, { useState, useEffect } from 'react';

interface OffRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OffRouteModal: React.FC<OffRouteModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'alert' | 'pin'>('alert');
  const [pin, setPin] = useState('');
  const [timeLeft, setTimeLeft] = useState(175); // 2 mins 55 secs
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStep('alert');
      setPin('');
      setTimeLeft(175);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleKeyClick = (num: string) => {
    if (pin.length < 6) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 6) {
        // Any 6-digit PIN works for verification in demo
        setTimeout(() => {
          onClose();
        }, 400);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 max-w-xs w-full shadow-2xl space-y-4 border border-rose-100 text-center animate-in zoom-in-95">
        {step === 'alert' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto ring-8 ring-rose-50">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">
                SAFETY INTEGRITY CHECK
              </span>
              <h3 className="text-base font-black text-stone-900 mt-0.5">
                Off-Route Divergence Alert
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-snug">
                You appear to have diverged 180m from the designated step-free corridor into an unverified stair sector.
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="bg-rose-50 rounded-2xl p-2.5 border border-rose-200">
              <span className="text-[10px] text-stone-500 font-semibold block">Auto-escalating to David K. in:</span>
              <span className="text-xl font-mono font-black text-rose-600">{formattedTime}</span>
            </div>

            <div>
              <button
                onClick={() => setStep('pin')}
                className="w-full py-3 bg-[#eb5e49] hover:bg-[#d94f3b] text-white font-extrabold text-xs rounded-2xl shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">lock_open</span>
                <span>I'm Safe (Enter PIN)</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center pb-1">
              <button
                onClick={() => setStep('alert')}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ← Back
              </button>
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                CONFIRM IDENTITY
              </span>
              <div className="w-6"></div>
            </div>

            <div>
              <h3 className="text-sm font-black text-stone-900">Enter Safety PIN</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Enter your 6-digit personal travel verification PIN.
              </p>
            </div>

            {/* PIN Dots */}
            <div className="flex justify-center gap-3 py-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    pin.length > i
                      ? 'bg-[#eb5e49] scale-110'
                      : 'bg-stone-200 ring-2 ring-stone-100'
                  }`}
                ></div>
              ))}
            </div>

            {/* Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-1 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleKeyClick(n)}
                  className="w-14 h-12 mx-auto rounded-2xl bg-stone-50 hover:bg-stone-100 font-extrabold text-base text-stone-900 transition active:scale-90 border border-stone-200/60 shadow-xs flex items-center justify-center"
                >
                  {n}
                </button>
              ))}
              <div className="w-14 h-12 mx-auto"></div>
              <button
                onClick={() => handleKeyClick('0')}
                className="w-14 h-12 mx-auto rounded-2xl bg-stone-50 hover:bg-stone-100 font-extrabold text-base text-stone-900 transition active:scale-90 border border-stone-200/60 shadow-xs flex items-center justify-center"
              >
                0
              </button>
              <button
                onClick={handleDelete}
                className="w-14 h-12 mx-auto rounded-2xl bg-stone-50 hover:bg-stone-100 font-bold text-xs text-stone-600 transition active:scale-90 border border-stone-200/60 shadow-xs flex items-center justify-center"
              >
                ⌫
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
