import { speakText, stopSpeakText } from '../components/chatbot/speakText';

export type TtsProvider = 'browser' | 'opentts';

export type TamilTtsRuntimeConfig = {
  provider?: TtsProvider;
  openTtsEndpoint?: string;
};

type SpeakOptions = {
  lang?: string;
  rate?: number;
  pitch?: number;
  provider?: TtsProvider;
};

const DEFAULT_LANG = 'ta-IN';
const CONFIG_STORAGE_KEY = 'tamil-tts-config-v1';

function readRuntimeConfig(): TamilTtsRuntimeConfig {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as TamilTtsRuntimeConfig;
    const provider = parsed.provider === 'opentts' || parsed.provider === 'browser'
      ? parsed.provider
      : undefined;
    const openTtsEndpoint = parsed.openTtsEndpoint?.trim() || undefined;

    return { provider, openTtsEndpoint };
  } catch {
    return {};
  }
}

export function updateTamilTtsConfig(config: TamilTtsRuntimeConfig): void {
  if (typeof window === 'undefined') return;

  const normalized: TamilTtsRuntimeConfig = {
    provider: config.provider,
    openTtsEndpoint: config.openTtsEndpoint?.trim() || undefined,
  };

  window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(normalized));
}

export function clearTamilTtsConfig(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CONFIG_STORAGE_KEY);
}

export function getTamilTtsConfig(): { provider: TtsProvider; openTtsEndpoint: string } {
  const runtime = readRuntimeConfig();
  const configuredProvider = (import.meta.env.VITE_TAMIL_TTS_PROVIDER as string | undefined)?.toLowerCase();
  const envProvider = configuredProvider === 'opentts' ? 'opentts' : 'browser';

  return {
    provider: runtime.provider ?? envProvider,
    openTtsEndpoint: runtime.openTtsEndpoint ?? ((import.meta.env.VITE_TAMIL_TTS_ENDPOINT as string | undefined)?.trim() || ''),
  };
}

export async function speakTamilText(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!text?.trim()) return;

  speakText(text, {
    lang: options.lang ?? DEFAULT_LANG,
    rate: options.rate ?? 0.95,
  });
}

export function stopTamilTts(): void {
  stopSpeakText();
}
