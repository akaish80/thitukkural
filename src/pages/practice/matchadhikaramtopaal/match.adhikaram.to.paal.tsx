import { useEffect, useState } from 'react';
import { getRandomList, isEmpty } from '../../../components/utils';
import adikaram from '../../../Common/adikaram_data';
// import paalList from '../../../Common/paalList_data';
import paalList from '../../../Common/paalList_data';
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

const MatchAdhikaramToPaal = ({ selPractice }: MatchAdhikaramToPaalProps) => {
  const [listOfAdhikaram, setListOfAdhikaram] = useState<AdikaramItem[]>([]);
  const [currentPaalList, setCurrentPaalList] = useState<PaalItem[]>(
    paalList.map((p) => ({ ...p, count: 0 })),
  );

  useEffect(() => {
    setListOfAdhikaram(getRandomList(adikaram, 10));
  }, []);

  const handleDrop = (item: { name: string }) => {
    const { name } = item;
    const obj = adikaram.find((adikaramItem: AdikaramItem) => adikaramItem.Tamil === name);
    if (!obj) return;
    const selectedPaal = currentPaalList.find(
      (paalItem) => obj.Index >= paalItem.adikaramStart && obj.Index <= paalItem.adikaramEnd,
    );
    if (!selectedPaal) return;

    setCurrentPaalList((prevPaalList) =>
      prevPaalList.map((paalItem) =>
        paalItem.Index === selectedPaal.Index ? { ...paalItem, count: paalItem.count + 1 } : paalItem,
      ),
    );
    setListOfAdhikaram((prevList) => prevList.filter((adikaramItem) => adikaramItem.Tamil !== name));
  };

  return (
    <div className="match-adhikaram-paal-page">
      <h2 className="title">பால் மற்றும் அதிகாரம் பொருத்து</h2>
      {listOfAdhikaram.length > 0 ? (
        <div className="tableContainer">
          <div className="tableHeader">
            <span>அதிகாரம்</span>
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
                        accept={item.adikaram}
                        onDrop={handleDrop}
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
                      <DragContainer name={item.Tamil} type={item.Tamil} isDropped={false} />
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
          வாழ்த்துகள்! அனைத்தையும் பொருத்திவிட்டீர்கள்!
        </div>
      )}
    </div>
  );
};

export default MatchAdhikaramToPaal;
