// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link rel="stylesheet" href="style/game-room.css">
//     <title>Game-room</title>
// </head>
// <body>
//     <section>
//     <div class="content">
//         <div class="selected-room">
//             <p><span><%= roomName %></span></p>
//         </div>
//         <div class="players">
//             <div class="player-info">
//             <p class="created">created by: <span>🎖️<%= creator %></span></p>
//             <div class="player-list">
//                 <% for (let i=0; i<players.length; i++) { %>
//                     <ul>🎖️<%= players[i] %></ul>
//                 <% } %>
//             </div>
//         </div>
//             <div class="globe">
//                 <div class="circle">
//                     <div></div>
//                     <div></div>
//                     <div></div>
//                     <div></div>
//                 </div>
//             </div>
        
//         </div>
//         <div class="error-text">
//             <%= error %>
//         </div>
//         <form class="buttons" action="/lobby" method="post">
//             <% if (isCreator) { %>
//                 <button class="start-game" name="action" type="submit" value="start">start</button>
//             <% } %>
//             <button class="leave-room" name="action" type="submit" value="leave">leave room</button>
//         </div>
//     </div>
// </section>
// </body>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.js"></script>
// <script>
//     const socket = io();
//     socket.on('update', (data) => {
//       location.reload()
//     });
//   </script>
// </html>