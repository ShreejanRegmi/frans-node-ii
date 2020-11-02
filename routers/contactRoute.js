const router = require('express').Router();
const Contact = require('../models/Contact');

router.post('/contact', async (req, res) => {
    delete req.body.send
    try {
        const contact = new Contact(req.body);
        await contact.save();
        return res.render('contact', { title: 'Contact', mainClass: 'home', message: 'Feedback Registered!' })
    } catch (error) {
        console.error(error)
        return res.render('contact', { title: 'Contact', mainClass: 'home', message: 'Error. Please try again later' })
    }
})

module.exports = router;