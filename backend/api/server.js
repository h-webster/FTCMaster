const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

let PORT;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  PORT = process.env.PORT || 5000;
}

//const mongoRoutes = require('./routes/mongoRoutes');
const ftceventsRoutes = require('./routes/ftceventsRoutes');
const eventRoutes = require('./routes/eventRoutes');
const teamRoutes = require('./routes/teamRoutes');
const ftcscoutRoutes = require('./routes/ftcscoutRoutes');
const oprRoutes = require('./routes/OPRRoutes');
const openApiRoutes = require('./routes/openApiRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
    ? ['https://ftc-master-b59g.vercel.app', 'https://www.ftcmaster.org']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// Routes (each route file handles its own database connection)
//app.use('/api', mongoRoutes);
app.use('/api', ftceventsRoutes);
app.use('/api', eventRoutes);
app.use('/api', teamRoutes);
app.use('/api', ftcscoutRoutes);
app.use('/api', oprRoutes);
app.use('/api', openApiRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }); 
}

module.exports = app;