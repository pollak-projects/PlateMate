const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllMethods,
    getMethodById,
    createMethod,
    deleteMethod
} = require('../controllers/paymentMethodController.js')

Router.get('/', roleCheck(['admin', 'cashier']), getAllMethods);

Router.get('/:id', roleCheck(['admin', 'cashier']), getMethodById);

Router.post('/', roleCheck(['admin']), createMethod);

Router.delete('/:id', roleCheck(['admin']), deleteMethod);

module.exports = Router