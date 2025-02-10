const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllPayments,
    getPaymentById,
    createPayment,
    deletePayment
} = require('../controllers/paidController.js')

Router.get('/', roleCheck(['admin']), getAllPayments);

Router.get('/:id', roleCheck(['admin']), getPaymentById);

Router.post('/', roleCheck(['admin', 'cashier']), createPayment);

Router.delete('/:id', roleCheck(['admin']), deletePayment);

module.exports = Router