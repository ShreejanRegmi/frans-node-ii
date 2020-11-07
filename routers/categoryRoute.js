const router = require('express').Router();
const Category = require('../models/Category')

router.get('/category', async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.send(categories)
    } catch (error) {
        console.error(error)
        return res.send(error)
    }
})

router.post('/category', async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        return res.send(category);
    } catch (error) {
        console.error(error)
    }
})

router.post('/savecategory', async (req, res) => {
    try {
        const category = new Category(req.body)
        await category.save();
        res.redirect('/admin/savecategory?message=Added Successfully')
    } catch (error) {
        console.error(error)
        res.redirect('/admin/savecategory?message=Error! Please try again later')
    }
})

module.exports = router