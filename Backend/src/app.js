const express = require('express');
const AuthRoutes = require('./Router/AuthRoutes');
const NotesRoutes = require('./Router/NotesRoutes');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', AuthRoutes);
app.use('/api/notes', NotesRoutes);

module.exports = app;
