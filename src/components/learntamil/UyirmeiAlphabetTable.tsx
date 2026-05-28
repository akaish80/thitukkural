import { useState } from 'react';
import { CONSONANTS } from '../../data/constants';
import { UYIRMEI_SUFFIXES, UYIRMEI_VOWEL_HEADER } from '../../data/learnTamilConstants';
import { speakText } from '../chatbot/speakText';

type UyirmeiAlphabetTableProps = {
  ariaLabel?: string;
  wrapperClassName?: string;
  tableClassName?: string;
  rowHeaderClassName?: string;
  cellClassName?: string;
};

const UyirmeiAlphabetTable = ({
  ariaLabel = 'Tamil Uyirmei alphabet table',
  wrapperClassName,
  tableClassName,
  rowHeaderClassName,
  cellClassName
}: UyirmeiAlphabetTableProps) => {
  const [selectedCellKey, setSelectedCellKey] = useState<string | null>(null);

  const speakCombination = (combination: string) => {
    speakText(combination, { lang: 'ta-IN' });
  };

  return (
    <div className={wrapperClassName}>
      <p>Click any consonant-vowel combination to hear it announced.</p>
      <table className={tableClassName} aria-label={ariaLabel}>
        <thead>
          <tr>
            <th></th>
            {UYIRMEI_VOWEL_HEADER.map((vowel) => (
              <th key={vowel}>{vowel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONSONANTS.map((consonant) => {
            return (
              <tr key={consonant.tamil}>
                <td className={rowHeaderClassName}>{consonant.tamil}</td>
                {UYIRMEI_SUFFIXES.map((suffix, index) => {
                  const combined = consonant.base + suffix;
                  const cellKey = `${consonant.base}-${suffix}`;
                  const isSelected = selectedCellKey === cellKey;

                  const handleSelect = () => {
                    const voiceText = `${consonant.tamil}+${UYIRMEI_VOWEL_HEADER[index]}`;
                    setSelectedCellKey(cellKey);
                    speakCombination(voiceText);
                  };

                  return (
                    <td
                      key={cellKey}
                      className={`${cellClassName ?? ''}${isSelected ? ' uyirmey-cell--selected' : ''}`}
                      title={`${consonant.tamil}+${UYIRMEI_VOWEL_HEADER[index]}`}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      onClick={handleSelect}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleSelect();
                        }
                      }}
                    >
                      {combined}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UyirmeiAlphabetTable;