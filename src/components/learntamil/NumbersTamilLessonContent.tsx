import { useMemo, useState } from 'react';

type NumberRow = {
  arabic: string;
  tamilNumeral: string;
  tamil: string;
  spokenTamil: string;
  transliteration: string;
};

const NUMBERS_ZERO_TO_TEN: NumberRow[] = [
  { arabic: '0', tamilNumeral: '௦', tamil: 'பூஜியம்/சுழியம்', spokenTamil: 'பூஜியம்', transliteration: 'Pujiyam' },
  { arabic: '1', tamilNumeral: '௧', tamil: 'ஒன்று', spokenTamil: 'ஒன்னு', transliteration: 'Onnu' },
  { arabic: '2', tamilNumeral: '௨', tamil: 'இரண்டு', spokenTamil: 'ரெண்டு', transliteration: 'Rendu' },
  { arabic: '3', tamilNumeral: '௩', tamil: 'மூன்று', spokenTamil: 'மூனு', transliteration: 'Moonu' },
  { arabic: '4', tamilNumeral: '௪', tamil: 'நான்கு', spokenTamil: 'நாலு', transliteration: 'Naalu' },
  { arabic: '5', tamilNumeral: '௫', tamil: 'ஐந்து', spokenTamil: 'அஞ்சு', transliteration: 'Anju' },
  { arabic: '6', tamilNumeral: '௬', tamil: 'ஆறு', spokenTamil: 'ஆறு', transliteration: 'Aru' },
  { arabic: '7', tamilNumeral: '௭', tamil: 'ஏழு', spokenTamil: 'ஏழு', transliteration: 'Yelu' },
  { arabic: '8', tamilNumeral: '௮', tamil: 'எட்டு', spokenTamil: 'எட்டு', transliteration: 'Ettu' },
  { arabic: '9', tamilNumeral: '௯', tamil: 'ஒன்பது', spokenTamil: 'ஒம்போது', transliteration: 'Onpathu' },
  { arabic: '10', tamilNumeral: '௰', tamil: 'பத்து', spokenTamil: 'பத்து', transliteration: 'Pathu' },
];

const NUMBERS_ELEVEN_TO_NINETEEN = [
  { arabic: '11', tamil: 'பதினொன்று', transliteration: 'Pathinoru' },
  { arabic: '12', tamil: 'பன்னிரண்டு', transliteration: 'Pannirendu' },
  { arabic: '13', tamil: 'பதிமூன்று', transliteration: 'Pathumoonu' },
  { arabic: '14', tamil: 'பதிநான்கு', transliteration: 'Pathinalu' },
  { arabic: '15', tamil: 'பதினைந்து', transliteration: 'Pathanju' },
  { arabic: '16', tamil: 'பதினாறு', transliteration: 'Pathinaru' },
  { arabic: '17', tamil: 'பதினேழு', transliteration: 'Pathinezu' },
  { arabic: '18', tamil: 'பதினெட்டு', transliteration: 'Pathientu' },
  { arabic: '19', tamil: 'பத்தொன்பது', transliteration: 'Pathombathu' },
];

const TWENTIES = [
  '20. இருபது',
  '21. இருபத்தி ஒன்று',
  '22. இருபத்தி இரண்டு',
  '23. இருபத்தி மூன்று',
  '24. இருபத்தி நான்கு',
  '25. இருபத்தி ஐந்து',
  '26. இருபத்தி ஆறு',
  '27. இருபத்தி ஏழு',
  '28. இருபத்தி எட்டு',
  '29. இருபத்தி ஒன்பது',
];

const THIRTIES = [
  '30. முப்பது',
  '31. முப்பத்தி ஒன்று',
  '32. முப்பத்தி இரண்டு',
  '33. முப்பத்தி மூன்று',
  '34. முப்பத்தி நான்கு',
  '35. முப்பத்தி ஐந்து',
  '36. முப்பத்தி ஆறு',
  '37. முப்பத்தி ஏழு',
  '38. முப்பத்தி எட்டு',
  '39. முப்பத்தி ஒன்பது',
];

