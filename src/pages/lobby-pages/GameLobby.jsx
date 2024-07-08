export default function GameLobby() {
    const roomName = "tarush room";
    const playerList = ['player 1', 'player 2', 'player 3'];
    const creator = 'player 1';
    const errTxt = "this is error text"
    return <>
    <section>
        <div className="center-container">
            <h2 className="title">{roomName}</h2>
            <div className="horizontal-wrapper">
                <ul className="player-list">
                    <li className="player-creator">Owner: <span>{creator}</span></li>
                    { playerList.map((player, index) => {
                        if (player != creator) {
                            return <li key={index}>🎖️{player}</li>
                        }
                    }) }
                </ul>
                <div class="globe">
                    <div class="circle">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            </div>

            <div className="button-container">
                <button className="btn">Start Game</button>
                <button className="btn">Leave Room</button>
            </div>
            <span className="error">
                {errTxt}
            </span>
        </div>
    </section>
    </>
}