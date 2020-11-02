const express = require('express');
const router = express.Router();
const Book = require('../modal/book');
const User = require('../modal/user');
const Joi = require('joi');
const multer = require('multer')
const bcrypt = require('bcrypt')
const passport = require('passport');
const path = require('path');
const { ensureAuthenticate } = require('../config/auth');

//Using multer package to handle file 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname) // i can also try file.originalname to get original name of the file
    }
})

let uploads = multer({
        storage,
        limits: { fileSize: 1000000 * 300 } //300 mb file size
    }).single('file') //this is the name from front end 



//*Sending Books Data to the home page 
router.get('/', async(req, res) => {

    const books = await Book.find();
    res.status(200).render('home', { books });
})



router.get('/login', (req, res) => {
    res.render('login');
})

//login routes
router.post('/login', ensureAuthenticate, (req, res, next) => {
    const { email, password } = req.body

    if (!email, !password) {
        req.flash('error', "All The Fields Are Required ");
        return res.render('login');
    }
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
});




router.get('/register', (req, res) => {
    res.render('register');
})


router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        req.flash('error', "All The Fields Are Required ");
        return res.render('register', {
            name,
            email,
            password
        });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {

                    req.flash('error', "Email Already Registered");
                    return res.render('register', {
                        name,
                        email,
                        password
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,

                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(result => {
                                    req.flash('success', 'User Registered');
                                    res.redirect('/login')
                                })
                                .catch(err => {
                                    console.log(err);
                                })

                        })
                    })

                }
            })
    }
})



router.post('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login');
})



module.exports = router