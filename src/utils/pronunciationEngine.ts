import { speakText, stopSpeakText } from '../components/chatbot/speakText';

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
let lastSpeechOutput: SpeechOutputMeta = {
  lang: 'ta-IN',
  voiceName: 'ResponsiveVoice',
  source: 'tamil',
};

const RATE: Record<SpeechSpeed, number> = {
  slow: 0.6,
  normal: 0.95,
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

export function speakTamil(text: string, speedOverride?: SpeechSpeed): void {
  if (!text?.trim()) return;

  const rate = RATE[speedOverride ?? currentSpeed];
  setSpeechOutput({
    lang: 'ta-IN',
    voiceName: 'ResponsiveVoice',
    source: 'tamil',
  });

  speakText(text, {
    lang: 'ta-IN',
    rate,
    onStart: () => setSpeaking(true),
    onEnd: () => setSpeaking(false),
    onError: () => setSpeaking(false),
  });
}

export function stopSpeaking(): void {
  stopSpeakText();
  setSpeaking(false);
}

export function stopTamilSpeech(): void {
  stopSpeaking();
}
