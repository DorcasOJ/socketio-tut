import { io } from "socket.io-client";

// const messageButton = document.getElementById('send-button');
const roomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const socket = io("http://localhost:3000/");
const userSocket = io("http://localhost:3000/user", {auth: {token: 'test'}})
userSocket.on('connect_error', error => {
  displayMessage(error)
})

socket.on('connect', ()=> {
    displayMessage(`You connected with id ${socket.id}`)
})

socket.on('receive-message', message=> {
    displayMessage(message, socket.id)
})

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;

  if (message === "") return;
  displayMessage(message, socket.id);
  socket.emit('send-message', message, room)

  messageInput.value = "";
});

roomButton.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit('join-room', room, message => {
    displayMessage(message, socket.id)
  });
});

function displayMessage(message, id=null) {
  const div = document.createElement("div");
  div.textContent = message;
  if(id) {
    div.innerHTML = `<span>${id}:</span> ${message}`
  }
  document.querySelector(".message-container").append(div);
}

document.addEventListener('keydown', e=> {
  if(e.target.matches('input')) return
  if(e.key === 'c') socket.connect()
  if(e.key === 'd') socket.disconnect()
})

let count =0;
setInterval(()=> {
  socket.volatile.emit('ping', ++count)
}, 1000)