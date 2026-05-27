import UyirmeiAlphabetTable from './UyirmeiAlphabetTable';
import { speakTamil } from '../../utils/pronunciationEngine';

type UyirmeiRuleRow = {
  consonantPlusVowel: string;
  uyirmei: string;
  changed: string;
};

const ruleRows: UyirmeiRuleRow[] = [
  {
    consonantPlusVowel: 'க் + அ',
    uyirmei: 'க',
    changed: 'The dot on top of the consonant is removed.',
  },
  {
    consonantPlusVowel: 'க் + ஆ',
    uyirmei: 'கா',
    changed: 'The ◌ா sign is added after the consonant.',
  },
  {
    consonantPlusVowel: 'க் + இ',
    uyirmei: 'கி',
    changed: 'The ◌ி sign is added on top of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஈ',
    uyirmei: 'கீ',
    changed: 'The ◌ீ sign is added on top of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + உ',
    uyirmei: 'கு',
    changed:
      'When உ is added with the consonant one of the following will happen: it will curve, have an aerial root, or a seat.',
  },
  {
    consonantPlusVowel: 'க் + ஊ',
    uyirmei: 'கூ',
    changed:
      'When ஊ is added one of the following will happen: accession, curled curve, legged seat, or crest.',
  },
  {
    consonantPlusVowel: 'க் + எ',
    uyirmei: 'கெ',
    changed: 'The ெ◌ sign is added in front of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஏ',
    uyirmei: 'கே',
    changed: 'The ே◌ sign is added in front of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஐ',
    uyirmei: 'கை',
    changed: 'The ை◌ sign is added in front of the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஒ',
    uyirmei: 'கொ',
    changed: 'The ெ◌ா signs are added in front of and behind the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஓ',
    uyirmei: 'கோ',
    changed: 'The ே◌ா signs are added in front of and behind the consonant.',
  },
  {
    consonantPlusVowel: 'க் + ஔ',
    uyirmei: 'கௌ',
    changed: 'The ெ◌ௗ signs are added in front of and behind the consonant.',
  },
];

const shortUExamples = 'கு, ஙு, சு, ஞு, டு, ணு, து, நு, பு, மு, யு, ரு, லு, வு, ழு, ளு, று, னு';
const longUExamples = 'கூ, ஙூ, சூ, ஞூ, டூ, ணூ, தூ, நூ, பூ, மூ, யூ, ரூ, லூ, வூ, ழூ, ளூ, றூ, னூ';

const UyirmeiLessonContent = () => {
  return (
    <div className="lt-uyirmei-section">
      <h2>Consonants + Vowels or Uyirmei EzhuthukaL (உயிர்மெய் எழுத்துகள்)</h2>

      <p className="lt-uyirmei-intro lt-text-left">
        The rest of the Tamil alphabets are called uyirmei ezhuthukaL. These alphabets are made by adding the vowel
        markers to the consonants. They are a combination of the vowels and the consonants we have learnt so far.
      </p>
      <p className="lt-uyirmei-intro lt-text-left">
        The vowels become companion letters or vowel markers called uyir kuriyeedugal. The vowel sound always comes
        at the end of the letter. Once we start adding the consonants to the vowels, the dot on top of the consonant
        is removed and other vowel markers are added.
      </p>
      <p className="lt-uyirmei-intro lt-text-left">
        Let us take the example of க் and add it to each of the vowels and see what happens. The same rule applies
        to all the other alphabets.
      </p>

      <div className="lt-uyirmei-table-wrap">
        <table className="lt-uyirmei-table">
          <thead>
            <tr>
              <th>Consonant + Vowel</th>
              <th>Uyirmei EzhuthukaL</th>
              <th>What Changed</th>
            </tr>
          </thead>
          <tbody>
            {ruleRows.map((row) => (
              <tr key={row.consonantPlusVowel}>
                <td>{row.consonantPlusVowel}</td>
                <td className="lt-uyirmei-letter-cell">{row.uyirmei}</td>
                <td>{row.changed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="lt-uyirmei-caption">TAMIL ALPHABETS: CONSONANT + VOWEL | 15</p>

      <h3 className="lt-uyirmei-subtitle">The Rules of Adding உ and ஊ to Consonants</h3>
      <ol className="lt-uyirmei-rules">
        <li>
          A short vertical line is drawn below with five consonants ப, ய, ச, ங, வ when short உ is added to them.
          The line gets a curve with a loop at the end for long ஊ.
        </li>
        <li>
          A curved line that wraps around the consonant starting on the right and moving left is used for க, ட, ம,
          ர, ழ, ள when short உ is added. For long ஊ, the curve ends with a loop; க is an exception to this rule and
          the loop is at the beginning of the curve and is straightened horizontally to the right at the end.
        </li>
        <li>
          For the consonants த, ந, ஞ, ண, ன, ல, ற, when added to short உ, a curved line makes a loop at the bottom
          and is straightened upwards. The straightened-up line is replicated and bridged to the right side like the
          companion letter used when adding +ஆ.
        </li>
      </ol>

      <p className="lt-uyirmei-examples lt-text-left">{shortUExamples}.</p>
      <p className="lt-uyirmei-examples lt-text-left">{longUExamples}.</p>

      <h3 className="lt-uyirmei-subtitle">Uyirmei Alphabet Table</h3>
      <p className="lt-uyirmei-intro lt-text-left">
        Consonant + vowel alphabet table: The table below shows all the combinations of consonants and vowels. The first column shows the consonant and the first row shows the vowel. The rest of the cells show the uyirmei ezhuthukaL formed by adding the consonant and vowel together.
      </p>

      <UyirmeiAlphabetTable
        wrapperClassName="lt-uyirmei-grid-wrap"
        tableClassName="lt-uyirmei-grid-table"
        rowHeaderClassName="lt-uyirmei-grid-rowhead"
        onCellHover={(_, __, voice) => speakTamil(voice)}
      />
    </div>
  );
};

export default UyirmeiLessonContent;