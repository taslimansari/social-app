const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, async (req, res) => {
  const post = await Post.create({
    userId: req.user.id,
    username: req.user.username,
    text: req.body.text,
    image: req.body.image
  });
  res.json(post);
});

router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

router.put("/:id/like", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  const liked = post.likes.find(l => l.username === req.user.username);

  if (liked) {
    post.likes = post.likes.filter(l => l.username !== req.user.username);
  } else {
    post.likes.push({ username: req.user.username });
  }

  await post.save();
  res.json(post);
});

router.post("/:id/comment", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({
    username: req.user.username,
    text: req.body.text
  });
  await post.save();
  res.json(post);
});

module.exports = router;
