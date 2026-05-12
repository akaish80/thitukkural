import { useEffect, useState, useCallback } from 'react';
import PageTitle from '../../components/PageTitle';
import { Container } from '../../Common/common.styles';
import './thirukurral.styles.scss';
import fetchWrapper from '../../utils/fetchWrapper';
import { isBookmarked, toggleBookmark } from '../../utils/learningStore';

const shareKurral = (kurralId: number, text: string) => {
  const cleanText = text.replace(/<br \/>/g, '\n');
  const shareText = `திருக்குறள் ${kurralId}:\n${cleanText}`;
  const url = `${window.location.origin}/kurral/${kurralId}`;
  return { shareText, url, cleanText };
};

const ShareButtons = ({ kurralId, text }: { kurralId: number; text: string }) => {
  const [copied, setCopied] = useState(false);
  const { shareText, url } = shareKurral(kurralId, text);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;

  return (
    <div className="tk-share-bar">
      <button className="tk-share-btn" onClick={handleCopy} title="Copy">
        {copied ? '✅' : '📋'}
      </button>
      <a className="tk-share-btn" href={whatsappUrl} target="_blank" rel="noreferrer" title="WhatsApp">
        💬
      </a>
      <a className="tk-share-btn" href={twitterUrl} target="_blank" rel="noreferrer" title="Twitter / X">
        🐦
      </a>
    </div>
  );
};

const BookmarkButton = ({ kurralId }: { kurralId: number }) => {
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(kurralId));

  const handleToggle = useCallback(() => {
    const added = toggleBookmark(kurralId);
    setBookmarked(added);
  }, [kurralId]);

  return (
    <button
      className={`tk-bookmark-btn${bookmarked ? ' active' : ''}`}
      onClick={handleToggle}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this kurral'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this kurral'}
    >
      {bookmarked ? '★' : '☆'}
    </button>
  );
};


