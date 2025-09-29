import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';
import './i18n';
import { initAnalytics } from '@/utils/analytics';

// Enable MSW in development
async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== 'false') {
    const { worker } = await import('./mocks/browser');
    return worker.start({
      onUnhandledRequest: 'bypass',
    });
  }
}

enableMocking().then(() => {
  initAnalytics()
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <HashRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </HashRouter>
    </React.StrictMode>
  );
});