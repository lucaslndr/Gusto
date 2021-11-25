const Model = require("../database/models");
const Joi = require('joi');


// const Model = {
//     Categories: require("../database/models/categories")(),           // config pour que l'ide propose les fonctions possibles
// }

exports.listFridges = (req, res) => {
    Model.Fridges.findAll()
    .then(fridge => res.status(200).json(fridge))
    .catch(error => res.status(400).json(error))
}



exports.listProductByFridge = (req,res) =>{
    Model.Fridges.findOne({
        where:{
            id_fridge:req.params.id
        },
    })
    .then(fridge=> {
        return fridge.getProducts()
    })
    .then(products =>{
        if(products.length == 0){
            return res.status(400).json({
                message:`Fridge with id ${req.params.id} does not have any product`
            })
        }

        else {
            return res.status(200).json(products)
        }
    })
    .catch(error => console.log(error))

}

exports.listClientByFridge = (req,res) => {
    Model.Fridges.findOne({
        where:{
            id_fridge : req.params.id
        },
    })

    .then(fridge =>{
        if (!fridge) {
            return res.status(400).json({
                message: 'Fridge does not exist',
            });
        }

        else {
            return fridge.getClients()
        }

    })
    .then(clients =>{
        if(clients.length == 0){
            return res.status(400).json({
                message:`Fridge with id ${req.params.id} does not have any client`
            })
        }

        else {
            return res.status(200).json(clients)
        }
    })
    .catch(error => res.status(400).json(error))
}


exports.listBadgeByFridge = (req,res) => {
    Model.Fridges.findOne({
        where:{
            id_fridge : req.params.id
        },
    })

    .then(fridge =>{
        if (!fridge) {
            return res.status(400).json({
                message: 'Fridge does not exist',
            });
        }

        else {
            return fridge.getBadges()

        }

    })
    .then(badges =>{
        if(badges.length == 0){
            return res.status(400).json({
                message:`Fridge with id ${req.params.id} does not have any badge`
            })
        }

        else {
            return res.status(200).json(badges)
        }
    })
    .catch(error => res.status(400).json(error))
}



exports.listMenuByFridge = (req,res) => {
    Model.Fridges.findOne({
        where:{
            id_fridge : req.params.id
        },
    })

    .then(fridge =>{
        if (!fridge) {
            return res.status(400).json({
                message: 'Fridge does not exist',
            });
        }

        else {
            return fridge.getMenus()  
        }
    })
    .then(menus =>{
        if(menus.length == 0){
            return res.status(400).json({
                message:`Fridge with id ${req.params.id} does not have any menu`
            })
        }

        else {
            return res.status(200).json(menus)
        }
    })
    .catch(error => res.status(400).json(error))
}


exports.listProductByOrderByFridge = (req,res) => {
    let fk_list = new Array()

    Model.Orders.findAll()
    .then(allOrders => {
        Model.Orders.count()
        .then(numberOfOrder =>{
            for(let i=0;i<numberOfOrder;i++){
                fk_list.push(allOrders[i].fk_id_fridge)
            }

            Model.Orders.findAll({
                where:{
                    fk_id_fridge: req.params.id
                },
                include:{ model: Model.Products}
            })
        
            .then(orders => {  

                if(!fk_list.includes(Number(req.params.id))){
                 
                    return res.status(400).json({
                        message: "Fridge does not exist or does not have any order"
                    })
                }
        
                else {
                    
                    return res.json(orders)
                }
            })


        }) 
    })
    .catch(error => res.json(error))
}




exports.addProduct = (req,res) =>{
    Model.Fridges.findOne({
        where:{
            id_fridge:req.params.id
        },
    })
    .then(fridge=> {
        return fridge.addProducts(req.body) // [1,3]
    })
    .then(products=> console.log(products))
    .catch(error => console.log(error))

}




exports.getNumberOfClientByFridge = (req,res) => {
    Model.Fridges.findOne({
        include: Model.Client,
        where:{
            id_fridge:req.params.id
        }
    })
    .then(a => res.json(a.Clients.length))
}


exports.getFridgeById = (req,res) => {
    Model.Fridges.findOne({
        where:{
            id_fridge : req.params.id
        }
    })
    .then((fridge) => {
        if (!fridge) {
            return res.status(400).json({
                message: 'Fridge does not exist',
            });
        }

        else {
            return res.status(200).json(fridge)
        }
    })
    .catch(error => res.json(error))
  
}

/*********************** Ajouter le fait que la foreign key ne peut avoir comme valeur que les id présent dans la table source (level : 1:2:3 => user ne peut avoir en fk que 1, 2 et 3) */

exports.addFridge = (req,res) =>{
    const { label, fk_id_technology, fk_id_menu_preset} = req.body

    const postFridgeSchema = Joi.object().keys({ 
        label : Joi.string().required(),
        fk_id_technology:Joi.number().required(),
        fk_id_menu_preset:Joi.number().required()
    })

    const result = postFridgeSchema.validate(req.body)

    const {error } = result;

    const valid = error == null;

    if (!valid) {
      res.status(400).json({ 
        message: 'Missing required parameters',
        info: 'Requires: label, fk_id_technologie, fk_id_menu_preset' 
      })
    }
    else {
        
        Model.Fridges.create({
        label : label,
        fk_id_technology:fk_id_technology,
        fk_id_menu_preset:fk_id_menu_preset
    })

    .then(fridge => res.status(200).json(fridge))
    .catch(error => res.status(400).json(error))

    }

        
}


exports.editFridge =(req,res) => {

    const { label, fk_id_technology} = req.body

    Model.Fridges.findOne({
        where: {
            id_fridge: req.params.id
        }
    })

    .then((fridge) => {
        if (!fridge) {
            return res.status(400).json({
                message: 'Fridge does not exist',
            });
        }

        const editFridgeSchema = Joi.object().keys({ 
            label: Joi.string(),
            fk_id_technology: Joi.number()
        })

        const result = editFridgeSchema.validate(req.body)

        const {error } = result; 
        const valid = error == null; 

        if (!valid) { 
          res.status(400).json({ 
            message: 'One or more fields are not well written', 
          }) 
        } 
        
        else { 
            Model.Fridges.update({
                label: label,
                fk_id_technology: fk_id_technology,
            },
            {
                where : {
                    id_fridge: req.params.id
                }
            })
            .then(res.send("Modification apply"))
        }
    })
    
    .catch(error => console.log(error))

}


exports.deleteFridge = (req,res) => {
    
    Model.Fridges.findOne({
        where: {
            id_fridge: req.params.id
        }
    })
    .then((fridge) => {
        if (!fridge) {
            return res.status(400).json({
                message: 'Fridge does not exist',
            });
        }
    Model.Fridges
            .destroy({
                where: {
                    id_fridge: req.params.id
                }
            }).then(res.send(`Fridge with id : ${req.params.id} has been deleted`))
        }

    )
    .catch(error => res.status(400).json(error))
}
