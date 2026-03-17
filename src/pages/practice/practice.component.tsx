import { lazy, Suspense, useState } from 'react';
import { isEmpty } from '../../components/utils';
import { Container } from '../../Common/common.styles';
import './practice.styles.scss';

const MatchAdhikaramToPaal = lazy(() => import('./matchadhikaramtopaal/match.adhikaram.to.paal'));
const FillInKurral = lazy(() => import('./fillinkurral/fill.in.kurral'));
const DrawLetter = lazy(() => import('./drawletter/draw.letter'));
const QuizPractice = lazy(() => import('./QuizPractice'));

const practiceTypes = [
  {
    Tamil: 'Match Paal to Adhikaram',
    index: 1,
    icon: '🎯',
    description: 'பாலுடன் அதிகாரத்தை பொருத்துக',
  },
  {
    Tamil: 'Fill in the Kurral',
    index: 2,
    icon: '✏️',
    description: 'குறள் வரிகளை நிரப்புக',
  },
  {
    Tamil: 'Draw Letter அ',
    index: 4,
    icon: '🎨',
    description: 'எழுத்துக்களை வரையுங்கள்',
  },
  {
    Tamil: 'Quiz Practice',
    index: 5,
    icon: '❓',
    description: 'திருக்குறள் Quiz பயிற்சி',
  },
];


const Excercise = () => {
  const [selectedExcercise, setSelectedExcercise] = useState(practiceTypes[0]);

  const handleClick = (practice: (typeof practiceTypes)[0]) => {
    setSelectedExcercise(practice);
  };

  // const isEmptyObj = isEmpty(selectedExcercise)

  const getExcerciseSessionContainer = (selInd: (typeof practiceTypes)[0]) => {
    if (selInd.index === 1) {
      return <MatchAdhikaramToPaal selPractice={selectedExcercise} />;
    } else if (selInd.index === 2) {
      return <FillInKurral />;
    } else if (selInd.index === 4) {
      return <DrawLetter />;
    } else if (selInd.index === 5) {
      return <QuizPractice />;
    }
  };

  if (!selectedExcercise) {
    console.log('Selected Exercise:', selectedExcercise);
    return null;
  }

  return (
    <Container>
      <div className="practice-page">
        <div className="practice-header">
          <h1 className="page-title">
            <span className="title-icon">🎓</span>
            பயிற்சி மையம்
          </h1>
          <p className="page-description">
            திருக்குறள் கற்கவும் தமிழ் எழுத்துக்கள் பயிற்சி செய்யவும்
          </p>
        </div>

        <div className="practice-content">
          <div className="practice-sidebar">
            <h3 className="sidebar-title">பயிற்சி வகைகள்</h3>
            <div className="practice-grid">
              {practiceTypes.map((practice, index) => (
                <div
                  key={index}
                  className={`practice-card ${selectedExcercise?.index === practice?.index ? 'active' : ''}`}
                  onClick={() => handleClick(practice)}
                >
                  <div className="card-icon">{practice.icon}</div>
                  <h4 className="card-title">{practice.Tamil}</h4>
                  <p className="card-description">{practice.description}</p>
                  <div className="card-indicator"></div>
                </div>
              ))}
            </div>
          </div>

          {!isEmpty(selectedExcercise) && (
            <div className="practice-main">
              <div className="exercise-header">
                <h2 className="exercise-title">
                  <span className="exercise-icon">{selectedExcercise.icon}</span>
                  {selectedExcercise.Tamil}
                </h2>
                <p className="exercise-description">{selectedExcercise.description}</p>
              </div>

              <div className="exercise-container">
                <Suspense fallback={<p>Loading practice module...</p>}>
                  {getExcerciseSessionContainer(selectedExcercise)}
                </Suspense>
              </div>
            </div>
          )}

          {isEmpty(selectedExcercise) && (
            <div className="practice-welcome">
              <div className="welcome-content">
                <div className="welcome-icon">📚</div>
                <h2 className="welcome-title">வணக்கம்!</h2>
                <p className="welcome-text">தயவுசெய்து ஒரு பயிற்சி வகையை தேர்ந்தெடுக்கவும்</p>
                <div className="welcome-features">
                  <div className="feature">
                    <span className="feature-icon">🎯</span>
                    <span>இலக்காக பயிற்சி</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">📈</span>
                    <span>முன்னேற்றம் கண்காணித்தல்</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon">🏆</span>
                    <span>சாதனைகள் பெறுதல்</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Excercise;
