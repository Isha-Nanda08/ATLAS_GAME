import './game-page.css'
export default function GamePage(params) {
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
    const roomName = "taruh room"
    const playerList = [
        'a', 'b', 'c', 'd', 'e',
        'a', 'b', 'c', 'd', 'e',
        'a', 'b', 'c', 'd', 'e',
        'a', 'b', 'c', 'd', 'e',
        'a', 'b', 'c', 'd', 'e',
    ]
    return <>
    <section id="game">
        <div id="room-name">
            <h1 className="title">{roomName}</h1>
        </div>
        <ul id="game-player-list">
            {playerList.map((player) => {
                return <li key={player} className="">
                    <span className="name">{player}</span>
                    <span className="lives">lives: 2</span>
                    <span className="hints">hints: 2</span>
                </li>
            })}
            <li className="current">
                <span className="name">hloo</span>
                <span className="lives">lives: 2</span>
                <span className="hints">hints: 2</span>
            </li>
            <li className="dead">
                <span className="name">hloo</span>
                <span className="lives">lives: 2</span>
                <span className="hints">hints: 2</span>
            </li>
        </ul>
        <div className="game-container">
            <div className="left">
                {/* this portion is for game logs!! */}
                {/* prev ans */}
                {/* prev turn */}
                {/* current letter */}
                {/* current turn */}
                {/* next turn */}
            </div>
            <div className="middle">
                {/* This portion is for map!! */}
            </div>
            <div className="right">
                <form action="" className="unlocked">
                    <span className="timer"></span>
                    <input type="text" name="answer" id="answer" placeholder="answer" />
                    <div className="button-container">
                        <button className="btn">Hint</button>
                        <button className="btn">Submit</button>
                    </div>
                    <button className="btn-link">Leave Game</button>
                </form>
            </div>
        </div>
    </section>
    </>
}