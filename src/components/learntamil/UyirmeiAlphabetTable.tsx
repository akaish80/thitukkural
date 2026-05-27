import { CONSONANTS } from '../../data/constants';
import { UYIRMEI_SUFFIXES, UYIRMEI_VOWEL_HEADER } from '../../data/learnTamilConstants';

type UyirmeiAlphabetTableProps = {
  ariaLabel?: string;
  wrapperClassName?: string;
  tableClassName?: string;
  rowHeaderClassName?: string;
  cellClassName?: string;
  highlightedVoice?: string | null;
  onRowClick?: (voice: string) => void;
};

const UyirmeiAlphabetTable = ({
  ariaLabel = 'Tamil Uyirmei alphabet table',
  wrapperClassName,
  tableClassName,
  rowHeaderClassName,
  cellClassName,
  highlightedVoice,
  onRowClick,
}: UyirmeiAlphabetTableProps) => {
  return (
    <div className={wrapperClassName}>
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
            const voice = consonant.voice ?? consonant.base;
            const isHighlighted = highlightedVoice === voice;

            return (
              <tr
                key={consonant.tamil}
                className={isHighlighted ? 'highlighted' : undefined}
                onClick={onRowClick ? () => onRowClick(voice) : undefined}
              >
                <td className={rowHeaderClassName}>{consonant.tamil}</td>
                {UYIRMEI_SUFFIXES.map((suffix, index) => {
                  const combined = consonant.base + suffix;

                  return (
                    <td
                      key={`${consonant.base}-${suffix}`}
                      className={cellClassName}
                      title={`${consonant.tamil}+${UYIRMEI_VOWEL_HEADER[index]}`}
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