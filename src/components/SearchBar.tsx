import React from 'react';
import { Search, X, Star } from 'lucide-react';
import { soundService } from '../services/soundService';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filteredCount: number;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

const CATEGORY_PRIORITY: Record<string, number> = {
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

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredCount,
  favoritesCount = 0,
  onOpenFavorites,
}) => {
  const sortedCategories = [...categories].sort((a, b) => {
    const pA = CATEGORY_PRIORITY[a.toUpperCase()] ?? 50;
    const pB = CATEGORY_PRIORITY[b.toUpperCase()] ?? 50;
    if (pA !== pB) return pA - pB;
    return a.localeCompare(b, 'pt-BR');
  });

  const handleSelectCategory = (cat: string) => {
    soundService.playSelect();
    setSelectedCategory(cat);
  };

  const handleClearSearch = () => {
    soundService.playSelect();
    setSearchQuery('');
  };

  const isFavoritesSelected = selectedCategory === 'FAVORITOS';

  return (
    <div className="w-full samsung-glass-subtle border-b border-white/10 py-2 sm:py-2.5 shadow-md overflow-hidden select-none">
      <div className="tv-safe-container space-y-2 min-w-0">
        {/* Search input bar & Counter with Samsung styling */}
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between min-w-0">
          <div className="relative w-full max-w-md min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9da8be]">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              id="channel-search-input"
              type="text"
              tabIndex={1}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar canal por nome ou categoria..."
              className="w-full bg-black/40 hover:bg-black/60 focus:bg-black/70 text-white placeholder-slate-400 text-xs rounded-2xl pl-9 pr-9 py-2.5 border border-white/15 focus:outline-none focus:border-[#0381fe] focus:ring-2 focus:ring-[#0381fe]/40 transition shadow-inner backdrop-blur-md"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9da8be] hover:text-white cursor-pointer"
                title="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-[#9da8be] font-medium whitespace-nowrap hidden sm:block shrink-0">
            Disponíveis: <span className="text-[#0381fe] font-bold font-mono">{filteredCount}</span> canais
          </div>
        </div>

        {/* Tabulated Category Pills & Favorites integrated */}
        <div className="w-full min-w-0">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full min-w-0">
            {/* Botão Favoritos incorporado nas pílulas */}
            {onOpenFavorites && (
              <button
                id="tab-btn-favoritos"
                type="button"
                data-tv-nav="category"
                tabIndex={0}
                onClick={onOpenFavorites}
                className={`tv-nav-focus flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isFavoritesSelected
                    ? 'bg-amber-400 text-black border border-amber-300 font-bold shadow-md shadow-amber-400/30'
                    : 'bg-[#181f2f]/80 hover:bg-[#222b40] text-amber-400 border border-white/10 hover:border-amber-400/50'
                }`}
                title="Acessar canais favoritos"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Favoritos</span>
                {favoritesCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[9px] bg-amber-400 text-black rounded-full font-black ml-0.5">
                    {favoritesCount}
                  </span>
                )}
              </button>
            )}

            {/* Categoria: Todos */}
            <button
              data-tv-nav="category"
              data-category-index={0}
              tabIndex={0}
              onClick={() => handleSelectCategory('TODOS')}
              className={`tv-nav-focus px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'TODOS'
                  ? 'bg-[#0381fe] text-white border border-blue-400/50 shadow-lg shadow-[#0381fe]/40 font-bold'
                  : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              Todos
            </button>

            {/* Demais Categorias */}
            {sortedCategories.map((category, idx) => {
              const catIndex = idx + 1;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  data-tv-nav="category"
                  data-category-index={catIndex}
                  tabIndex={0}
                  onClick={() => handleSelectCategory(category)}
                  className={`tv-nav-focus px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#0381fe] text-white border border-blue-400/50 shadow-lg shadow-[#0381fe]/40 font-bold'
                      : 'bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;