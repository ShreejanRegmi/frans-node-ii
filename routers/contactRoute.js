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

router.put('/contact/:id', async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, { seen: 'yes' })
        return res.redirect('/admin/contacts')
    } catch (error) {
        console.error(error)
        return res.render('error', { title: 'Error', layout: req.app.get('admin-layout') })
    }
})

module.exports = router;