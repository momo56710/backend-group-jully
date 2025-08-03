const Product = require('../models/product');

const createProduct = async (req, res) => {
    try {
        const user = req.user.userId;
        const { title, description, price, category} = req.body;
        const imageUrl = req.file?.path || 'uploads/products/default.jpg';
        const product = new Product({ title, description, price, category, imageUrl, owner: user });
        await product.save();
        res.status(201).json({ message: 'Product created successfully' , product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getProducts = async (req, res) => {
    try {
        const { category = "", minPrice = 0, maxPrice = 100000000 , search = "", page = 1 , limit = 10 , sort = 'createdAt'} = req.query;
      const filter = {};

      // Title search
      if (search && search.trim() !== "") {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Category filter (exact match if provided)
      if (category && category.trim() !== "") {
        filter.category = category;
      }

      // Price range filter
      filter.price = {};
      if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
        filter.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
        filter.price.$lte = Number(maxPrice);
      }
      // Remove price if no range specified
      if (Object.keys(filter.price).length === 0) {
        delete filter.price;
      }

      // Pagination and sorting
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const sortObj = {};
      if (sort) {
        sortObj[sort] = -1;
      }
      console.log(filter);
      const products = await Product.find(filter)
        .populate('owner', 'name email')
        .sort(sortObj)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      const totalProducts = await Product.countDocuments(filter); 
      const totalPages = Math.ceil(totalProducts / limitNum);
      res.status(200).json({ products , pagination: {totalProducts , totalPages , currentPage: pageNum } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
module.exports = { createProduct , getProducts };