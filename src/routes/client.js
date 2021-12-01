const clients = require('express').Router();
const clientController = require("../controllers/client")
const passport = require("passport")

clients.get('/',clientController.listClients)
clients.get('/:id',clientController.getClientById)
clients.post('/',clientController.addClient)
clients.put('/:id',clientController.editClient)
clients.delete('/:id',clientController.deleteClient)


clients.get('/:id/categories',clientController.listCategoryByClient)

clients.get('/:id/tags',clientController.listTagsbyClients)

module.exports = clients