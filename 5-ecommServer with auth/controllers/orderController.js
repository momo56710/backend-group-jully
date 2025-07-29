const Order = require("../models/orderModal");
const User = require("../models/userModal");
const Product = require("../models/productModal");
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Orders", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { sellerId, buyerId, products } = req.body;
    let total = 0;
    if (sellerId === buyerId) {
      throw new Error("Seller and Buyer cannot be the same");
    }
    const seller = await User.findById(sellerId);
    const buyer = await User.findById(buyerId);
    if (!seller && !buyer) {
      throw new Error("Seller and Buyer not found");
    }
    await Promise.all(
      products.map(async (product) => {
        const checkProduct = await Product.findById(product.productId);
        if (!checkProduct) {
          throw new Error("Product not found");
        }
        total += checkProduct.price * product.quantity;
      })
    );
    const order = await Order.create({
      sellerId,
      buyerId,
      products,
      totalAmount: total,
    });
    res.status(201).json({
      message: "Order created successfully",
      order: await order.populate("sellerId", "name email -_id"),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Order", error: error.message });
  }
};
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("sellerId")
      .populate("buyerId")
      .populate("products.productId");
    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching Order", error: error.message });
  }
};
const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        runValidators: true,
        new: true,
      }
    );
    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Order", error: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Order", error: error.message });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};
