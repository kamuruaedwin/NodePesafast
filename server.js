const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const socket = new WebSocket('ws://localhost:3000')
const wss = new WebSocket.Server({ server });

// when server and clients running on different domains
const cors = require('cors');
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const canvas = createCanvas(800, 400);
const context = canvas.getContext('2d');

// ... (rest of your server-side logic remains unchanged)

// WebSocket logic
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    // Handle WebSocket messages from clients
  });

  // Send initial data to the client (if needed)
  // For example, you can send the burst value and hash value
  ws.send(JSON.stringify({ burst_value: burst_value, hashvalue: hashvalue }));
});


const animationDuration = 280000;
let animationStartTime;
let animationIsRunning = true;
let randomStopTime = Math.random() * 280000;


const drawGraph = () => {
  const currentTime = Date.now();
  if (!animationStartTime) {
    animationStartTime = currentTime;
  }
  const elapsedTime = currentTime - animationStartTime;

  const progress = Math.min(1, elapsedTime / animationDuration);
  const value = 1 + progress * (elapsedTime / 1000);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'orange';
  context.fillRect(50, 50, value * 10, 30); // Adjust the graph drawing as needed

  if (elapsedTime >= randomStopTime || (progress >= 1 && animationIsRunning)) {
    stopAnimation(value);
  } else if (animationIsRunning) {
    setTimeout(drawGraph, 1000);
  }
};

const stopAnimation = (value) => {
  animationIsRunning = false;
  console.log(`BURST! ${value.toFixed(2)}`);

  randomStopTime = Math.random() * 280000;

  setTimeout(() => {
    startAnimation();
  }, 3000);
};

const startAnimation = () => {
  animationStartTime = null;
  animationIsRunning = true;
  drawGraph();
};

startAnimation();

// Save canvas as an image (optional)
const out = fs.createWriteStream(__dirname + '/graph.png');
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on('finish', () => console.log('The PNG file was created.'));
