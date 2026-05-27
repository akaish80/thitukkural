import { lazy, Suspense, useEffect, Component } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

class RouteErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong loading this page.</h2>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import NotFound from './pages/PageNotFound/pagenotfound.component';

const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const Thirukkural = lazy(() => import('./pages/thirukurral/thirukurral.component'));
const KurralLanding = lazy(() => import('./pages/thirukurral/KurralLanding'));
const KurralExplorer = lazy(() => import('./pages/thirukurral/KurralExplorer'));
const Exercise = lazy(() => import('./pages/practice/practice.component'));
const TamilExperienceAssessment = lazy(() => import('./components/tamilEvaluation/TamilExperienceAssessment.tsx'));
const Aathichudi = lazy(() => import('./pages/aathichudi/aathichudi.component.tsx'));

// const PracticeLetter = lazy(() => import('./pages/practiceletter/practice.letter'));
const PracticeLetter = lazy(() => import('./pages/practice/practiceletter/practice.letter'));
const DrawLetter = lazy(() => import('./pages/practice/drawletter/draw.letter'));
const FreeType = lazy(() => import('./pages/practice/freetype/free.type'));
const TamilLetters = lazy(() => import('./pages/tamilletters/tamilletters.component'));
const LetterExercise = lazy(() => import('./pages/tamilletters/letterexercise.component'));
const About = lazy(() => import('./pages/about/about.component'));
const Contact = lazy(() => import('./pages/contact/contact.component'));
const Privacy = lazy(() => import('./pages/privacy/privacy.component'));
const TamilNumbers = lazy(() => import('./pages/tamilnumbers/tamilnumbers.component'));
const LearningPath = lazy(() => import('./pages/learningpath/LearningPath'));
const PlannerPage = lazy(() => import('./pages/learningpath/PlannerPage'));
const LessonPage = lazy(() => import('./pages/learningpath/LessonPage'));
const PictureWordChartPage = lazy(() => import('./pages/learningpath/PictureWordChartPage'));
const LearnTamilImageRecognitionPage = lazy(() => import('./pages/tamilImageRecogniztion/LearnTamilImageRecognitionPage.tsx'));
const LearnTamilChaptersPage = lazy(() => import('./pages/learnTamil/LearnTamilChaptersPage.tsx'));
const TamilCounting = lazy(() => import('./pages/tamilcounting/tamilcounting.component'));
const LearnTamilUnitPage = lazy(() => import('./pages/tamilUnitPage/LearnTamilUnitPage.tsx'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
};

const LoadingSkeleton = () => (
  <div className="page-loading">
    <div className="loading-spinner" />
  </div>
);

const AppRoutes = () => (
  <RouteErrorBoundary>
    <Suspense fallback={<LoadingSkeleton />}>
    <ScrollToTop />
    <Routes> 
      <Route path="/" element={<HomePage />} />
      <Route path="/kurral" element={<Thirukkural />}>
        <Route index element={<KurralLanding />} />
        <Route path="explore" element={<KurralExplorer />} />
        <Route path=":id" element={<KurralExplorer />} />
      </Route>
      <Route path="/kurral/exercise" element={<Exercise />} />
      <Route path="/kurral/exercise/:exerciseType" element={<Exercise />} />
      <Route path="/tamil-evaluation" element={<TamilExperienceAssessment />} />
      <Route path="/practice" element={<PracticeLetter />} />
      <Route path="/draw-letter" element={<DrawLetter />} />
      <Route path="/free-type" element={<FreeType />} />
      <Route path="/tamil-letters" element={<TamilLetters />} />
      <Route path="/letter-exercise" element={<LetterExercise />} />
      <Route path="/aathichudi" element={<Aathichudi />} />
      <Route path="/arthichudi" element={<Aathichudi />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/tamil-numbers" element={<TamilNumbers />} />
      <Route path="/learn" element={<LearningPath />} />
      <Route path="/planner" element={<PlannerPage />} />
      <Route path="/learn/:stepId/:lessonId" element={<LessonPage />} />
      <Route path="/learn/picture-chart" element={<PictureWordChartPage />} />
      <Route path="/learn-tamil" element={<LearnTamilChaptersPage />} />
      <Route path="/learn-tamil/:chapterId" element={<LearnTamilChaptersPage />} />
      <Route path="/learn-tamil/:chapterId/:unitId" element={<LearnTamilUnitPage />} />
      <Route path="/learn-tamil/image-letter-recognition" element={<LearnTamilImageRecognitionPage />} />
      <Route path="/learn-tamil/picture-chart" element={<PictureWordChartPage />} />
      <Route path="/tamil-counting" element={<TamilCounting />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
</RouteErrorBoundary>
);

export default AppRoutes;
