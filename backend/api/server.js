const express = require('express');
const cors = require('cors');
const mongoRoutes = require('./routes/mongoRoutes');
const ftceventsRoutes = require('./routes/ftceventsRoutes');

let PORT;

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    PORT = process.env.PORT || 5000;
}

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
    ? ['https://ftc-master.vercel.app', 'https://www.ftcmaster.org', 'https://ftcmaster.org']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api', mongoRoutes);
app.use('/api', ftceventsRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }); 
}


module.exports = app;