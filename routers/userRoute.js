const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
/** @param {import('passport')} passport */
module.exports = function (passport) {

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
    });

    router.post('/login', passport.authenticate('local', {
        successRedirect: '/admin/home',
        failureRedirect: '/admin/login',
        failureFlash: true
    }))
    return router;
}