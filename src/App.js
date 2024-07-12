import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import CreateRoom from './pages/create-room/CreateRoom';
import LoginPage from './pages/create-room/LoginPage';
import GameLobby from './pages/lobby-pages/GameLobby';
import WinnerPage from './pages/lobby-pages/WinnerPage';
import GamePage from './pages/game-page/GamePage';

const SOCKET_SERVER_URL = 'https://atlas-server-ecru.vercel.app'; // Replace with your server URL


function App() {
    let [userId, setUserId] = useState(localStorage.getItem('socketId'));
    const [currPage, setCurrPage] = useState('login-page');
    const [socket, setSocket] = useState(null);
    const [extra, setExtra] = useState({});
    const [roomId, setRoomId] = useState(-1);

    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to the server:', newSocket.id);
            if (userId == null) {
                localStorage.setItem('socketId', newSocket.id)
                setUserId(newSocket.id)
            }
            console.log("user id found: ", userId)
            console.log("Sending update request")
            newSocket.emit('update-me', { userId });
        });

        newSocket.on('your-initial-data', (data) => {
            console.log('initial-data given by server', data);
            setRoomId(data.roomId)
        })

        newSocket.on('your-room-id', (data) => {
            // console.log('joined/created room id given by server', data);
            if (data.roomId == -1) {
                setExtra({ error: data.error })
            } else {
                setRoomId(data.roomId);
                setCurrPage('game-lobby');
            }
        })

        newSocket.on('your-room-started', () => {
            setCurrPage('game-page');
        })

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, [userId]);


    const renderCurrPage = (currPage, props) => {
        switch (currPage) {
            case 'create-room':
                return <CreateRoom {...props} />
            case 'login-page':
                return <LoginPage {...props} />
            case 'game-lobby':
                return <GameLobby {...props} setRoomId={setRoomId} />
            case 'winner-page':
                return <WinnerPage {...props} setRoomId={setRoomId} />
            case 'game-page':
                return <GamePage {...props} />
            default:
                return null;
        }
    }

    return renderCurrPage(currPage, { socket, setCurrPage, roomId, extra, userId });
}

export default App;
