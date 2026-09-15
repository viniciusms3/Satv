import React from 'react';
import { Star } from 'lucide-react';
import { Channel, GroupedChannels, UiDensity } from '../types';
import ChannelCard from './ChannelCard';

interface ChannelGridProps {
  groupedChannels: GroupedChannels;
  favorites?: string[];
  onToggleFavorite?: (channelName: string) => void;
  onSelectChannel: (channel: Channel) => void;
  onClearFilters: () => void;
  density?: UiDensity;
}

const CATEGORY_ORDER: Record<string, number> = {
  'CANAL': 1,
  'DOCUMENTÁRIOS': 2,
  'FILMES & SÉRIES': 3,
  'FILMES E SÉRIES': 3,
  'VARIEDADES': 4,
  'ESPORTES': 5,
  'ESPN': 6,
  'PREMIERE': 7,
  'ESPORTES PPV': 8,
  'HBO': 9,
  'NOTÍCIAS': 10,
  'INFANTIS': 11,
  'MÚSICA': 12,
  'RELIGIOSOS': 13,
};

const ChannelGrid: React.FC<ChannelGridProps> = ({
  groupedChannels,
  favorites = [],
  onToggleFavorite,
  onSelectChannel,
  onClearFilters,
  density = 'compact',
}) => {
  const sortedGroupNames = Object.keys(groupedChannels).sort((a, b) => {
    const upperA = a.toUpperCase();
    const upperB = b.toUpperCase();

    const orderA = CATEGORY_ORDER[upperA] ?? 50;
    const orderB = CATEGORY_ORDER[upperB] ?? 50;

    if (orderA !== orderB) return orderA - orderB;
    return a.localeCompare(b, 'pt-BR');
  });

  // Fully automatic responsive grid: adapts dynamically to screen width without requiring manual intervention
  const gridClasses =
    'grid grid-cols-4 min-[360px]:grid-cols-5 min-[440px]:grid-cols-6 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 2xl:grid-cols-14 gap-1 sm:gap-2';

  if (sortedGroupNames.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-[#181f2f] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#9da8be] border border-white/10">
          <Star className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          Nenhum canal encontrado
        </h3>
        <p className="text-xs sm:text-sm text-[#9da8be] max-w-md mx-auto mb-5">
          Para favoritar um canal, clique na estrelinha no canto superior de qualquer canal.
        </p>
        <button
          onClick={onClearFilters}
          className="px-5 py-2 rounded-full text-xs font-bold bg-[#0381fe] hover:bg-blue-600 text-white transition shadow-lg shadow-[#0381fe]/30 cursor-pointer"
        >
          Limpar Filtros e Ver Todos
        </button>
      </div>
    );
  }

  // Calculate continuous sequential index across all visible channels
  let globalIndex = 0;

  return (
    <div className="tv-safe-container py-3 sm:py-4 space-y-4 sm:space-y-5">
      {sortedGroupNames.map((groupName) => {
        const channels = groupedChannels[groupName];
        if (!channels || channels.length === 0) return null;

        return (
          <section key={groupName} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center justify-between py-1 px-1">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0381fe] inline-block shadow-lg shadow-[#0381fe]/60 animate-pulse" />
                <h2 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase">
                  {groupName}
                </h2>
                <span className="text-[10px] sm:text-[11px] text-slate-300 font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 shadow-sm">
                  {channels.length} canais
                </span>
              </div>
            </div>

            {/* Channels Grid (Square Tiles) */}
            <div className={gridClasses}>
              {channels.map((channel) => {
                const currentIndex = globalIndex++;
                return (
                  <ChannelCard
                    key={`${channel.name}-${channel.url}`}
                    channel={channel}
                    index={currentIndex}
                    isFavorite={favorites.includes(channel.name)}
                    onToggleFavorite={onToggleFavorite}
                    onSelect={onSelectChannel}
                    density={density}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ChannelGrid;
