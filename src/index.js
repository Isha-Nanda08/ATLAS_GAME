import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
// const audio = new Audio('/awesomeness.wav');
// audio.volume = 0.5;
// audio.loop = true;
// audio.play()

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
