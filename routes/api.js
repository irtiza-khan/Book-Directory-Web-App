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
    }).single('myfile') //this is the name from front end 




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

router.get('/book', (req, res) => {
    res.render('addBook');
})


//Adding a Book To Data Base 
router.post('/book', (req, res) => {
    //TODO: This route is not Working need to delete joi and add simple validation  and check for file system

    uploads(req, res, async(err) => {

        const { name, type, language, author, publisher } = req.body;
        if (!req.file) {
            req.flash('error', "Please Upload a file ");
            return res.status(400).render('addBook');
        }
        if (err) {

            req.flash('error', "Something Went Wrong With File Upload ");
            return res.status(400).render('addBook')

        }
        //Bring in joi Validation 
        const schema = Joi.object({
            name: Joi.string().min(3).max(20).required(),
            type: Joi.string().min(3).max(20).required(),
            language: Joi.string().min(3).max(20).required(),
            author: Joi.string().min(3).max(20).required(),
            publisher: Joi.string().min(3).max(20).required(),
        })


        //Now Validating My Result 
        const { error } = schema.validate({
            name,
            type,
            language,
            author,
            publisher
        });

        if (error) {

            req.flash('error', "All The Fields Are Required ");
            return res.render('addBook');

        } else {
            //Save book to Data Base
            Book.findOne({ name: name })
                .then(book => {
                    if (book) {

                        req.flash('error', "Book is already Present in database ");
                        return res.render('addBook');
                    } else {
                        const newBook = new Book({
                            name,
                            type,
                            language,
                            author,
                            publisher,
                            file: req.file.filename
                        })
                        console.log(newBook);
                        newBook.save()
                            .then(result => {
                                req.flash('success', 'Book Added To The Database ')
                                return res.redirect('/')
                            })
                            .catch(err => {

                                req.flash('error', 'Book Didnot added in database something went wrong')
                                return res.render('addBook')

                            })

                    }

                })

        }


    })




})

router.post('/add-book', (req, res) => {
    console.log(res.body);
    return res.json({ 'message': 'Nothing occured' });
})


router.post('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login');
})
module.exports = router