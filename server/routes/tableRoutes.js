const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllTables,
    getTableById,
    createTable,
    deleteTable
} = require('../controllers/tableController.js')

Router.get('/', roleCheck(['admin', 'waiter', 'cashier', 'chef']), getAllTables);

Router.get('/:id', roleCheck(['admin', 'waiter', 'cashier']), getTableById);

Router.post('/', roleCheck(['admin']), createTable);

Router.delete('/:id', roleCheck(['admin']), deleteTable);

module.exports = Router