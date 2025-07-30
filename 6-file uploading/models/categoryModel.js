const mongoose = require("mongoose");
const schema = mongoose.Schema;

const categorySchema = new schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  posts: {
    type: [schema.Types.ObjectId],
    ref: "post",
  },
});

module.exports = mongoose.model("categories", categorySchema);