const TENS_TO_2000 = [
  '10 = பத்து (pathu)',
  '20 = இருபது (iruvathu)',
  '30 = முப்பது (mupathu)',
  '40 = நாற்பது (napathu)',
  '50 = ஐம்பது (aibathu)',
  '60 = அறுபது (aruvathu)',
  '70 = எழுபது (ezuvathu)',
  '80 = எண்பது (enpathu)',
  '90 = தொண்ணூறு (thonooru)',
  '100 = நூறு (nooru)',
  '1000 = ஆயிரம் (aiyaram)',
  '2000 = இரண்டாயிரம் (iradayiram)',
  '2023 = இரண்டாயிரத்தி இருபத்தி மூன்று (Iradayirathi iruvathi moonru)',
];

const MATCH_NUMBER_WORDS = [
  { number: '1', word: 'ஒன்று' },
  { number: '2', word: 'இரண்டு' },
  { number: '3', word: 'மூன்று' },
  { number: '4', word: 'நான்கு' },
  { number: '5', word: 'ஐந்து' },
  { number: '6', word: 'ஆறு' },
  { number: '7', word: 'ஏழு' },
  { number: '8', word: 'எட்டு' },
  { number: '9', word: 'ஒன்பது' },
  { number: '10', word: 'பத்து' },
];

const FILL_NUMERAL_ITEMS = [
  { tamil: 'பத்து', numeral: '10' },
  { tamil: 'இருபது', numeral: '20' },
  { tamil: 'முப்பது', numeral: '30' },
  { tamil: 'நாற்பது', numeral: '40' },
  { tamil: 'ஐம்பது', numeral: '50' },
  { tamil: 'அறுபது', numeral: '60' },
  { tamil: 'எழுபது', numeral: '70' },
  { tamil: 'எண்பது', numeral: '80' },
  { tamil: 'தொண்ணூறு', numeral: '90' },
  { tamil: 'நூறு', numeral: '100' },
];

const MCQ_ITEMS = [
  {
    prompt: 'Tamil word for 7 is:',
    options: ['ஐந்து', 'ஏழு', 'ஒன்பது', 'பத்து'],
    answer: 'ஏழு',
  },
  {
    prompt: 'Tamil word for 20 is:',
    options: ['இருபது', 'முப்பது', 'நாற்பது', 'அறுபது'],
    answer: 'இருபது',
  },
  {
    prompt: 'Tamil word for 13 is:',
    options: ['பன்னிரண்டு', 'பதிமூன்று', 'பதிநான்கு', 'பதினைந்து'],
    answer: 'பதிமூன்று',
  },
  {
    prompt: 'Tamil word for 90 is:',
    options: ['எண்பது', 'தொண்ணூறு', 'நூறு', 'ஆயிரம்'],
    answer: 'தொண்ணூறு',
  },
];

const ORDER_ITEMS = ['11', '12', '13', '14', '15'];

const SYMBOL_ITEMS = [
  { arabic: '2', tamilNumeral: '௨' },
  { arabic: '4', tamilNumeral: '௪' },
  { arabic: '6', tamilNumeral: '௬' },
  { arabic: '8', tamilNumeral: '௮' },
  { arabic: '10', tamilNumeral: '௰' },
];

