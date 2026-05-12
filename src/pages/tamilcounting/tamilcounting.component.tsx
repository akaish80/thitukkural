import { useState } from 'react';
import PageTitle from '../../components/PageTitle';
import { speakTamil } from '../../utils/pronunciationEngine';
import './tamilcounting.styles.scss';

interface CountingNumber {
  arabic: number;
  tamil: string;
  romanization: string;
}

const numbers: CountingNumber[] = [
  { arabic: 1, tamil: 'ஒன்று', romanization: 'onru' },
  { arabic: 2, tamil: 'இரண்டு', romanization: 'irandu' },
  { arabic: 3, tamil: 'மூன்று', romanization: 'mūnru' },
  { arabic: 4, tamil: 'நான்கு', romanization: 'nānku' },
  { arabic: 5, tamil: 'ஐந்து', romanization: 'aintu' },
  { arabic: 6, tamil: 'ஆறு', romanization: 'āru' },
  { arabic: 7, tamil: 'ஏழு', romanization: 'ēzhu' },
  { arabic: 8, tamil: 'எட்டு', romanization: 'ettu' },
  { arabic: 9, tamil: 'ஒன்பது', romanization: 'onpatu' },
  { arabic: 10, tamil: 'பத்து', romanization: 'pattu' },
  { arabic: 11, tamil: 'பதினொன்று', romanization: 'pathinonru' },
  { arabic: 12, tamil: 'பதினிரண்டு', romanization: 'pathinirandu' },
  { arabic: 13, tamil: 'பதின்மூன்று', romanization: 'pathinmūnru' },
  { arabic: 14, tamil: 'பதினான்கு', romanization: 'pathinānku' },
  { arabic: 15, tamil: 'பதினைந்து', romanization: 'pathinaintu' },
  { arabic: 16, tamil: 'பதினாறு', romanization: 'pathinā ru' },
  { arabic: 17, tamil: 'பதினேழு', romanization: 'pathinēzhu' },
  { arabic: 18, tamil: 'பதினெட்டு', romanization: 'pathinettu' },
  { arabic: 19, tamil: 'பதினொன்பது', romanization: 'pathinonpatu' },
  { arabic: 20, tamil: 'இருபது', romanization: 'irupathu' },
  { arabic: 21, tamil: 'இருபத்தொன்று', romanization: 'irupathonru' },
  { arabic: 22, tamil: 'இருபத்திரண்டு', romanization: 'irupathirandu' },
  { arabic: 23, tamil: 'இருபத்திரூன்று', romanization: 'irupathimūnru' },
  { arabic: 24, tamil: 'இருபத்தான்கு', romanization: 'irupathnānku' },
  { arabic: 25, tamil: 'இருபத்தைந்து', romanization: 'irupathaintu' },
  { arabic: 26, tamil: 'இருபத்தாறு', romanization: 'irupathāru' },
  { arabic: 27, tamil: 'இருபத்தேழு', romanization: 'irupathēzhu' },
  { arabic: 28, tamil: 'இருபத்தெட்டு', romanization: 'irupathe ttu' },
  { arabic: 29, tamil: 'இருபத்தொன்பது', romanization: 'irupathonpatu' },
  { arabic: 30, tamil: 'முப்பது', romanization: 'muppathu' },
  { arabic: 31, tamil: 'முப்பத்தொன்று', romanization: 'muppathonru' },
  { arabic: 32, tamil: 'முப்பத்திரண்டு', romanization: 'muppathirandu' },
  { arabic: 33, tamil: 'முப்பத்திரூன்று', romanization: 'muppathimūnru' },
  { arabic: 34, tamil: 'முப்பத்தான்கு', romanization: 'muppathnānku' },
  { arabic: 35, tamil: 'முப்பத்தைந்து', romanization: 'muppathaintu' },
  { arabic: 36, tamil: 'முப்பத்தாறு', romanization: 'muppathāru' },
  { arabic: 37, tamil: 'முப்பத்தேழு', romanization: 'muppathēzhu' },
  { arabic: 38, tamil: 'முப்பத்தெட்டு', romanization: 'muppathe ttu' },
  { arabic: 39, tamil: 'முப்பத்தொன்பது', romanization: 'muppathonpatu' },
  { arabic: 40, tamil: 'நாற்பது', romanization: 'nārpathu' },
  { arabic: 41, tamil: 'நாற்பத்தொன்று', romanization: 'nārpathonru' },
  { arabic: 42, tamil: 'நாற்பத்திரண்டு', romanization: 'nārpathirandu' },
  { arabic: 43, tamil: 'நாற்பத்திரூன்று', romanization: 'nārpathimūnru' },
  { arabic: 44, tamil: 'நாற்பத்தான்கு', romanization: 'nārpathnānku' },
  { arabic: 45, tamil: 'நாற்பத்தைந்து', romanization: 'nārpathaintu' },
  { arabic: 46, tamil: 'நாற்பத்தாறு', romanization: 'nārpathāru' },
  { arabic: 47, tamil: 'நாற்பத்தேழு', romanization: 'nārpathēzhu' },
  { arabic: 48, tamil: 'நாற்பத்தெட்டு', romanization: 'nārpathe ttu' },
  { arabic: 49, tamil: 'நாற்பத்தொன்பது', romanization: 'nārpathonpatu' },
  { arabic: 50, tamil: 'ஐம்பது', romanization: 'aimpathu' },
  { arabic: 51, tamil: 'ஐம்பத்தொன்று', romanization: 'aimpathonru' },
  { arabic: 52, tamil: 'ஐம்பத்திரண்டு', romanization: 'aimpathirandu' },
  { arabic: 53, tamil: 'ஐம்பத்திரூன்று', romanization: 'aimpathimūnru' },
  { arabic: 54, tamil: 'ஐம்பத்தான்கு', romanization: 'aimpathnānku' },
  { arabic: 55, tamil: 'ஐம்பத்தைந்து', romanization: 'aimpathaintu' },
  { arabic: 56, tamil: 'ஐம்பத்தாறு', romanization: 'aimpathāru' },
  { arabic: 57, tamil: 'ஐம்பத்தேழு', romanization: 'aimpathēzhu' },
  { arabic: 58, tamil: 'ஐம்பத்தெட்டு', romanization: 'aimpathe ttu' },
  { arabic: 59, tamil: 'ஐம்பத்தொன்பது', romanization: 'aimpathonpatu' },
  { arabic: 60, tamil: 'அறுபது', romanization: 'arupathu' },
  { arabic: 61, tamil: 'அறுபத்தொன்று', romanization: 'arupathonru' },
  { arabic: 62, tamil: 'அறுபத்திரண்டு', romanization: 'arupathirandu' },
  { arabic: 63, tamil: 'அறுபத்திரூன்று', romanization: 'arupathimūnru' },
  { arabic: 64, tamil: 'அறுபத்தான்கு', romanization: 'arupathnānku' },
  { arabic: 65, tamil: 'அறுபத்தைந்து', romanization: 'arupathaintu' },
  { arabic: 66, tamil: 'அறுபத்தாறு', romanization: 'arupathāru' },
  { arabic: 67, tamil: 'அறுபத்தேழு', romanization: 'arupathēzhu' },
  { arabic: 68, tamil: 'அறுபத்தெட்டு', romanization: 'arupathe ttu' },
  { arabic: 69, tamil: 'அறுபத்தொன்பது', romanization: 'arupathonpatu' },
  { arabic: 70, tamil: 'எழுபது', romanization: 'ezhupathu' },
  { arabic: 71, tamil: 'எழுபத்தொன்று', romanization: 'ezhupathonru' },
  { arabic: 72, tamil: 'எழுபத்திரண்டு', romanization: 'ezhupathirandu' },
  { arabic: 73, tamil: 'எழுபத்திரூன்று', romanization: 'ezhupathimūnru' },
  { arabic: 74, tamil: 'எழுபத்தான்கு', romanization: 'ezhupathnānku' },
  { arabic: 75, tamil: 'எழுபத்தைந்து', romanization: 'ezhupathaintu' },
  { arabic: 76, tamil: 'எழுபத்தாறு', romanization: 'ezhupathāru' },
  { arabic: 77, tamil: 'எழுபத்தேழு', romanization: 'ezhupathēzhu' },
  { arabic: 78, tamil: 'எழுபத்தெட்டு', romanization: 'ezhupathe ttu' },
  { arabic: 79, tamil: 'எழுபத்தொன்பது', romanization: 'ezhupathonpatu' },
  { arabic: 80, tamil: 'எண்பது', romanization: 'enpathu' },
  { arabic: 81, tamil: 'எண்பத்தொன்று', romanization: 'enpathonru' },
  { arabic: 82, tamil: 'எண்பத்திரண்டு', romanization: 'enpathirandu' },
  { arabic: 83, tamil: 'எண்பத்திரூன்று', romanization: 'enpathimūnru' },
  { arabic: 84, tamil: 'எண்பத்தான்கு', romanization: 'enpathnānku' },
  { arabic: 85, tamil: 'எண்பத்தைந்து', romanization: 'enpathaintu' },
  { arabic: 86, tamil: 'எண்பத்தாறு', romanization: 'enpathāru' },
  { arabic: 87, tamil: 'எண்பத்தேழு', romanization: 'enpathēzhu' },
  { arabic: 88, tamil: 'எண்பத்தெட்டு', romanization: 'enpathe ttu' },
  { arabic: 89, tamil: 'எண்பத்தொன்பது', romanization: 'enpathonpatu' },
  { arabic: 90, tamil: 'தொண்ணூறு', romanization: 'tonnūru' },
  { arabic: 91, tamil: 'தொண்ணூற்றொன்று', romanization: 'tonnūrthonru' },
  { arabic: 92, tamil: 'தொண்ணூற்றிரண்டு', romanization: 'tonnūrtirandu' },
  { arabic: 93, tamil: 'தொண்ணூற்றுமூன்று', romanization: 'tonnūrtumūnru' },
  { arabic: 94, tamil: 'தொண்ணூற்றான்கு', romanization: 'tonnūrnānku' },
  { arabic: 95, tamil: 'தொண்ணூற்றைந்து', romanization: 'tonnūraintu' },
  { arabic: 96, tamil: 'தொண்ணூற்றாறு', romanization: 'tonnūrāru' },
  { arabic: 97, tamil: 'தொண்ணூற்றேழு', romanization: 'tonnūrēzhu' },
  { arabic: 98, tamil: 'தொண்ணூற்றெட்டு', romanization: 'tonnūrettu' },
  { arabic: 99, tamil: 'தொண்ணூற்றொன்பது', romanization: 'tonnūronpatu' },
  { arabic: 100, tamil: 'நூறு', romanization: 'nūru' },
];

