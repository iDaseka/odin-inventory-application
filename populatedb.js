#! /usr/bin/env node

console.log('Database populator');

const userArgs = process.argv.slice(2);

const Item = require('./models/item');
const Category = require('./models/category');

const items = [];
const categories = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = userArgs[0];
main().catch((err) => console.log(err));

async function main(){
    await mongoose.connect(mongoDB);
    await createCategories();
    await createItems();
    mongoose.connection.close();
}

async function categoryCreator(index, name){
    const category = new Category({
        name: name
    })

    await category.save();
    categories[index] = category;
}

async function itemCreator(index, name, description, category, price, stock){
    const itemDetails = {
        name: name,
        description: description,
        price: price,
        stock: stock
    }
    if (category != false)
        itemDetails.category = category;

    const item = new Item(itemDetails);
    await item.save();
    items[index] = item;
}

async function createCategories(){
    await Promise.all([
        categoryCreator(0, 'Eyeshadows'),
        categoryCreator(1, 'Highlighters'),
        categoryCreator(2, 'Eyeliners'),
        categoryCreator(3, 'Sunscreens'),
        categoryCreator(4, 'Shampoos'),
        categoryCreator(5, 'Body splashes'),
        categoryCreator(6, 'Eau de toilettes'),
        categoryCreator(7, 'Foundations'),
        categoryCreator(8, 'Concealers'),
        categoryCreator(9, 'Face powders'),
    ])
}

async function createItems(){
    await Promise.all([
        itemCreator(0, 'Barber Shop - 2 in 1', '240 ml', categories[4], 7.6, 1),
        itemCreator(1, 'F of Flor - Sugar', '100 ml', categories[5], 8.4, 1),
        itemCreator(2, 'Kroma - Black', '60 ml', categories[6], 11.4, 3),
        itemCreator(3, 'Kroma - Red', '60 ml', categories[6], 11.4, 1),
        itemCreator(4, 'Hydra', '200 ml', categories[4], 6.2, 1),
        itemCreator(5, 'Millanel - Gel', '2 g', categories[2], 5.0, 1),
        itemCreator(6, 'Millanel - Liquid', '3 ml', categories[2], 3.9, 1),
        itemCreator(7, 'Millanel - Gold Diva', '2 g', categories[0], 5.3, 1),
        itemCreator(8, 'Millanel Vegan - Solid', '90 g', categories[4], 5.8, 1),
        itemCreator(9, 'Millanel - Red Love', '125 ml', categories[5], 6.2, 0),
    ])
}