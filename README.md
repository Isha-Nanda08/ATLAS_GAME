# Atlas Game

This repository contains the source code for the **Atlas Game**, a React-based web application that allows players to engage in a game of Atlas. The game communicates with a custom-built server via [Socket.IO](https://socket.io/) and uses an API, also created by me, to fetch location data.

## Live Demo

You can play the game live at: [Atlas Game](https://atlas-game.vercel.app)

## Features

- **Real-Time Gameplay**: Communicates with the server using Socket.IO to provide a seamless real-time gaming experience.
- **Multiple Rooms**: Players can create and join multiple game rooms, each running independently.
- **Bot Integration**: Rooms can include up to 1 bot with adjustable difficulty, providing a challenging experience even in solo play.
- **Custom API**: The game fetches location data from a custom-built API to enhance gameplay.

## Technologies Used

- **React**: For building the user interface.
- **Socket.IO**: For real-time communication between the client and server.
- **Custom API**: Provides location data for the game.
- **Vercel**: The game is deployed and hosted on Vercel.

## How to Play

1. **Create or Join a Room**: Players can create a new room or join an existing one.
2. **Invite Friends or Play with a Bot**: Invite friends to the room or add a bot to challenge yourself.
3. **Start the Game**: Once all players are ready, the game can begin.
4. **Gameplay**: Players take turns naming places starting with the last letter of the previous place. The game continues until no player remains.

---

Thank you for checking out the Atlas Game! If you enjoy the game, please consider giving the repository a star ⭐.
