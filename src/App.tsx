import { useEffect, lazy, Suspense, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import store from './redux/store';
import './App.scss';
import ThemeProvider from './contexts/ThemeContext';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import Nav from './components/nav/nav.component';
import AppRoutes from './Routes';
import { loadContent } from './redux/content/content.slice';

const Chatbot = lazy(() => import('./components/chatbot/Chatbot'));

function getTamilVoiceInstallHint(): { title: string; steps: string } {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  if (/Windows/i.test(ua)) {
    return {
      title: 'Tamil voice setup recommended for best pronunciation',
      steps: 'Windows: Settings > Time & language > Language & region > Add a language > Tamil. Open Tamil language options and install Text-to-speech. Restart browser after install.',
    };
  }

  if (/Macintosh|Mac OS X/i.test(ua)) {
    return {
      title: 'Tamil voice setup recommended for best pronunciation',
      steps: 'macOS: System Settings > Accessibility > Spoken Content > System Voice > Manage Voices. Download a Tamil voice and restart browser.',
    };
  }

  if (/Android/i.test(ua)) {
    return {
      title: 'Tamil voice setup recommended for best pronunciation',
      steps: 'Android: Settings > Language & input > Text-to-speech output > Install voice data. Download Tamil voice and set preferred engine.',
    };
  }

  if (/iPhone|iPad|iPod/i.test(ua)) {
    return {
      title: 'Tamil voice setup recommended for best pronunciation',
      steps: 'iOS/iPadOS: Settings > Accessibility > Spoken Content > Voices > Tamil. Download a Tamil voice and reopen browser.',
    };
  }

  return {
    title: 'Tamil voice setup recommended for best pronunciation',
    steps: 'Install Tamil text-to-speech voice in your operating system language settings, then restart browser.',
  };
}

function App() {
  const location = useLocation();
  const dispatch = useDispatch<typeof store.dispatch>();
  const [showVoiceBanner, setShowVoiceBanner] = useState(true);
  const voiceInstallHint = useMemo(() => getTamilVoiceInstallHint(), []);

  useEffect(() => {
    dispatch(loadContent());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <div className="App">
        <a className="skip-nav" href="#content">Skip to content</a>
        <header className="App-header">
          <Header />
        </header>
        {showVoiceBanner && (
          <section className="global-voice-banner" role="status" aria-live="polite">
            <div className="global-voice-banner__content">
              <strong className="global-voice-banner__title">{voiceInstallHint.title}</strong>
              <span className="global-voice-banner__steps">{voiceInstallHint.steps}</span>
            </div>
            <button
              type="button"
              className="global-voice-banner__close"
              onClick={() => setShowVoiceBanner(false)}
              aria-label="Dismiss Tamil voice setup banner"
            >
              Dismiss
            </button>
          </section>
        )}
        <Nav location={location} />
        <div id="content">
          <AppRoutes />
        </div>
        <footer>
          <Footer />
        </footer>
        <Suspense fallback={null}>
          <Chatbot />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;
