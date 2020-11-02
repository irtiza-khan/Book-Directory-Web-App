const express = require('express');
const router = express.Router();
const Book = require('../modal/book');
const multer = require('multer')
const Noty = require('noty');


//Using multer package to handle file 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        console.log(file)
        cb(null, file.originalname) // i can also try file.originalname to get original name of the file
    }
})

let uploads = multer({
        storage,
    }).single('file') //this is the name from front


//TODO: FILE UPLOAD NOT WORKING req.file is returning null google the answer

router.post('/test', (req, res) => {

    const { name, type, language, author, publisher } = req.body;

    uploads(req, res, (err) => {
        if (!req.file) {

            req.flash('error', 'Please Upload A file')
            return res.render('addBook');

        }

        if (req.file) {
            req.body.file = req.file.filename;
        }
        if (err) {
            req.flash('error', "Something Went Wrong  ");
            return res.redirect('/book');
        }
        Book.findOne({ name: req.body.name })
            .then(book => {
                if (book) {
                    req.flash('error', 'Book Already In Database')
                    return res.render('addBook')
                } else {

                    const newBook = new Book(req.body)
                    newBook.save()
                        .then((result) => {
                            console.log('Book Save In Database' + result)
                                // new Noty({
                                //     type: 'success',
                                //     layout: 'top Right',
                                //     timeout: 1000,
                                //     progressBar: false,
                                //     theme: 'sunset',
                                //     text: 'Book Add To Database'
                                // }).show();
                            req.flash('success', 'Book Has Been Added in Database');
                            res.redirect('/');
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })



    })

})


router.get('/', (req, res) => {
    res.render('addBook');
})





module.exports = router;