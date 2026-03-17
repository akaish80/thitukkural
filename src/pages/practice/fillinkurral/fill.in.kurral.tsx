/* eslint-disable array-callback-return */
import React, { createRef, useEffect, useRef, useState } from 'react';
import { getRandomList, returnMatchedLine } from '../../../components/utils';
import TextInputComp from '../../../components/TextInputComp';
import './fill.in.kurral.styles.scss';

interface KurralItem {
  Index: number;
  Tamil: string;
  line1: string;
  line2: string;
  line1Replace?: boolean;
  line2Replace?: boolean;
  inputWord?: string;
  error?: boolean;
  [key: string]: any;
}

const FillInKurral = () => {
  const [kurralList, setKurralList] = useState<KurralItem[]>([]);
  const [success, setSetSuccess] = useState(false);
  const [acceptedWords, setAcceptedWords] = useState<string[]>([]);
  // const [inputWords, setInputWords] = useState([]);
  const [loadComplete, setLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const inputRefs = useRef<Array<React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>>>(
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadKurralData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/kurrals`);
        const data = await response.json();
        if (isMounted) {
          setKurralList(getRandomList(data as KurralItem[], 10));
        }
      } catch (error) {
        if (isMounted) {
          setLoadError('Unable to load kurral data. Please refresh and try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadKurralData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (kurralList.length > 0 && !loadComplete) {
      const arr: string[] = [];
      kurralList.forEach((item: KurralItem) => {
        const kurral = item.Tamil.replace('<br />', ' ');
        const spltKurral = kurral.split(' ');
        const randomWord = getRandomList(spltKurral, 1)[0];
        arr.push(randomWord);

        item.line1Replace = false;
        item.line2Replace = false;
        const { matchedLine, replacedString } = returnMatchedLine(
          item.line1,
          item.line2,
          randomWord,
        );
        if (matchedLine === 'line1') {
          item.line1 = replacedString;
          item.line1Replace = true;
        } else {
          item.line2 = replacedString;
          item.line2Replace = true;
        }
      });
      setAcceptedWords(arr);
      setLoadComplete(true);
    }
  }, [kurralList, loadComplete]);

  const handleChange = (value: string, index: number) => {
    const newKurLst = [...kurralList];
    newKurLst[index].inputWord = value;
    newKurLst[index].error = false;

    setKurralList(newKurLst);
  };

  const getInputField = ({
    line,
    inputWord,
    rowNum,
  }: {
    line: string;
    inputWord: string | undefined;
    rowNum: number;
  }) => {
    if (!inputRefs.current[rowNum]) {
      inputRefs.current[rowNum] = createRef<HTMLInputElement | HTMLTextAreaElement>();
    }

    const spltStr = line.split(' ');
    return spltStr.map((item, index) =>
      item === '_' ? (
        <TextInputComp
          key={index}
          freeRef={inputRefs.current[rowNum]}
          freeText={inputWord ?? ''}
          setFreeText={(text) => handleChange(text, rowNum)}
          className="kurral-blank-input"
          placeholder="சொல்"
        />
      ) : (
        <p key={index}>{`${item} `}</p>
      ),
    );
  };

  const handleSubmit = () => {
    const newKurralList = kurralList.map((item: KurralItem) => {
      item.error = true;
      if (
        acceptedWords.findIndex((acceptedWord: string) => item.inputWord === acceptedWord) !== -1
      ) {
        item.error = false;
      }
      return item;
    });
    const filterList = newKurralList.filter((item: KurralItem) => item.error === true);

    if (filterList.length > 0) {
      setSetSuccess(false);
      setKurralList(newKurralList);
    } else {
      setSetSuccess(true);
      setKurralList([]);
    }
  };

  return (
    <div className="fill-in-kurral-page">
      {isLoading && <p className="status-msg">Loading exercise...</p>}
      {loadError && <p className="status-msg error">{loadError}</p>}
      {!success ? (
        <>
          {!isLoading &&
            !loadError &&
            kurralList.length > 0 &&
            kurralList.map((item, index) => {
              return (
                <div key={index} className="fillInTheBlanksContainer">
                  <p className="title">
                    <span>{`குறள் - ${index + 1}`}</span>
                  </p>
                  <div className="kurralFillContainer">
                    <div className={`line ${item.line1Replace ? 'wrapcontent' : ''}`}>
                      {!item.line1Replace ? (
                        <p>{item.line1}</p>
                      ) : (
                        getInputField({
                          line: item.line1,
                          inputWord: item.inputWord,
                          rowNum: index,
                        })
                      )}
                    </div>
                    <div className={`line ${item.line2Replace ? 'wrapcontent' : ''}`}>
                      {!item.line2Replace ? (
                        <p>{item.line2}</p>
                      ) : (
                        getInputField({
                          line: item.line2,
                          inputWord: item.inputWord,
                          rowNum: index,
                        })
                      )}
                    </div>
                    {item.error && <p className="errorField"> Error </p>}
                  </div>
                </div>
              );
            })}
          {!isLoading && !loadError && kurralList.length > 0 && (
            <div className="controls">
              <button onClick={handleSubmit}>Submit Answers</button>
            </div>
          )}
        </>
      ) : (
        <p className="status-msg success">Success! All answers are correct.</p>
      )}
    </div>
  );
};

export default FillInKurral;
