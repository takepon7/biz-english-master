/**
 * ブラウザで利用可能な英語音声のうち、
 * 自然な発音のものを優先して選択する。
 * （Google US English / Samantha 等を優先）
 *
 * 初回再生時のピッチずれ対策として、AudioContext の resume と
 * 無音ダミー発話による SpeechSynthesis のウォームアップを行う。
 */
const EN_US = "en-US";

let speechWarmedUp = false;

/**
 * AudioContext が suspended の場合は resume する。
 * ユーザージェスチャー内で呼ぶこと（speak 実行時など）。
 */
export function ensureAudioContextResumed(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return Promise.resolve();
  const ctx = new AC();
  if (ctx.state === "suspended") {
    return ctx.resume().then(() => ctx.close());
  }
  return ctx.close();
}

/**
 * 初回のみダミー発話でウォームアップしてから、本番の Utterance を再生する。
 * 1 回目の再生時のピッチずれ・掠れを防ぐ。
 */
export function speakWithWarmup(
  synth: SpeechSynthesis,
  utterance: SpeechSynthesisUtterance
): void {
  const doSpeak = () => {
    synth.cancel();
    synth.speak(utterance);
  };

  if (speechWarmedUp) {
    doSpeak();
    return;
  }

  speechWarmedUp = true;
  ensureAudioContextResumed().then(() => {
    const dummy = new SpeechSynthesisUtterance(" ");
    dummy.volume = 0.01;
    dummy.rate = 3;
    dummy.lang = "en-US";
    dummy.onend = () => {
      doSpeak();
    };
    dummy.onerror = () => {
      doSpeak();
    };
    synth.cancel();
    synth.speak(dummy);
  });
}

const PREFERRED_NAME_PATTERNS: (string | RegExp)[] = [
  "Google US English", // Chrome
  "Google US English (Female)",
  "Google US English (Male)",
  "Samantha", // macOS
  "Microsoft Zira", // Windows
  "Microsoft Mark",
  "Karen", // macOS (en-AU だが自然な場合あり)
];

function scoreVoice(voice: SpeechSynthesisVoice): number {
  const langOk =
    voice.lang === EN_US ||
    voice.lang.startsWith("en-US") ||
    voice.lang.toLowerCase().startsWith("en-us");
  if (!langOk) return -1;

  const name = voice.name;
  for (let i = 0; i < PREFERRED_NAME_PATTERNS.length; i++) {
    const p = PREFERRED_NAME_PATTERNS[i];
    if (typeof p === "string" && name.includes(p)) return 1000 - i;
    if (p instanceof RegExp && p.test(name)) return 1000 - i;
  }
  return 0;
}

function pickFromVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const enUs = voices.filter((v) => scoreVoice(v) >= 0);
  if (enUs.length === 0) return null;
  enUs.sort((a, b) => scoreVoice(b) - scoreVoice(a));
  return enUs[0];
}

let cachedVoice: SpeechSynthesisVoice | null | undefined = undefined;

function ensureVoicesLoaded(): SpeechSynthesisVoice[] {
  const synth = window.speechSynthesis;
  let voices = synth.getVoices();
  if (voices.length > 0) return voices;
  return [];
}

export function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice !== undefined) return cachedVoice;

  const voices = ensureVoicesLoaded();
  cachedVoice = pickFromVoices(voices) ?? null;

  window.speechSynthesis.addEventListener("voiceschanged", () => {
    const next = pickFromVoices(window.speechSynthesis.getVoices());
    cachedVoice = next ?? null;
  }, { once: true });

  return cachedVoice;
}
