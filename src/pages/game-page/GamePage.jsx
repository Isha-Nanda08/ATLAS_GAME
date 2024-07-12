import { useEffect, useState } from 'react'
import './game-page.css'
export default function GamePage({socket, setCurrPage, roomId, userId}) {
    const [{ roomName, roomStatus, allPlayers, livePlayers, currPlayerId, roomLog, prevAns, remainingTime, currPlayerHints }, setGameData] = useState({
        roomName : '',
        roomStatus : true,
        allPlayers : [],
        livePlayers : [],
        currPlayerId : '',
        roomLog : [],
        prevAns : '',
        remainingTime: 0, 
        currPlayerHints: 0
    })

    useEffect(() => {
        if (roomId === -1) {
            setCurrPage('login-page')
        } else if (!roomStatus) {
            setCurrPage('game-lobby')
        } else if (livePlayers.length == 1) {
            setCurrPage('winner-page')
        }
    }, [roomId, roomStatus, livePlayers])

    const sendAns = (event) => {
        event.preventDefault()
        const ans = document.getElementById("answer").value;
        if (ans != '') {
            socket.emit('my-game-input', { ans, userId })
        }
    }
    const getHint = () => {
        console.log('sending hint request to user')
        socket.emit('get-game-hint', { userId })
    }
    useEffect(() => {
        if (socket) {
            console.log('sending game data reuest to server')
            
            socket.emit('get-running-game-info', { userId })
    
            socket.on('running-game-info', data => {
                console.log('recieved game info')
                setGameData(data)
            })
    
            socket.on('your-game-hint', data => {
                console.log('hint received: ', data.ans)
                alert(`your hint: ${data.ans}`);
            })
        }
        

        return () => {
            if (socket) {
                socket.off('running-game-info');
                socket.off('your-game-hint');
            }
        };
    }, [socket, userId])

    useEffect(() => {
        const timerDiv = document.querySelector('.timer span')
        let time = remainingTime;
        const updateTimer = () => {
            if (time >= 0) {
                const minutes = Math.floor(time / 60);
                const seconds = time % 60;
                timerDiv.textContent = ` ${minutes} : ${seconds < 10 ? '0' : ''}${seconds}`;
                time -= 1;
            } else {
                clearInterval(intervalId);
            }
        };
        const intervalId = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(intervalId);
    }, [remainingTime, roomLog])

    return <>
    <section id="game">
        <div id="room-name">
            <h1 className="title">{ roomName }</h1>
        </div>
        {/* <ul id="game-player-list">
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
        </ul> */}
        <div className="game-container">
            <div className="left">
                <div className='float-box'>
                    <h2 className="title">Player List</h2>
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
                                <span className="lives">lives: {player.lives} hints: {player.hints}</span>
                            </li>
                        }) }
                    </ul>
                </div>
            </div>
            <div className="middle">
                <img src="map.svg" alt="" />
            </div>
            <div className="right">
                <div className='float-box'>
                    <h2 className="title">Room History</h2>
                    <ul>
                    { roomLog.map((log, index) => (
                            <li key={index}>{log}</li>
                    ))}
                    </ul>
                </div>

                <form action="" className="float-box">
                    <span className="prevAns">previous ans: <span>{prevAns}</span></span>
                    <span className="currentWord">current letter: <span>{prevAns.charAt(prevAns.length - 1)}</span></span>
                    <span className="timer">time left: <span>15:00</span></span>
                    {
                        userId === currPlayerId && remainingTime - 2 >= 0? 
                        <>
                            <div className="input-box">
                                <input type="text" name="answer" id="answer" required />
                                <strong>answer</strong>
                            </div>
                            <div className="button-container">
                                <button className={currPlayerHints>0?"btn":"btn disabled"} onClick={() => getHint()} type='button'>Hint</button>
                                <button className="btn" type='submit' onClick={(event) => sendAns(event)}>Submit</button>
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