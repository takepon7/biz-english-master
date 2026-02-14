/**
 * ブラウザで利用可能な英語音声のうち、
 * 自然な発音のものを優先して選択する。
 * （Google US English / Samantha 等を優先）
 */
const EN_US = "en-US";

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
