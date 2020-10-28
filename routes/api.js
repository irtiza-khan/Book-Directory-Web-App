const express = require('express');
const router = express.Router();


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
    res.render('book');
})
module.exports = router