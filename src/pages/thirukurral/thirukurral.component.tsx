import { useEffect, useState } from 'react';
import { Container } from '../../Common/common.styles';
import './thirukurral.styles.scss';
import IntroSection from './components/IntroSection';


const Thirukkural = () => {
  const [paalList, setPaalList] = useState<any[]>([]);
  const [adikaramList, setAdikaramList] = useState<any[]>([]);
  const [kurralData, setKurralData] = useState<any[]>([]);
  const [selectedPaalId, setSelectedPaalId] = useState<number>(-1);
  const [selectedAdikaramId, setSelectedAdikaramId] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [expandedPaalId, setExpandedPaalId] = useState<number | null>(null);
  const [expandedAdikaramId, setExpandedAdikaramId] = useState<number | null>(null);
  const [expandedKurralId, setExpandedKurralId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPaals = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/paals`);
        if (!response.ok) throw new Error('Failed to load paals');
        const paals = await response.json();
        if (isMounted) {
          const mappedPaals = (Array.isArray(paals) ? paals : []).map((paal: any) => ({
            Index: Number(paal.index),
            Tamil: paal.tamil,
            English: paal.english,
            Transliteration: paal.transliteration,
          }));
          setPaalList(mappedPaals);
          if (mappedPaals.length > 0) {
            setSelectedPaalId(Number(mappedPaals[0].Index));
          }
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/paals/${selectedPaalId}/adikarams`);
        if (!response.ok) throw new Error('Failed to load adikarams');
        const payload = await response.json();
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
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/paals/${selectedPaalId}/adikarams/${selectedAdikaramId}/kurrals`
        );
        if (!response.ok) throw new Error('Failed to load kurrals');
        const payload = await response.json();
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
      <div
        className="thirukurral-page"
        style={{
          fontFamily: "'Noto Sans Tamil', 'Segoe UI', 'Helvetica Neue', Arial, 'sans-serif'",
        }}
      >
        <h1 className="page-title">திருக்குறள் பட்டியல்</h1>
        <IntroSection />
        <div className="accordion-listing">
          {/* Hierarchical Accordion: Paal -> Adikaram -> Kurral */}
          {paalList.map((paal) => (
            <div className={`accordion-panel${expandedPaalId === paal.Index ? ' expanded' : ''}`} key={paal.Index}>
              <button
                className="accordion-header"
                onClick={() => {
                  setExpandedPaalId(expandedPaalId === paal.Index ? null : paal.Index);
                  setSelectedPaalId(paal.Index);
                  setExpandedAdikaramId(null);
                }}
              >
                <span>{paal.Tamil}</span>
                <span>{expandedPaalId === paal.Index ? '▲' : '▼'}</span>
              </button>
              {expandedPaalId === paal.Index && (
                <div className="accordion-content">
                  {/* Adikaram Accordion inside Paal */}
                  {adikaramList.length === 0 && <p>Loading...</p>}
                  {adikaramList.map((adikaram) => (
                    <div
                      className={`accordion-panel nested${expandedAdikaramId === adikaram.Index ? ' expanded' : ''}`}
                      key={adikaram.Index}
                    >
                      <button
                        className="accordion-header nested"
                        onClick={() => {
                          setExpandedAdikaramId(expandedAdikaramId === adikaram.Index ? null : adikaram.Index);
                          setSelectedAdikaramId(adikaram.Index);
                        }}
                      >
                        <span>{adikaram.Tamil}</span>
                        <span>{expandedAdikaramId === adikaram.Index ? '▲' : '▼'}</span>
                      </button>
                      {expandedAdikaramId === adikaram.Index && (
                        <div className="accordion-content nested">
                          {isLoading && <p>Loading kurral data...</p>}
                          {loadError && <p>{loadError}</p>}
                          {!isLoading && !loadError && kurralData.length > 0 && (
                            <div className="kurral-accordion-listing">
                              {kurralData.map((kurral) => (
                                <div
                                  className={`accordion-panel kurral${expandedKurralId === kurral.Index ? ' expanded' : ''}`}
                                  key={kurral.Index}
                                >
                                  <button
                                    className="accordion-header kurral"
                                    onClick={() => setExpandedKurralId(expandedKurralId === kurral.Index ? null : kurral.Index)}
                                  >
                                    <span>{kurral.Index}. {kurral.Tamil?.replace(/<br \/>/g, '')?.slice(0, 30)}{kurral.Tamil?.length > 30 ? '...' : ''}</span>
                                    <span>{expandedKurralId === kurral.Index ? '▲' : '▼'}</span>
                                  </button>
                                  {expandedKurralId === kurral.Index && (
                                    <div className="accordion-content kurral">
                                      {/* Render Kurral details inline, similar to KurralDetailView */}
                                      <div>
                                        {kurral.Tamil && <p className="title">{kurral.Tamil?.replace(/<br \/>/g, '')}</p>}
                                        {kurral.MuVaUrai && <p className="urraiTitle"><span style={{"fontWeight": "bold"}}>ம.வ உரை</span>: {kurral.MuVaUrai}</p>}
                                        {kurral.SolomonPaapaiyaUrai && <p className="urraiTitle"><span style={{"fontWeight": "bold"}}>சாலமன் பாப்பையா உரை</span>: {kurral.SolomonPaapaiyaUrai}</p>}
                                        {kurral.KalaignarUrai && <p className="urraiTitle"><span style={{"fontWeight": "bold"}}>கலைஞர் உரை</span>: {kurral.KalaignarUrai}</p>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Thirukkural;
