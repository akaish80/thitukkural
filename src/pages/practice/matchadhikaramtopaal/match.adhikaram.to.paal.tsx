import { useEffect, useState } from 'react';
import { getRandomList, isEmpty } from '../../../components/utils';
import './match.adhikaram.to.paal.scss';
import { DropContainer } from '../../../components/DragAndDrop/DropContainer';
import { DragContainer } from '../../../components/DragAndDrop/DragContainer';

interface MatchAdhikaramToPaalProps {
  selPractice: any;
}


interface AdikaramItem {
  Index: number;
  Tamil: string;
  English: string;
  Transliteration: string;
  kurralStart: number;
  kurralEnd: number;
}

interface PaalItem {
  Index: number;
  Tamil: string;
  English: string;
  Transliteration: string;
  adikaramStart: number;
  adikaramEnd: number;
  adikaram: string[];
  count: number;
}

type MatchListType = 'Tamil' | 'English' | 'Transliteration';

interface MatchListOption {
  key: MatchListType;
  label: string;
}

interface MatchPromptItem extends AdikaramItem {
  displayName: string;
}

const MATCH_LIST_OPTIONS: MatchListOption[] = [
  { key: 'Tamil', label: 'தமிழ் பட்டியல்' },
  { key: 'English', label: 'English List' },
  { key: 'Transliteration', label: 'Transliteration List' },
];

