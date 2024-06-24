const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: {type: String, required: true, minLength: 1, maxLength: 100},
    description: {type: String, required: true},
    category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
    price: {type: Number, required: true, min: 0},
    stock: {type: Number, required: true, min: 0}
})

ItemSchema.virtual('url').get(function(){
    return '/inventory/item/' + this._id;
})

module.exports = mongoose.model('Item', ItemSchema);