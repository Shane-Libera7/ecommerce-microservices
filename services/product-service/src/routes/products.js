const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');




//Get all Products
router.get('/', async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const { category } = req.query;

    try {
        let query = db('products').select(['id', 'name', 'price', 'inventory', 'category_id', 'description']).limit(limit).offset((page - 1) * limit);
        if (category){
            query = query.where('category_id', category);
        }
        const products = await query;
        return res.status(200).json(products);

    } catch(e){
        console.log(e);
        next(e);
    }
})


//Get Single Product by Id
router.get('/:id', async (req, res, next) => {
    const productId = req.params.id;

    try {
        const product = await db('products').select(['id', 'name', 'price', 'inventory', 'category_id', 'description']).where('id', productId).first();

        if(!product){
            return res.status(404).json({ error: 'Product not found'});
        } else{
            return res.status(200).json(product);
        }
    } catch(e){
        console.log(e);
        next(e);
    }
})



//Create Product, Only possible for Admin user 
router.post('/', authMiddleware, async (req,res, next) => {
    const userIsAdmin = req.isAdmin;
    const { name, price, inventory, category_id, description } = req.body;

    try {
        if (!userIsAdmin){
        return res.status(403).json({ error: 'user does not have access to create product'});
            } else {
        const product = {
            name: name,
            price: price,
            inventory: inventory,
            category_id: category_id,
            description: description
        };

        const [newProduct] = await db('products').insert(product).returning(['id', 'name', 'price', 'inventory', 'category_id', 'description', 'created_at']);
        return res.status(201).json(newProduct);
    }} catch(e){
        console.log(e);
        next(e);
    }
})



//Patch Product
router.patch('/:id', authMiddleware, async (req, res, next) => {
    const productId = req.params.id;
    const userIsAdmin = req.isAdmin;
    let update = {};
    try{
        if (!userIsAdmin){
            return res.status(403).json({ error: 'user does not have access to edit product'});
        } else{

            if (req.body.name !== undefined){
            update.name = req.body.name;
        } if (req.body.price !== undefined){
            update.price = req.body.price;
        } if (req.body.category_id !== undefined){
            update.category_id = req.body.category_id;
        } if (req.body.description !== undefined){
            update.description = req.body.description;
        }
        if (Object.keys(update).length === 0){
            return res.status(400).json({ error: 'No fields entered to be updated'})
        }

        const updatedProduct = await db('products').where('id', productId).update(update).returning(['id', 'name', 'price', 'inventory', 'category_id', 'description', 'created_at']);
        return res.status(200).json(updatedProduct);
        }
    }catch(e){
        console.log(e);
        next(e);
    }
})

module.exports = router;