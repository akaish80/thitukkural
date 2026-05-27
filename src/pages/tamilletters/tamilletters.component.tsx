import { useState, useEffect, useCallback } from 'react';
import PageTitle from '../../components/PageTitle';
import { speakTamil } from '../../utils/pronunciationEngine';
import { SpeakButton, SpeedToggle, Waveform } from '../../components/PronunciationPlayer/PronunciationPlayer';
import { onSpeakingChange } from '../../utils/pronunciationEngine';
import { VOWEL_DETAILS } from '../../data/vowels';
import { CONSONANT_DETAILS } from '../../data/consonants';
import { CONSONANTS } from '../../data/constants';
import UyirmeiAlphabetTable from '../../components/learntamil/UyirmeiAlphabetTable';
import './tamilletters.styles.scss';

interface LetterGroup {
  title: string;
  subtitle: string;
  letters: string[];
  color: string;
}

// Combine vowel and consonant details into a single letterDetails object
const letterDetails = { ...VOWEL_DETAILS, ...CONSONANT_DETAILS };

// Letter detail modal component with pronunciation player
const LetterModal = ({ letter, onClose }: { letter: string; onClose: () => void }) => {
  const detail = letterDetails[letter];
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => onSpeakingChange(setSpeaking), []);

  // NOTE: auto-speak removed — useEffect runs outside user gesture context
  // so browsers block it silently. Users click 🔊 instead.

  const typeColor =
    detail?.type === 'vowel' ? '#58cc02'
    : detail?.type === 'consonant' ? '#ce82ff'
    : '#ff9600';

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!detail) return null;

  return (
    <div className="letter-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Details for ${letter}`}>
      <div className="letter-modal" onClick={(e) => e.stopPropagation()}>
        <button className="letter-modal__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="letter-modal__header" style={{ '--type-color': typeColor } as React.CSSProperties}>
          <div className="letter-modal__letter-row">
            <div className="letter-modal__letter">{letter}</div>
            <Waveform active={speaking} bars={5} className="letter-modal__waveform" />
          </div>
          <SpeakButton text={letter} size="lg" className="letter-modal__speak" />
          <div className="letter-modal__romanization">{detail.romanization}</div>
          <span className="letter-modal__type-badge">{detail.typeLabel} · {detail.typeLabelEn}</span>
          <SpeedToggle className="letter-modal__speed-toggle" />
        </div>

        <div className="letter-modal__body">
          <div className="letter-modal__section">
            <h4>📣 Pronunciation</h4>
            <p>{detail.pronunciation}</p>
          </div>

          <div className="letter-modal__section letter-modal__example-word">
            <h4>📝 Example Word</h4>
            {detail.imageSrc && (
              <img
                src={detail.imageSrc}
                alt={`${detail.word} visual`}
                className="letter-modal__example-image"
                loading="lazy"
              />
            )}
            <div className="letter-modal__word-row">
              <span className="letter-modal__tamil-word">{detail.word}</span>
              <SpeakButton text={detail.word} size="sm" />
              <span className="letter-modal__word-meaning">— {detail.meaning}</span>
            </div>
          </div>

          <div className="letter-modal__section">
            <h4>💬 Example Sentence</h4>
            <div className="letter-modal__sentence-row">
              <p className="letter-modal__tamil-sentence">{detail.exampleSentence}</p>
              <SpeakButton text={detail.exampleSentence} size="sm" />
            </div>
            <p className="letter-modal__translation">{detail.exampleTranslation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const uyirLetters = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ', 'ஃ'];
const meyLetters = CONSONANTS.map((letter) => letter.tamil);
const aytham = 'ஃ';

const letterGroups: LetterGroup[] = [
  {
    title: 'உயிர் எழுத்துகள்',
    subtitle: 'Vowels (including Aytham) — 13 letters',
    letters: uyirLetters,
    color: '#58cc02',
  },
  {
    title: 'மெய் எழுத்துகள்',
    subtitle: 'Consonants — 18 letters',
    letters: meyLetters,
    color: '#ce82ff',
  },
];

type ActiveTab = 'overview' | 'uyirmey';

const TamilLetters = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [highlightedVoice, setHighlightedVoice] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleLetterClick = useCallback((letter: string) => {
    setSelectedLetter(letter);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedLetter(null);
  }, []);

  return (
    <div className="tamil-letters-page">
      <PageTitle
        title="Tamil Letters — உயிர் & மெய்"
        description="Learn all 12 Tamil vowels, 18 consonants and the Aytham with pronunciation, examples and audio."
        path="/tamil-letters"
      />
      <section className="tamil-letters-hero">
        <h1>தமிழ் எழுத்துகள்</h1>
        <p>Tamil script has 12 vowels, 18 consonants, and 216 compound letters</p>
        <div className="tamil-letters-hero__audio-controls">
          <SpeedToggle />
          <span className="tamil-letters-hero__hint">Click any letter to hear it</span>
        </div>
      </section>

      <div className="tamil-letters-tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          அடிப்படை எழுத்துகள்
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'uyirmey' ? 'active' : ''}`}
          onClick={() => setActiveTab('uyirmey')}
        >
          உயிர்மெய் எழுத்துகள்
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="tamil-letters-overview">
          {letterGroups.map((group) => (
            <section
              key={group.title}
              className="letter-group"
              style={{ '--group-color': group.color } as React.CSSProperties}
            >
              <div className="letter-group__header">
                <h2>{group.title}</h2>
                <span className="letter-group__badge">{group.subtitle}</span>
              </div>
              <div className="letter-group__grid">
                {group.letters.map((letter) => {
                  const info = letterDetails[letter];
                  return (
                    <div
                      key={letter}
                      className="letter-tile"
                      title={info ? `${info.word} — ${info.meaning}` : ''}
                      onClick={() => handleLetterClick(letter)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleLetterClick(letter)}
                    >
                      <span className="letter-tile__char">{letter}</span>
                      {info?.imageSrc && (
                        <img
                          src={info.imageSrc}
                          alt={`${info.word} image`}
                          className="letter-tile__image"
                          loading="lazy"
                        />
                      )}
                      {info && (
                        <span className="letter-tile__meaning">
                          <span className="letter-tile__word">{info.word}</span>
                          <span className="letter-tile__english">{info.meaning}</span>
                        </span>
                      )}
                      <SpeakButton text={letter} size="sm" className="letter-tile__speak" />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <section
            className="letter-group"
            style={{ '--group-color': '#ff9600' } as React.CSSProperties}
          >
            <div className="letter-group__header">
              <h2>ஆய்த எழுத்து</h2>
              <span className="letter-group__badge">Special letter — 1</span>
            </div>
            <div className="letter-group__grid">
              <div
                className="letter-tile letter-tile--special"
                title={`${letterDetails[aytham].word} — ${letterDetails[aytham].meaning}`}
                onClick={() => handleLetterClick(aytham)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleLetterClick(aytham)}
              >
                <span className="letter-tile__char">{aytham}</span>
                <span className="letter-tile__meaning">
                  <span className="letter-tile__word">{letterDetails[aytham].word}</span>
                  <span className="letter-tile__english">{letterDetails[aytham].meaning}</span>
                </span>
              </div>
            </div>
          </section>

          <section className="tamil-letters-summary">
            <h2>சுருக்கம்</h2>
            <div className="summary-cards">
              <div className="summary-card" style={{ '--card-color': '#58cc02' } as React.CSSProperties}>
                <span className="summary-card__number">13</span>
                <span className="summary-card__label">உயிர் எழுத்துகள்</span>
              </div>
              <div className="summary-card" style={{ '--card-color': '#ce82ff' } as React.CSSProperties}>
                <span className="summary-card__number">18</span>
                <span className="summary-card__label">மெய் எழுத்துகள்</span>
              </div>
              <div className="summary-card" style={{ '--card-color': '#1cb0f6' } as React.CSSProperties}>
                <span className="summary-card__number">234</span>
                <span className="summary-card__label">உயிர்மெய் எழுத்துகள்</span>
              </div>
              <div className="summary-card summary-card--total" style={{ '--card-color': '#ff4b4b' } as React.CSSProperties}>
                <span className="summary-card__number">247</span>
                <span className="summary-card__label">மொத்தம்</span>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'uyirmey' && (
        <div className="tamil-letters-uyirmey">
          <p className="uyirmey-info">
            ஒவ்வொரு மெய் எழுத்தும் 12 உயிர் எழுத்துகளுடன் சேர்ந்து 12 உயிர்மெய் எழுத்துகளை உருவாக்கும்.
            Click a row to highlight it, or click any letter to hear it spoken.
          </p>
          <UyirmeiAlphabetTable
            wrapperClassName="uyirmey-table-wrapper"
            tableClassName="uyirmey-table"
            rowHeaderClassName="row-header"
            cellClassName="uyirmey-cell"
            highlightedVoice={highlightedVoice}
            onRowClick={(voice) => setHighlightedVoice(voice === highlightedVoice ? null : voice)}
            onCellHover={(_, __, voice) => speakTamil(voice)}
            onCellClick={(_, voice) => speakTamil(voice)}
          />
        </div>
      )}

      {selectedLetter && (
        <LetterModal letter={selectedLetter} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TamilLetters;
