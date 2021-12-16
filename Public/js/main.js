/** @format */

const chatForm = document.getElementById("chat-form");
const chatMessagesDiv = document.querySelector(".chat-messages");

//get username and room

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

const socket = io();

//join room

socket.emit("joinRoom", { username, room });

//message from server
socket.on("message", (msg) => {
  console.log(msg);
  outputMessage(msg);
  chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
});

//Text Submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get the text from input
  const text = e.target.elements.msg.value;

  //emit text to server
  socket.emit("chatMessage", text);

  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//Output the message to dom

outputMessage = (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.userName} <span>${msg.time}</span></p>
    <p class="text">
      ${msg.text}
    </p>`;

  document.querySelector(".chat-messages").appendChild(div);
};
