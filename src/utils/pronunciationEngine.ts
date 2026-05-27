// Centralized Tamil pronunciation utility with speed control and speaking-state tracking.

export type SpeechSpeed = 'slow' | 'normal';

type SpeakingCallback = (isSpeaking: boolean) => void;
type SpeechOutputCallback = (meta: SpeechOutputMeta) => void;

export type SpeechOutputMeta = {
  lang: string;
  voiceName: string | null;
  source: 'tamil' | 'fallback' | 'loading';
};

let currentSpeed: SpeechSpeed = 'normal';
const listeners = new Set<SpeakingCallback>();
const outputListeners = new Set<SpeechOutputCallback>();
let isSpeakingNow = false;
let voicesInitialized = false;
let lastSpeechOutput: SpeechOutputMeta = {
  lang: 'ta-IN',
  voiceName: null,
  source: 'loading',
};

const RATE: Record<SpeechSpeed, number> = {
  slow: 0.5,
  normal: 0.8,
};

export function getSpeed(): SpeechSpeed {
  return currentSpeed;
}

export function setSpeed(speed: SpeechSpeed): void {
  currentSpeed = speed;
}

export function toggleSpeed(): SpeechSpeed {
  currentSpeed = currentSpeed === 'normal' ? 'slow' : 'normal';
  return currentSpeed;
}

/** Subscribe to speaking state changes. Returns unsubscribe fn. */
export function onSpeakingChange(cb: SpeakingCallback): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function setSpeaking(val: boolean) {
  isSpeakingNow = val;
  listeners.forEach((cb) => cb(val));
}

function setSpeechOutput(meta: SpeechOutputMeta) {
  lastSpeechOutput = meta;
  outputListeners.forEach((cb) => cb(meta));
}

export function isSpeaking(): boolean {
  return isSpeakingNow;
}

export function getLastSpeechOutput(): SpeechOutputMeta {
  return lastSpeechOutput;
}

export function onSpeechOutputChange(cb: SpeechOutputCallback): () => void {
  outputListeners.add(cb);
  return () => outputListeners.delete(cb);
}

function initVoices(): void {
  if (!('speechSynthesis' in window) || voicesInitialized) return;
  voicesInitialized = true;

  const synth = window.speechSynthesis;

  // Trigger voice loading on browsers that populate lazily.
  synth.getVoices();
  synth.addEventListener('voiceschanged', () => {
    synth.getVoices();
  });
}

type VoiceSelection = {
  voice: SpeechSynthesisVoice | null;
  lang: string;
  source: 'tamil' | 'fallback' | 'loading';
};

function selectTamilVoice(): VoiceSelection {
  if (!('speechSynthesis' in window)) {
    return { voice: null, lang: 'ta-IN', source: 'loading' };
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    // Voice list may still be loading; keep ta-IN to mirror chatbot behavior.
    return { voice: null, lang: 'ta-IN', source: 'loading' };
  }

  const exact = voices.find((v) => v.lang.toLowerCase() === 'ta-in');
  if (exact) return { voice: exact, lang: exact.lang || 'ta-IN', source: 'tamil' };

  const tamil = voices.find((v) => v.lang.toLowerCase().startsWith('ta'));
  if (tamil) return { voice: tamil, lang: tamil.lang || 'ta-IN', source: 'tamil' };

  return { voice: null, lang: 'ta-IN', source: 'fallback' };
}

function toSpeakableText(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Tamil mei letters (ending with pulli) are often rendered as silence by TTS.
  // Convert single-letter mei forms like "க்" -> "க" to make them pronounceable.
  if (trimmed.length <= 2 && trimmed.endsWith('்')) {
    return trimmed.slice(0, -1);
  }

  return trimmed;
}

function hasTamilScript(text: string): boolean {
  return /[\u0B80-\u0BFF]/.test(text);
}

