const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    brandName: String,
    description: String,
    image: String,
    price: Number,
    category: String,
});

module.exports = mongoose.model('Product', ProductSchema);
