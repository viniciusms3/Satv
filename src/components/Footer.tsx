import React from 'react';

interface FooterProps {
  totalChannels?: number;
  favoritesCount?: number;
}

const Footer: React.FC<FooterProps> = ({ totalChannels = 0, favoritesCount = 0 }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full border-t border-white/10 samsung-glass-subtle py-3 text-slate-400 mt-auto transition-all select-none backdrop-blur-2xl shadow-2xl"
    >
      <div className="tv-safe-container flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-2">
        
        {/* Linha esquerda: Status do Sistema & Canais */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online {totalChannels > 0 && `• ${totalChannels} Canais`}
          </span>
          {favoritesCount > 0 && (
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              ⭐ {favoritesCount} {favoritesCount === 1 ? 'favorito' : 'favoritos'}
            </span>
          )}
          <span className="hidden md:inline px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
            Samsung TV+ One UI
          </span>
        </div>

        {/* Linha direita: Copyright & Contato */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <img
            src="https://i.imgur.com/VWtF2t5.jpeg"
            alt="SATV Logo"
            className="w-4 h-4 rounded-full border border-white/40 object-cover shadow-sm opacity-90 ring-1 ring-[#0381fe]/50"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span>Vinícius Mendes &reg; {currentYear}</span>
          <span className="text-white/20">&bull;</span>
          <a
            href="mailto:vinicius@mail.bg"
            className="text-slate-300 hover:text-[#0381fe] transition-colors font-mono"
          >
            vinicius@mail.bg
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;