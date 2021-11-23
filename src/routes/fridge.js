const fridges = require('express').Router();
const fridgeController = require("../controllers/fridge")
const passport = require("passport")

fridges.get('/',fridgeController.listFridges)
fridges.get('/:id',fridgeController.getFridgeById)
fridges.post('/',fridgeController.addFridge)
fridges.put('/:id',fridgeController.editFridge)
fridges.delete('/:id',fridgeController.deleteFridge)

fridges.get('/:id/products',fridgeController.listProductByFridge)
fridges.get('/:id/count',fridgeController.getNumberOfClientByFridge)
fridges.post('/:id/addProducts',fridgeController.addProduct) // [2,3]



module.exports = fridges