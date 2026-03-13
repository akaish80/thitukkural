import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/PageNotFound/pagenotfound.component';
// import NotFound from './pages/PageNotFound';

const HomePage = lazy(() => import('./pages/homepage/homepage.component'));
const Thirukkural = lazy(() => import('./pages/thirukurral/thirukurral.component'));
const Practice = lazy(() => import('./pages/practice/practice.component'));

const AppRoutes = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/kurral" element={<Thirukkural />} />
      <Route path="/kurral/:id" element={<Thirukkural />} />
      <Route path="/kurral/excercise" element={<Practice />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
