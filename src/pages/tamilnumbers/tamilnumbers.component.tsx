import { useState } from 'react';
import './tamilnumbers.styles.scss';

interface TamilNumber {
  tamil: string;
  arabic: number;
  word: string;
  wordMeaning: string;
}

const basicNumbers: TamilNumber[] = [
  { tamil: '௦', arabic: 0, word: 'சுழியம்', wordMeaning: 'Zero' },
  { tamil: '௧', arabic: 1, word: 'ஒன்று', wordMeaning: 'One' },
  { tamil: '௨', arabic: 2, word: 'இரண்டு', wordMeaning: 'Two' },
  { tamil: '௩', arabic: 3, word: 'மூன்று', wordMeaning: 'Three' },
  { tamil: '௪', arabic: 4, word: 'நான்கு', wordMeaning: 'Four' },
  { tamil: '௫', arabic: 5, word: 'ஐந்து', wordMeaning: 'Five' },
  { tamil: '௬', arabic: 6, word: 'ஆறு', wordMeaning: 'Six' },
  { tamil: '௭', arabic: 7, word: 'ஏழு', wordMeaning: 'Seven' },
  { tamil: '௮', arabic: 8, word: 'எட்டு', wordMeaning: 'Eight' },
  { tamil: '௯', arabic: 9, word: 'ஒன்பது', wordMeaning: 'Nine' },
];

const tens: TamilNumber[] = [
  { tamil: '௧௦', arabic: 10, word: 'பத்து', wordMeaning: 'Ten' },
  { tamil: '௨௦', arabic: 20, word: 'இருபது', wordMeaning: 'Twenty' },
  { tamil: '௩௦', arabic: 30, word: 'முப்பது', wordMeaning: 'Thirty' },
  { tamil: '௪௦', arabic: 40, word: 'நாற்பது', wordMeaning: 'Forty' },
  { tamil: '௫௦', arabic: 50, word: 'ஐம்பது', wordMeaning: 'Fifty' },
  { tamil: '௬௦', arabic: 60, word: 'அறுபது', wordMeaning: 'Sixty' },
  { tamil: '௭௦', arabic: 70, word: 'எழுபது', wordMeaning: 'Seventy' },
  { tamil: '௮௦', arabic: 80, word: 'எண்பது', wordMeaning: 'Eighty' },
  { tamil: '௯௦', arabic: 90, word: 'தொண்ணூறு', wordMeaning: 'Ninety' },
];

const specials: TamilNumber[] = [
  { tamil: '௱', arabic: 100, word: 'நூறு', wordMeaning: 'Hundred' },
  { tamil: '௲', arabic: 1000, word: 'ஆயிரம்', wordMeaning: 'Thousand' },
];

const tamilDigit = (n: number): string => {
  const digits = '௦௧௨௩௪௫௬௭௮௯';
  return String(n).split('').map(d => digits[parseInt(d)] || d).join('');
};

const speakTamil = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ta-IN';
  utter.rate = 0.8;
  window.speechSynthesis.speak(utter);
};

type TabType = 'digits' | 'tens' | 'special' | 'converter';

const TamilNumbers = () => {
  const [activeTab, setActiveTab] = useState<TabType>('digits');
  const [converterValue, setConverterValue] = useState('');

  const renderNumberGrid = (numbers: TamilNumber[], color: string) => (
    <div className="number-grid">
      {numbers.map((num) => (
        <div
          key={num.arabic}
          className="number-card"
          style={{ '--card-accent': color } as React.CSSProperties}
          onClick={() => speakTamil(num.word)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && speakTamil(num.word)}
        >
          <span className="number-card__tamil">{num.tamil}</span>
          <span className="number-card__arabic">{num.arabic}</span>
          <span className="number-card__word">{num.word}</span>
          <span className="number-card__en">{num.wordMeaning}</span>
          <span className="number-card__speak" title="Listen">🔊</span>
        </div>
      ))}
    </div>
  );

  const convertedTamil = converterValue ? tamilDigit(parseInt(converterValue) || 0) : '';

  return (
    <div className="tamil-numbers-page">
      <section className="numbers-hero">
        <h1 className="numbers-hero__title">
          <span className="numbers-hero__tamil">தமிழ் எண்கள்</span>
          <span className="numbers-hero__en">Tamil Number System</span>
        </h1>
        <p className="numbers-hero__subtitle">
          Tamil has its own numeral system dating back over 2,000 years. Learn the digits, tens, and special symbols.
        </p>
      </section>

      <div className="numbers-tabs">
        {([
          ['digits', '௧-௯ எண்கள்', 'Digits (0–9)'],
          ['tens', '௧௦-௯௦ பத்துகள்', 'Tens'],
          ['special', '௱ ௲ சிறப்பு', 'Special'],
          ['converter', '🔄 மாற்றி', 'Converter'],
        ] as [TabType, string, string][]).map(([key, label, sub]) => (
          <button
            key={key}
            className={`numbers-tab${activeTab === key ? ' active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <span className="numbers-tab__label">{label}</span>
            <span className="numbers-tab__sub">{sub}</span>
          </button>
        ))}
      </div>

      {activeTab === 'digits' && renderNumberGrid(basicNumbers, '#58cc02')}
      {activeTab === 'tens' && renderNumberGrid(tens, '#ce82ff')}
      {activeTab === 'special' && renderNumberGrid(specials, '#ff9600')}

      {activeTab === 'converter' && (
        <div className="number-converter">
          <h2>Number Converter</h2>
          <p className="number-converter__info">
            Type any number to see it in Tamil numerals.
          </p>
          <div className="number-converter__input-row">
            <input
              type="number"
              min="0"
              max="999999999"
              value={converterValue}
              onChange={(e) => setConverterValue(e.target.value)}
              placeholder="Enter a number..."
              className="number-converter__input"
            />
          </div>
          {convertedTamil && (
            <div className="number-converter__result">
              <span className="number-converter__tamil">{convertedTamil}</span>
              <button
                className="number-converter__speak"
                onClick={() => speakTamil(convertedTamil)}
              >
                🔊 Listen
              </button>
            </div>
          )}
        </div>
      )}

      <section className="numbers-info">
        <h2>Did You Know?</h2>
        <div className="numbers-info__cards">
          <div className="numbers-info__card">
            <span className="numbers-info__icon">📜</span>
            <p>Tamil numerals are one of the oldest numeral systems still in use, found in inscriptions from the 6th century CE.</p>
          </div>
          <div className="numbers-info__card">
            <span className="numbers-info__icon">🔢</span>
            <p>Tamil has special symbols for 100 (௱) and 1000 (௲) that are unique to the Tamil numeral system.</p>
          </div>
          <div className="numbers-info__card">
            <span className="numbers-info__icon">📖</span>
            <p>The word "சுழியம்" (zero) in Tamil is one of the earliest words for zero in any language.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TamilNumbers;
