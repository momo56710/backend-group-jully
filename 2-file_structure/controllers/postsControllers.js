const fs = require("fs");
const getPosts = (req, res) => {
  const data = fs.readFileSync("posts.json", "utf-8");
  const posts = JSON.parse(data);
  res.send(posts);
};
const createPost = (req, res) => {
  const data = fs.readFileSync("posts.json", "utf-8");
  const posts = JSON.parse(data);
  posts.push(req.body);
  fs.writeFileSync("posts.json", JSON.stringify(posts));
  res.send(posts);
};
const getPostById = (req, res) => {
  const data = fs.readFileSync("posts.json", "utf-8");
  const posts = JSON.parse(data);
  const post = posts.find((post) => post.id === req.params.id);
  res.send(post);
};
module.exports = { getPosts, createPost, getPostById };
