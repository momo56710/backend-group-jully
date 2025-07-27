const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Location: {
    type: {
      altitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);
