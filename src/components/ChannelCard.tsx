import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Channel, UiDensity } from '../types';
import { getChannelLogo } from '../data/channelLogos';
import { soundService } from '../services/soundService';

interface ChannelCardProps {
  channel: Channel;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (channelName: string) => void;
  onSelect?: (channel: Channel) => void;
  density?: UiDensity;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  index,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  density = 'compact',
}) => {
  const [imgError, setImgError] = useState(false);

  // Fallback to official high-quality logo mapping
  const fallbackLogo = getChannelLogo(channel.name);
  const logoSrc = imgError || !channel.logo ? fallbackLogo : channel.logo;

  // Ação 1: Abrir o canal com o som BotaoRadio.mp3 (Enter / OK / Clique)
  const handleOpenChannel = () => {
    soundService.playSelect();
    try {
      const channelId = channel.id || encodeURIComponent(channel.name);
      localStorage.setItem('satv_last_focused_channel_name', channel.name);
      localStorage.setItem('satv_last_focused_channel_id', channelId);
      localStorage.setItem('satv_last_scroll_y', String(window.scrollY));
      localStorage.setItem('satv_should_restore_channel', 'true');
      sessionStorage.setItem('satv_last_focused_channel_name', channel.name);
      sessionStorage.setItem('satv_last_focused_channel_id', channelId);
      sessionStorage.setItem('satv_last_scroll_y', String(window.scrollY));
      sessionStorage.setItem('satv_should_restore_channel', 'true');
    } catch {
      // ignore
    }
    if (onSelect) {
      onSelect(channel);
    } else {
      window.open(channel.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Ação 2: Alternar Favorito
  const handleToggleFavoriteAction = () => {
    soundService.playSelect();
    if (onToggleFavorite) {
      onToggleFavorite(channel.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const code = e.keyCode || e.which;
    const key = e.key;

    // 1. Botão Play / Pause do controle do Fire TV / Android TV (KeyCode 85 / MediaPlayPause)
    const isPlayPauseKey =
      code === 85 ||
      code === 126 ||
      code === 127 ||
      key === 'MediaPlayPause' ||
      e.code === 'MediaPlayPause' ||
      key === 'Play' ||
      key === 'Pause' ||
      key === 'p' ||
      key === 'P';

    if (isPlayPauseKey) {
      e.preventDefault();
      e.stopPropagation();
      handleToggleFavoriteAction();
      return;
    }

    // 2. Botão OK / ENTER no meio do D-Pad do controle
    const isOkEnterKey =
      key === 'Enter' ||
      key === ' ' ||
      code === 13 ||
      code === 23 ||
      code === 66;

    if (isOkEnterKey) {
      e.preventDefault();
      e.stopPropagation();
      handleOpenChannel();
      return;
    }

    // 3. Tecla 'f' / 'F' ou '0' para alternar favorito pelo teclado
    if (key === 'f' || key === 'F' || key === '0' || code === 48 || code === 96) {
      e.preventDefault();
      e.stopPropagation();
      handleToggleFavoriteAction();
      return;
    }
  };

  return (
    <a
      id={`channel-card-${channel.id || encodeURIComponent(channel.name)}`}
      href={channel.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={0}
      role="button"
      aria-label={`Canal ${channel.name} - Abrir canal. Pressione Play/Pause para favoritar.`}
      data-tv-card="true"
      data-channel-name={channel.name}
      data-channel-index={index}
      onClick={(e) => {
        e.preventDefault();
        handleOpenChannel();
      }}
      onMouseEnter={() => {
        soundService.playNav();
      }}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        soundService.playNav();
        try {
          const channelId = channel.id || encodeURIComponent(channel.name);
          localStorage.setItem('satv_last_focused_channel_name', channel.name);
          localStorage.setItem('satv_last_focused_channel_id', channelId);
          localStorage.setItem('satv_last_scroll_y', String(window.scrollY));
          sessionStorage.setItem('satv_last_focused_channel_name', channel.name);
          sessionStorage.setItem('satv_last_focused_channel_id', channelId);
          sessionStorage.setItem('satv_last_scroll_y', String(window.scrollY));
        } catch {
          // ignore
        }
      }}
      className={`group tv-card-focus relative aspect-square samsung-glass-card rounded-2xl p-2 sm:p-2.5 flex flex-col items-center justify-between text-center transition-all duration-200 cursor-pointer outline-none select-none shadow-md hover:shadow-2xl hover:bg-[#182338]/90 focus:bg-[#182338] shrink-0 border ${
        isFavorite
          ? 'border-amber-400/80 hover:border-amber-300 focus:border-amber-300 shadow-amber-500/20'
          : 'border-white/10 hover:border-[#0381fe]/80 focus:border-[#0381fe]'
      }`}
    >
      {/* Estrelinha indicadora de Favorito */}
      {onToggleFavorite && (
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFavoriteAction();
          }}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          title={isFavorite ? 'Favorito ativo' : 'Favoritar'}
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-lg transition-all ${
            isFavorite
              ? 'text-amber-400 bg-black/80 shadow-md opacity-100 scale-100 ring-1 ring-amber-400/40'
              : 'text-white/40 hover:text-amber-300 bg-black/50 opacity-0 group-hover:opacity-100 group-focus:opacity-100'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
        </button>
      )}

      {/* Auto-responsive Channel Logo Cradle com efeito vitrificado */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center p-2 rounded-xl overflow-hidden transition bg-gradient-to-b from-white/5 to-transparent border border-white/5 shadow-inner">
        <img
          src={logoSrc}
          alt={`${channel.name} logo`}
          className="max-w-[85%] max-h-[75%] object-contain channel-logo-img drop-shadow-md transition-transform duration-200 group-hover:scale-110 group-focus:scale-110"
          onError={() => setImgError(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Auto-responsive Channel Title with Fluid Typography */}
      <p
        className={`w-full text-center font-bold tracking-tight truncate leading-tight transition-colors pt-1.5 px-1 text-[clamp(8px,1.9vw,11px)] sm:text-[clamp(9px,1.2vw,12px)] ${
          isFavorite ? 'text-amber-200' : 'text-[#e6ebf5] group-hover:text-white group-focus:text-white'
        }`}
        title={channel.name}
      >
        {channel.name}
      </p>
    </a>
  );
};

export default ChannelCard;