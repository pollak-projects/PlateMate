const express = require('express')
const { roleCheck } = require("../middlewares/roleHandler") 
var Router = express.Router()

const{
    getAllSettings,
    getSettingById,
    createSetting,
    deleteSetting
} = require('../controllers/permissionSettingController.js')

Router.get('/', roleCheck(['admin']), getAllSettings);

Router.get('/:id', roleCheck(['admin']), getSettingById);

Router.post('/', roleCheck(['admin']), createSetting);

Router.delete('/:id', roleCheck(['admin']), deleteSetting);

module.exports = Router