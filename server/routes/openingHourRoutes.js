const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllOpeningHours,
    createOpeningHour,
    deleteOpeningHour
} = require('../controllers/openingHourController')

Router.get('/', roleCheck(['admin', 'waiter']), getAllOpeningHours);

Router.post('/',  roleCheck(['admin']), createOpeningHour);

Router.delete('/:id', roleCheck(['admin']), deleteOpeningHour);

module.exports = Router