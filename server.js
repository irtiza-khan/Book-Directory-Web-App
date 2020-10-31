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
const session = require('express-session')
const flash = require('express-flash');
const passport = require('passport');

//*Bringing in Passport Js file

require('./config/passport')(passport);


//! Code Begins

const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

//* Bring In Mongo Db Connection
connectDB();

app.use(bodyParser.urlencoded({ extended: false }))

//Setting  Up view engine
app.use(expressLayouts)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')


//*Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))


//Passport Middle Ware
app.use(passport.initialize());
app.use(passport.session());



app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.user = req.user; //global user provided by passport js 
    next();

})


//! Setting up Books Routes
app.use('/', bookRoutes);

app.listen(PORT, () => console.log(`Port Listening on http://localhost:${PORT}`))