import { useEffect } from 'react';
import './App.css';
import CreateRoom from './pages/create-room/CreateRoom';
import LoginPage from './pages/create-room/LoginPage';
import GameLobby from './pages/lobby-pages/GameLobby';

const audio = new Audio('/awesomeness.wav');
audio.volume = 0.5;
audio.loop = true;

function App() {
  useEffect(() => {

    const playAudio = () => {
      audio.play();
      document.removeEventListener('click', playAudio);
    };

    document.addEventListener('click', playAudio);

    return () => {
      audio.pause()
      document.removeEventListener('click', playAudio);
    };
  }, []);
  return (
    <GameLobby />
  );
}

export default App;
