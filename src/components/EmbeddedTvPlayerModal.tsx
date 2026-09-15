import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Tv,
  Radio,
  Star,
  RefreshCw,
} from 'lucide-react';
import { Channel } from '../types';
import { getChannelLogo } from '../data/channelLogos';
import { EpgService } from '../services/epgService';
import { soundService } from '../services/soundService';

interface EmbeddedTvPlayerModalProps {
  channel: Channel | null;
  allChannels: Channel[];
  favorites: string[];
  onClose: () => void;
  onSelectChannel: (channel: Channel) => void;
  onToggleFavorite: (channelName: string) => void;
}

export const EmbeddedTvPlayerModal: React.FC<EmbeddedTvPlayerModalProps> = ({
  channel,
  allChannels,
  favorites,
  onClose,
  onSelectChannel,
  onToggleFavorite,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showChannelDrawer, setShowChannelDrawer] = useState(false);
  const hideControlsTimerRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!channel) return null;

  const isFavorite = favorites.includes(channel.name);
  const epgService = EpgService.getInstance();
  const epg = epgService.getChannelEpg(channel.name);
  const currentProgram = epg.currentProgram;
  const nextProgram = epg.nextProgram;
  const logoSrc = channel.logo || getChannelLogo(channel.name);

  // Auto-hide controls in player mode after inactivity
  const resetControlsTimer = () => {
    setIsControlsVisible(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    hideControlsTimerRef.current = window.setTimeout(() => {
      setIsControlsVisible(false);
    }, 4000);
  };

  useEffect(() => {
    resetControlsTimer();
    return () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, [channel]);

  // Channel switching helper (Next / Previous)
  const currentIndex = allChannels.findIndex(
    (c) => c.name.toLowerCase() === channel.name.toLowerCase()
  );

  const handleNextChannel = () => {
    if (allChannels.length === 0) return;
    const nextIdx = (currentIndex + 1) % allChannels.length;
    soundService.playSelect();
    onSelectChannel(allChannels[nextIdx]);
  };

  const handlePrevChannel = () => {
    if (allChannels.length === 0) return;
    const prevIdx = (currentIndex - 1 + allChannels.length) % allChannels.length;
    soundService.playSelect();
    onSelectChannel(allChannels[prevIdx]);
  };

  // Keyboard navigation for TV player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetControlsTimer();

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Arrow Up / Down to zap channels
      if (e.key === 'ArrowUp' || e.key === 'ChannelUp') {
        e.preventDefault();
        handleNextChannel();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ChannelDown') {
        e.preventDefault();
        handlePrevChannel();
        return;
      }

      // 'f' or '0' to toggle favorite
      if (e.key === 'f' || e.key === 'F' || e.key === '0') {
        e.preventDefault();
        onToggleFavorite(channel.name);
        return;
      }

      // 'm' to toggle mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setIsMuted((prev) => !prev);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allChannels, channel]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        // Fullscreen API may be blocked in some iframes
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimer}
      onClick={resetControlsTimer}
      className="fixed inset-0 z-50 bg-black flex flex-col items-stretch justify-between select-none overflow-hidden"
    >
      {/* 1. TOP BAR OVERLAY (Samsung TV+ Glass) */}
      <div
        className={`absolute top-0 inset-x-0 z-30 transition-all duration-300 p-3 sm:p-5 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/90 via-black/50 to-transparent ${
          isControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {/* Channel Identity */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Voltar para a lista de canais"
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-[#0381fe] text-white border border-white/20 transition cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-[#0b0f19] border border-white/15 p-1.5 flex items-center justify-center shadow-lg">
            <img
              src={logoSrc}
              alt={channel.name}
              className="max-w-full max-h-full object-contain drop-shadow"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider">
                <Radio className="w-3 h-3 animate-pulse" /> AO VIVO
              </span>
              <span className="text-xs text-slate-300 font-mono hidden sm:inline">
                {channel.group || 'Geral'}
              </span>
              <button
                type="button"
                onClick={() => onToggleFavorite(channel.name)}
                className={`p-1 rounded transition ${
                  isFavorite ? 'text-amber-400' : 'text-white/40 hover:text-white'
                }`}
                title="Favoritar canal"
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
            <h1 className="text-base sm:text-xl font-black text-white tracking-wide truncate max-w-[240px] sm:max-w-md">
              {channel.name}
            </h1>
          </div>
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center gap-2">
          {/* Recarregar canal */}
          <button
            type="button"
            onClick={() => setIframeKey((prev) => prev + 1)}
            title="Recarregar transmissão"
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer backdrop-blur-md"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Abrir em nova aba caso o site bloqueie em iframe */}
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir diretamente na fonte externa"
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer backdrop-blur-md"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Alternar tela cheia */}
          <button
            type="button"
            onClick={toggleFullscreen}
            title="Tela cheia"
            className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer backdrop-blur-md"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Fechar Player */}
          <button
            type="button"
            onClick={onClose}
            title="Sair do player (Esc)"
            className="p-2 sm:p-2.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white transition cursor-pointer shadow-lg ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. THE EMBEDDED STREAM IFRAME */}
      <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center">
        <iframe
          key={iframeKey}
          src={channel.url}
          title={`Transmissão ${channel.name}`}
          className="w-full h-full border-0 absolute inset-0 bg-black"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        />

        {/* Fallback Overlay if browser or external server restricts inline frame */}
        <div className="pointer-events-none absolute bottom-24 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 border border-white/10 text-white/70 text-[11px] backdrop-blur-md">
          <span>Caso trave:</span>
          <a
            href={channel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto text-[#0381fe] font-bold hover:underline"
          >
            Abrir em Nova Aba &rarr;
          </a>
        </div>
      </div>

      {/* 3. BOTTOM TV CONTROLS & EPG OVERLAY */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 transition-all duration-300 p-3 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-3 ${
          isControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Live EPG Timeline */}
        {currentProgram && (
          <div className="samsung-glass-subtle rounded-2xl p-3 sm:p-4 border border-white/10 max-w-4xl mx-auto w-full backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2 text-xs sm:text-sm mb-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0381fe] animate-pulse" />
                <span className="font-black text-white">{currentProgram.title}</span>
                {currentProgram.category && (
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    • {currentProgram.category}
                  </span>
                )}
              </div>
              <span className="font-mono text-slate-300 font-bold text-xs">
                {currentProgram.start} - {currentProgram.stop}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="bg-[#0381fe] h-full rounded-full transition-all duration-1000 shadow-md shadow-[#0381fe]"
                style={{ width: `${currentProgram.progressPercent || 45}%` }}
              />
            </div>

            {nextProgram && (
              <p className="text-[11px] text-slate-400 truncate">
                <span className="font-semibold text-slate-300">A seguir:</span> {nextProgram.title} ({nextProgram.start})
              </p>
            )}
          </div>
        )}

        {/* Quick Channel Zap Bar (Zapear Canais) */}
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <button
            type="button"
            onClick={handlePrevChannel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-[#0381fe] text-white font-bold text-xs border border-white/15 cursor-pointer backdrop-blur-md transition shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Canal Anterior</span>
            <span className="sm:hidden">Anterior</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowChannelDrawer((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0381fe] hover:bg-blue-600 text-white font-bold text-xs border border-blue-400/40 cursor-pointer shadow-lg shadow-[#0381fe]/40 transition"
            >
              <Tv className="w-4 h-4" />
              <span>Lista de Canais ({currentIndex + 1}/{allChannels.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextChannel}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-[#0381fe] text-white font-bold text-xs border border-white/15 cursor-pointer backdrop-blur-md transition shadow-md"
          >
            <span className="hidden sm:inline">Próximo Canal</span>
            <span className="sm:hidden">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. DRAWER LATERAL DE CANAIS DENTRO DO PLAYER (Estilo Samsung One UI TV Quick List) */}
      {showChannelDrawer && (
        <div
          className="absolute inset-y-0 right-0 z-40 w-80 sm:w-96 samsung-glass border-l border-white/15 p-4 flex flex-col backdrop-blur-2xl animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-[#0381fe]" />
              <h3 className="font-bold text-white text-sm">Zapear Canais</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowChannelDrawer(false)}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 tv-scroll-smooth">
            {allChannels.map((ch, idx) => {
              const isActive = ch.name.toLowerCase() === channel.name.toLowerCase();
              const logo = ch.logo || getChannelLogo(ch.name);
              return (
                <button
                  key={ch.id || `${ch.name}-${idx}`}
                  type="button"
                  onClick={() => {
                    soundService.playSelect();
                    onSelectChannel(ch);
                    setShowChannelDrawer(false);
                  }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                    isActive
                      ? 'bg-[#0381fe] text-white border-blue-400/50 shadow-lg shadow-[#0381fe]/30 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/10 p-1 shrink-0 flex items-center justify-center">
                    <img src={logo} alt={ch.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs truncate">{ch.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{ch.group || 'Geral'}</p>
                  </div>
                  {favorites.includes(ch.name) && (
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
