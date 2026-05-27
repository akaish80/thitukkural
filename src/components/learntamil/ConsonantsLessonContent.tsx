import { CONSONANTS } from '../../data/constants';

type ConsonantPronunciationRow = {
  consonant: string;
  group: string;
  pronunciationHelp: string;
};

const consonants = CONSONANTS.map((letter) => letter.tamil);

const pronunciationRows: ConsonantPronunciationRow[] = [
  { consonant: 'க்', group: 'vallinam', pronunciationHelp: 'k as in king' },
  { consonant: 'ங்', group: 'mellinam', pronunciationHelp: 'ng as in king' },
  { consonant: 'ச்', group: 'vallinam', pronunciationHelp: 'ch as in match' },
  { consonant: 'ஞ்', group: 'mellinam', pronunciationHelp: 'ng as in plunge' },
  { consonant: 'ட்', group: 'vallinam', pronunciationHelp: 't as in top' },
  { consonant: 'ண்', group: 'mellinam', pronunciationHelp: 'n as in cinder' },
  { consonant: 'த்', group: 'vallinam', pronunciationHelp: 'th as in bath' },
  { consonant: 'ந்', group: 'mellinam', pronunciationHelp: 'n as in pan' },
  { consonant: 'ப்', group: 'vallinam', pronunciationHelp: 'p as in puck' },
  { consonant: 'ம்', group: 'mellinam', pronunciationHelp: 'm as in from' },
  { consonant: 'ய்', group: 'idaiyinam', pronunciationHelp: 'y as in yak' },
  { consonant: 'ர்', group: 'idaiyinam', pronunciationHelp: 'r as in fur' },
  { consonant: 'ல்', group: 'idaiyinam', pronunciationHelp: 'l as in lump' },
  { consonant: 'வ்', group: 'idaiyinam', pronunciationHelp: 'v as in vice' },
  { consonant: 'ழ்', group: 'idaiyinam', pronunciationHelp: 'tongue retracted to produce "zh"' },
  { consonant: 'ள்', group: 'idaiyinam', pronunciationHelp: 'l as in marble' },
  { consonant: 'ற்', group: 'vallinam', pronunciationHelp: 'tr as in trick' },
  { consonant: 'ன்', group: 'mellinam', pronunciationHelp: 'n as in fin' },
];

const ConsonantsLessonContent = () => {
  return (
    <div className="lt-consonant-section">
      <h2>Tamil Consonants (Mei EzhuthukaL)</h2>
      <p className="lt-consonant-intro lt-text-left">
        In this chapter we will learn the Tamil consonants and learn to identify, write and pronounce them.
      </p>
      <p className="lt-consonant-intro lt-text-left">
        The consonants are called Mei ezhuthukaL. They are listed below.
      </p>

      <div className="lt-consonant-list" aria-label="Tamil consonants list">
        {consonants.map((letter) => (
          <span key={letter} className="lt-consonant-chip">
            {letter}
          </span>
        ))}
      </div>

      <h3 className="lt-consonant-subtitle">Pronunciation of Consonants</h3>
      <p className="lt-consonant-intro lt-text-left">
        This chart below shows how to pronounce the consonants with simple English examples.
      </p>
      <p className="lt-consonant-caption">12 | CHAPTER 1.2 CONSONANTS</p>

      <div className="lt-consonant-table-wrap">
        <table className="lt-consonant-table">
          <thead>
            <tr>
              <th>Consonant</th>
              <th>Group</th>
              <th>Pronunciation Help</th>
            </tr>
          </thead>
          <tbody>
            {pronunciationRows.map((row) => (
              <tr key={row.consonant}>
                <td>{row.consonant}</td>
                <td>{row.group}</td>
                <td>{row.pronunciationHelp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsonantsLessonContent;