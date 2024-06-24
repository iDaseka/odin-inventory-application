const Item = require('../models/item');
const Category = require('../models/category');

const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const item = require('../models/item');

exports.item_list = asyncHandler(async (req, res, next) => {
    res.render('item_list', {
        item_list: await Item.find().sort({name: 1}).exec()
    })
})

exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate('category').exec();

    if (!item){
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    } 

    res.render('item_detail', {
        title: item.name,
        item: item,
        category_list: await Category.find().sort({name: 1}).exec(),
    })
})

//Create Get and Post
exports.item_create_get = asyncHandler(async (req, res, next) => {
    res.render('item_form', {
        title: 'Create Item',
        category_list: await Category.find().sort({name: 1}).exec()
    });
})

exports.item_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({min: 1}).escape(),
    body('category.*').escape(),
    body('stock', 'Stock must not be empty.').trim().escape(),
    body('price', 'Price must not be empty.').trim().escape(),

    asyncHandler(async (req, res, next) => {
        const items = await Item.find().sort({name: 1}).exec();
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            stock: req.body.stock,
            price: req.body.price
        })

        for (let i = 0; i < items.length; i++){
            if (items[i].name.toLowerCase() === item.name.toLowerCase() && items[i].description.toLowerCase() === item.description.toLowerCase() && items[i].category.toLowerCase() == item.category.toLowerCase()){
                errors.errors.push({msg: 'This item already exists'});
            }
        }
        if (!errors.isEmpty()){
            res.render('item_form', {
                title: 'Create Item',
                category_list: await Category.find().sort({name: 1}).exec(),
                item: item,
                errors: errors.array()
            })
        }
        else{
            await item.save();
            res.redirect('/inventory/categories/' + req.body.category);
        }
    })
]

//Delete Get and Post
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate('category').exec();

    res.render('item_delete', {
        title: 'Delete Item',
        item: item,
        category_list: await Category.find().sort({name: 1}).exec(),
    })
})

exports.item_delete_post = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate('category').exec();
    let categoryName = item.category._id;

    await Item.findByIdAndDelete(req.body.id);
    res.redirect('/inventory/categories/' + categoryName);
})

//Update Get and Post
exports.item_update_get = asyncHandler(async (req, res, next) => {
    res.render('item_form', {
        title: 'Update Item',
        item: await Item.findById(req.params.id).populate('category').exec(),
        category_list: await Category.find().sort({name: 1}).exec()
    })
})

exports.item_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),
    body('description', 'Description must not be empty.').trim().isLength({min: 1}).escape(),
    body('category.*').escape(),
    body('stock', 'Stock must not be empty.').trim().escape(),
    body('price', 'Price must not be empty.').trim().escape(),

    asyncHandler(async (req, res, next) => {
        const items = await Item.find().sort({name: 1}).exec();
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            stock: req.body.stock,
            price: req.body.price,
            _id: req.params.id
        })

        for (let i = 0; i < items.length; i++){
            if (items[i].name === item.name && items[i].description === item.description && items[i].category == item.category){
                errors.errors.push({msg: 'This item already exists'});
            }
        }
        if (!errors.isEmpty()){
            res.render('item_form', {
                title: 'Create Item',
                category_list: await Category.find().sort({name: 1}).exec(),
                item: item,
                errors: errors.array()
            })
        }
        else{
            await Item.findByIdAndUpdate(req.params.id, item, {});
            res.redirect('/inventory/categories/' + req.body.category);
        }
    })

]