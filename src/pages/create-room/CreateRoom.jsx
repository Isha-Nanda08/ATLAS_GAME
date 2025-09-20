import { useEffect, useState } from 'react'
import './create-room.css'
export default function CreateRoom({socket, setCurrPage, roomId, extra, userId}) {
    useEffect(() => {
        if (roomId !== -1) {
            setCurrPage('game-lobby')
        }
    }, [roomId])
    
    const [needBot, setNeedBot] = useState(false);

    const createRoom = (event) => {
        event.preventDefault();
        const userName = document.getElementById("username").value
        const password = document.getElementById('password').value;
        const roomName = document.getElementById('roomname').value;
        const botDifficulty = parseInt(document.getElementById('botDifficulty').value) || 0;
        // const publicRoom = document.getElementById('publicRoom').checked;
        const enableBot = document.getElementById('enableBot').checked;

        if (userName !== '' && password !== '' && roomName !== '') {
            const data = {
                userName, password, roomName, botDifficulty,  enableBot //, publicRoom
            }
    
            console.log("sending create room request with given data", data)
            socket.emit('create-new-room', {...data, userId})
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
                <h2 className="title">Create New Room</h2>
                <form action="" className='signin'>
                    <div className="input-box">
                        <input type="text" autoComplete='off' id="username" required /> <strong>User Name</strong>
                    </div>

                    <div className="input-box">
                        <input type="text" autoComplete='off' id="roomname" required /> <strong>Room Name</strong>
                    </div>
                    
                    <div className="input-box">
                        <input type="password" autoComplete='off' id="password" required /> <strong>Password</strong>
                    </div>
                    
                    <div className="check-box">
                        {/* <i> <input type="checkbox" id="publicRoom" name="publicRoom" /> Do you want to make room public?</i> */}
                        <i> 
                            <input type="checkbox" id="enableBot" name="enableBot" checked={needBot} onClick={(e) => { setNeedBot(!needBot) }} /> 
                            <label htmlFor="enableBot"> Do you want to include bot?</label>
                        </i>
                    </div>

                    <div className={needBot? "input-box" : "hide input-box"}>
                        <input type="text" autoComplete='off' id="botDifficulty" min="1" max="100" required /> <strong>Difficulty (in %)</strong>
                    </div>

                    <div className="button-container">
                        <button className="btn" type="submit" onClick={(event) => createRoom(event)}>Create Room</button>
                    </div>
                    <button className="btn-link" type='button' onClick={() => setCurrPage('login-page')}>Join Room</button>
                </form>
                <p className="error"> {extra.error} </p>
            </div>
        </section>
    </>
}