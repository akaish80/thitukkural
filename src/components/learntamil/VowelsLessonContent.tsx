import type { ReactNode } from 'react';
import { SpeakButton } from '../PronunciationPlayer/PronunciationPlayer';
import { VOWELS, type TamilLetter } from '../../data/constants';

type VowelRowProps = {
  label: string;
  value: ReactNode;
  rowClassName?: string;
};

const VowelRow = ({ label, value, rowClassName }: VowelRowProps) => {
  const className = rowClassName ? `lt-vowel-row ${rowClassName}` : 'lt-vowel-row';

  return (
    <div className={className}>
      <span className="lt-vowel-label">{label}:</span>
      <span className="lt-vowel-value">{value}</span>
    </div>
  );
};

type VowelCardProps = {
  vowel: TamilLetter;
};

const VowelCard = ({ vowel }: VowelCardProps) => {
  return (
    <div className="lt-vowel-card">
      <div className="lt-vowel-card__header">
        <div className="lt-vowel-visual">{vowel.visual}</div>
        <div className="lt-vowel-char">{vowel.tamil}</div>
        <SpeakButton text={vowel.tamil} size="md" className="lt-vowel-speak-btn" />
      </div>

      <div className="lt-vowel-card__body">
        <VowelRow label="Romanization" value={vowel.romanization} />
        <VowelRow label="Type" value={vowel.typeLabelEn} />
        <VowelRow label="Pronunciation" value={vowel.pronunciation} />
        <VowelRow
          label="Example Word"
          value={(
            <>
              {vowel.word}
              <SpeakButton text={vowel.word} size="sm" className="lt-vowel-speak-btn--sm" />
            </>
          )}
        />
        <VowelRow label="Meaning" value={vowel.meaning} />
        <VowelRow
          label="Example"
          value={(
            <>
              {vowel.exampleSentence}
              <SpeakButton text={vowel.exampleSentence} size="sm" className="lt-vowel-speak-btn--sm" />
            </>
          )}
        />
        <VowelRow label="Translation" value={vowel.exampleTranslation} rowClassName="lt-vowel-translation" />
      </div>
    </div>
  );
};

const VowelsLessonContent = () => {
  return (
    <div className="lt-vowel-section">
      <h2>Tamil Vowels (உயிர் எழுத்துகள்)</h2>
      <p className="lt-vowel-intro lt-text-left">
        Tamil has 12 vowels in its alphabet. These vowels are the foundation of Tamil speech and are classified into
        two categories: short vowels and long vowels. Each vowel has a unique pronunciation and sound.
      </p>

      <div className="lt-vowel-grid">
        {VOWELS.map((vowel: TamilLetter) => (
          <VowelCard key={vowel.tamil} vowel={vowel} />
        ))}
      </div>
    </div>
  );
};

export default VowelsLessonContent;
