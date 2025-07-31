const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 3 && v.length < 30;
        },
        message: "title must be between 3 and 30 characters",
      },
    },
    description: {
      type: String,

      validate: {
        validator: function (v) {
          return v.length > 10;
        },
        message: "description must be at least 10 characters",
      },
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "price must be greater than 0",
      },
    },
    stock: {
      type: Number,
      default: 0,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("product", productSchema);