const NumbersTamilLessonContent = () => {
  const wordBank = useMemo(
    () => [...MATCH_NUMBER_WORDS.map((item) => item.word)].sort(() => Math.random() - 0.5),
    []
  );

  const [matchAnswers, setMatchAnswers] = useState<Record<string, string>>({});
  const [matchScore, setMatchScore] = useState<string>('');

  const [fillAnswers, setFillAnswers] = useState<Record<string, string>>({});
  const [fillScore, setFillScore] = useState<string>('');

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [mcqScore, setMcqScore] = useState<string>('');

  const [orderAnswers, setOrderAnswers] = useState<string[]>(['', '', '', '', '']);
  const [orderScore, setOrderScore] = useState<string>('');

  const [symbolAnswers, setSymbolAnswers] = useState<Record<string, string>>({});
  const [symbolScore, setSymbolScore] = useState<string>('');

  const checkMatchAnswers = () => {
    let correct = 0;
    MATCH_NUMBER_WORDS.forEach((item) => {
      if ((matchAnswers[item.number] || '') === item.word) {
        correct += 1;
      }
    });
    setMatchScore(`Score: ${correct}/${MATCH_NUMBER_WORDS.length}`);
  };

  const checkFillAnswers = () => {
    let correct = 0;
    FILL_NUMERAL_ITEMS.forEach((item) => {
      if ((fillAnswers[item.tamil] || '').trim() === item.numeral) {
        correct += 1;
      }
    });
    setFillScore(`Score: ${correct}/${FILL_NUMERAL_ITEMS.length}`);
  };

  const checkMcqAnswers = () => {
    let correct = 0;
    MCQ_ITEMS.forEach((item, index) => {
      if ((mcqAnswers[index] || '') === item.answer) {
        correct += 1;
      }
    });
    setMcqScore(`Score: ${correct}/${MCQ_ITEMS.length}`);
  };

  const checkOrderAnswers = () => {
    let correct = 0;
    ORDER_ITEMS.forEach((value, index) => {
      if (orderAnswers[index] === value) {
        correct += 1;
      }
    });
    setOrderScore(`Score: ${correct}/${ORDER_ITEMS.length}`);
  };

  const checkSymbolAnswers = () => {
    let correct = 0;
    SYMBOL_ITEMS.forEach((item) => {
      if ((symbolAnswers[item.arabic] || '').trim() === item.tamilNumeral) {
        correct += 1;
      }
    });
    setSymbolScore(`Score: ${correct}/${SYMBOL_ITEMS.length}`);
  };

  return (
    <div className="lt-consonant-section">
      <h2>Numbers in Tamil (எண்கள்)</h2>
      <p className="lt-consonant-intro lt-text-left">
        In this chapter, we will learn Tamil numbers so we can use them in daily life, like telling phone numbers,
        time, date, and schedules. We are going to learn regular Arabic numerals with equivalent Tamil words.
      </p>
      <p className="lt-consonant-intro lt-text-left">
        The goal of this chapter is to be able to tell time, date, and year in any conversation. This helps in giving
        personal information like age, phone number, and address.
      </p>

      <h3 className="lt-consonant-subtitle">Numbers From 1 to 10</h3>
      <div className="lt-consonant-table-wrap">
        <table className="lt-consonant-table">
          <thead>
            <tr>
              <th>Arabic Numeral</th>
              <th>Tamil Numeral</th>
              <th>Tamil</th>
              <th>Spoken Tamil</th>
              <th>Transliteration</th>
            </tr>
          </thead>
          <tbody>
            {NUMBERS_ZERO_TO_TEN.map((row) => (
              <tr key={row.arabic}>
                <td>{row.arabic}</td>
                <td>{row.tamilNumeral}</td>
                <td>{row.tamil}</td>
                <td>{row.spokenTamil}</td>
                <td>{row.transliteration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="lt-consonant-intro lt-text-left">
        <strong>Note:</strong> In Tamil, nine, nineteen, ninety, and nine hundred are often treated as "one less"
        than the next complete number: ஒன்பது (Onpathu), பத்தொன்பது (Pathuonpathu), தொண்ணூறு (Thonnooru),
        and தொள்ளாயிரம் (Tholayiram).
      </p>

      <h3 className="lt-consonant-subtitle">Audio for Counting in Tamil</h3>
      <ul className="lt-text-left">
        <li>
          Audio for counting to 10 in formal Tamil:{' '}
          <a href="https://openbooks.lib.msu.edu/basictamil/?p=97#h5p-32" target="_blank" rel="noreferrer">
            openbooks.lib.msu.edu/basictamil/?p=97#h5p-32
          </a>
        </li>
        <li>
          Audio for counting from 0 to 10 in spoken Tamil:{' '}
          <a href="https://openbooks.lib.msu.edu/basictamil/?p=97#h5p-33" target="_blank" rel="noreferrer">
            openbooks.lib.msu.edu/basictamil/?p=97#h5p-33
          </a>
        </li>
      </ul>

      <h3 className="lt-consonant-subtitle">Numbers From 11 to 19</h3>
      <p className="lt-consonant-intro lt-text-left">
        For "teen" numbers, Tamil uses the "பதி" sound pattern in front of number words.
      </p>
      <div className="lt-consonant-table-wrap">
        <table className="lt-consonant-table">
          <thead>
            <tr>
              <th>Arabic Numeral</th>
              <th>Formal Tamil</th>
              <th>Transliteration</th>
            </tr>
          </thead>
          <tbody>
            {NUMBERS_ELEVEN_TO_NINETEEN.map((row) => (
              <tr key={row.arabic}>
                <td>{row.arabic}</td>
                <td>{row.tamil}</td>
                <td>{row.transliteration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="lt-consonant-intro lt-text-left">
        Audio/Video for counting to 20 in Tamil:{' '}
        <a href="https://openbooks.lib.msu.edu/basictamil/?p=97#video-97-1" target="_blank" rel="noreferrer">
          openbooks.lib.msu.edu/basictamil/?p=97#video-97-1
        </a>
      </p>

      <h3 className="lt-consonant-subtitle">20 to 29 Pattern</h3>
      <p className="lt-consonant-intro lt-text-left">
        20 is "இருபது" (irubathu / iruvathu). Numbers in the twenties are formed as "இருபத்தி" + the number from
        one to nine.
      </p>
      <ul className="lt-text-left">
        {TWENTIES.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>

      <h3 className="lt-consonant-subtitle">30 to 39 Pattern</h3>
      <p className="lt-consonant-intro lt-text-left">
        30 is "முப்பது" (mupadhu). Numbers in the thirties are formed with "முப்பத்தி" + one to nine.
      </p>
      <ul className="lt-text-left">
        {THIRTIES.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>

      <p className="lt-consonant-intro lt-text-left">
        You can follow the same pattern for 40s (நாற்பது / நாற்பத்தி...) and 50s (ஐம்பது / ஐம்பத்தி...). This is how
        Tamil builds bigger numbers.
      </p>

      <h3 className="lt-consonant-subtitle">Counting by 10s till 2000</h3>
      <p className="lt-consonant-intro lt-text-left">
        Learning these values is useful for saying years and dates.
      </p>
      <ul className="lt-text-left">
        {TENS_TO_2000.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>

      <p className="lt-consonant-intro lt-text-left">
        Video for counting by 100s to 2024 in Tamil:{' '}
        <a href="https://openbooks.lib.msu.edu/basictamil/?p=97#video-97-2" target="_blank" rel="noreferrer">
          openbooks.lib.msu.edu/basictamil/?p=97#video-97-2
        </a>
      </p>

      <h3 className="lt-consonant-subtitle">Ordinal</h3>

      <h3 className="lt-consonant-subtitle">Evaluation Activities</h3>

      <section className="lt-number-eval-card">
        <h4>Activity 1: Match Number Words (1 to 10)</h4>
        <p className="lt-consonant-intro lt-text-left">Pick the correct Tamil word for each number.</p>

        <div className="lt-number-eval-grid">
          {MATCH_NUMBER_WORDS.map((item) => (
            <label key={item.number} className="lt-number-eval-row">
              <span>{item.number}</span>
              <select
                value={matchAnswers[item.number] || ''}
                onChange={(event) =>
                  setMatchAnswers((prev) => ({
                    ...prev,
                    [item.number]: event.target.value,
                  }))
                }
              >
                <option value="">Select</option>
                {wordBank.map((word) => (
                  <option key={`${item.number}-${word}`} value={word}>
                    {word}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <button type="button" className="lt-btn lt-btn--primary" onClick={checkMatchAnswers}>
          Check Activity 1
        </button>
        {matchScore ? <p className="lt-number-eval-score">{matchScore}</p> : null}
      </section>

      <section className="lt-number-eval-card">
        <h4>Activity 2: Fill the Matching Numeral</h4>
        <p className="lt-consonant-intro lt-text-left">Read the Tamil number and type its numeral. Example: ஒன்று = 1</p>

        <div className="lt-number-eval-grid">
          {FILL_NUMERAL_ITEMS.map((item) => (
            <label key={item.tamil} className="lt-number-eval-row">
              <span>{item.tamil}</span>
              <input
                type="text"
                value={fillAnswers[item.tamil] || ''}
                onChange={(event) =>
                  setFillAnswers((prev) => ({
                    ...prev,
                    [item.tamil]: event.target.value,
                  }))
                }
                placeholder="Type numeral"
              />
            </label>
          ))}
        </div>

        <button type="button" className="lt-btn lt-btn--primary" onClick={checkFillAnswers}>
          Check Activity 2
        </button>
        {fillScore ? <p className="lt-number-eval-score">{fillScore}</p> : null}
      </section>

      <section className="lt-number-eval-card">
        <h4>Activity 3: Quick Multiple Choice</h4>
        <div className="lt-number-eval-questions">
          {MCQ_ITEMS.map((item, index) => (
            <div key={item.prompt} className="lt-number-eval-question">
              <p>{index + 1}. {item.prompt}</p>
              <div className="lt-number-eval-options">
                {item.options.map((option) => (
                  <label key={`${item.prompt}-${option}`}>
                    <input
                      type="radio"
                      name={`mcq-${index}`}
                      checked={mcqAnswers[index] === option}
                      onChange={() =>
                        setMcqAnswers((prev) => ({
                          ...prev,
                          [index]: option,
                        }))
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="lt-btn lt-btn--primary" onClick={checkMcqAnswers}>
          Check Activity 3
        </button>
        {mcqScore ? <p className="lt-number-eval-score">{mcqScore}</p> : null}
      </section>

      <section className="lt-number-eval-card">
        <h4>Activity 4: Arrange 11 to 15 in Order</h4>
        <p className="lt-consonant-intro lt-text-left">Choose the correct number for each position from smallest to largest.</p>

        <div className="lt-number-eval-grid">
          {ORDER_ITEMS.map((_, index) => (
            <label key={`order-${index}`} className="lt-number-eval-row">
              <span>Position {index + 1}</span>
              <select
                value={orderAnswers[index]}
                onChange={(event) => {
                  const next = [...orderAnswers];
                  next[index] = event.target.value;
                  setOrderAnswers(next);
                }}
              >
                <option value="">Select</option>
                {ORDER_ITEMS.map((value) => (
                  <option key={`position-${index}-${value}`} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <button type="button" className="lt-btn lt-btn--primary" onClick={checkOrderAnswers}>
          Check Activity 4
        </button>
        {orderScore ? <p className="lt-number-eval-score">{orderScore}</p> : null}
      </section>

      <section className="lt-number-eval-card">
        <h4>Activity 5: Write Tamil Numeral Symbols</h4>
        <p className="lt-consonant-intro lt-text-left">Type the Tamil numeral symbol for each Arabic numeral.</p>

        <div className="lt-number-eval-grid">
          {SYMBOL_ITEMS.map((item) => (
            <label key={item.arabic} className="lt-number-eval-row">
              <span>{item.arabic}</span>
              <input
                type="text"
                value={symbolAnswers[item.arabic] || ''}
                onChange={(event) =>
                  setSymbolAnswers((prev) => ({
                    ...prev,
                    [item.arabic]: event.target.value,
                  }))
                }
                placeholder="Tamil symbol"
              />
            </label>
          ))}
        </div>

        <button type="button" className="lt-btn lt-btn--primary" onClick={checkSymbolAnswers}>
          Check Activity 5
        </button>
        {symbolScore ? <p className="lt-number-eval-score">{symbolScore}</p> : null}
      </section>
    </div>
  );
};

export default NumbersTamilLessonContent;