const GROUPS = [
  { label: '1–10', range: [1, 10] },
  { label: '11–20', range: [11, 20] },
  { label: '21–30', range: [21, 30] },
  { label: '31–40', range: [31, 40] },
  { label: '41–50', range: [41, 50] },
  { label: '51–60', range: [51, 60] },
  { label: '61–70', range: [61, 70] },
  { label: '71–80', range: [71, 80] },
  { label: '81–90', range: [81, 90] },
  { label: '91–100', range: [91, 100] },
];

const TamilCounting = () => {
  const [activeGroup, setActiveGroup] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [speaking, setSpeaking] = useState<number | null>(null);

  const visibleNumbers = numbers.filter(
    (n) => n.arabic >= GROUPS[activeGroup].range[0] && n.arabic <= GROUPS[activeGroup].range[1]
  );

  const handleSpeak = (n: CountingNumber) => {
    setSpeaking(n.arabic);
    speakTamil(n.tamil);
    setTimeout(() => setSpeaking(null), 1200);
  };

  const toggleReveal = (arabic: number) => {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(arabic)) next.delete(arabic);
      else next.add(arabic);
      return next;
    });
  };

  const revealAll = () => setRevealed(new Set(visibleNumbers.map((n) => n.arabic)));
  const hideAll = () => setRevealed(new Set());

  return (
    <div className="tamil-counting-page">
      <PageTitle
        title="Tamil Counting"
        description="Practice counting in Tamil with interactive exercises."
        path="/tamil-counting"
      />
      {/* Hero */}
      <section className="counting-hero">
        <h1 className="counting-hero__title">
          <span className="counting-hero__tamil">தமிழில் எண்ணுங்கள்</span>
          <span className="counting-hero__en">Count in Tamil (1–100)</span>
        </h1>
        <p className="counting-hero__subtitle">
          Learn the Tamil words for numbers 1 to 100, with romanized pronunciation guides and audio.
        </p>
        <button
          className={`counting-quiz-toggle${quizMode ? ' active' : ''}`}
          onClick={() => { setQuizMode(!quizMode); setRevealed(new Set()); }}
        >
          {quizMode ? '📖 Study Mode' : '🧩 Quiz Mode'}
        </button>
      </section>

      {/* Group tabs */}
      <div className="counting-groups">
        {GROUPS.map((g, i) => (
          <button
            key={g.label}
            className={`counting-group-btn${activeGroup === i ? ' active' : ''}`}
            onClick={() => { setActiveGroup(i); setRevealed(new Set()); }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Quiz controls */}
      {quizMode && (
        <div className="counting-quiz-controls">
          <button className="counting-quiz-action" onClick={revealAll}>Show All</button>
          <button className="counting-quiz-action" onClick={hideAll}>Hide All</button>
        </div>
      )}

      {/* Number cards */}
      <div className="counting-grid">
        {visibleNumbers.map((n) => {
          const isRevealed = !quizMode || revealed.has(n.arabic);
          return (
            <div
              key={n.arabic}
              className={`counting-card${speaking === n.arabic ? ' speaking' : ''}`}
              onClick={() => quizMode ? toggleReveal(n.arabic) : handleSpeak(n)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && (quizMode ? toggleReveal(n.arabic) : handleSpeak(n))}
              aria-label={`${n.arabic}: ${n.tamil}`}
            >
              <span className="counting-card__number">{n.arabic}</span>
              <span className={`counting-card__tamil${isRevealed ? '' : ' hidden'}`}>
                {isRevealed ? n.tamil : '???'}
              </span>
              <span className={`counting-card__roman${isRevealed ? '' : ' hidden'}`}>
                {isRevealed ? n.romanization : ''}
              </span>
              {!quizMode && (
                <button
                  className="counting-card__speak"
                  onClick={(e) => { e.stopPropagation(); handleSpeak(n); }}
                  title="Listen"
                  aria-label={`Listen to ${n.tamil}`}
                >
                  🔊
                </button>
              )}
              {quizMode && !isRevealed && (
                <span className="counting-card__hint">Tap to reveal</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <section className="counting-tips">
        <h2>Patterns to Remember</h2>
        <div className="counting-tips__grid">
          <div className="counting-tips__card">
            <span className="counting-tips__icon">💡</span>
            <h3>11–19</h3>
            <p>Start with <strong>பதின்</strong> (pathin) + the unit. E.g., 11 = பதினொன்று (pathin + onru).</p>
          </div>
          <div className="counting-tips__card">
            <span className="counting-tips__icon">💡</span>
            <h3>21–29</h3>
            <p>Start with <strong>இருபத்</strong> (irupath) + the unit. E.g., 21 = இருபத்தொன்று.</p>
          </div>
          <div className="counting-tips__card">
            <span className="counting-tips__icon">💡</span>
            <h3>Tens</h3>
            <p>20=இருபது, 30=முப்பது, 40=நாற்பது, 50=ஐம்பது, 60=அறுபது, 70=எழுபது, 80=எண்பது, 90=தொண்ணூறு.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TamilCounting;
