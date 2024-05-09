const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // Importa el paquete cors
const crypto = require('crypto');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');
const notificationsRouter = require('./routes/notifications');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Habilita CORS
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true
}));

// Configura el middleware de sesión con una clave secreta generada automáticamente
app.use(session({
  secret: crypto.randomBytes(32).toString('hex'), // Genera una clave secreta aleatoria
  resave: false,
  saveUninitialized: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);
app.use('/notifications', notificationsRouter); 

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

module.exports = app;
