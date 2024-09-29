const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json()); // Body parser
// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Middleware to parse application/json


// Import Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Adjusted to match the import
const animalRoutes = require('./routes/animalRoutes');

const ApplicationRoutes=require('./routes/applicationroutes')


// Socket.io setup
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    // Broadcast the message to all connected clients
    io.emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/animals', animalRoutes);

app.use('/api/application',ApplicationRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
