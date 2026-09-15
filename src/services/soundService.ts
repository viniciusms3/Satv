/**
 * Audio feedback service for SATV IPTV.
 * 
 * 1. Passar o cursor / Setas / D-Pad / Scroll: 'BotaoRadio.mp3'
 * 2. Clicar no botão / OK no controle remoto: 'clicksan.mp3'
 */
const BOTAO_RADIO_URL = '/clicksan.mp3';
const CLICKSAN_URL = '/BotaoRadio.mp3';

class SoundService {
  private static instance: SoundService;
  private audioCtx: AudioContext | null = null;
  private navBuffer: AudioBuffer | null = null;       //  clicksan.mp3
  private selectBuffer: AudioBuffer | null = null;    // BotaoRadio.mp3
  private lastNavPlayTime = 0;
  private lastScrollPlayTime = 0;
  private isMuted = false;

  // Audio pools for instant zero-latency playback on TV WebViews (Fire TV / Android TV)
  private navPool: HTMLAudioElement[] = [];
  private selectPool: HTMLAudioElement[] = [];
  private navIdx = 0;
  private selectIdx = 0;

  private constructor() {
    this.init();
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  private init() {
    if (typeof window === 'undefined') return;

    // 1. Create instant Audio pool (4 instances each for rapid navigation)
    try {
      for (let i = 0; i < 4; i++) {
        const a1 = new Audio(BOTAO_RADIO_URL);
        a1.preload = 'auto';
        this.navPool.push(a1);

        const a2 = new Audio(CLICKSAN_URL);
        a2.preload = 'auto';
        this.selectPool.push(a2);
      }
    } catch {
      // Audio element initialization fallback
    }

    // 2. Load Web Audio API buffers for ultra-low-latency decoding
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (AudioCtx) {
      try {
        this.audioCtx = new AudioCtx();
        this.loadAudioBuffer(BOTAO_RADIO_URL).then((b) => {
          this.navBuffer = b;
        });
        this.loadAudioBuffer(CLICKSAN_URL).then((b) => {
          this.selectBuffer = b;
        });
      } catch {
        // ignore
      }
    }

    // 3. Auto-unlock AudioContext on first remote button or touch
    const unlock = () => {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      // Pre-warm the HTMLAudio elements
      try {
        this.navPool.forEach((a) => a.load());
        this.selectPool.forEach((a) => a.load());
      } catch {
        // ignore
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('click', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { passive: true, once: true });
    window.addEventListener('touchstart', unlock, { passive: true, once: true });
  }

  private async loadAudioBuffer(url: string): Promise<AudioBuffer | null> {
    if (!this.audioCtx) return null;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const arrayBuf = await res.arrayBuffer();
      return await this.audioCtx.decodeAudioData(arrayBuf);
    } catch {
      return null;
    }
  }

  /**
   * SOM 1: Cursor / Setas / D-Pad (BotaoRadio.mp3)
   * Chamado quando o cursor se move entre os canais ou botões.
   */
  public playNav(volume = 0.7) {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastNavPlayTime < 45) return;
    this.lastNavPlayTime = now;

    this.playFromBufferOrPool(this.navBuffer, this.navPool, this.navIdx, (next) => {
      this.navIdx = next;
    }, volume);
  }

  /**
   * SOM 1: Scroll da tela (BotaoRadio.mp3)
   * Chamado ao rolar a grade de canais para cima ou para baixo.
   */
  public playScroll(volume = 0.4) {
    if (this.isMuted) return;
    const now = performance.now();
    if (now - this.lastScrollPlayTime < 70) return;
    this.lastScrollPlayTime = now;

    this.playNav(volume);
  }

  /**
   * SOM 2: Botão OK / Enter / Clique no centro do controle remoto (clicksan.mp3)
   * Chamado quando o usuário clica ou aperta OK em qualquer item.
   */
  public playSelect(volume = 0.5) {
    if (this.isMuted) return;

    this.playFromBufferOrPool(this.selectBuffer, this.selectPool, this.selectIdx, (next) => {
      this.selectIdx = next;
    }, volume);
  }

  /**
   * Alias de playSelect para cliques de botões
   */
  public playClick(volume = 0.8) {
    this.playSelect(volume);
  }

  private playFromBufferOrPool(
    buffer: AudioBuffer | null,
    pool: HTMLAudioElement[],
    poolIdx: number,
    updateIdx: (i: number) => void,
    volume: number
  ) {
    // 1. Tentar Web Audio API (menor latência possível)
    if (this.audioCtx && this.audioCtx.state === 'running' && buffer) {
      try {
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        const gain = this.audioCtx.createGain();
        gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        source.connect(gain);
        gain.connect(this.audioCtx.destination);
        source.start(0);
        return;
      } catch {
        // Fallback para pool de áudio
      }
    }

    // 2. Fallback imediato: HTMLAudioElement pool
    if (pool.length > 0) {
      try {
        const audio = pool[poolIdx];
        updateIdx((poolIdx + 1) % pool.length);
        audio.volume = volume;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {
        // ignore
      }
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const soundService = SoundService.getInstance();
