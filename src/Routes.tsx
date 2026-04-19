import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from './pages/PageNotFound/pagenotfound.component';
// import NotFound from './pages/PageNotFound';

const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const Thirukkural = lazy(() => import('./pages/thirukurral/thirukurral.component'));
const KurralLanding = lazy(() => import('./pages/thirukurral/KurralLanding'));
const KurralExplorer = lazy(() => import('./pages/thirukurral/KurralExplorer'));
const Exercise = lazy(() => import('./pages/practice/practice.component'));
const Aathichudi = lazy(() => import('./pages/aathichudi/aathichudi.component.tsx'));

// const PracticeLetter = lazy(() => import('./pages/practiceletter/practice.letter'));
const PracticeLetter = lazy(() => import('./pages/practice/practiceletter/practice.letter'));
const DrawLetter = lazy(() => import('./pages/practice/drawletter/draw.letter'));
const FreeType = lazy(() => import('./pages/practice/freetype/free.type'));
const TamilLetters = lazy(() => import('./pages/tamilletters/tamilletters.component'));
const LetterExercise = lazy(() => import('./pages/tamilletters/letterexercise.component'));

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
      <Route path="/practice" element={<PracticeLetter />} />
      <Route path="/draw-letter" element={<DrawLetter />} />
      <Route path="/free-type" element={<FreeType />} />
      <Route path="/tamil-letters" element={<TamilLetters />} />
      <Route path="/letter-exercise" element={<LetterExercise />} />
      <Route path="/aathichudi" element={<Aathichudi />} />
      <Route path="/arthichudi" element={<Aathichudi />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
