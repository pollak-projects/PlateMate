const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllReservations,
    getReservationById,
    getAllReservationsOnDay,
    createReservation,
    deleteReservation
} = require('../controllers/reservedTableController.js')

Router.get('/', roleCheck(['admin', 'waiter', 'cashier']), getAllReservations);

Router.get('/reservations-on-day/', roleCheck(['admin', 'waiter', 'cashier']), getAllReservationsOnDay);

Router.get('/:id', roleCheck(['admin', 'waiter', 'cashier']), getReservationById);

Router.post('/', roleCheck(['admin', 'waiter', 'cashier']), createReservation);

Router.delete('/:id', roleCheck(['admin', 'waiter', 'cashier']), deleteReservation);

module.exports = Router