import { useEffect, useState } from 'react'
import './game-page.css'
export default function GamePage({socket, setCurrPage, roomId, extra, userId}) {
    // room name
    // player list
        // player name
        // player is alive - color
        // current player - color
        // player lives
        // player hints
    // input section
        // current ans
        // timer
        // hint btn
        // leave btn
    // game logs
    const [{ roomName, roomStatus, allPlayers, livePlayers, currPlayerId, roomLog }, setGameData] = useState({
        roomName : '',
        roomStatus : true,
        allPlayers : [],
        livePlayers : [],
        currPlayerId : '',
        roomLog : [],
        // also ask: remaining time
    })

    if (roomId === -1) {
        setCurrPage('login-page')
    } else if (!roomStatus) {
        setCurrPage('game-lobby')
    }
    // if room status and live player == 1 => go to winner page
    useEffect(() => {
        console.log('sending game data reuest to server')
        socket.emit('get-running-game-info', { userId })
        socket.on('running-game-info', data => {
            console.log('recieved game info')
            setGameData(data)
        })
        // const timerDiv = document.querySelector('.timer')
        // const intervalId = setInterval(() => {
        //     timerDiv.textContent = 'hllo this is time'
        // }, 1000)

        // return () => {
        //     clearInterval(intervalId)
        // }
    }, [socket])
    return <>
    {/* {roomName, roomStatus, allPlayers, livePlayers, currPlayerId, roomLog} */}
    <section id="game">
        <div id="room-name">
            <h1 className="title">{ roomName }</h1>
        </div>
        <ul id="game-player-list">
            { allPlayers.map((player) => {
                let className = '';
                if (player.id === currPlayerId) {
                    className = 'current'
                } else if (!livePlayers.some(user => user.id === player.id)) {
                    className = 'dead'
                }
                return <li key={player.id} className={className}>
                    <span className="name">{player.name}</span>
                    <span className="lives">lives: {player.lives}</span>
                    <span className="hints">hints: {player.hints}</span>
                </li>
            }) }
        </ul>
        <div className="game-container">
            {/* <div className="left">
                
            </div> */}
            <div className="middle">
                {/* This portion is for map!! */}
            </div>
            <div className="right">
                <div>
                    <h2 className="title">Room History</h2>
                    <ul>
                    { roomLog.map(log => (
                            <li>{log}</li>
                    ))}
                    </ul>
                </div>

                <form action="" className={userId === currPlayerId? "unlocked" : "locked"}>
                    {/* prev ans */}
                    {/* current letter */}
                    <span className="prevAns">previous ans: <span>Asia</span></span>
                    <span className="currentWord">current letter: <span>a</span></span>
                    <span className="timer">time left: <span>15:00</span></span>
                    {
                        userId === currPlayerId? 
                        <>
                            <div className="input-box">
                                <input type="text" name="answer" id="answer" required />
                                <strong>answer</strong>
                            </div>
                            <div className="button-container">
                                <button className="btn">Hint</button>
                                <button className="btn">Submit</button>
                            </div>
                        </>
                        : <>
                        <h2 className="title">Not Your turn</h2>
                        </>
                    }
                    {/* <button className="btn-link">Leave Game</button> */}
                </form>
            </div>
        </div>
    </section>
    </>
}