require('dotenv').config();
const dns = require('node:dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const socketManager = require('./src/sockets/socketManager');

const app = express();
const server = http.createServer(app);

connectDB();

app.use(helmet());
app.use(morgan('dev'));

// Allow Netlify frontend to connect in production
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: clientOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    methods: ["GET", "POST"]
  }
});

socketManager(io);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Production Server running on port ${PORT}`);
});
