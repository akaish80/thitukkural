import { useState } from 'react';
import './tamilletters.styles.scss';

interface LetterGroup {
  title: string;
  subtitle: string;
  letters: string[];
  color: string;
}

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

  return (
    <div className="tamil-letters-page">
      <section className="tamil-letters-hero">
        <h1>தமிழ் எழுத்துகள்</h1>
        <p>Tamil script has 12 vowels, 18 consonants, and 216 compound letters</p>
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
                {group.letters.map((letter) => (
                  <div key={letter} className="letter-tile">
                    {letter}
                  </div>
                ))}
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
              <div className="letter-tile letter-tile--special">{aytham}</div>
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
            Click a row to highlight it.
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
                    {uyirSuffixes.map((suffix, i) => (
                      <td key={i}>{base + suffix}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TamilLetters;
