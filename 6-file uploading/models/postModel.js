const mongoose = require("mongoose");

const schema = mongoose.Schema;

const postSchema = new schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
      minlength: 5,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    
    user: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [{
      type: String,
      default: [],
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("post", postSchema);
