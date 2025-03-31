const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrder,
    deleteOrderByArray,
    getAllInProcessOrders,
    getAllFinishedOrders,
    getAllServedOrders,
    setDoneOrder,
    rollbackDoneOrder,
    setServedOrder,
    rollbackServedOrder,
    getOrdersByTableId,
    getOrdersByTableId2
} = require('../controllers/orderController.js')


Router.get('/', roleCheck(['admin', 'waiter', 'cashier']), getAllOrders);

Router.get('/in-process/', roleCheck(['admin', 'waiter', 'cashier', 'chef']), getAllInProcessOrders);

Router.get('/finished/', roleCheck(['admin', 'waiter', 'cashier', 'chef']), getAllFinishedOrders);

Router.get('/served/', roleCheck(['admin', 'waiter', 'cashier', 'chef']), getAllServedOrders);

Router.get('/for-checkout/:id', roleCheck(['admin', 'cashier']), getOrdersByTableId);

Router.get('/for-checkout2/:id', roleCheck(['admin', 'cashier']), getOrdersByTableId2);

Router.get('/:id', roleCheck(['admin', 'waiter', 'cashier']), getOrderById);

Router.put('/set-done/:id', roleCheck(['admin', 'waiter', 'cashier']), setDoneOrder);

Router.put('/rollback-done/:id', roleCheck(['admin', 'waiter', 'cashier']), rollbackDoneOrder);

Router.put('/set-served/:id', roleCheck(['admin', 'waiter', 'cashier']), setServedOrder);

Router.put('/rollback-served/:id', roleCheck(['admin', 'waiter', 'cashier']), rollbackServedOrder);

Router.post('/', roleCheck(['admin', 'waiter']), createOrder);

Router.delete('/mass-delete/', roleCheck(['admin', 'waiter']), deleteOrderByArray);

Router.delete('/:id', roleCheck(['admin', 'waiter']), deleteOrder);

module.exports = Router