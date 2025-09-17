import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import { signInAnon } from './services/firebase';

// Try anon sign-in, but don't block rendering if it fails.
(async () => {
  try {
    await signInAnon();
  } catch (e) {
    console.warn('Anonymous sign-in failed (non-fatal):', e);
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);