const KurralExplorer = () => {
  const [paalList, setPaalList] = useState<any[]>([]);
  const [adikaramList, setAdikaramList] = useState<any[]>([]);
  const [kurralData, setKurralData] = useState<any[]>([]);
  const [selectedPaalId, setSelectedPaalId] = useState<number>(-1);
  const [selectedAdikaramId, setSelectedAdikaramId] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedKurralId, setExpandedKurralId] = useState<number | null>(null);
  const [mobileStep, setMobileStep] = useState<'paal' | 'adikaram' | 'kurrals' | 'kurral-detail'>('paal');

  const selectedPaal = paalList.find((p) => p.Index === selectedPaalId);
  const selectedAdikaram = adikaramList.find((a) => a.Index === selectedAdikaramId);
  const selectedKurral = kurralData.find((k) => k.Index === expandedKurralId);

  useEffect(() => {
    let isMounted = true;

    const loadPaals = async () => {
      try {
        const paals = await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/paals`);
        if (isMounted) {
          const mappedPaals = (Array.isArray(paals) ? paals : []).map((paal: any) => ({
            Index: Number(paal.index),
            Tamil: paal.tamil,
            English: paal.english,
            Transliteration: paal.transliteration,
          }));
          setPaalList(mappedPaals);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError('Unable to load paal data. Please refresh and try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPaals();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedPaalId < 0) return;
    let isMounted = true;

    const loadAdikarams = async () => {
      try {
        const payload = await fetchWrapper(`${import.meta.env.VITE_API_BASE_URL}/api/paals/${selectedPaalId}/adikarams`);
        if (isMounted) {
          const mappedAdikarams = (Array.isArray(payload.adikarams) ? payload.adikarams : []).map(
            (adikaram: any) => ({
              Index: Number(adikaram.adikaramNumber),
              Tamil: adikaram.tamil,
              English: adikaram.english,
              Transliteration: adikaram.transliteration,
            })
          );
          setAdikaramList(mappedAdikarams);
          if (mappedAdikarams.length > 0) {
            setSelectedAdikaramId(Number(mappedAdikarams[0].Index));
          } else {
            setSelectedAdikaramId(-1);
            setKurralData([]);
          }
        }
      } catch (error) {
        if (isMounted) {
          setAdikaramList([]);
          setSelectedAdikaramId(-1);
          setKurralData([]);
          setLoadError('Unable to load adikaram data. Please refresh and try again.');
        }
      }
    };

    loadAdikarams();

    return () => {
      isMounted = false;
    };
  }, [selectedPaalId]);

  useEffect(() => {
    if (selectedPaalId < 0 || selectedAdikaramId < 0) return;
    let isMounted = true;
    setIsLoading(true);

    const loadKurrals = async () => {
      debugger;
      try {
        const payload = await fetchWrapper(
          `${import.meta.env.VITE_API_BASE_URL}/api/paals/${selectedPaalId}/adikarams/${selectedAdikaramId}/kurrals`
        );
        if (isMounted) {
          const mappedKurrals = (Array.isArray(payload.kurrals) ? payload.kurrals : []).map(
            (kurral: any) => ({
              Index: Number(kurral.kurralId),
              Tamil: kurral.tamil?.full || '',
              MuVaUrai: kurral.explanations?.muVa || '',
              SolomonPaapaiyaUrai: kurral.explanations?.solomonPaapaiya || '',
              KalaignarUrai: kurral.explanations?.kalaignar || '',
            })
          );
          setKurralData(mappedKurrals);
          setLoadError(null);
        }
      } catch (error) {
        if (isMounted) {
          setKurralData([]);
          setLoadError('Unable to load kurral data. Please refresh and try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadKurrals();

    return () => {
      isMounted = false;
    };
  }, [selectedPaalId, selectedAdikaramId]);



  return (
    <Container>
      <PageTitle
        title={expandedKurralId ? `திருக்குறள் #${expandedKurralId}` : 'திருக்குறள் Explore'}
        description="Browse all 1330 Thirukkural couplets by Paal, Adikaram and Kurral. Read, bookmark and share."
        path={expandedKurralId ? `/kurral/${expandedKurralId}` : '/kurral/explore'}
      />
      <div
        className="thirukurral-page"
        style={{
          fontFamily: "'Noto Sans Tamil', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'",
        }}
      >
        <h1 className="page-title">திருக்குறள் பட்டியல்</h1>
        

        {/* Mobile breadcrumb */}
        <nav className="tk-breadcrumb">
          <button
            className={`tk-breadcrumb__crumb${mobileStep === 'paal' ? ' active' : ''}`}
            onClick={() => setMobileStep('paal')}
          >பால்</button>
          {selectedPaal && (
            <>
              <span className="tk-breadcrumb__sep">›</span>
              <button
                className={`tk-breadcrumb__crumb${mobileStep === 'adikaram' ? ' active' : ''}`}
                onClick={() => setMobileStep('adikaram')}
              >{selectedPaal.Tamil}</button>
            </>
          )}
          {selectedAdikaram && (mobileStep === 'kurrals' || mobileStep === 'kurral-detail') && (
            <>
              <span className="tk-breadcrumb__sep">›</span>
              <button
                className={`tk-breadcrumb__crumb${mobileStep === 'kurrals' ? ' active' : ''}`}
                onClick={() => { setMobileStep('kurrals'); setExpandedKurralId(null); }}
              >{selectedAdikaram.Tamil}</button>
            </>
          )}
          {selectedKurral && mobileStep === 'kurral-detail' && (
            <>
              <span className="tk-breadcrumb__sep">›</span>
              <span className="tk-breadcrumb__crumb active">குறள் {selectedKurral.Index}</span>
            </>
          )}
        </nav>

        <div className="tk-explorer">
          {/* Column 1 — Paal */}
          <nav className={`tk-col tk-col--paal${mobileStep === 'paal' ? ' mobile-active' : ''}`}>
            <h2 className="tk-col__title">பால்</h2>
            <ul className="tk-list">
              {paalList.map((paal) => (
                <li key={paal.Index}>
                  <button
                    className={`tk-list__item${selectedPaalId === paal.Index ? ' active' : ''}`}
                    onClick={() => {
                      setSelectedPaalId(paal.Index);
                      setExpandedKurralId(null);
                      setMobileStep('adikaram');
                    }}
                  >
                    <span className="tk-list__label">{paal.Tamil}</span>
                    <span className="tk-list__sub">{paal.English}</span>
                    <span className="tk-list__arrow">›</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Column 2 — Adikaram */}
          <nav className={`tk-col tk-col--adikaram${mobileStep === 'adikaram' ? ' mobile-active' : ''}`}>
            <div className="tk-col__title">
              <button className="tk-col__back" onClick={() => setMobileStep('paal')}>‹</button>
              அதிகாரம்
            </div>
            {selectedPaalId < 0 ? (
              <p className="tk-empty">பால் தேர்வு செய்யவும்</p>
            ) : adikaramList.length === 0 ? (
              <p className="tk-empty tk-empty--loading">ஏற்றுகிறது…</p>
            ) : (
              <ul className="tk-list">
                {adikaramList.map((adikaram) => (
                  <li key={adikaram.Index}>
                    <button
                      className={`tk-list__item${selectedAdikaramId === adikaram.Index ? ' active' : ''}`}
                      onClick={() => {
                        setSelectedAdikaramId(adikaram.Index);
                        setExpandedKurralId(null);
                        setMobileStep('kurrals');
                      }}
                    >
                      <span className="tk-list__num">{adikaram.Index}.</span>
                      <span className="tk-list__label">{adikaram.Tamil}</span>
                      <span className="tk-list__arrow">›</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>

          {/* Column 3 — Kurrals */}
          <section className={`tk-col tk-col--kurrals${mobileStep === 'kurrals' ? ' mobile-active' : ''}`}>
            <div className="tk-col__title">
              <button className="tk-col__back" onClick={() => setMobileStep('adikaram')}>‹</button>
              குறள்கள்
              {selectedAdikaram && (
                <span className="tk-col__title-sub">{selectedAdikaram.Tamil}</span>
              )}
            </div>
            {isLoading ? (
              <p className="tk-empty tk-empty--loading">ஏற்றுகிறது…</p>
            ) : loadError ? (
              <p className="tk-empty tk-empty--error">{loadError}</p>
            ) : kurralData.length === 0 ? (
              <p className="tk-empty">அதிகாரம் தேர்வு செய்யவும்</p>
            ) : (
              <ul className="tk-kurral-list">
                {kurralData.map((kurral) => (
                  <li
                    key={kurral.Index}
                    className={`tk-kurral-card${expandedKurralId === kurral.Index ? ' expanded' : ''}`}
                  >
                    <button
                      className="tk-kurral-card__header"
                      onClick={() => {
                        const newId = expandedKurralId === kurral.Index ? null : kurral.Index;
                        setExpandedKurralId(newId);
                        if (newId !== null) setMobileStep('kurral-detail');
                      }}
                    >
                      <span className="tk-kurral-card__num">{kurral.Index}</span>
                      <span className="tk-kurral-card__verse">
                        {kurral.Tamil?.split(/<br \/>/).map((line: string, i: number) => (
                          <span key={i} className="tk-kurral-card__verse-line">{line}</span>
                        ))}
                      </span>
                      <span className="tk-kurral-card__chevron">
                        {expandedKurralId === kurral.Index ? '▲' : '▼'}
                      </span>
                    </button>
                    {expandedKurralId === kurral.Index && (
                      <div className="tk-kurral-card__body">
                        <div className="tk-kurral-card__actions">
                          <BookmarkButton kurralId={kurral.Index} />
                          <ShareButtons kurralId={kurral.Index} text={kurral.Tamil} />
                        </div>
                        {kurral.MuVaUrai && (
                          <div className="tk-explanation">
                            <span className="tk-explanation__author">ம.வ உரை</span>
                            <p className="tk-explanation__text">{kurral.MuVaUrai}</p>
                          </div>
                        )}
                        {kurral.SolomonPaapaiyaUrai && (
                          <div className="tk-explanation">
                            <span className="tk-explanation__author">சாலமன் பாப்பையா</span>
                            <p className="tk-explanation__text">{kurral.SolomonPaapaiyaUrai}</p>
                          </div>
                        )}
                        {kurral.KalaignarUrai && (
                          <div className="tk-explanation">
                            <span className="tk-explanation__author">கலைஞர்</span>
                            <p className="tk-explanation__text">{kurral.KalaignarUrai}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Panel 4 — Kurral Detail (mobile only) */}
          <section className={`tk-col tk-col--kurral-detail${mobileStep === 'kurral-detail' ? ' mobile-active' : ''}`}>
            <div className="tk-col__title">
              <button className="tk-col__back" onClick={() => { setMobileStep('kurrals'); setExpandedKurralId(null); }}>‹</button>
              குறள் {selectedKurral?.Index}
            </div>
            {selectedKurral && (
              <div className="tk-kurral-detail">
                <div className="tk-kurral-card__actions">
                  <BookmarkButton kurralId={selectedKurral.Index} />
                  <ShareButtons kurralId={selectedKurral.Index} text={selectedKurral.Tamil} />
                </div>
                <div className="tk-kurral-detail__verse">
                  {selectedKurral.Tamil?.split(/<br \/>/).map((line: string, i: number) => (
                    <span key={i} className="tk-kurral-detail__verse-line">{line}</span>
                  ))}
                </div>
                {selectedKurral.MuVaUrai && (
                  <div className="tk-explanation">
                    <span className="tk-explanation__author">ம.வ உரை</span>
                    <p className="tk-explanation__text">{selectedKurral.MuVaUrai}</p>
                  </div>
                )}
                {selectedKurral.SolomonPaapaiyaUrai && (
                  <div className="tk-explanation">
                    <span className="tk-explanation__author">சாலமன் பாப்பையா</span>
                    <p className="tk-explanation__text">{selectedKurral.SolomonPaapaiyaUrai}</p>
                  </div>
                )}
                {selectedKurral.KalaignarUrai && (
                  <div className="tk-explanation">
                    <span className="tk-explanation__author">கலைஞர்</span>
                    <p className="tk-explanation__text">{selectedKurral.KalaignarUrai}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </Container>
  );
};

export default KurralExplorer;
