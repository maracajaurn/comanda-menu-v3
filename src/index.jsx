import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { App } from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      if (process.env.REACT_APP_NODE_ENV === "development") {
        console.log("Service Worker registrado com sucesso:", registration.scope);
      };
    })
    .catch((error) => {
      console.error("Erro ao registrar o Service Worker:", error);
    });
};