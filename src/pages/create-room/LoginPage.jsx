import { useState } from "react";
import './create-room.css'

export default function LoginPage(props) {
    const roomList = ['room A', 'room b', 'room c', 'room d', 'r2d2'];
    const [room, setRoom] = useState('');
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
                <input type="text" name="username" required /> <strong>User Name</strong>
            </div>

            <div className="select-box input-box">
                <input type="text" name="username" required value={room} /> <strong>Room Name</strong>
                <ul className="drop-down">
                    {
                        roomList.map((room, index) => {
                            return <li onClick={() => setRoom(room)}>{room}</li>
                        })
                    }
                </ul>
            </div>
            
            <div className="input-box">
                <input type="password" name="username" required /> <strong>Password</strong>
            </div>
            


            <div className="button-container">
                <button className="btn" type="submit">Join Room</button>
            </div>
            <button className="btn-link">Create Room</button>
        </form>
    </div>
</section>
</>
}




// <body>
//   <section> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span>
//     <span></span> <span></span> <span></span> <span></span> <span></span>

//     <div class="signin">

//       <div class="content">

//         <h2>LET'S GO</h2>

//         <form class="form" action="/" method="post">

//           <div class="inputBox">
//             <input type="text" name="userName" required> <i>username</i>
//           </div>
          
//           <div class="dropdown">
//             <div class="dropbtn">Select Room</div>
//             <div class="dropdown-content">
//             <%if (locals.rooms) {%>
//               <% for (var i = 0; i < locals.rooms.length; i++) { %>
//                 <a onclick="selectRoom('<%= i %>')" href="#"><%= locals.rooms[i].name %></a>
//               <% } %>
//               <select style="display: none;" name="roomId" id="roomDropdown">
//                 <% for (var i = 0; i < locals.rooms.length; i++) { %>
//                   <option value="<%= locals.rooms[i].id %>"></option>
//                 <% } %>
//               </select>
//             <% } %>
//             </div>
//           </div>

//           <div class="inputBox">
//             <input type="text" name="password" required> <i>room password</i>
//           </div>

//           <button class="start" type="submit">Join</button>
//           <div class="create-room-text"><a href="/createRoom">Create Room</a></div>
//           <% if (locals.err) { %>
//             <div class="error-text">
//               <%= err %>
//             </div>
//           <% } %>
//         </form>
//       </div>
//     </div>
//   </section>

// </body>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.js"></script>
// <script>
//   const socket = io();
//     socket.on('update', (data) => {
//       location.reload()
//     });
//   function selectRoom(index) {
//         var dropdown = document.getElementById('roomDropdown');
//         var options = dropdown.getElementsByTagName('option');

//         // Uncheck all options
//         for (var i = 0; i < options.length; i++) {
//             options[i].selected = false;
//         }

//         // Check the corresponding option
//         options[index].selected = true;
//   }
// </script>
// </html>