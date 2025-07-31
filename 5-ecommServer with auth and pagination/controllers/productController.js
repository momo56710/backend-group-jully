const Product = require("../models/productModal");
const User = require("../models/userModal");
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select("title price");
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Products", error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    console.log(req.user);
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { title, description, price, stock } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      sellerId: req.user.userId,
    });
    res.status(201).json({
      message: "Product created successfully",
      product: await product.populate("sellerId", "name email -_id"),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Product", error: error.message });
  }
};
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("sellerId");
    res.status(200).json({
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Product", error: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        runValidators: true,
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Product", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Product", error: error.message });
  }
};
const getMyProducts = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Forbidden you are not a seller" });
    }
    const products = await Product.find({ sellerId: req.user.userId });
    res
      .status(200)
      .json({ message: "Products fetched successfully", products });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Products", error: error.message });
  }
};
module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
