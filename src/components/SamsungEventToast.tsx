import React from 'react';
import { Activity, Sparkles, X, ChevronRight } from 'lucide-react';
import { matchInfo, matchEvents } from '../data/samsungMatchData';
import { soundService } from '../services/soundService';

interface SamsungEventToastProps {
  visible: boolean;
  onOpenSidePanel: () => void;
  onDismiss: () => void;
}

export const SamsungEventToast: React.FC<SamsungEventToastProps> = ({
  visible,
  onOpenSidePanel,
  onDismiss,
}) => {
  if (!visible) return null;

  // Most recent key event
  const latestEvent = matchEvents[matchEvents.length - 2]; // 59' Penalty Cole Palmer

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-40 animate-slideLeft select-none">
      <div
        className="relative flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl samsung-glass"
        style={{
          borderColor: 'rgba(3, 129, 254, 0.4)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px rgba(3, 129, 254, 0.25)',
          minWidth: '280px',
          maxWidth: '360px',
        }}
      >
        {/* Left Pulse Accent */}
        <span className="absolute -left-px top-3 bottom-3 w-1 rounded-r-full bg-[#0381fe] animate-pulse" />

        {/* Event Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0381fe]/20 border border-[#0381fe]/40 text-[#0381fe]">
          <Activity className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#0381fe]">
              SAMSUNG LIVE MATCH
            </span>
            <span className="font-mono text-[10px] tabular-nums text-emerald-400 font-bold">
              {latestEvent.minute}&apos;
            </span>
          </div>

          <p className="font-bold text-xs text-white leading-tight truncate">
            {latestEvent.player} · Gol ({latestEvent.scoreAfter})
          </p>

          <button
            onClick={() => {
              soundService.playSelect();
              onOpenSidePanel();
            }}
            className="mt-1 flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200 font-semibold cursor-pointer group"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Abrir Painel Samsung TV+</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Close / Dismiss */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            soundService.playSelect();
            onDismiss();
          }}
          className="shrink-0 p-1 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          title="Dispensar notificação"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
