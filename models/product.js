const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    brandName: String,
    description: String,
    image: String,
    price: Number,
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
    }
});

module.exports = mongoose.model('Product', ProductSchema);
