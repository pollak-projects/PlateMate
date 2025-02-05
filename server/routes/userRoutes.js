const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllUsers,
    getUserById,
    deleteUser
} = require('../controllers/userController.js')

Router.get('/', roleCheck(['admin']), getAllUsers);

Router.get('/:id', roleCheck(['admin']), getUserById);

Router.delete('/:id', roleCheck(['admin']), deleteUser);

module.exports = Router