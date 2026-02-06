const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  username: String,

  text: String,
  image: String,

  likes: [{ username: String }],
  comments: [{
    username: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", PostSchema);
