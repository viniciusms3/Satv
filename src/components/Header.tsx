import React, { useState, useEffect } from 'react';
import { LayoutGrid, Menu, Rows3, Clock, MoreVertical, Volume2, VolumeX, Activity } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  totalChannels: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  onOpenMenu?: () => void;
  onOpenSportsPanel?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  totalChannels,
  viewMode,
  setViewMode,
  favoritesCount = 0,
  onOpenFavorites,
  onOpenMenu,
  onOpenSportsPanel,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    setIsMuted((prev) => !prev);
    document.querySelectorAll('video, audio').forEach((el) => {
      (el as HTMLMediaElement).muted = !isMuted;
    });
  };

  return (
    <header className="samsung-glass text-white shadow-2xl border-b border-white/10 select-none backdrop-blur-xl">
      <div className="w-full max-w-[1760px] mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Calligraphic Slogan with Samsung TV+ Badge */}
          <div className="flex items-center space-x-3 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <img
                src="https://i.imgur.com/VWtF2t5.jpeg"
                alt="SATV Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white/80 shadow-lg object-cover bg-black ring-2 ring-[#0381fe]/40"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="sr-only">SATV</span>
            </div>

            <div className="flex items-baseline gap-2.5 min-w-0">
              <h1
                style={{ fontFamily: "'Alex Brush', 'Great Vibes', cursive" }}
                className="text-xl sm:text-2xl text-white font-normal tracking-wide drop-shadow truncate py-0.5"
              >
                Aqui você é a nossa atração
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-[#0381fe]/20 text-[#0381fe] border border-[#0381fe]/40 uppercase">
                Samsung One UI TV
              </span>
            </div>
          </div>

          {/* Navigation Tabs, Audio, Clock & Guia Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* View Mode Switcher (Fileiras, Mosaico, Guia) styled with Samsung TV+ pill tabs */}
            <div className="flex items-center p-1 bg-black/60 rounded-full border border-white/10 shadow-inner">
              {/* Fileiras */}
              <button
                id="tab-btn-fileiras"
                type="button"
                data-tv-nav="tab"
                tabIndex={0}
                onClick={() => setViewMode('rows')}
                className={`tv-nav-focus flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer outline-none ${
                  viewMode === 'rows'
                    ? 'bg-[#0381fe] text-white shadow-lg shadow-[#0381fe]/40'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="Modo TV: fileiras horizontais por categoria"
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Fileiras</span>
              </button>

              {/* Mosaico */}
              <button
                id="tab-btn-canais"
                type="button"
                data-tv-nav="tab"
                tabIndex={0}
                onClick={() => setViewMode('grid')}
                className={`tv-nav-focus flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer outline-none ${
                  viewMode === 'grid'
                    ? 'bg-[#0381fe] text-white shadow-lg shadow-[#0381fe]/40'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="Modo Mosaico: grade vertical de canais"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mosaico</span>
              </button>

              {/* Guia EPG (Tab) */}
              <button
                id="tab-btn-guia-epg"
                type="button"
                data-tv-nav="tab"
                tabIndex={0}
                onClick={() => setViewMode('epg')}
                className={`tv-nav-focus flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer outline-none ${
                  viewMode === 'epg'
                    ? 'bg-[#0381fe] text-white shadow-lg shadow-[#0381fe]/40 font-extrabold'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                title="Guia EPG de canais e programação ao vivo"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Guia</span>
              </button>
            </div>

            {/* Volume / Áudio Button */}
            <button
              id="btn-header-volume"
              type="button"
              data-tv-nav="tab"
              tabIndex={0}
              onClick={toggleSound}
              className="tv-nav-focus flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 hover:bg-black/80 active:bg-black text-gray-200 hover:text-white border border-white/10 shadow-inner transition cursor-pointer outline-none"
              title={isMuted ? 'Ativar Som' : 'Desativar Som (Mudo)'}
              aria-label="Controle de Áudio"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-gray-200" />
              )}
            </button>

            {/* Smart TV Real-Time Clock */}
            {timeStr && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 border border-white/10 text-xs font-mono font-bold text-gray-200 shadow-inner">
                <Clock className="w-3.5 h-3.5 text-[#0381fe]" />
                <span>{timeStr}</span>
              </div>
            )}

            {/* Samsung TV+ Sports & AI Overlay Trigger */}
            {onOpenSportsPanel && (
              <button
                id="btn-header-samsung-sports"
                type="button"
                data-tv-nav="tab"
                tabIndex={0}
                onClick={onOpenSportsPanel}
                className="tv-nav-focus hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#0381fe]/30 to-cyan-500/20 hover:from-[#0381fe]/50 hover:to-cyan-500/40 text-cyan-300 font-bold text-xs border border-[#0381fe]/50 shadow-md transition cursor-pointer outline-none"
                title="Abrir Painel Esportivo Interativo Samsung TV Plus"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden md:inline">Samsung Live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              </button>
            )}

            {/* Botão Guia / Menu Samsung TV+ Style */}
            {onOpenMenu && (
              <button
                id="btn-three-dots-menu"
                type="button"
                data-tv-nav="tab"
                tabIndex={0}
                onClick={onOpenMenu}
                className="tv-nav-focus flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-[#0381fe] hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-[#0381fe]/30 transition cursor-pointer outline-none border border-blue-400/40"
                title="Abrir Menu Principal e Modos de Exibição"
                aria-label="Menu e Guia de Opções"
              >
                <MoreVertical className="w-4 h-4 text-white stroke-[2.5]" />
                <span>Menu</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;