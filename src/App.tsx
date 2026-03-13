import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import store from './redux/store';
import './App.scss';
import ThemeProvider from './contexts/ThemeContext';
import Header from './components/header/header.component';
import Footer from './components/footer/footer.component';
import Nav from './components/nav/nav.component';
import Chatbot from './components/chatbot/Chatbot';
import AppRoutes from './Routes';
import { loadContent } from './redux/content/content.slice';

function App() {
  const location = useLocation();
  const dispatch = useDispatch<typeof store.dispatch>();

  useEffect(() => {
    dispatch(loadContent());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <Nav location={location} />
        <div id="content">
          <AppRoutes />
        </div>
        <footer>
          <Footer />
        </footer>
        <Chatbot />
      </div>
    </ThemeProvider>
  );
}

export default App;
