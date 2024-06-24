const Category = require('../models/category');
const Item = require('../models/item');

const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
    const [itemsIndex, categoriesIndex, outOfStockIndex] = await Promise.all([
        Item.countDocuments({}).exec(),
        Category.countDocuments({}).exec(),
        Item.find({stock: 0}).exec()
    ])

    res.render('index', {
        category_list: await Category.find().sort({name: 1}).exec(),
        item_count: itemsIndex,
        category_count: categoriesIndex,
        out_of_stock_count: outOfStockIndex.length
    })
})

exports.category_list = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId).exec()
    const items = await Item.find({category: categoryId, stock: {$gt: 0}}).sort({name: 1}).exec();

    res.render('category_list', {
        title: category.name,
        category: category,
        item_list: items,
        category_list: await Category.find().sort({name: 1}).exec(),
    })
})

exports.category_detail= asyncHandler(async (req, res, next) => {
    res.render('category_detail', {
        title: 'Category Detail',
        category: await Category.findById(req.params.id).exec(),
        item_list: await Item.find({category: req.params.id,}).sort({name: 1}).exec(),
        category_list: await Category.find().sort({name: 1}).exec()
    })
})

//Create Get and Post
exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.render('category_form', {
        title: 'Create Category',
        category_list: await Category.find().sort({name: 1}).exec(),
    })
})

exports.category_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),

    asyncHandler(async (req, res, next) => {
        const categories = await Category.find().sort({name: 1}).exec();
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name
        })

        for (let i = 0; i < categories.length; i++) {
            if (categories[i].name.toLowerCase() === category.name.toLowerCase()) {
                errors.errors.push({msg: 'Category already exists'});
            }
        }
        if (!errors.isEmpty()){
            res.render('category_form', {
                title: 'Create Category',
                category_list: await Category.find().sort({name: 1}).exec(),
                category: category,
                errors: errors.array()
            })
        }
        else{
            category.save();
            res.redirect('/inventory/categories/'+ category._id);
        }
    })
]
//Delete Get and Post
exports.category_delete_get = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_list: await Category.find().sort({name: 1}).exec(),
    })
})

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    const category = await Category.findById(req.params.id).exec();

    await Category.findByIdAndDelete(req.body.id);
    res.redirect('/inventory');
})
//Update Get and Post
exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.render('category_form', {
        title: 'Update Category',
        category: await Category.findById(req.params.id).exec(),
        category_list: await Category.find().sort({name: 1}).exec()
    })
})

exports.category_update_post = [
    body('name', 'Name must not be empty.').trim().isLength({min: 1}).escape(),

  asyncHandler(async (req, res, next) => {
    const categories = await Category.find().sort({ name: 1 }).exec();
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
    });



    for (let i = 0; i < categories.length; i++) {
      if (categories[i].name.toLowerCase() === category.name.toLowerCase()) {
        errors.errors.push({ msg: "Category already exists" });
      }
    }

    if (!errors.isEmpty()) {
        res.render("category_form", {
            title: "Update Category",
            category_list: await Category.find().sort({name: 1}).exec(),
            category: category,
            errors: errors.array(),
        });
    }
    else{
        const newId = (await Category.findById(req.params.id).exec())._id;
        const oldId = req.params.id;

        await Category.findByIdAndUpdate(oldId, {$set: { name: category.name }});
        await Item.updateMany({category: oldId}, {category: newId});
        res.redirect("/inventory/categories/" + oldId);
    }
  }),
]

//Out of Stock
exports.outOfStock = asyncHandler(async (req, res, next) => {
    res.render('outOfStock_detail', {
        title: 'Out of Stock',
        item_list: await Item.find({stock: 0}).populate('category').sort({category: 1}).exec(),
        category_list: await Category.find().sort({name: 1}).exec()
    })
})