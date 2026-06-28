import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './components/contexts/SettingsContext';
import App from './App.tsx';
import './index.css';

// React Quill এর 'findDOMNode is deprecated' ওয়ার্নিংটি হাইড করার জন্য কাস্টম লজিক
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (typeof args[0] === 'string' && args[0].includes('findDOMNode is deprecated')) {
    return; // এই নির্দিষ্ট ওয়ার্নিংটি কনসোলে প্রিন্ট করবে না
  }
  originalConsoleError(...args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <SettingsProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SettingsProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);