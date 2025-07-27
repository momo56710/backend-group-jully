const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    type: {
      city: { type: String, required: true },
      street: { type: String, required: true },
      building: { type: String, required: true },
    },
    required: true,
  },
  phone: { type: String, required: true },
  accountNumber: { type: Number, required: true },
  bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank", required: true },
});

module.exports = mongoose.model("Customer", customerSchema);
