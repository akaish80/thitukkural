import { lazy, Suspense, useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../Common/common.styles';
import './practice.styles.scss';

const MatchAdhikaramToPaal = lazy(() => import('./matchadhikaramtopaal/match.adhikaram.to.paal'));
const FillInKurral = lazy(() => import('./fillinkurral/fill.in.kurral'));
const QuizPractice = lazy(() => import('./QuizPractice'));
const TamilExperienceAssessment = lazy(() => import('../../components/tamilEvaluation/TamilExperienceAssessment.tsx'));

const practiceTypes = [
  {
    Tamil: 'Match Paal to Adhikaram',
    index: 1,
    slug: 'match-paal',
    icon: '🎯',
    color: '#58cc02',
    description: 'பாலுடன் அதிகாரத்தை பொருத்துக',
  },
  {
    Tamil: 'Fill in the Kurral',
    index: 2,
    slug: 'fill-kurral',
    icon: '✏️',
    color: '#ce82ff',
    description: 'குறள் வரிகளை நிரப்புக',
  },
  {
    Tamil: 'Quiz Practice',
    index: 5,
    slug: 'quiz',
    icon: '❓',
    color: '#1cb0f6',
    description: 'திருக்குறள் Quiz பயிற்சி',
  },
  {
    Tamil: 'Tamil Experience Test',
    index: 6,
    slug: 'tamil-evaluation',
    icon: '🧪',
    color: '#ff9600',
    description: 'உங்கள் தமிழ் திறன் நிலையை மதிப்பிடுக',
  },
];

type MobileView = 'path' | 'exercise';

const Excercise = () => {
  const { exerciseType } = useParams<{ exerciseType?: string }>();
  const navigate = useNavigate();

  const selectedExcercise = useMemo(() => {
    if (exerciseType) {
      return practiceTypes.find((p) => p.slug === exerciseType) || null;
    }
    return null;
  }, [exerciseType]);

  const [mobileView, setMobileView] = useState<MobileView>(
    exerciseType ? 'exercise' : 'path',
  );

  useEffect(() => {
    setMobileView(exerciseType ? 'exercise' : 'path');
  }, [exerciseType]);

  const handleClick = useCallback((practice: (typeof practiceTypes)[0]) => {
    navigate(`/kurral/exercise/${practice.slug}`);
  }, [navigate]);

  const handleBack = useCallback(() => {
    navigate('/kurral/exercise');
  }, [navigate]);

  const getExcerciseSessionContainer = (selInd: (typeof practiceTypes)[0]) => {
    if (selInd.index === 1) {
      return <MatchAdhikaramToPaal />;
    } else if (selInd.index === 2) {
      return <FillInKurral />;
    } else if (selInd.index === 5) {
      return <QuizPractice />;
    } else if (selInd.index === 6) {
      return <TamilExperienceAssessment />;
    }
  };

  // Landing page when no exercise is selected
  if (!selectedExcercise) {
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

          <div className="exercise-landing">
            <div className="exercise-landing__grid">
              {practiceTypes.map((practice) => (
                <button
                  key={practice.index}
                  type="button"
                  className="exercise-landing__card"
                  style={{ '--card-accent': practice.color } as React.CSSProperties}
                  onClick={() => handleClick(practice)}
                >
                  <div className="exercise-landing__icon">{practice.icon}</div>
                  <h3 className="exercise-landing__title">{practice.Tamil}</h3>
                  <p className="exercise-landing__desc">{practice.description}</p>
                  <span className="exercise-landing__cta">தொடங்கு →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={`practice-page mobile-view--${mobileView}`}>
        {/* Mobile back bar — visible only when exercise is open on mobile */}
        <div className="mobile-back-bar">
          <button className="back-btn" type="button" onClick={handleBack}>
            ← பயிற்சிகள்
          </button>
          <span className="back-title">
            {selectedExcercise.icon} {selectedExcercise.Tamil}
          </span>
        </div>

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
          {/* Sidebar / Duolingo path (mobile) */}
          <div className="practice-sidebar">
            <h3 className="sidebar-title">பயிற்சி வகைகள்</h3>

            {/* Desktop grid */}
            <div className="practice-grid desktop-grid">
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

            {/* Mobile tile grid */}
            <div className="mobile-tile-grid">
              {practiceTypes.map((practice) => (
                <button
                  type="button"
                  key={practice.index}
                  className={`mobile-tile ${selectedExcercise?.index === practice.index ? 'active' : ''}`}
                  style={{ '--tile-color': practice.color } as React.CSSProperties}
                  onClick={() => handleClick(practice)}
                >
                  <span className="mobile-tile__icon">{practice.icon}</span>
                  <span className="mobile-tile__title">{practice.Tamil}</span>
                  <span className="mobile-tile__desc">{practice.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise panel */}
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
        </div>
      </div>
    </Container>
  );
};

export default Excercise;
