const Category = require("../models/categoryModel");
const Post = require("../models/postModel");

// Get all categories with search and pagination
const getAllCategories = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build search query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Get categories with pagination and populate posts
    const categories = await Category.find(query)
      .populate('posts', 'title content')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / parseInt(limit));

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCategories,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error retrieving categories:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Create new category
const createCategory = async (req, res) => {
  const { name, description, posts = [] } = req.body;
  
  if (!name || !description) {
    return res.status(400).json({ 
      success: false, 
      message: "Name and description are required" 
    });
  }
  
  try {
    // Validate all posts exist before creating the category
    if (posts.length > 0) {
      for (const postId of posts) {
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ 
            success: false, 
            message: `Post with ID ${postId} not found` 
          });
        }
      }
    }

    const category = new Category({
      name,
      description,
      posts,
    });
    
    await category.save();
    
    // Populate posts in response
    await category.populate('posts', 'title content');
    
    res.status(201).json({ 
      success: true, 
      message: "Category created successfully", 
      data: category 
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Category name already exists" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const category = await Category.findById(id).populate('posts', 'title content user');
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Category found", 
      data: category 
    });
  } catch (error) {
    console.error("Error retrieving category:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { posts } = req.body;
  
  try {
    // If posts are being updated, validate they exist
    if (posts && posts.length > 0) {
      for (const postId of posts) {
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ 
            success: false, 
            message: `Post with ID ${postId} not found` 
          });
        }
      }
    }
    
    const category = await Category.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    ).populate('posts', 'title content');
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Category updated successfully", 
      data: category 
    });
  } catch (error) {
    console.error("Error updating category:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: "Category name already exists" 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  
  try {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: "Category not found" 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: "Category deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};

module.exports = { 
  getAllCategories, 
  createCategory, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
};
