const router = require('express').Router()
const Furniture = require('../models/Furniture')
const formidableMiddleware = require('express-formidable')
const path = require('path');

router.post('/furniture',
    formidableMiddleware({ uploadDir: path.join(__dirname, '../', 'public', 'images', 'furniture'), keepExtensions: true }),
    async (req, res) => {
        try {
            const furniture = new Furniture({
                ...req.fields,
                image: path.basename((req.files.image.path))
            })
            await furniture.save();
            res.redirect('/admin/savefurniture?message=Furniture Added')
        } catch (error) {
            console.error(error)
            return res.render('error', { title: 'Error', layout: req.app.get('admin-layout') })
        }
    })

module.exports = router