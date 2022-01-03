const Model = require("../database/models");
const Joi = require('joi');


// Retorune l'ensemble des tags

exports.listTags = (req, res) => {
    Model.Tags.findAll()
    .then(tag => res.status(200).json(tag))
    .catch(error => res.status(400).json(error))
}


// Récupère l'ensemble des tags associés à l'utilisateur connecté

exports.listTagsForUser = (req,res) => {
    Model.Tags.findAll({
        where:{
            fk_id_client: req.user.fk_id_client
        }
    })

    .then(tags => res.status(200).json(tags))
    .catch(error => res.status(400).json(error))
}

// Récupère un tag par son id

exports.getTagById = (req,res) => {
    Model.Tags.findOne({
        where:{
            id_tag : req.params.id
        }
    })
    .then((tag) => {
        if (!tag) {
            return res.status(400).json({
                message: 'Tag does not exist',
            });
        }

        else {
            return res.status(200).json(tag)
        }
    })
    .catch(error => res.json(error))
 
    
}

// Ajoute un tag

exports.addTag = (req,res) =>{
    const {id_tag,fk_id_product,fk_id_client} = req.body

    let list_fk_product = []
    let list_fk_client = []

    const postTagSchema = Joi.object().keys({
        id_tag:Joi.string().required(), 
        fk_id_product : Joi.number(),
        fk_id_client: Joi.number()
    })

    const result = postTagSchema.validate(req.body)

    const {error } = result;

    const valid = error == null;

    if (!valid) {
      res.status(400).json({ 
        message: 'Missing required parameters or parameters type are incorrect',
        info: 'Requires: id_tag' 
      })
    }

    else {

        Model.Products.findAll()
        .then(allproduct => {
            Model.Products.count()
            .then(numberOfProduct => {
                for (let i =0; i<numberOfProduct;i++){
                    list_fk_product.push(allproduct[i].id_product)
                }

                Model.Client.findAll()
                .then(allClient => {
                    Model.Client.count()
                    .then(numberOfClient => {
                        for (let j =0; j<numberOfClient;j++){
                            list_fk_client.push(allClient[j].id_client)
                        }

                        if(!list_fk_client.includes(fk_id_client) && fk_id_client != null){
                            res.status(400).json({
                                message:"fk_id_client does not match any id_client"
                            })
                        }

                        else if (!list_fk_product.includes(fk_id_product) && fk_id_product != null){
                            res.status(400).json({
                                message: "fk_id_product does not match any id_product"
                            })
                        }

                        else {
                            Model.Tags.create({
                                id_tag:id_tag.toUpperCase(),
                                fk_id_product : fk_id_product,
                                fk_id_client: fk_id_client
                            })

                            .then(tag => res.status(200).json(tag))
                            .catch(error => res.status(400).json(error))
                        }

                    })
                })
            })
        })
    
    }
        
}

// Modifie un tag

exports.editTag =(req,res) => {

    const {fk_id_product,fk_id_client} = req.body

    let list_fk_product = []
    let list_fk_client = []

    Model.Tags.findOne({
        where: {
            id_tag: req.params.id
        }
    })

    .then((tag) => {
        if (!tag) {
            return res.status(400).json({
                message: 'Tag does not exist',
            });
        }

        const editTagSchema = Joi.object().keys({ 
            fk_id_product : Joi.number(),
            fk_id_client: Joi.number()
        })

        const result = editTagSchema.validate(req.body)

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
            
            Model.Products.findAll()
            .then(allProduct => {
                Model.Products.count()
                .then(numberOfProduct => {
                    for(let i =0;i<numberOfProduct;i++){
                        list_fk_product.push(allProduct[i].id_product)
                    }

                    Model.Client.findAll()
                    .then(allClient => {
                        Model.Client.count()
                        .then(numberOfClient => {
                            for(let j =0;j<numberOfClient;j++){
                                list_fk_client.push(allClient[j].id_client)
                            }

                            if(!list_fk_client.includes(fk_id_client) && fk_id_client){
                                res.status(400).json({
                                    message: "fk_id_client does not match any id_client"
                                })
                            }

                            else if (!list_fk_product.includes(fk_id_product)&& fk_id_product){
                                res.status(400).json({
                                    message: "fk_id_product does not match any id_product"
                                })
                            }

                            else {
                                Model.Tags.update({
                                    fk_id_product : fk_id_product,
                                    fk_id_client:fk_id_client
                                },
                                {
                                    where : {
                                        id_tag: req.params.id
                                    }
                                })
                                .then(res.status(200).json({
                                    message: "Item has been updated"})
                                )
                                .catch(error => res.status(400).json(error))
                            }
                        })
                    })
                })            
            })
        }
    })

}