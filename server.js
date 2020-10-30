//* MAIN SERVER FILE 
const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const bodyParser = require('body-parser');
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const bookRoutes = require('./routes/api')
const connectDB = require('./config/db')
const flash = require('express-flash');

//! Code Begins

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

//* Bring In Mongo Db Connection
connectDB();

//Setting  Up view engine
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.use(flash());


//! Setting up Books Routes
app.use('/', bookRoutes);

app.listen(PORT, () => console.log(`Port Listening on http://localhost:${PORT}`))