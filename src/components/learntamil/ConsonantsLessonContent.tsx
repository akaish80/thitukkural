import {
  CONSONANT_PRONUNCIATION_ROWS,
  LEARNTAMIL_CONSONANT_LETTERS,
} from '../../data/learnTamilConstants';

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
        {LEARNTAMIL_CONSONANT_LETTERS.map((letter) => (
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
            {CONSONANT_PRONUNCIATION_ROWS.map((row) => (
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