function transliterateTamil(text: string): string {
  const vowels: Record<string, string> = {
    அ: 'a',
    ஆ: 'aa',
    இ: 'i',
    ஈ: 'ii',
    உ: 'u',
    ஊ: 'uu',
    எ: 'e',
    ஏ: 'ee',
    ஐ: 'ai',
    ஒ: 'o',
    ஓ: 'oo',
    ஔ: 'au',
  };

  const consonants: Record<string, string> = {
    க: 'k',
    ங: 'ng',
    ச: 'ch',
    ஜ: 'j',
    ஞ: 'nj',
    ட: 't',
    ண: 'n',
    த: 'th',
    ந: 'n',
    ப: 'p',
    ம: 'm',
    ய: 'y',
    ர: 'r',
    ல: 'l',
    வ: 'v',
    ழ: 'zh',
    ள: 'l',
    ற: 'r',
    ன: 'n',
    ஶ: 'sh',
    ஷ: 'sh',
    ஸ: 's',
    ஹ: 'h',
    க்ஷ: 'ksh',
  };

  const vowelSigns: Record<string, string> = {
    'ா': 'aa',
    'ி': 'i',
    'ீ': 'ii',
    'ு': 'u',
    'ூ': 'uu',
    'ெ': 'e',
    'ே': 'ee',
    'ை': 'ai',
    'ொ': 'o',
    'ோ': 'oo',
    'ௌ': 'au',
    '்': '',
  };

  const chars = Array.from(text);
  let out = '';

  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i];

    if (vowels[ch]) {
      out += vowels[ch];
      continue;
    }

    if (consonants[ch]) {
      const next = chars[i + 1];
      if (next && Object.prototype.hasOwnProperty.call(vowelSigns, next)) {
        out += consonants[ch] + vowelSigns[next];
        i += 1;
      } else {
        out += consonants[ch] + 'a';
      }
      continue;
    }

    if (ch === 'ஃ') {
      out += 'akh';
      continue;
    }

    out += ch;
  }

  return out;
}

/** Speak Tamil text.
 *  Uses chatbot-style speech synthesis path for maximum compatibility. */
export function speakTamil(text: string, speedOverride?: SpeechSpeed): void {
  if (!('speechSynthesis' in window) || !text) return;

  initVoices();

  const synth = window.speechSynthesis;
  if (synth.paused) synth.resume();

  const selection = selectTamilVoice();
  const speakable = toSpeakableText(text);
  const shouldUseFallbackPhonetics = selection.source !== 'tamil' && hasTamilScript(speakable);
  const fallbackLang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
  const utterText = shouldUseFallbackPhonetics ? transliterateTamil(speakable) : speakable;
  const utterLang = shouldUseFallbackPhonetics ? fallbackLang : 'ta-IN';

  setSpeechOutput({
    lang: utterLang,
    voiceName: selection.voice?.name ?? null,
    source: shouldUseFallbackPhonetics ? 'fallback' : selection.source,
  });

  const utter = new SpeechSynthesisUtterance(utterText);
  utter.lang = utterLang;
  utter.rate = RATE[speedOverride ?? currentSpeed];

  utter.onstart = () => setSpeaking(true);
  utter.onend = () => setSpeaking(false);
  utter.onerror = () => {
    setSpeaking(false);

    // If ta-IN fails on a system without Tamil voices, retry once with browser language
    // so users hear output instead of silence.
    const retry = new SpeechSynthesisUtterance(transliterateTamil(speakable));
    retry.lang = fallbackLang;
    retry.rate = RATE[speedOverride ?? currentSpeed];

    setSpeechOutput({
      lang: retry.lang,
      voiceName: null,
      source: 'fallback',
    });

    synth.speak(retry);
  };

  synth.speak(utter);
}

/** Stop any ongoing speech. */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  setSpeaking(false);
}

export function stopTamilSpeech(): void {
  if (!('speechSynthesis' in window)) return;

  const synth = window.speechSynthesis;
  if (synth.speaking) {
    synth.cancel();
  }
}
