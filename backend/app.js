const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // Importa el paquete cors

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Habilita CORS
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notes', notesRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Aplicación Express escuchando en el puerto ${port}`);
});

module.exports = app;
