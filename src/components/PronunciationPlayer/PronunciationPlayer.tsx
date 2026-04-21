import { useState, useEffect, useCallback } from 'react';
import {
  speakTamil,
  stopSpeaking,
  getSpeed,
  toggleSpeed,
  onSpeakingChange,
  getLastSpeechOutput,
  onSpeechOutputChange,
  type SpeechOutputMeta,
  type SpeechSpeed,
} from '../../utils/pronunciationEngine';
import './PronunciationPlayer.scss';

/* ── Compact speak button (icon only) ── */
export const SpeakButton = ({
  text,
  size = 'md',
  className = '',
}: {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const unsub = onSpeakingChange((val) => {
      if (!val) setActive(false);
    });
    return unsub;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (active) {
      stopSpeaking();
      setActive(false);
    } else {
      // Just speak — no cancel, exactly like the working chatbot
      setActive(true);
      speakTamil(text);
    }
  }, [active, text]);

  return (
    <button
      className={`speak-btn speak-btn--${size} ${active ? 'speak-btn--active' : ''} ${className}`}
      onClick={handleClick}
      aria-label={`Listen to ${text}`}
      title="Listen"
      type="button"
    >
      {active ? '⏹' : '🔊'}
    </button>
  );
};

/* ── Speed toggle pill ── */
export const SpeedToggle = ({ className = '' }: { className?: string }) => {
  const [speed, setSpeed] = useState<SpeechSpeed>(getSpeed);

  const handleToggle = useCallback(() => {
    const next = toggleSpeed();
    setSpeed(next);
  }, []);

  return (
    <button
      className={`speed-toggle ${className}`}
      onClick={handleToggle}
      aria-label={`Speech speed: ${speed}`}
      title={`Speed: ${speed} (click to toggle)`}
      type="button"
    >
      {speed === 'slow' ? '🐢' : '🐇'} {speed === 'slow' ? 'Slow' : 'Normal'}
    </button>
  );
};

/* ── Waveform animation ── */
export const Waveform = ({
  active = false,
  bars = 5,
  className = '',
}: {
  active?: boolean;
  bars?: number;
  className?: string;
}) => (
  <span className={`waveform ${active ? 'waveform--active' : ''} ${className}`} aria-hidden="true">
    {Array.from({ length: bars }, (_, i) => (
      <span
        key={i}
        className="waveform__bar"
        style={{ animationDelay: `${i * 0.1}s` }}
      />
    ))}
  </span>
);

/* ── Full pronunciation player card ── */
interface PronunciationPlayerProps {
  /** Primary text to speak (Tamil letter / word / sentence) */
  text: string;
  /** Display label */
  label?: string;
  /** Romanization / transliteration */
  romanization?: string;
  /** English meaning */
  meaning?: string;
  /** Extra words to show as speakable chips */
  exampleWords?: { tamil: string; meaning: string }[];
  /** Whether to show speed toggle inline */
  showSpeedToggle?: boolean;
  className?: string;
}

const PronunciationPlayer = ({
  text,
  label,
  romanization,
  meaning,
  exampleWords,
  showSpeedToggle = true,
  className = '',
}: PronunciationPlayerProps) => {
  const [active, setActive] = useState(false);
  const [activeText, setActiveText] = useState('');
  const [speechOutput, setSpeechOutput] = useState<SpeechOutputMeta>(getLastSpeechOutput);

  useEffect(() => {
    const unsub = onSpeakingChange((val) => {
      if (!val) { setActive(false); setActiveText(''); }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSpeechOutputChange(setSpeechOutput);
    return unsub;
  }, []);

  const voiceLabel = speechOutput.voiceName ?? 'System voice';
  const sourceLabel =
    speechOutput.source === 'tamil'
      ? 'Tamil voice'
      : speechOutput.source === 'loading'
        ? 'Loading voice list'
        : 'Fallback voice';

  const play = useCallback((t: string) => {
    setActiveText(t);
    setActive(true);
    speakTamil(t);
  }, []);

  const handleMainPlay = useCallback(() => {
    if (active && activeText === text) {
      stopSpeaking();
      setActive(false);
    } else {
      play(text);
    }
  }, [active, activeText, text, play]);

  return (
    <div className={`pronunciation-player ${className}`}>
      {/* Main play area */}
      <div className="pronunciation-player__main">
        <button
          className={`pronunciation-player__play ${active && activeText === text ? 'pronunciation-player__play--active' : ''}`}
          onClick={handleMainPlay}
          type="button"
          aria-label={`Listen to ${text}`}
        >
          <span className="pronunciation-player__icon">
            {active && activeText === text ? '⏹' : '▶'}
          </span>
          <Waveform active={active && activeText === text} bars={5} />
        </button>

        <div className="pronunciation-player__info">
          {label && <span className="pronunciation-player__label">{label}</span>}
          <span className="pronunciation-player__text">{text}</span>
          {romanization && <span className="pronunciation-player__roman">{romanization}</span>}
          {meaning && <span className="pronunciation-player__meaning">{meaning}</span>}
          <span
            className="pronunciation-player__voice"
            title={`${sourceLabel}: ${voiceLabel} (${speechOutput.lang})`}
          >
            Voice: {voiceLabel} ({speechOutput.lang})
          </span>
        </div>

        {showSpeedToggle && <SpeedToggle className="pronunciation-player__speed" />}
      </div>

      {/* Example words */}
      {exampleWords && exampleWords.length > 0 && (
        <div className="pronunciation-player__examples">
          <span className="pronunciation-player__examples-label">Example Words</span>
          <div className="pronunciation-player__chips">
            {exampleWords.map((w) => (
              <button
                key={w.tamil}
                className={`pronunciation-player__chip ${active && activeText === w.tamil ? 'pronunciation-player__chip--active' : ''}`}
                onClick={() => play(w.tamil)}
                type="button"
              >
                <span className="pronunciation-player__chip-tamil">{w.tamil}</span>
                <span className="pronunciation-player__chip-en">{w.meaning}</span>
                {active && activeText === w.tamil && <Waveform active bars={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PronunciationPlayer;
