const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory
} = require('../controllers/categoryController.js')

Router.get('/', roleCheck(['admin', 'waiter']), getAllCategories);

Router.get('/:id', roleCheck(['admin', 'waiter']), getCategoryById);

Router.post('/', roleCheck(['admin']), createCategory);

Router.delete('/:id', roleCheck(['admin']), deleteCategory);

module.exports = Router