const MatchAdhikaramToPaal = ({ selPractice }: MatchAdhikaramToPaalProps) => {
  const [listOfAdhikaram, setListOfAdhikaram] = useState<MatchPromptItem[]>([]);
  const [currentPaalList, setCurrentPaalList] = useState<PaalItem[]>([]);
  const [allAdikaram, setAllAdikaram] = useState<AdikaramItem[]>([]);
  const [allPaalList, setAllPaalList] = useState<PaalItem[]>([]);
  const [activeListType, setActiveListType] = useState<MatchListType>('Tamil');
  const [correctCount, setCorrectCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [dropMessage, setDropMessage] = useState('');
  const [dropStatus, setDropStatus] = useState<'correct' | 'wrong' | ''>('');
  const totalItems = 10;
  const matchedCount = totalItems - listOfAdhikaram.length;
  const scorePercent = attemptCount === 0 ? 0 : Math.round((correctCount / attemptCount) * 100);


  // Fetch and flatten data from thirukkural_complete_nested.json
  useEffect(() => {
    async function fetchData() {
      const data = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/getPaalsAndAdikarams`).then((res) => res.json());
      // Flatten paal/adikaram structure
      const paals: PaalItem[] = data.paals.map((paal: any) => ({
        Index: paal.index,
        Tamil: paal.tamil,
        English: paal.english,
        Transliteration: paal.transliteration,
        adikaramStart: paal.adikaramRange.start,
        adikaramEnd: paal.adikaramRange.end,
        adikaram: paal.adikarams.map((a: any) => a.tamil),
        count: 0,
      }));
      const adikarams: AdikaramItem[] = data.paals.flatMap((paal: any) =>
        paal.adikarams.map((a: any) => ({
          Index: a.index,
          Tamil: a.tamil,
          English: a.english,
          Transliteration: a.transliteration,
          kurralStart: a.kurralRange.start,
          kurralEnd: a.kurralRange.end,
        }))
      );
      setAllPaalList(paals);
      setAllAdikaram(adikarams);
      // Build initial practice list
      buildPracticeList(activeListType, adikarams, paals);
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  // Rebuild practice list when list type changes
  useEffect(() => {
    if (allAdikaram.length && allPaalList.length) {
      buildPracticeList(activeListType, allAdikaram, allPaalList);
    }
    // eslint-disable-next-line
  }, [activeListType]);

  const buildPracticeList = (
    listType: MatchListType,
    adikaramSource: AdikaramItem[] = allAdikaram,
    paalSource: PaalItem[] = allPaalList
  ) => {
    const randomItems = getRandomList(adikaramSource, totalItems) as AdikaramItem[];
    const prepared = randomItems.map((item) => ({
      ...item,
      displayName: item[listType],
    }));
    setListOfAdhikaram(prepared);
    setCurrentPaalList(paalSource.map((p) => ({ ...p, count: 0 })));
    setCorrectCount(0);
    setAttemptCount(0);
    setDropMessage('');
    setDropStatus('');
  };

  const handleDrop = (item: { name: string }, targetPaal: PaalItem) => {
    const droppedItem = listOfAdhikaram.find((adikaramItem) => adikaramItem.displayName === item.name);
    if (!droppedItem) return;

    setAttemptCount((prev) => prev + 1);

    const isCorrectMatch =
      droppedItem.Index >= targetPaal.adikaramStart && droppedItem.Index <= targetPaal.adikaramEnd;

    if (!isCorrectMatch) {
      setDropStatus('wrong');
      setDropMessage('தவறு! வேறு பாலில் முயற்சி செய்யவும்.');
      return;
    }

    setDropStatus('correct');
    setDropMessage('சரியான பொருத்தம்!');
    setCorrectCount((prev) => prev + 1);

    setCurrentPaalList((prevPaalList) =>
      prevPaalList.map((paalItem) =>
        paalItem.Index === targetPaal.Index ? { ...paalItem, count: paalItem.count + 1 } : paalItem,
      ),
    );
    setListOfAdhikaram((prevList) =>
      prevList.filter((adikaramItem) => adikaramItem.displayName !== item.name),
    );
  };

  return (
    <div className="match-adhikaram-paal-page">
      <div className="page-head">
        <h2 className="title">பால் மற்றும் அதிகாரம் பொருத்து</h2>
        <p className="subtitle">அதிகாரங்களை சரியான பாலுடன் இணைக்கவும்.</p>
      </div>

      <div className="progress-strip">
        <div className="progress-item">
          <span className="label">முடிந்தவை</span>
          <span className="value">{matchedCount}</span>
        </div>
        <div className="progress-item">
          <span className="label">மீதமுள்ளவை</span>
          <span className="value">{listOfAdhikaram.length}</span>
        </div>
        <div className="progress-item">
          <span className="label">முயற்சிகள்</span>
          <span className="value">{attemptCount}</span>
        </div>
        <div className="progress-item">
          <span className="label">Score</span>
          <span className="value">{scorePercent}%</span>
        </div>
      </div>

      <div className="list-switcher">
        {MATCH_LIST_OPTIONS.map((option) => (
          <button
            key={option.key}
            type="button"
            className={`switch-btn ${activeListType === option.key ? 'active' : ''}`}
            onClick={() => setActiveListType(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {dropMessage && <div className={`drop-status ${dropStatus}`}>{dropMessage}</div>}

      {listOfAdhikaram.length > 0 ? (
        <div className="tableContainer">
          <div className="tableHeader">
            <span>{activeListType === 'Tamil' ? 'அதிகாரம்' : activeListType}</span>
            <span>பால்</span>
          </div>
          {!isEmpty(selPractice) && (
            <div className="examContainer">
              <div className="dragDropSection">
                <h3 className="section-title">பால்கள்</h3>
                <div className="dragDropContainer">
                  {currentPaalList.map((item, index) => (
                    <div className="drop-item" key={index}>
                      <DropContainer
                        name={`${item.Tamil} (${item.count})`}
                        accept={listOfAdhikaram.map((adikaramItem) => adikaramItem.displayName)}
                        onDrop={(draggedItem) => handleDrop(draggedItem, item)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="dragDropSection">
                <h3 className="section-title">அதிகாரங்கள்</h3>
                <div className="dragDropContainer">
                  {listOfAdhikaram.map((item, idx) => (
                    <div className="drag-item" key={idx}>
                      <DragContainer
                        name={item.displayName}
                        type={item.displayName}
                        isDropped={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="success-message">
          <span role="img" aria-label="celebrate">
            🎉
          </span>{' '}
          வாழ்த்துகள்! அனைத்தையும் பொருத்திவிட்டீர்கள்! <br />
          <strong>
            Score: {correctCount}/{attemptCount} ({scorePercent}%)
          </strong>
          <div>
            <button type="button" className="retry-btn" onClick={() => buildPracticeList(activeListType)}>
              மீண்டும் விளையாடு
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchAdhikaramToPaal;
