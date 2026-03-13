import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DndProvider } from 'react-dnd';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import store from './redux/store.ts';
import { HTML5Backend } from 'react-dnd-html5-backend';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <Provider store={store}>
    <App />
        </Provider>
      </DndProvider>
    </BrowserRouter>
  </StrictMode>,
)
