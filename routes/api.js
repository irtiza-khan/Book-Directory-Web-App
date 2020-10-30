const express = require('express');
const router = express.Router();
const Book = require('../modal/book');
const Joi = require('joi');
const multer = require('multer')
const path = require('path')

//Using multer package to handle file 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()) // i can also try file.originalname to get original name of the file
    }
})

let uploads = multer({
        storage,
        limits: { fileSize: 1000000 * 300 } //300 mb file size
    }).single('myfile') //this is the name from front end 




router.get('/', (req, res) => {
    res.status(200).render('home');
})



router.get('/login', (req, res) => {
    res.render('login');
})


router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/book', (req, res) => {
    res.render('addBook');
})


//Adding a Book To Data Base 
router.post('/book', (req, res) => {

    uploads(req, res, async(err) => {

        const { name, type, language, author, publisher, file } = req.body;
        if (!req.file) {
            req.flash('error', "Please Upload a file ");
            return res.status(400).redirect('addBook');
        }
        if (err) {

            req.flash('error', "Something Went Wrong With File Upload ");
            return res.status(400).redirect('addBook');

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
            return res.redirect('/addBook');

        } else {
            //Save book to Data Base

        }


    })




})

router.post('/add-book', (req, res) => {
    console.log(res.body);
    return res.json({ 'message': 'Nothing occured' });
})
module.exports = router