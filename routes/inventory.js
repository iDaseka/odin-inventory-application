const express = require('express');
const router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');

router.get('/', category_controller.index);


//Item Routes
router.get('/item/create', item_controller.item_create_get);
router.post('/item/create', item_controller.item_create_post);
router.get('/item/:id/delete', item_controller.item_delete_get);
router.post('/item/:id/delete', item_controller.item_delete_post);
router.get('/item/:id/update', item_controller.item_update_get);
router.post('/item/:id/update', item_controller.item_update_post);
router.get('/item/:id', item_controller.item_detail);
router.get('/item', item_controller.item_list);

//Category Routes
router.get('/categories/create', category_controller.category_create_get);
router.post('/categories/create', category_controller.category_create_post);
router.get('/categories/:id/delete', category_controller.category_delete_get);
router.post('/categories/:id/delete', category_controller.category_delete_post);
router.get('/categories/:id/update', category_controller.category_update_get);
router.post('/categories/:id/update', category_controller.category_update_post);
router.get('/categories/:id', category_controller.category_list);
router.get('/categories/:id/selected', category_controller.category_detail);

//Out of Stock Route
router.get('/out_of_stock', category_controller.outOfStock);
module.exports = router;