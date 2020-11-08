const Category = require('./models/Category');
const Contact = require('./models/Contact');
const Furniture = require('./models/Furniture');
const User = require('./models/User');

const getCategories = async () => {
    try {
        const categories = await Category.find({});
        return categories
    } catch (error) {
        console.error(error)
        return { err: 'Server Error' };
    }
}

const getFurnitures = async (filter) => {
    try {
        const furnitures = await Furniture.find(filter).populate('category')
        return furnitures
    } catch (error) {
        console.error(error)
        return { err: "Server Error" }
    }
}

const getFeedbacks = async () => {
    try {
        const feedbacks = await Contact.find();
        return feedbacks;
    } catch (error) {
        console.error(err)
        return { err: 'Server Error' }
    }
}

const getFurnitureById = async (id) => {
    try {
        const furniture = await Furniture.findById(id).populate('category')
        return furniture
    } catch (error) {
        console.error(error)
        return { err: "Server Error" }
    }
}

const getUsers = async () => {
    try {
        const users = await User.find()
        return users
    } catch (error) {
        console.error(object)
        return {err: 'Server Error'}
    }
}


module.exports = {
    getCategories,
    getFurnitures,
    getFeedbacks,
    getFurnitureById,
    getUsers
}