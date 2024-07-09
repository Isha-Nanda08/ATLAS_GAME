import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import CreateRoom from './pages/create-room/CreateRoom';
import LoginPage from './pages/create-room/LoginPage';
import GameLobby from './pages/lobby-pages/GameLobby';
import WinnerPage from './pages/lobby-pages/WinnerPage';
import GamePage from './pages/game-page/GamePage';

const SOCKET_SERVER_URL = 'http://localhost:4000'; // Replace with your server URL

function renderCurrPage(currPage, props) {
  switch (currPage) {
    case 'create-room':
      return <CreateRoom {...props} />
    case 'login-page':
      return <LoginPage {...props} />
    case 'game-lobby':
      return <GameLobby {...props} />
    case 'winner-page':
      return <WinnerPage {...props} />
    case 'game-page':
      return <GamePage {...props} />
    default:
      return null;
  }
}

function App() {
  const [currPage, setCurrPage] = useState('login-page');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish socket connection when the component mounts
    const newSocket = io(SOCKET_SERVER_URL);
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  return renderCurrPage(currPage);
}

export default App;
