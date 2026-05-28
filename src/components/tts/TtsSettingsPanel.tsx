import { useState } from 'react';
import { speakText, stopSpeakText } from '../chatbot/speakText';
import './TtsSettingsPanel.scss';

const TAMIL_SAMPLE_TEXT = 'வணக்கம்! தமிழ் குரல் சோதனை வெற்றியாக முடிந்தது.';

function TtsSettingsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [sampleText, setSampleText] = useState(TAMIL_SAMPLE_TEXT);

  const testSpeech = () => {
    speakText(sampleText, { lang: 'ta-IN', rate: 0.95 });
  };

  return (
    <section className="tts-settings" aria-label="Tamil text to speech settings">
      <div className="tts-settings__head">
        <strong>Speech Settings</strong>
        <button
          type="button"
          className="tts-settings__toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls="tts-settings-panel"
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {isOpen && (
        <div id="tts-settings-panel" className="tts-settings__panel">
          <label className="tts-settings__field" htmlFor="tts-provider">
            Provider
            <select
              id="tts-provider"
              value={sampleText}
              onChange={(event) => setSampleText(event.target.value)}
            />
          </label>

          <div className="tts-settings__actions">
            <button type="button" onClick={testSpeech}>Test</button>
            <button type="button" onClick={stopSpeakText}>Stop</button>
          </div>

          <p className="tts-settings__hint">
            Speech uses ResponsiveVoice first, and falls back to browser speech synthesis if unavailable.
          </p>
        </div>
      )}
    </section>
  );
}

export default TtsSettingsPanel;
