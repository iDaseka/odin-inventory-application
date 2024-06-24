const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: {type: String, required: true, minLength: 1, maxLength: 100}
})

CategorySchema.virtual('url').get(function(){
    return '/inventory/categories/' + this._id;
})

module.exports = mongoose.model('Category', CategorySchema);