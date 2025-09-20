import { useEffect, useState } from "react";
import './create-room.css'

export default function LoginPage({socket, setCurrPage, roomId, extra, userId}) {
    useEffect(() => {
        if (roomId !== -1) {
            setCurrPage('game-lobby');
        }
    }, [roomId])
    const [room, setRoom] = useState('');
    const [roomList, setRoomList] = useState([]);

    useEffect(() => {
        if (socket) {
            socket.emit('get-room-list', {userId});
            socket.on('room-list', (data) => {
                setRoomList(data);
            })
        }

        return () => {
            if (socket) {
                socket.off('room-list')
            }
        }
    }, [socket, userId])

    const joinRoom = (event) => {
        event.preventDefault();
        const userName = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (userName !== '' && password !=='' && room !=='') {
            console.log('sending join room request with data: ', {id: room.id, userName, password, userId })
            socket.emit('join-room', {id: room.id, userName, password, userId });
        }
    }

    return <>
    <section id="create-room-section">
    <>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
        <span></span> <span></span> <span></span> <span></span> <span></span>
    </>

    <div className="create-room-container center-container">
        <h2 className="title">Join Room</h2>
        <form action="" className='signin'>
            <div className="input-box">
                <input type="text" autoComplete='off' id="username" required /> <strong>User Name</strong>
            </div>

            <div className="select-box input-box">
                <input type="text" autoComplete='off' id="room" required value={room.name} /> <strong>Room Name</strong>
                <ul className="drop-down">
                    {
                        roomList.map((room, index) => {
                            return <li onClick={() => setRoom(room)} key={index}>{room.name}</li>
                        })
                    }
                </ul>
            </div>
            
            <div className="input-box">
                <input type="password" autoComplete='off' id="password" required /> <strong>Password</strong>
            </div>

            <div className="button-container">
                <button className="btn" type="submit" onClick={(event) => {joinRoom(event)}}>Join Room</button>
            </div>
            <button className="btn-link" onClick={() => setCurrPage("create-room")}>Create Room</button>
        </form>
        <p className="error"> {extra.error} </p>
    </div>

    <div className="cc"
        onClick={() => window.open('https://opengameart.org/content/platformer-game-music-pack', '_blank')}>
        Music By: CodeManu [https://opengameart.org/content/platformer-game-music-pack]
    </div>
</section>
</>
}