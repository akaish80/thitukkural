import { useState, useEffect, useCallback } from 'react';
import PageTitle from '../../components/PageTitle';
import { speakTamil } from '../../utils/pronunciationEngine';
import { SpeakButton, SpeedToggle, Waveform } from '../../components/PronunciationPlayer/PronunciationPlayer';
import { onSpeakingChange } from '../../utils/pronunciationEngine';
import './tamilletters.styles.scss';

interface LetterGroup {
  title: string;
  subtitle: string;
  letters: string[];
  color: string;
}

interface LetterDetail {
  word: string;
  meaning: string;
  imageSrc?: string;
  type: 'vowel' | 'consonant' | 'special';
  typeLabel: string;
  typeLabelEn: string;
  romanization: string;
  pronunciation: string;
  exampleSentence: string;
  exampleTranslation: string;
}

// Full explanations for each Tamil letter
const letterDetails: Record<string, LetterDetail> = {
  // உயிர் எழுத்துகள் (Vowels)
  'அ': { word: 'அம்மா', meaning: 'Mother', imageSrc: '/learning-images/png/vowel-a.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Short Vowel', romanization: 'a', pronunciation: 'Like "u" in "but"', exampleSentence: 'அம்மா வீட்டில் இருக்கிறாள்', exampleTranslation: 'Mother is at home' },
  'ஆ': { word: 'ஆடு', meaning: 'Goat', imageSrc: '/learning-images/png/vowel-aa.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Long Vowel', romanization: 'aa', pronunciation: 'Like "a" in "father"', exampleSentence: 'ஆடு புல் தின்கிறது', exampleTranslation: 'The goat eats grass' },
  'இ': { word: 'இலை', meaning: 'Leaf', imageSrc: '/learning-images/png/vowel-i.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Short Vowel', romanization: 'i', pronunciation: 'Like "i" in "sit"', exampleSentence: 'இலை மரத்தில் உள்ளது', exampleTranslation: 'The leaf is on the tree' },
  'ஈ': { word: 'ஈ', meaning: 'Fly', imageSrc: '/learning-images/png/vowel-ii.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Long Vowel', romanization: 'ii', pronunciation: 'Like "ee" in "see"', exampleSentence: 'ஈ பறக்கிறது', exampleTranslation: 'The fly is flying' },
  'உ': { word: 'உணவு', meaning: 'Food', imageSrc: '/learning-images/png/vowel-u.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Short Vowel', romanization: 'u', pronunciation: 'Like "u" in "put"', exampleSentence: 'உணவு சாப்பிட வேண்டும்', exampleTranslation: 'You should eat food' },
  'ஊ': { word: 'ஊஞ்சல்', meaning: 'Swing', imageSrc: '/learning-images/png/vowel-uu.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Long Vowel', romanization: 'uu', pronunciation: 'Like "oo" in "moon"', exampleSentence: 'ஊஞ்சல் ஆடு', exampleTranslation: 'Play on the swing' },
  'எ': { word: 'எலி', meaning: 'Rat', imageSrc: '/learning-images/png/vowel-e.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Short Vowel', romanization: 'e', pronunciation: 'Like "e" in "pet"', exampleSentence: 'எலி ஓடுகிறது', exampleTranslation: 'The rat is running' },
  'ஏ': { word: 'ஏணி', meaning: 'Ladder', imageSrc: '/learning-images/png/vowel-ee.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Long Vowel', romanization: 'ee', pronunciation: 'Like "a" in "gate"', exampleSentence: 'ஏணி மேல் ஏறு', exampleTranslation: 'Climb up the ladder' },
  'ஐ': { word: 'ஐந்து', meaning: 'Five', imageSrc: '/learning-images/png/vowel-ai.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Diphthong', romanization: 'ai', pronunciation: 'Like "ai" in "aisle"', exampleSentence: 'ஐந்து விரல்கள் உள்ளன', exampleTranslation: 'There are five fingers' },
  'ஒ': { word: 'ஒட்டகச்சிவிங்கி', meaning: 'Giraffe', imageSrc: '/learning-images/png/vowel-o.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Short Vowel', romanization: 'o', pronunciation: 'Like "o" in "go" (short)', exampleSentence: 'ஒட்டகச்சிவிங்கி உயரமான விலங்கு', exampleTranslation: 'The giraffe is a tall animal' },
  'ஓ': { word: 'ஓடம்', meaning: 'Boat', imageSrc: '/learning-images/png/vowel-oo.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Long Vowel', romanization: 'oo', pronunciation: 'Like "o" in "go" (long)', exampleSentence: 'ஓடம் ஆற்றில் செல்கிறது', exampleTranslation: 'The boat goes in the river' },
  'ஔ': { word: 'ஔடதம்', meaning: 'Medicine', imageSrc: '/learning-images/png/vowel-au.png', type: 'vowel', typeLabel: 'உயிர்', typeLabelEn: 'Diphthong', romanization: 'au', pronunciation: 'Like "ow" in "cow"', exampleSentence: 'ஔடதம் நேரத்தில் எடுத்துக்கொள்', exampleTranslation: 'Take medicine on time' },
  // ஆய்த எழுத்து
  'ஃ': { word: 'அஃது', meaning: 'That', type: 'special', typeLabel: 'ஆய்தம்', typeLabelEn: 'Aytham (Special)', romanization: 'kh', pronunciation: 'A brief pause or glottal stop', exampleSentence: 'அஃது நல்லது', exampleTranslation: 'That is good' },
  // மெய் எழுத்துகள் (Consonants)
  'க்': { word: 'கல்', meaning: 'Stone', type: 'consonant', typeLabel: 'வல்லினம்', typeLabelEn: 'Hard Consonant', romanization: 'k', pronunciation: 'Like "k" in "kite"', exampleSentence: 'கல்வி கரை இல', exampleTranslation: 'Education has no shore (is endless)' },
  'ங்': { word: 'மாங்காய்', meaning: 'Mango (raw)', type: 'consonant', typeLabel: 'மெல்லினம்', typeLabelEn: 'Soft Consonant', romanization: 'ng', pronunciation: 'Like "ng" in "sing"', exampleSentence: 'மாங்காய் புளிக்கும்', exampleTranslation: 'Raw mango is sour' },
  'ச்': { word: 'சட்டி', meaning: 'Pot', type: 'consonant', typeLabel: 'வல்லினம்', typeLabelEn: 'Hard Consonant', romanization: 'c', pronunciation: 'Like "ch" in "chat"', exampleSentence: 'சட்டியில் சோறு இருக்கிறது', exampleTranslation: 'There is rice in the pot' },
  'ஞ்': { word: 'ஞாயிறு', meaning: 'Sun / Sunday', type: 'consonant', typeLabel: 'மெல்லினம்', typeLabelEn: 'Soft Consonant', romanization: 'nj', pronunciation: 'Like "ny" in "canyon"', exampleSentence: 'ஞாயிறு விடுமுறை நாள்', exampleTranslation: 'Sunday is a holiday' },
  'ட்': { word: 'வட்டம்', meaning: 'Circle', type: 'consonant', typeLabel: 'வல்லினம்', typeLabelEn: 'Hard Consonant', romanization: 't', pronunciation: 'Like "t" in "top" (retroflex)', exampleSentence: 'வட்டம் வரையவும்', exampleTranslation: 'Draw a circle' },
  'ண்': { word: 'மண்', meaning: 'Soil', type: 'consonant', typeLabel: 'மெல்லினம்', typeLabelEn: 'Soft Consonant', romanization: 'n', pronunciation: 'Like "n" in "under" (retroflex)', exampleSentence: 'மண் வளமானது', exampleTranslation: 'The soil is fertile' },
  'த்': { word: 'தமிழ்', meaning: 'Tamil', type: 'consonant', typeLabel: 'வல்லினம்', typeLabelEn: 'Hard Consonant', romanization: 't', pronunciation: 'Like "th" in "the" (dental)', exampleSentence: 'தமிழ் இனிய மொழி', exampleTranslation: 'Tamil is a sweet language' },
  'ந்': { word: 'நண்டு', meaning: 'Crab', type: 'consonant', typeLabel: 'மெல்லினம்', typeLabelEn: 'Soft Consonant', romanization: 'n', pronunciation: 'Like "n" in "name" (dental)', exampleSentence: 'நண்டு கடலில் வாழும்', exampleTranslation: 'Crabs live in the sea' },
  'ப்': { word: 'பழம்', meaning: 'Fruit', type: 'consonant', typeLabel: 'வல்லினம்', typeLabelEn: 'Hard Consonant', romanization: 'p', pronunciation: 'Like "p" in "put"', exampleSentence: 'பழம் சாப்பிடு', exampleTranslation: 'Eat the fruit' },
  'ம்': { word: 'மரம்', meaning: 'Tree', type: 'consonant', typeLabel: 'மெல்லினம்', typeLabelEn: 'Soft Consonant', romanization: 'm', pronunciation: 'Like "m" in "moon"', exampleSentence: 'மரம் நிழல் தருகிறது', exampleTranslation: 'The tree gives shade' },
  'ய்': { word: 'யானை', meaning: 'Elephant', type: 'consonant', typeLabel: 'இடையினம்', typeLabelEn: 'Medium Consonant', romanization: 'y', pronunciation: 'Like "y" in "yes"', exampleSentence: 'யானை பெரிய விலங்கு', exampleTranslation: 'Elephant is a big animal' },
  'ர்': { word: 'ரோஜா', meaning: 'Rose', type: 'consonant', typeLabel: 'இடையினம்', typeLabelEn: 'Medium Consonant', romanization: 'r', pronunciation: 'Like "r" in "run" (alveolar tap)', exampleSentence: 'ரோஜா மலர் அழகானது', exampleTranslation: 'The rose flower is beautiful' },
  'ல்': { word: 'லட்டு', meaning: 'Laddu (sweet)', type: 'consonant', typeLabel: 'இடையினம்', typeLabelEn: 'Medium Consonant', romanization: 'l', pronunciation: 'Like "l" in "love"', exampleSentence: 'லட்டு இனிப்பானது', exampleTranslation: 'Laddu is sweet' },
  'வ்': { word: 'வாழை', meaning: 'Banana', type: 'consonant', typeLabel: 'இடையினம்', typeLabelEn: 'Medium Consonant', romanization: 'v', pronunciation: 'Like "v" in "vine"', exampleSentence: 'வாழைப்பழம் நல்லது', exampleTranslation: 'Banana is good' },
  'ழ்': { word: 'தாழ்', meaning: 'Lock', type: 'consonant', typeLabel: 'இடையினம்', typeLabelEn: 'Medium Consonant', romanization: 'zh', pronunciation: 'Unique Tamil retroflex "zh" sound', exampleSentence: 'தாழ் போடு', exampleTranslation: 'Lock it' },
  'ள்': { word: 'வெள்ளம்', meaning: 'Flood', type: 'consonant', typeLabel: 'இடையினம்', typeLabelEn: 'Medium Consonant', romanization: 'l', pronunciation: 'Like "l" with tongue curled back', exampleSentence: 'வெள்ளம் வந்தது', exampleTranslation: 'The flood came' },
  'ற்': { word: 'கற்றை', meaning: 'Bundle', type: 'consonant', typeLabel: 'வல்லினம்', typeLabelEn: 'Hard Consonant', romanization: 'r', pronunciation: 'Like rolled "rr" in "parrot"', exampleSentence: 'கற்றது கைமண் அளவு', exampleTranslation: 'What is learnt is a handful' },
  'ன்': { word: 'மின்', meaning: 'Electricity', type: 'consonant', typeLabel: 'மெல்லினம்', typeLabelEn: 'Soft Consonant', romanization: 'n', pronunciation: 'Like "n" in "fun" (alveolar)', exampleSentence: 'மின்சாரம் தேவை', exampleTranslation: 'Electricity is needed' },
};

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

