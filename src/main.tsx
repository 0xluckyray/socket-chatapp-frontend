import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { SocketProvider } from './context/SocketContext';
import { Provider } from 'jotai';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Provider>
          <App />
        </Provider>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>
);