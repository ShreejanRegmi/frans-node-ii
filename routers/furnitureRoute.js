const router = require('express').Router()
const Furniture = require('../models/Furniture')

router.post('/furniture', async (req, res) => {
    try {
        const furniture = new Furniture(req.body)
        await furniture.save()
        return res.send(furniture)
    } catch (error) {
        console.error(error)
        return res.send(error)
    }
})

module.exports = router