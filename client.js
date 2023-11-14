// client.js
const canvas = document.getElementById('chart-container');
const context = canvas.getContext('2d');

const socket = new WebSocket('ws://localhost:3000'); // Connect to your server

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  // Update the client-side canvas based on the data received from the server
  // You may need to implement drawing logic here
});
