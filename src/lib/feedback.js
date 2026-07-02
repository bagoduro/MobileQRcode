/**
 * Feedback tátil e sonoro para dar sensação de app nativo.
 * Sons são sintetizados via Web Audio API (osciladores) — não dependem
 * de nenhum arquivo de áudio externo, então funcionam offline e no APK.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function tone({ freq = 440, duration = 0.08, type = 'sine', volume = 0.12, delay = 0 } = {}) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const startAt = ctx.currentTime + delay;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);

  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(volume, startAt + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

function vibrate(pattern) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export const feedback = {
  /** Toque leve — troca de aba, seleção de item */
  tap() {
    tone({ freq: 620, duration: 0.045, type: 'sine', volume: 0.07 });
    vibrate(8);
  },

  /** Confirmação positiva — QR lido, salvo com sucesso, login ok */
  success() {
    tone({ freq: 740, duration: 0.09, type: 'sine', volume: 0.11 });
    tone({ freq: 1108, duration: 0.11, type: 'sine', volume: 0.1, delay: 0.07 });
    vibrate([10, 40, 15]);
  },

  /** Erro / ação destrutiva — falha de login, excluir nota */
  error() {
    tone({ freq: 220, duration: 0.12, type: 'square', volume: 0.06 });
    tone({ freq: 160, duration: 0.14, type: 'square', volume: 0.06, delay: 0.09 });
    vibrate([20, 30, 20, 30, 20]);
  },

  /** Aviso leve — necessário confirmar algo */
  warn() {
    tone({ freq: 500, duration: 0.1, type: 'triangle', volume: 0.08 });
    vibrate(15);
  },
};

export default feedback;
