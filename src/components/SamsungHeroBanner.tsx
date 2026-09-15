import React from 'react';
import { Play, RotateCcw, Tv, Clock } from 'lucide-react';
import { Channel } from '../types';
import { getChannelLogo } from '../data/channelLogos';
import { EpgService } from '../services/epgService';
import { soundService } from '../services/soundService';

interface SamsungHeroBannerProps {
  lastChannel: Channel | null;
  onPlayChannel: (channel: Channel) => void;
  onOpenLivePanel: () => void;
}

export const SamsungHeroBanner: React.FC<SamsungHeroBannerProps> = ({
  lastChannel,
  onPlayChannel,
  onOpenLivePanel,
}) => {
  // If no channel has been played yet, fallback to a premier channel like ESPN or Globo
  const channelToDisplay = lastChannel || {
    name: 'ESPN HD',
    url: 'https://vini.fun/espn',
    group: 'ESPORTES',
    logo: 'https://i.imgur.com/8Q7VfP1.png',
  };

  const epgService = EpgService.getInstance();
  const channelEpg = epgService.getChannelEpg(channelToDisplay.name);
  const current = channelEpg.currentProgram;
  const logoSrc = channelToDisplay.logo || getChannelLogo(channelToDisplay.name);

  return (
    <div className="w-full max-w-[1760px] mx-auto px-3 sm:px-6 pt-3 pb-1 select-none">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0d1322] via-[#0a0f1d] to-[#04060a] p-4 sm:p-6 shadow-2xl backdrop-blur-2xl">
        {/* Background Ambient Glow inspired by Samsung One UI */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-[#0381fe]/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          {/* Left info: Last played channel badge, logo, name, live program */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#080c16] border border-white/10 flex items-center justify-center p-2.5 shadow-xl ring-2 ring-[#0381fe]/30">
              <img
                src={logoSrc}
                alt={channelToDisplay.name}
                className="max-w-full max-h-full object-contain filter drop-shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getChannelLogo(channelToDisplay.name);
                }}
              />
              <span className="absolute -bottom-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white shadow-md">
                ●
              </span>
            </div>

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0381fe]/20 border border-[#0381fe]/40 text-[#0381fe] text-[10px] font-mono font-bold uppercase tracking-wider">
                  <RotateCcw className="w-3 h-3" />
                  {lastChannel ? 'Último Programa Assistido' : 'Destaque Samsung TV+'}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {channelToDisplay.group || 'Geral'}
                </span>
              </div>

              <h2 className="text-base sm:text-xl font-black text-white tracking-wide truncate">
                {channelToDisplay.name}
              </h2>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#9da8be]">
                <Clock className="w-3.5 h-3.5 text-[#0381fe]" />
                <span className="font-semibold text-white truncate max-w-[280px] sm:max-w-md">
                  {current?.title || 'Programação Ao Vivo HD'}
                </span>
                {current?.start && (
                  <span className="font-mono text-xs text-slate-400 hidden xs:inline">
                    ({current.start} - {current.stop})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              id="hero-btn-play-last"
              type="button"
              tabIndex={0}
              onClick={() => {
                soundService.playSelect();
                onPlayChannel(channelToDisplay);
              }}
              className="tv-nav-focus flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0381fe] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#0381fe]/40 border border-blue-400/50 cursor-pointer outline-none transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Sintonizar Agora</span>
            </button>

            <button
              id="hero-btn-open-panel"
              type="button"
              tabIndex={0}
              onClick={() => {
                soundService.playSelect();
                onOpenLivePanel();
              }}
              className="tv-nav-focus flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 cursor-pointer outline-none transition"
            >
              <Tv className="w-4 h-4 text-cyan-300" />
              <span className="hidden sm:inline">Camada Interativa</span>
              <span className="sm:hidden">Painel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
