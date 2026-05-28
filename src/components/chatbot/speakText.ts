type ResponsiveVoiceApi = {
  speak: (text: string, voice?: string, options?: Record<string, unknown>) => void;
  cancel?: () => void;
};

export type SpeakTextOptions = {
  lang?: string;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
};

function getResponsiveVoiceName(lang?: string): string {
  if (!lang) return 'Tamil Female';
  const normalized = lang.toLowerCase();
  if (normalized.startsWith('en')) return 'US English Female';
  if (normalized.startsWith('ta')) return 'Tamil Female';
  return 'Tamil Female';
}

// Utility to handle speech synthesis for the chatbot
export function speakText(text: string, options: SpeakTextOptions = {}) {
  if (!text?.trim()) return;

  const lang = options.lang ?? 'ta-IN';
  const rate = options.rate ?? 0.95;

  const responsiveVoiceApi = (window as Window & { responsiveVoice?: ResponsiveVoiceApi }).responsiveVoice;
  if (responsiveVoiceApi?.speak) {
    responsiveVoiceApi.speak(text, getResponsiveVoiceName(lang), {
      rate,
      onstart: options.onStart,
      onend: options.onEnd,
      onerror: options.onError,
    });
    return;
  }

  // Fallback if external script is unavailable.
  if ('speechSynthesis' in window) {
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;
    utter.onstart = () => options.onStart?.();
    utter.onend = () => options.onEnd?.();
    utter.onerror = () => options.onError?.();
    window.speechSynthesis.speak(utter);
  }
}

export function stopSpeakText() {
  const responsiveVoiceApi = (window as Window & { responsiveVoice?: ResponsiveVoiceApi }).responsiveVoice;
  if (responsiveVoiceApi?.cancel) {
    responsiveVoiceApi.cancel();
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}