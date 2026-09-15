import React, { useState } from 'react';
import { matchInfo, matchStats, matchEvents, chelsea, manchesterCity, getPlayerById, MatchEvent } from '../data/samsungMatchData';
import { soundService } from '../services/soundService';
import { X, Activity, Users, Shield, Sparkles, ChevronRight, ArrowLeft } from 'lucide-react';

interface SamsungSportsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SamsungSportsOverlay: React.FC<SamsungSportsOverlayProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'che' | 'mci' | 'ai'>('overview');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswers, setAiAnswers] = useState<{ q: string; a: string }[]>([
    {
      q: 'Quem marcou os gols até agora?',
      a: 'Cole Palmer marcou duas vezes para o Chelsea (23\' e 59\' de pênalti), e Erling Haaland marcou aos 41\' com assistência de De Bruyne para o Manchester City.',
    },
    {
      q: 'Qual time tem maior probabilidade de vitória?',
      a: 'Com a vantagem de 2 a 1 e o controle das chances agudas (xG 1.84 vs 1.21), o Chelsea possui 68% de probabilidade de vitória neste momento do jogo.',
    }
  ]);

  if (!isOpen) return null;

  const selectedPlayer = selectedPlayerId ? getPlayerById(selectedPlayerId) : null;

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    soundService.playSelect();
    const q = aiQuestion.trim();
    setAiQuestion('');
    
    // Resposta inteligente simulada
    setTimeout(() => {
      let reply = `Estatísticas em tempo real da Samsung TV Plus: o jogador Cole Palmer lidera o rating da partida com 8.9 após seus 2 gols. O índice de passe do jogo é de 89%.`;
      if (q.toLowerCase().includes('posse')) {
        reply = `O Manchester City tem 52% da posse de bola contra 48% do Chelsea, concentrando as trocas no terço central.`;
      } else if (q.toLowerCase().includes('chute') || q.toLowerCase().includes('finaliza')) {
        reply = `O Chelsea finalizou 12 vezes (5 no alvo), enquanto o City finalizou 9 vezes (3 no alvo).`;
      }
      setAiAnswers((prev) => [...prev, { q, a: reply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fadeIn select-none">
      {/* Back click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Samsung TV+ Frosted Side Panel */}
      <aside
        role="dialog"
        aria-label="Samsung TV Plus Painel Esportivo Interativo"
        className="relative z-10 w-[95%] sm:w-[500px] lg:w-[540px] h-[94vh] my-auto mr-2 sm:mr-6 rounded-2xl overflow-hidden flex flex-col samsung-glass text-[#e6ebf5] border border-white/10 shadow-2xl transition-all duration-300"
      >
        {/* Top Header with Live Badge & Match Overview */}
        <div className="p-5 border-b border-white/10 bg-[#0c121e]/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/90 text-white font-mono text-[10px] font-bold tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                AO VIVO
              </span>
              <span className="text-xs text-[#9da8be] font-medium">{matchInfo.competition}</span>
            </div>

            <button
              onClick={() => {
                soundService.playSelect();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Fechar painel (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BigCo Scoreboard */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md"
                style={{ backgroundColor: matchInfo.homeTeam.color }}
              >
                CHE
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white">{matchInfo.homeTeam.name}</span>
                <span className="text-[11px] text-[#9da8be]">Mandante</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider">
                <span>{matchInfo.homeScore}</span>
                <span className="text-white/40">-</span>
                <span>{matchInfo.awayScore}</span>
              </div>
              <span className="text-[11px] font-mono text-[#0381fe] font-semibold">{matchInfo.minute}&apos; 2º Tempo</span>
            </div>

            <div className="flex items-center gap-2.5 text-right">
              <div className="flex flex-col items-end">
                <span className="font-bold text-sm text-white">{matchInfo.awayTeam.name}</span>
                <span className="text-[11px] text-[#9da8be]">Visitante</span>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-md"
                style={{ backgroundColor: matchInfo.awayTeam.color }}
              >
                MCI
              </div>
            </div>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center border-b border-white/10 bg-[#0a0f1a]/70 px-4">
          <button
            onClick={() => {
              soundService.playNav();
              setActiveTab('overview');
              setSelectedPlayerId(null);
            }}
            className={`relative flex items-center gap-1.5 py-3 px-3 font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'overview' ? 'text-white' : 'text-[#9da8be] hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 text-[#0381fe]" />
            <span>Visão Geral</span>
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0381fe] shadow-[0_0_12px_#0381fe]" />
            )}
          </button>

          <button
            onClick={() => {
              soundService.playNav();
              setActiveTab('che');
              setSelectedPlayerId(null);
            }}
            className={`relative flex items-center gap-1.5 py-3 px-3 font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'che' ? 'text-white' : 'text-[#9da8be] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: matchInfo.homeTeam.color }} />
            <span>Chelsea FC</span>
            {activeTab === 'che' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0381fe] shadow-[0_0_12px_#0381fe]" />
            )}
          </button>

          <button
            onClick={() => {
              soundService.playNav();
              setActiveTab('mci');
              setSelectedPlayerId(null);
            }}
            className={`relative flex items-center gap-1.5 py-3 px-3 font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'mci' ? 'text-white' : 'text-[#9da8be] hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: matchInfo.awayTeam.color }} />
            <span>Man City</span>
            {activeTab === 'mci' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0381fe] shadow-[0_0_12px_#0381fe]" />
            )}
          </button>

          <button
            onClick={() => {
              soundService.playNav();
              setActiveTab('ai');
              setSelectedPlayerId(null);
            }}
            className={`relative flex items-center gap-1.5 py-3 px-3 font-semibold text-xs sm:text-sm transition-colors cursor-pointer ${
              activeTab === 'ai' ? 'text-white' : 'text-[#9da8be] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Samsung AI</span>
            {activeTab === 'ai' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            )}
          </button>
        </div>

        {/* Panel Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 no-scrollbar space-y-5">
          {/* PLAYER DETAIL VIEW */}
          {selectedPlayer ? (
            <div className="space-y-4 animate-fadeIn">
              <button
                onClick={() => {
                  soundService.playNav();
                  setSelectedPlayerId(null);
                }}
                className="flex items-center gap-1.5 text-xs text-[#9da8be] hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar à escalação
              </button>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-black text-white">#{selectedPlayer.number}</span>
                    <h3 className="font-bold text-lg text-white">{selectedPlayer.name}</h3>
                  </div>
                  <span className="text-xs text-[#0381fe] font-semibold">{selectedPlayer.position}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#9da8be]">Nota</span>
                  <span className="text-2xl font-mono font-black text-emerald-400">{selectedPlayer.rating}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                  <span className="text-[#9da8be]">Gols</span>
                  <span className="text-lg font-mono font-bold text-white">{selectedPlayer.stats.goals}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                  <span className="text-[#9da8be]">Assistências</span>
                  <span className="text-lg font-mono font-bold text-white">{selectedPlayer.stats.assists}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                  <span className="text-[#9da8be]">Precisão Passes</span>
                  <span className="text-lg font-mono font-bold text-white">{selectedPlayer.stats.passAccuracy}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                  <span className="text-[#9da8be]">Passes Chave</span>
                  <span className="text-lg font-mono font-bold text-white">{selectedPlayer.stats.keyPasses}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                  <span className="text-[#9da8be]">Finalizações</span>
                  <span className="text-lg font-mono font-bold text-white">{selectedPlayer.stats.shots}</span>
                </div>
                <div className="p-3 rounded-lg bg-black/40 border border-white/5 flex flex-col">
                  <span className="text-[#9da8be]">Desarmes</span>
                  <span className="text-lg font-mono font-bold text-white">{selectedPlayer.stats.tackles}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* TAB: VISÃO GERAL */}
              {activeTab === 'overview' && (
                <div className="space-y-5 animate-fadeIn">
                  {/* Eventos da partida */}
                  <div>
                    <h4 className="text-xs uppercase font-mono tracking-wider text-[#9da8be] mb-3">Linha do Tempo de Gols & Eventos</h4>
                    <div className="space-y-2.5">
                      {matchEvents.map((evt, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#0381fe] transition"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold text-white ${
                                evt.type === 'goal' || evt.type === 'penalty'
                                  ? 'bg-emerald-600'
                                  : evt.type === 'yellow'
                                  ? 'bg-yellow-500 text-black'
                                  : 'bg-blue-600'
                              }`}
                            >
                              {evt.type === 'goal' ? '⚽' : evt.type === 'penalty' ? 'PEN' : '🟨'}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-white">{evt.player}</p>
                              {evt.assistedBy && <p className="text-[11px] text-[#9da8be]">Assistência: {evt.assistedBy}</p>}
                              {evt.detail && !evt.assistedBy && <p className="text-[11px] text-[#9da8be]">{evt.detail}</p>}
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-mono text-sm font-bold text-white">{evt.minute}&apos;</span>
                            {evt.scoreAfter && <span className="text-xs font-bold text-[#0381fe]">{evt.scoreAfter}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comparativo de Estatísticas */}
                  <div>
                    <h4 className="text-xs uppercase font-mono tracking-wider text-[#9da8be] mb-3">Estatísticas da Partida</h4>
                    <div className="space-y-3">
                      {matchStats.map((st, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span style={{ color: matchInfo.homeTeam.color }}>{st.home}</span>
                            <span className="text-[#9da8be]">{st.label}</span>
                            <span style={{ color: matchInfo.awayTeam.color }}>{st.away}</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 flex overflow-hidden">
                            <div className="h-full bg-[#034694]" style={{ width: `${st.homePercent}%` }} />
                            <div className="h-full bg-[#6CABDD]" style={{ width: `${st.awayPercent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: CHELSEA FC */}
              {activeTab === 'che' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9da8be]">Esquema: {chelsea.formation}</span>
                    <span className="text-xs text-[#0381fe]">Toque em um jogador para ver detalhes</span>
                  </div>
                  <div className="space-y-2">
                    {chelsea.players.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          soundService.playSelect();
                          setSelectedPlayerId(p.id);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-[#0381fe] hover:bg-[#0381fe]/10 transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#9da8be] w-6">#{p.number}</span>
                          <div>
                            <p className="text-sm font-semibold text-white">{p.name}</p>
                            <span className="text-[10px] text-[#9da8be]">{p.position}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">{p.rating}</span>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: MAN CITY */}
              {activeTab === 'mci' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#9da8be]">Esquema: {manchesterCity.formation}</span>
                    <span className="text-xs text-[#0381fe]">Toque em um jogador para ver detalhes</span>
                  </div>
                  <div className="space-y-2">
                    {manchesterCity.players.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          soundService.playSelect();
                          setSelectedPlayerId(p.id);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-[#0381fe] hover:bg-[#0381fe]/10 transition text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-[#9da8be] w-6">#{p.number}</span>
                          <div>
                            <p className="text-sm font-semibold text-white">{p.name}</p>
                            <span className="text-[10px] text-[#9da8be]">{p.position}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-emerald-400">{p.rating}</span>
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SAMSUNG AI ASSISTANT */}
              {activeTab === 'ai' && (
                <div className="space-y-4 animate-fadeIn flex flex-col h-full">
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200">
                    Pergunte qualquer dado, lance ou estatística em tempo real da transmissão Samsung TV Plus!
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                    {aiAnswers.map((item, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="p-2 rounded-lg bg-white/10 text-white font-medium self-end">
                          <span className="text-cyan-400 font-bold">Você:</span> {item.q}
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0f1a2e] border border-cyan-500/20 text-gray-200">
                          <span className="text-cyan-400 font-bold">Samsung AI:</span> {item.a}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAskAI} className="mt-auto flex items-center gap-2 pt-2 border-t border-white/10">
                    <input
                      type="text"
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      placeholder="Ex: Quem tem mais posse de bola?"
                      className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-[#0381fe]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#0381fe] hover:bg-blue-600 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#090d15] flex items-center justify-between text-[11px] text-[#9da8be]">
          <span>BigCo Samsung TV Plus Interactive Engine</span>
          <span className="font-mono">Pressione Esc para fechar</span>
        </div>
      </aside>
    </div>
  );
};
