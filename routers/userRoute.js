const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/user', async (req, res) => {
    try {
        const user = new User({
            ...req.body,
            encryptedPassword: await bcrypt.hash(req.body.encryptedPassword, 8)
        })
        await user.save()
        res.redirect('/admin/users')
    } catch (error) {
        console.error(error)
        return res.render('error', { title: 'Error', layout: req.app.get('admin-layout') })
    }
})

module.exports = router;