const uyirLetters = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'];
const meyLetters = ['க்', 'ங்', 'ச்', 'ஞ்', 'ட்', 'ண்', 'த்', 'ந்', 'ப்', 'ம்', 'ய்', 'ர்', 'ல்', 'வ்', 'ழ்', 'ள்', 'ற்', 'ன்'];
const uyirMeyBase = ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'];
const uyirSuffixes = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];
const aytham = 'ஃ';

const letterGroups: LetterGroup[] = [
  {
    title: 'உயிர் எழுத்துகள்',
    subtitle: 'Vowels — 12 letters',
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
  const [highlightedBase, setHighlightedBase] = useState<string | null>(null);
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
                <span className="summary-card__number">12</span>
                <span className="summary-card__label">உயிர் எழுத்துகள்</span>
              </div>
              <div className="summary-card" style={{ '--card-color': '#ce82ff' } as React.CSSProperties}>
                <span className="summary-card__number">18</span>
                <span className="summary-card__label">மெய் எழுத்துகள்</span>
              </div>
              <div className="summary-card" style={{ '--card-color': '#1cb0f6' } as React.CSSProperties}>
                <span className="summary-card__number">216</span>
                <span className="summary-card__label">உயிர்மெய் எழுத்துகள்</span>
              </div>
              <div className="summary-card" style={{ '--card-color': '#ff9600' } as React.CSSProperties}>
                <span className="summary-card__number">1</span>
                <span className="summary-card__label">ஆய்த எழுத்து</span>
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
          <div className="uyirmey-table-wrapper">
            <table className="uyirmey-table">
              <thead>
                <tr>
                  <th></th>
                  {uyirLetters.map((v) => (
                    <th key={v}>{v}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uyirMeyBase.map((base) => (
                  <tr
                    key={base}
                    className={highlightedBase === base ? 'highlighted' : ''}
                    onClick={() => setHighlightedBase(highlightedBase === base ? null : base)}
                  >
                    <td className="row-header">{base}</td>
                    {uyirSuffixes.map((suffix, i) => {
                      const combined = base + suffix;
                      return (
                        <td
                          key={i}
                          className="uyirmey-cell"
                          onClick={(e) => { e.stopPropagation(); speakTamil(combined); }}
                          title={`Click to hear "${combined}"`}
                        >
                          {combined}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedLetter && (
        <LetterModal letter={selectedLetter} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TamilLetters;
