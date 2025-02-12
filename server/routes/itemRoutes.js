const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllItems,
    getItemById,
    createItem,
    deleteItem
} = require('../controllers/itemController.js')

Router.get('/', roleCheck(['admin', 'waiter', 'chef']), getAllItems);

Router.get('/:id', roleCheck(['admin', 'waiter']), getItemById);

Router.post('/', roleCheck(['admin']), createItem);

Router.delete('/:id', roleCheck(['admin']), deleteItem);

module.exports = Router