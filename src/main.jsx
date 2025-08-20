import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

(function removeSplash() {
  try {
    const splash = document.getElementById('site-splash');
    if (!splash) return;
    // immediate fade for smoothness
    splash.style.transition = 'opacity 220ms ease, visibility 220ms';
    splash.style.opacity = '0';
    splash.style.visibility = 'hidden';
    // final remove to free memory
    setTimeout(() => { if (splash.parentNode) splash.parentNode.removeChild(splash); }, 250);
  } catch (e) {
    // fallback: try direct removal
    const s = document.getElementById('site-splash');
    if (s && s.parentNode) s.parentNode.removeChild(s);
  }
}) 
();