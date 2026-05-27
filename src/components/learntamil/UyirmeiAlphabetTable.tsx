import { CONSONANTS } from '../../data/constants';
import { stopTamilSpeech } from '../../utils/pronunciationEngine';

const VOWEL_HEADER = ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'];
const UYIR_SUFFIXES = ['', 'ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ'];

type UyirmeiAlphabetTableProps = {
  ariaLabel?: string;
  wrapperClassName?: string;
  tableClassName?: string;
  rowHeaderClassName?: string;
  cellClassName?: string;
  highlightedVoice?: string | null;
  onRowClick?: (voice: string) => void;
  onCellClick?: (combinedLetter: string, voice: string) => void;
  onCellHover?: (combinationText: string, combinedLetter: string, voice: string) => void;
};

const UyirmeiAlphabetTable = ({
  ariaLabel = 'Tamil Uyirmei alphabet table',
  wrapperClassName,
  tableClassName,
  rowHeaderClassName,
  cellClassName,
  highlightedVoice,
  onRowClick,
  onCellClick,
  onCellHover,
}: UyirmeiAlphabetTableProps) => {
  return (
    <div className={wrapperClassName}>
      <table className={tableClassName} aria-label={ariaLabel}>
        <thead>
          <tr>
            <th></th>
            {VOWEL_HEADER.map((vowel) => (
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
                {UYIR_SUFFIXES.map((suffix, index) => {
                  const combined = consonant.base + suffix;

                  return (
                    <td
                      key={`${consonant.base}-${suffix}`}
                      className={cellClassName}
                      title={`${consonant.tamil}+${VOWEL_HEADER[index]}`}
                      onMouseEnter={
                        onCellHover
                          ? () => {
                              const voice = consonant.voice?.replace('COLUMN', VOWEL_HEADER[index]).replace('CURRENTLETTER', consonant.base) ?? combined;
                              onCellHover(voice, combined, voice);
                            }
                          : undefined
                      }
                      onMouseLeave={() => stopTamilSpeech()}
                      onClick={
                        onCellClick
                          ? (event) => {
                              event.stopPropagation();
                              onCellClick(combined, voice);
                            }
                          : undefined
                      }
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