const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// Serve static frontend files
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Main route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Load routes
try {
  const disasterRoutes = require('./routes/disasters');
  const geocodeRoutes = require('./routes/geocode');
  const resourceRoutes = require('./routes/resources');
  const imageVerifyRoutes = require('./routes/verifyImage');
  const socialRoutes = require('./routes/socialMedia');
  const updatesRoutes = require('./routes/officialUpdates');

  app.use('/api/disasters', disasterRoutes);
  app.use('/api/geocode', geocodeRoutes);
  app.use('/api/resources', resourceRoutes);
  app.use('/api/verify-image', imageVerifyRoutes);
  app.use('/api/social-media', socialRoutes);
  app.use('/api/official-updates', updatesRoutes);
} catch (err) {
  console.error("Error loading routes:", err.message);
}

// WebSocket setup
io.on('connection', (socket) => {
  console.log('🟢 User connected');
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
