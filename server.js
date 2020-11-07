if (process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv')
    dotenv.config()
}

const express = require('express')
const ejsLayout = require('express-ejs-layouts')
const connectMongo = require('./db');
const methodOverride = require('method-override')

const { getCategories, getFurnitures, getFeedbacks } = require('./functions')

connectMongo();

const app = express()

const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('layout', 'layouts/user-layout')
app.set('admin-layout', 'layouts/admin-layout')


app.use(ejsLayout)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

//Router imports
const contactRouter = require('./routers/contactRoute');
const categoryRouter = require('./routers/categoryRoute')
const furnitureRouter = require('./routers/furnitureRoute')

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
});

//admin routes
app.get('/admin/login', (req, res) => {
    res.render('login', { title: 'Admin Login', mainClass: 'home' })
})

app.get('/admin/home', (req, res) => {
    res.render('admin/admin-home', { title: 'Admin Homepage', layout: app.get('admin-layout') })
})

app.get('/admin/categories', async (req, res) => {
    const categories = await getCategories();
    if (categories.err)
        return res.render('error', { title: 'Error', layout: app.get('admin-layout') })
    return res.render('admin/admin-category', { title: 'Manage Categories', layout: app.get('admin-layout'), categories })
})

app.get('/admin/savecategory', async (req, res) => {
    const message = req.query.message;
    let categories = [];

    const cid = req.query.cid;
    if (cid) {
        categories = await getCategories();
    }
    res.render('admin/admin-savecategory', {
        title: 'Add Category',
        layout: app.get('admin-layout'),
        message,
        category: categories.find(c => c.id === cid)
    })
})

app.get('/admin/furnitures', async (req, res) => {
    const furnitures = await getFurnitures();
    if (furnitures.err)
        return res.render('error', { title: 'Error', layout: app.get('admin-layout') })
    res.render('admin/admin-furniture', { title: 'Manage Furnitures', layout: app.get('admin-layout'), furnitures })
})

app.get('/admin/users', (req, res) => {
    res.render('admin/admin-user', { title: 'Manage Users', layout: app.get('admin-layout') })
})

app.get('/admin/update', (req, res) => {
    res.render('admin/admin-update', { title: 'Manage Updates', layout: app.get('admin-layout') })
})

app.get('/admin/contacts', async (req, res) => {
    const feedbacks = await getFeedbacks();
    if (feedbacks.err)
        return res.render('error', { title: 'Error', layout: app.get('admin-layout') })
    return res.render('admin/admin-contact', { title: 'Manage Contacts', layout: app.get('admin-layout'), feedbacks })
})


app.listen(PORT, console.log(`listening on port ${PORT}`))
