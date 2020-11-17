if (process.env.NODE_ENV !== "production") {
    const dotenv = require('dotenv')
    dotenv.config()
}

const express = require('express')
const ejsLayout = require('express-ejs-layouts')
const connectMongo = require('./db');
const methodOverride = require('method-override')
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose');
const flash = require('express-flash')
const { getCategories, getFurnitures, getFeedbacks, getFurnitureById, getUsers } = require('./functions')

connectMongo();

const app = express()

//configure passport
require('./passport-config')(passport)


const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('layout', 'layouts/user-layout')
app.set('admin-layout', 'layouts/admin-layout')


app.use(ejsLayout)
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))

//Router imports
const contactRouter = require('./routers/contactRoute');
const categoryRouter = require('./routers/categoryRoute')
const furnitureRouter = require('./routers/furnitureRoute')
const userRouter = require('./routers/userRoute')(passport);

/* API Endpoints */
app.use(contactRouter)
app.use(categoryRouter)
app.use(furnitureRouter)
app.use(userRouter)

const checkNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated())
        return next()
    res.redirect('/admin/home')
}

/* Webpage Routes */
app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('home', { title: 'Home', mainClass: 'home' })
})

app.get('/about', checkNotAuthenticated, (req, res) => {
    res.render('about', { title: 'About', mainClass: 'home' })
})

app.get('/faq', checkNotAuthenticated, (req, res) => {
    res.render('faq', { title: 'FAQs', mainClass: 'home' })
})

app.get('/contact', checkNotAuthenticated, (req, res) => {
    res.render('contact', { title: 'Contact', mainClass: 'home' })
})

app.get('/furnitures', checkNotAuthenticated, async (req, res) => {
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
app.get('/admin/login', checkNotAuthenticated, (req, res) => {
    res.render('login', { title: 'Admin Login', mainClass: 'home' })
})

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated())
        return next()
    return res.redirect('/admin/login')
}

app.get('/admin/home', checkAuthenticated, (req, res) => {
    res.render('admin/admin-home', { title: 'Admin Homepage', layout: app.get('admin-layout'), user: req.user })
})

app.get('/admin/categories', checkAuthenticated, async (req, res) => {
    const categories = await getCategories();
    if (categories.err)
        return res.render('error', { title: 'Error', layout: app.get('admin-layout') })
    return res.render('admin/admin-category', { title: 'Manage Categories', layout: app.get('admin-layout'), categories })
})

app.get('/admin/savecategory', checkAuthenticated, async (req, res) => {
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

app.get('/admin/furnitures', checkAuthenticated, async (req, res) => {
    const furnitures = await getFurnitures();
    if (furnitures.err)
        return res.render('error', { title: 'Error', layout: app.get('admin-layout') })
    res.render('admin/admin-furniture', { title: 'Manage Furnitures', layout: app.get('admin-layout'), furnitures })
})

app.get('/admin/savefurniture', checkAuthenticated, async (req, res) => {
    const message = req.query.message;
    const categories = await getCategories();
    let furniture = null;

    if (req.query.fid) {
        furniture = await getFurnitureById(req.query.fid);
    }
    res.render('admin/admin-savefurniture', {
        title: 'Add Furniture',
        layout: app.get('admin-layout'),
        message,
        furniture,
        categories
    })
})

app.get('/admin/users', checkAuthenticated, async (req, res) => {
    const users = await getUsers();
    if (users.err)
        return res.render('error', { title: 'Error', layout: app.get('admin-layout') })
    res.render('admin/admin-user', { title: 'Manage Users', layout: app.get('admin-layout'), users })
})

app.get('/admin/saveuser', checkAuthenticated, async (req, res) => {
    res.render('admin/admin-saveuser', { title: 'Add User', layout: app.get('admin-layout') })
})

app.get('/admin/update', checkAuthenticated, (req, res) => {
    res.render('admin/admin-update', { title: 'Manage Updates', layout: app.get('admin-layout') })
})

app.get('/admin/contacts', checkAuthenticated, async (req, res) => {
    const feedbacks = await getFeedbacks();
    if (feedbacks.err)
        return res.render('error', { title: 'Error', layout: app.get('admin-layout') })
    return res.render('admin/admin-contact', { title: 'Manage Contacts', layout: app.get('admin-layout'), feedbacks })
})

app.get('/admin/logout', checkAuthenticated, (req, res) => {
    req.logout();
    res.redirect('/')
})


app.listen(PORT, console.log(`listening on port ${PORT}`))
