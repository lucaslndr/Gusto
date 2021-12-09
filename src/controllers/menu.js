const Model = require("../database/models");
const Joi = require('joi');

    exports.listMenus = (req, res) => {
        Model.Menus.findAll()
        .then(menu => res.status(200).json(menu))
        .catch(error => res.status(400).json(error))
    }


    exports.getMenuById = (req,res) => {
        Model.Menus.findOne({
            where:{
                id_menu : req.params.id
            }
        })
        .then((menu) => {
            if (!menu) {
                return res.status(400).json({
                    message: 'Menu not found',
                });
            }

            else {
                return res.status(200).json(menu)
            }
        })
        .catch(error => res.status(400).json(error))
     
        
    }

    exports.listProductByMenu = (req, res) => {
        Model.Menus.findOne({
            where:{
                id_menu : req.params.id
            }
        })
        .then((menu) => {
            if (!menu) {
                return res.status(400).json({
                    message: 'Menu does not exist',
                });
            }
    
            else {
                menu.getProducts()
                .then(products =>{
            
                    if(products.length == 0){
                        return res.status(400).json({
                            message:`Menu with id ${req.params.id} does not have any product`
                        })
                    }
                    
                    else {
                        return res.status(200).json(products)
                    }
                })
            }
        })
        .catch(error => res.json(error))
    }


    exports.addProductInMenu = (req,res) => {
        const {fk_id_product} = req.body

        const list_product = new Array()
        const list_productOfMenu =new Array()


        const postProductInMenuSchema = Joi.object().keys({ 
            fk_id_product: Joi.number().required()
        })

        const result = postProductInMenuSchema.validate(req.body)

        const {error } = result;

        const valid = error == null;

        if (!valid) {
            res.status(400).json({ 
            message: 'Missing required parameters',
            info: 'Requires: fk_id_product' 
            })
        }

        else {

            Model.Products.findAll()
            .then(allProducts => {
                Model.Products.count()
                .then(numberOfProduct => {
                    for(let i =0;i<numberOfProduct;i++){
                        list_product.push(allProducts[i].id_product)
                    }

                    

                    if(!list_product.includes(fk_id_product)){
                        res.status(400).json({
                            message:"fk_is_product does not match any id_product"
                        })
                    }
                })
            })

            Model.Menus.findOne({
            where:{
                id_menu:req.params.id
            }
        })

            .then((menu) => {
                if (!menu) {
                    return res.status(400).json({
                        message: 'Menu does not exist',
                    });
                }

                else {
                    menu.getProducts()
                    .then(allProd=>{
                        for(let i =0;i<allProd.length;i++){
                            list_productOfMenu.push(allProd[i].menus_products.fk_id_product)
                        }
                        
                        if(list_productOfMenu.includes(fk_id_product)){
                            res.status(400).json({
                                message:`Menu ${req.params.id} already contains product ${fk_id_product}`
                            })
                        }

                        else {
                            return menu.addProducts(fk_id_product)
                            .then(addedProduct => res.status(200).json(addedProduct))
                            .catch(error => res.status(400).json(error))
                        }
                    })
                   
                   
                    
                }
            })
        }
    }


    exports.deleteProductInMenu = (req,res) => {
        const {fk_id_product} = req.body

        const list_productOfMenu = new Array()


        const postProductInMenuSchema = Joi.object().keys({ 
            fk_id_product: Joi.number().required()
        })

        const result = postProductInMenuSchema.validate(req.body)

        const {error } = result;

        const valid = error == null;

        if (!valid) {
            res.status(400).json({ 
            message: 'Missing required parameters',
            info: 'Requires: fk_id_product' 
            })
        }

        else {

            Model.Menus.findOne({
                where:{
                    id_menu:req.params.id
                }
            })

            .then((menu) => {
                if (!menu) {
                    return res.status(400).json({
                        message: 'Menu does not exist',
                    });
                }

                else {

                    menu.getProducts()
                    .then(allProd=>{
                        for(let i =0;i<allProd.length;i++){
                            list_productOfMenu.push(allProd[i].menus_products.fk_id_product)
                        }
                        
                        if(!list_productOfMenu.includes(fk_id_product)){
                            res.status(400).json({
                                message:"fk_id_product does not match any id_product"
                            })
                        }

                        else {

                            menu.removeProducts(fk_id_product)
                            .then(res.status(200).json("Deletion completed"))
                        }
                    })
                }
            })
        }
    }

    exports.addMenu = (req,res) =>{
        const { image, price, web_label, fridge_label} = req.body;
        

       const postMenuSchema = Joi.object().keys({ 
        image: Joi.string().required(),
        price: Joi.number().required(),
        web_label: Joi.string().required(),
        fridge_label:Joi.string().required(),
    })

    const result = postMenuSchema.validate(req.body)

    const {error } = result;

    const valid = error == null;

    if (!valid) {
      res.status(400).json({ 
        message: 'Missing required parameters',
        info: 'Requires: image, price, web_label, fridge_label' 
      })
    }

   

    else {

        Model.Client.findOne({
            where:{
                id_client: req.user.fk_id_client
            }
        })
        .then(client => {
            Model.Menus.create({ 
                image:image,
                price:price,
                web_label:web_label,
                fridge_label:fridge_label,
                fk_id_client:client.id_client
            }) 
            .then(menu => res.status(200).json(menu))
            .catch(error => res.status(400).json(error))

        })
                
    }
}



exports.editMenu = (req,res) => {
    const { image, price, web_label, fridge_label} = req.body;

    Model.Menus.findOne({
        where: {
            id_menu: req.params.id
        }
    })

    .then((menu) => {
        if (!menu) {
            return res.status(400).json({
                message: 'Menu not found',
            });
        }

        const editMenuSchema = Joi.object().keys({ 
            image: Joi.string(),
            price: Joi.number(),
            web_label: Joi.string(), 
            fridge_label:Joi.string(),
        })

        const result = editMenuSchema.validate(req.body)

        const {error } = result; 
        const valid = error == null;

        if (!valid) { 
          res.status(400).json({ 
            message: 'One or more fields are not well written', 
          }) 
        }
        
        else if(Object.keys(req.body).length == 0){
            res.status(400).json({
                message:"No parameters were passed"
            })
        }
        
        else { 
            Model.Menus.update({
                image: image,
                price: price,
                web_label: web_label,
                fridge_label:fridge_label
            },
            {
                where : {
                    id_menu: req.params.id
                }
            })

            return res.status(200).json({
                message: "Item has been updated"
            })
        }
    })
    
    .catch(error => console.log(error))
}
        

exports.deleteMenu = (req,res) => {
    
    Model.Menus.findOne({
        where: {
            id_menu: req.params.id
        }
    })
    .then((menu) => {
        if (!menu) {
            return res.status(400).json({
                message: 'Menu not found',
            });
        }
        else {

            Model.Menus.destroy({
                where: {
                    id_menu: req.params.id
                }
            })
            .then(res.status(200).json({
                message:`Menu with id : ${req.params.id} has been deleted`})
            )
        }
            
    })
    .catch(error => res.status(400).json(error))
}

