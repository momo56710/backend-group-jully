const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("order", orderSchema);
// title: {
//     type: String,
//     required: true,
//     validate: {
//       validator: function (v) {
//         return v.length > 3 && v.length < 30;
//       },
//       message: "title must be between 3 and 30 characters",
//     },
//   },
//   description: {
//     type: String,

//     validate: {
//       validator: function (v) {
//         return v.length > 10;
//       },
//       message: "description must be at least 10 characters",
//     },
//   },
//   price: {
//     type: Number,
//     required: true,
//     validate: {
//       validator: function (v) {
//         return v > 0;
//       },
//       message: "price must be greater than 0",
//     },
//   },
//   stock: {
//     type: Number,
//     default: 0,
//   },
