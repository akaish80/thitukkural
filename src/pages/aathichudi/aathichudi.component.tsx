import { useState } from 'react';
import './aathichudi.component.scss';

type AathichudiVerse = {
  letter: string;
  tamil: string;
  meaning: string;
};

const aathichudiVerses: AathichudiVerse[] = [
  { letter: 'அ', tamil: 'அறம் செய விரும்பு', meaning: 'Love and choose the path of righteousness.' },
  { letter: 'ஆ', tamil: 'ஆறுவது சினம்', meaning: 'Let anger cool and pass.' },
  { letter: 'இ', tamil: 'இயல்வது கரவேல்', meaning: 'Do not withhold help when you can do it.' },
  { letter: 'ஈ', tamil: 'ஈவது விலக்கேல்', meaning: 'Do not prevent acts of giving.' },
  { letter: 'உ', tamil: 'உடையது விளம்பேல்', meaning: 'Do not boast about your possessions.' },
  { letter: 'ஊ', tamil: 'ஊக்கமது கைவிடேல்', meaning: 'Never give up determination.' },
  { letter: 'எ', tamil: 'எண் எழுத்து இகழேல்', meaning: 'Do not neglect learning numbers and letters.' },
  { letter: 'ஏ', tamil: 'ஏற்பது இகழ்ச்சி', meaning: 'Living by begging is degrading.' },
  { letter: 'ஐ', tamil: 'ஐயம் இட்டு உண்', meaning: 'Share with others before you eat.' },
  { letter: 'ஒ', tamil: 'ஒப்புரவு ஒழுகு', meaning: 'Live in harmony and mutual support.' },
  { letter: 'ஓ', tamil: 'ஓதுவது ஒழியேல்', meaning: 'Never stop studying.' },
  { letter: 'ஔ', tamil: 'ஔவியம் பேசேல்', meaning: 'Avoid speaking with envy.' },
  { letter: 'ஃ', tamil: 'அஃகம் சுருக்கேல்', meaning: 'Do not be narrow-hearted in generosity.' },
];

const Aathichudi = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const allCardKeys = aathichudiVerses.map((verse) => `${verse.letter}-${verse.tamil}`);
  const areAllFlipped = allCardKeys.every((key) => !!flippedCards[key]);

  const toggleCard = (key: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleAllCards = () => {
    if (areAllFlipped) {
      setFlippedCards({});
      return;
    }

    const nextState: Record<string, boolean> = {};
    allCardKeys.forEach((key) => {
      nextState[key] = true;
    });
    setFlippedCards(nextState);
  };

  return (
    <div className="aathichudi-page">
      <section className="aathichudi-hero">
        <h1>ஆத்திசூடி</h1>
        <p>Click each tile to flip and see the meaning.</p>
        <button
          type="button"
          className="flip-all-btn"
          onClick={toggleAllCards}
          aria-pressed={areAllFlipped}
        >
          {areAllFlipped ? 'Reset All' : 'Flip All'}
        </button>
      </section>

      <section className="aathichudi-grid" aria-label="Aathichudi verses">
        {aathichudiVerses.map((verse) => {
          const cardKey = `${verse.letter}-${verse.tamil}`;
          const isFlipped = !!flippedCards[cardKey];

          return (
            <button
              type="button"
              className={`verse-card ${isFlipped ? 'is-flipped' : ''}`}
              key={cardKey}
              onClick={() => toggleCard(cardKey)}
              aria-pressed={isFlipped}
              aria-label={`${verse.tamil}. ${isFlipped ? 'Hide meaning' : 'Show meaning'}`}
            >
              <div className="verse-card-inner">
                <div className="verse-face verse-front">
                  <div className="letter-badge" aria-hidden="true">
                    {verse.letter}
                  </div>
                  <h2>{verse.tamil}</h2>
                  <span className="flip-hint">Tap to reveal meaning</span>
                </div>

                <div className="verse-face verse-back">
                  <h3>Meaning</h3>
                  <p>{verse.meaning}</p>
                  <span className="flip-hint">Tap to flip back</span>
                </div>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
};

export default Aathichudi;
