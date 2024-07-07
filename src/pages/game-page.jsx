// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link rel="stylesheet" href="style/game-page.css">
//     <title>Game Page</title>
// </head>
// <body>
//     <div class="main-content">
//         <div class="container1"></div>
//         <h1>ATLAS-MANIA</h1>
//         <div class="player-info">
//             <ul>
//                 <% for (let i=0; i<allPlayers.length; i++) { %>
//                     <% let currentPlayer = allPlayers[i]; %>
//                     <% if (currentPlayer.ip == livePlayers[currPlayer].ip) { %>
//                         <li class="player-active">
//                     <% } else { %>
//                         <li>
//                     <% } %>

//                         <p class="nameP">🎖️<%= currentPlayer.name %>
//                             <div class="status">
//                                 <!-- DEAD PLAYER -->
//                                 <% if (!livePlayers.some(player => currentPlayer.name != "Atlas-AI" && player.ip == currentPlayer.ip)) { %>
//                                     🚩
//                                 <% } %>
//                             </div>
//                         </p>
//                         <p>❤️<%= currentPlayer.lives %> lives</p>  
//                         <button class="on ">💡Hints(<%= currentPlayer.hints %>)</button>
//                     </li>
//                 <% } %>
//             <ul>
                
//         </div>
        
        
//         <div class="fun-fact">
//             <p class="room-name"><%= name %></p>
//             <p><span class="prev-player">next-player: <%= livePlayers[(currPlayer+1)%livePlayers.length].name %></span> <span class="prev-word">
//                 word spoken: <span><%= currWord %></span></span></p>
//             <p><span class="current-player">current-player: <%= livePlayers[currPlayer].name %> </span> <span class="current-alpha">current alphabet :</p>
//                 <div id="timer-box">time left: <span class="time">
                    
//                 </span></div>
//             <p class="alpha"><%= currWord[currWord.length - 1] %></p>
//             <% if (hasTurn) { %>
//                 <form class="box-in" action="/game" method="post">
//                     <input placeholder="enter region " class="input-count" name="locationInp" type="text">
                    
//                     <p><button type="submit" name="action" class="submit" value="submit">submit
//                         <span class="first"></span>
//                         <span class="second"></span>
//                         <span class="third"></span>
//                         <span class="fourth"></span>
//                     </button>
//                     <% if (livePlayers[currPlayer].hints > 0) { %>
//                     <button class="submit" type="submit" name="action" value="hint">hint
//                         <span class="first"></span>
//                         <span class="second"></span>
//                         <span class="third"></span>
//                         <span class="fourth"></span>
//                     </button>
//                     <% } %>
//                 </p>
//             </from>
//             <% } %>
//             <!-- <div class="leave-btn"><button class="leave">leave-room</button></div> -->
//         </div>

//         <div class="map-svg">
//             <%- include("svgs/world 1.ejs") %>
//         </div>
//         <div class="current-loc">
//             <%=  roomLog %>
//         </div>
//     </div>
// </body>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.js"></script>
// <script>
//     const socket = io();
//     socket.on('update', (data) => {
//         console.log("update request recieved from client")
//         location.reload()
//     });

//     const url = window.location.href;
//     const urlObj = new URL(url);
//     const hint = urlObj.searchParams.get('hint');

//     window.onload = () => {
//         if (hint) {
//             alert(hint)
//         }
//     }

//     const timeDiv = document.querySelector(".time")

// </script>
// </html>