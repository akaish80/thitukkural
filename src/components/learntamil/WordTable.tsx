import type { TamilWordRow } from '../../data/learnTamilConstants';

type WordTableProps = {
  title: string;
  words: TamilWordRow[];
  description?: string;
  defaultOpen?: boolean;
};

const WordTable = ({
  title,
  words,
  description,
  defaultOpen = false,
}: WordTableProps) => {
  return (
    <details className="lt-word-accordion" open={defaultOpen}>
      <summary className="lt-consonant-subtitle">{title}</summary>
      {description && (
        <p className="lt-consonant-intro lt-text-left lt-word-accordion-description">
          {description}
        </p>
      )}
      <div className="lt-consonant-table-wrap">
        <table className="lt-consonant-table">
          <thead>
            <tr>
              <th>Tamil Word</th>
              <th>English Meaning</th>
            </tr>
          </thead>
          <tbody>
            {words.map((row) => (
              <tr key={row.tamil}>
                <td>{row.tamil}</td>
                <td>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};

export default WordTable;
