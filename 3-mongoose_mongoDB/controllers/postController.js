const Post = require('../models/Post');
const User = require('../models/User');

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    
    // Check if author exists
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ message: 'Author not found' });
    }
    
    const post = new Post({ title, content, author });
    await post.save();
    
    // Populate author details
    await post.populate('author', 'username email');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Get all posts with author details
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Get post by ID
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

// Get posts by author
const getPostsByAuthor = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.authorId }).populate('author', 'username email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts by author', error: error.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateData = {};
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'username email');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByAuthor,
  updatePost,
  deletePost
}; 