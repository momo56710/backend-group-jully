const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

// Get all comments with search and pagination
const getAllComments = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      postId = '',
      userId = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build search query
    const query = {};
    if (search) {
      query.content = { $regex: search, $options: 'i' };
    }
    if (postId) query.post = postId;
    if (userId) query.user = userId;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get comments with pagination and populate user and post
    const comments = await Comment.find(query)
      .populate('user', 'name email')
      .populate('post', 'title')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalComments = await Comment.countDocuments(query);
    const totalPages = Math.ceil(totalComments / parseInt(limit));

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalComments,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error retrieving comments:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Create new comment
const createComment = async (req, res) => {
  const { content, post: postId, user: userId } = req.body;
  
  if (!content || !postId || !userId) {
    return res.status(400).json({ 
      success: false, 
      message: "Content, post ID, and user ID are required" 
    });
  }
  
  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }
    
    const commentData = { content, post: postId, user: userId };
    
    // Add attachment paths if files were uploaded
    if (req.files && req.files.length > 0) {
      commentData.attachments = req.files.map(file => file.path);
    }
    
    const comment = new Comment(commentData);
    await comment.save();
    
    // Populate user and post details in response
    await comment.populate([
      { path: 'user', select: 'name email' },
      { path: 'post', select: 'title' }
    ]);
    
    res.status(201).json({ 
      success: true, 
      message: "Comment created successfully", 
      data: comment 
    });
  } catch (error) {
    console.error("Error creating comment:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Get comment by ID
const getCommentById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const comment = await Comment.findById(id)
      .populate('user', 'name email')
      .populate('post', 'title');
      
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Comment found", 
      data: comment 
    });
  } catch (error) {
    console.error("Error retrieving comment:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Update comment
const updateComment = async (req, res) => {
  const { id } = req.params;
  
  try {
    const updateData = { ...req.body };
    
    // Add attachment paths if files were uploaded
    if (req.files && req.files.length > 0) {
      updateData.attachments = req.files.map(file => file.path);
    }
    
    const comment = await Comment.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate([
      { path: 'user', select: 'name email' },
      { path: 'post', select: 'title' }
    ]);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Comment updated successfully", 
      data: comment 
    });
  } catch (error) {
    console.error("Error updating comment:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Delete comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Comment deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

module.exports = { 
  getAllComments, 
  createComment, 
  getCommentById, 
  updateComment, 
  deleteComment 
};
