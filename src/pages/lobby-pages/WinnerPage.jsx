import { useEffect, useState } from 'react';
import './lobby.css'
export default function WinnerPage({ socket, setCurrPage, roomId, userId, setRoomId }) {
    const [{ roomName, roomStatus, allPlayers, livePlayers, creator }, setGameData] = useState({
        roomName : '',
        roomStatus : true,
        allPlayers : [],
        livePlayers : [{name: ''}],
        creator: {id: '', name: ''}
    })

    useEffect(() => {
        if (roomId === -1) {
            setCurrPage('login-page')
        } else if (!roomStatus) {
            setCurrPage('game-lobby')
        } else if (livePlayers.length != 1) {
            setCurrPage('game-page')
        }
    }, [roomId, roomStatus, livePlayers])

    const playAgain = () => {
        socket.emit('restart-room', { userId })
    }
    const leaveRoom = () => {
        socket.emit('leave-running-room', { userId })
        setRoomId(-1)
    }

    useEffect(() => {
        console.log('sending game data reuest to server')
        
        socket.emit('get-running-game-info', { userId })

        socket.on('running-game-info', data => {
            console.log('recieved running-game-info')
            console.log(data.creator)
            setGameData(data)
        })

        return () => {
            socket.off('running-game-info')
        }
    }, [socket, userId])

    return <>
    <section id="lobby-section">
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
        <div className="center-container">
            <div className="gif-container">
                <img src="/celeb.gif" className="celeb" alt=""/>
                <img src="/output-onlinegiftools.gif"  className="bunny-dance" alt=""/>
                <img src="/djsaur.gif" className="djsaur-dance" alt=""/>
            </div>
            <h2 className="title">{roomName}</h2>
            <div className="player-winner">Winner: <p>{livePlayers[0].name}</p></div>
            <div className="horizontal-wrapper">
                <ul className="player-list">
                    <li className="player-creator">Owner: <p>{creator.name}</p></li>
                    { allPlayers.map((player, index) => {
                        if (player.id != creator.id) {
                            return <li key={index}>🎖️{player.name}</li>
                        }
                    }) }
                </ul>
                <div className="trophy">
                    <img src="/trophy.gif" alt="" />
                </div>
            </div>

            <div className="button-container">
                { 
                    userId === creator.id && 
                    <button className="btn" onClick={() => playAgain()}>Play Again</button>
                }
                <button className="btn" onClick={() => leaveRoom()}>Leave Room</button>
            </div>
            <p className="error">
                {/* {errTxt} */}
            </p>
        </div>
    </section>
    </>
}