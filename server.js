if (process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv')
    dotenv.config()
}

const express = require('express')
const ejsLayout = require('express-ejs-layouts')
const connectMongo = require('./db');

//Router imports
const contactRouter = require('./routers/contactRoute');
const categoryRouter = require('./routers/categoryRoute')
const furnitureRouter = require('./routers/furnitureRoute')

const { getCategories, getFurnitures } = require('./functions')

connectMongo();

const app = express()

const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('layout', 'layouts/user-layout')
//app.set('admin-layout', 'layouts/admin-layout')

app.use(ejsLayout)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))


/* API Endpoints */
app.use(contactRouter)
app.use(categoryRouter)
app.use(furnitureRouter)

/* Webpage Routes */
app.get('/', (req, res) => {
    res.render('home', { title: 'Home', mainClass: 'home' })
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About', mainClass: 'home' })
})

app.get('/faq', (req, res) => {
    res.render('faq', { title: 'FAQs', mainClass: 'home' })
})

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact', mainClass: 'home' })
})

app.get('/furnitures', async (req, res) => {
    const categories = await getCategories();
    let furnitures;

    if (req.query.category)
        furnitures = await getFurnitures({ category: req.query.category })
    else
        furnitures = await getFurnitures({});

    if (categories.err || furnitures.err)
        return res.render('error', { title: 'Error', mainClass: 'home' })

    res.render('furnitures', {
        title: 'Furnitures',
        mainClass: 'admin',
        categories, furnitures,
        category: categories.find(c => c._id == req.query.category)
    })
})

app.listen(PORT, console.log(`listening on port ${PORT}`))