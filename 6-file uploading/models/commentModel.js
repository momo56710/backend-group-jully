const mongoose = require("mongoose");

const schema = mongoose.Schema;

const commentSchema = new schema(
  {
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
    post: {
      type: schema.Types.ObjectId,
      ref: "post",
      required: true,
    },
    attachments: [{
      type: String,
      default: [],
    }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("comment", commentSchema);
