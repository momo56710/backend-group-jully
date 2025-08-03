
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 120
    },
    description: {
        type: String,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['electronics', 'fashion', 'home']
    },
    imageUrl: {
        type: String,
        required: true,
        default: 'uploads/products/default.jpg'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{timestamps: true , versionKey: false})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;