import {
  PRONUNCIATION_GROUP_DESCRIPTIONS,
  READING_PRONUNCIATION_EXAMPLE_GROUPS,
  READING_PRONUNCIATION_RULES,
  READING_SINGLE_LETTER_WORDS,
  READING_THREE_LETTER_WORDS,
  READING_TWO_LETTER_WORDS,
} from "../../data/learnTamilConstants";
import WordTable from './WordTable';

const ReadingTamilLessonContent = () => {
  return (
    <div className="lt-consonant-section">
      <h2>Reading in Tamil</h2>
      <p className="lt-consonant-intro lt-text-left">
        The goal of this unit is to help students read and pronounce simple
        Tamil words. Meanings are given with examples so learners can focus
        first on reading skill and sound patterns.
      </p>
      <p className="lt-consonant-intro lt-text-left">
        Once Tamil alphabets are learned, reading becomes easier because letters
        are pronounced consistently and there are no silent letters. We start
        with single-letter words and move up to multi-syllable words.
      </p>

      <h3 className="lt-consonant-subtitle">
        Some Rules in Tamil Pronunciation
      </h3>
      <ul className="lt-text-left">
        {READING_PRONUNCIATION_RULES.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>

      <h3 className="lt-consonant-subtitle">
        More Pronunciation Examples (க, ச, ட, த, ப)
      </h3>
      {READING_PRONUNCIATION_EXAMPLE_GROUPS.map((group, index) => (
        <WordTable
          key={group.title}
          title={group.title}
          words={group.examples}
          description={PRONUNCIATION_GROUP_DESCRIPTIONS[group.title]}
          defaultOpen={index === 0}
        />
      ))}

      {/* <p className="lt-consonant-intro lt-text-left">
        Reference: <a href="https://openbooks.lib.msu.edu/basictamil/?p=92">Basic Tamil reading slides and audio</a>
      </p> */}
      <WordTable
        title="Single Letter Words in Tamil"
        words={READING_SINGLE_LETTER_WORDS}
        description="Start with short single-letter forms to build confidence in reading core vowel-length patterns."
        defaultOpen
      />
      <WordTable
        title="Two Letter Words in Tamil"
        words={READING_TWO_LETTER_WORDS}
        description="Practice two-letter words to notice contrasts in short and long vowels and similar consonant pairs."
      />
      <WordTable
        title="Three Letter Words in Tamil"
        words={READING_THREE_LETTER_WORDS}
        description="Move to longer words and focus on smoother syllable transitions and consistent pronunciation flow."
      />

      {/* <h3 className="lt-consonant-subtitle">Speaking Activity</h3>
      <p className="lt-consonant-intro lt-text-left">
        Read these words aloud and record your pronunciation for teacher feedback.
      </p> */}
    </div>
  );
};

export default ReadingTamilLessonContent;
