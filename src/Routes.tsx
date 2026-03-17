import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from './pages/PageNotFound/pagenotfound.component';
// import NotFound from './pages/PageNotFound';

const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const Thirukkural = lazy(() => import('./pages/thirukurral/thirukurral.component'));
const Exercise = lazy(() => import('./pages/practice/practice.component'));

// const PracticeLetter = lazy(() => import('./pages/practiceletter/practice.letter'));
const PracticeLetter = lazy(() => import('./pages/practice/practiceletter/practice.letter'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ScrollToTop />
    <Routes> 
      <Route path="/" element={<HomePage />} />
      <Route path="/kurral" element={<Thirukkural />} />
      <Route path="/kurral/:id" element={<Thirukkural />} />
      <Route path="/excercise" element={<Exercise />} />
      <Route path="/practice" element={<PracticeLetter />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
