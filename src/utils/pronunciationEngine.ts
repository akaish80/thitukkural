// Centralized Tamil pronunciation utility with speed control and speaking-state tracking.

export type SpeechSpeed = 'slow' | 'normal';

type SpeakingCallback = (isSpeaking: boolean) => void;

let currentSpeed: SpeechSpeed = 'normal';
const listeners = new Set<SpeakingCallback>();
let isSpeakingNow = false;

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

export function isSpeaking(): boolean {
  return isSpeakingNow;
}

/** Speak Tamil text. Stops any ongoing speech first. */
export function speakTamil(text: string, speedOverride?: SpeechSpeed): void {
  if (!('speechSynthesis' in window) || !text) return;

  // If something is already playing, stop it first and use a microtask
  // to let the cancel settle before speaking again.
  if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    // Reschedule after cancel settles
    requestAnimationFrame(() => doSpeak(text, speedOverride));
    return;
  }

  doSpeak(text, speedOverride);
}

function doSpeak(text: string, speedOverride?: SpeechSpeed): void {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ta-IN';
  utter.rate = RATE[speedOverride ?? currentSpeed];

  utter.onstart = () => setSpeaking(true);
  utter.onend = () => setSpeaking(false);
  utter.onerror = () => setSpeaking(false);

  window.speechSynthesis.speak(utter);
}

/** Stop any ongoing speech. */
export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  setSpeaking(false);
}
