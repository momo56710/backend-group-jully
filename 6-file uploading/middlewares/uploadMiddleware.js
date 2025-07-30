const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine model folder based on field name
    let modelFolder = 'uploads';
    
    if (file.fieldname === 'avatar') {
      modelFolder = 'uploads/users';
    } else if (file.fieldname === 'images') {
      modelFolder = 'uploads/posts';
    } else if (file.fieldname === 'attachments') {
      modelFolder = 'uploads/comments';
    } else if (file.fieldname === 'image') {
      modelFolder = 'uploads/posts';
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(modelFolder)) {
      fs.mkdirSync(modelFolder, { recursive: true });
    }
    cb(null, modelFolder);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Image filter function
const imageFilter = (req, file, cb) => {
  // Allowed image types only
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    
  ];

  if (allowedImageTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid image type: ${file.mimetype}. Only JPEG, PNG, GIF images are allowed.`), false);
  }
};

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types (images + documents)
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, GIF, PDF, TXT, DOC, DOCX files are allowed.`), false);
  }
};

// Configure multer for images only
const uploadImages = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

// Configure multer for all files (images + documents)
const uploadFiles = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  }
});

// Middleware for single image upload
const uploadSingleImage = (fieldName) => {
  return (req, res, next) => {
    uploadImages.single(fieldName)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  };
};

// Middleware for multiple images upload
const uploadMultipleImages = (fieldName, maxCount = 10) => {
  return (req, res, next) => {
    uploadImages.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  };
};

// Middleware for single file upload (images + documents)
const uploadSingleFile = (fieldName) => {
  return (req, res, next) => {
    uploadFiles.single(fieldName)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  };
};

// Middleware for multiple files upload (images + documents)
const uploadMultipleFiles = (fieldName, maxCount = 10) => {
  return (req, res, next) => {
    uploadFiles.array(fieldName, maxCount)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  };
};

// Middleware for multiple fields with different file counts
const uploadFields = (fields) => {
  return (req, res, next) => {
    uploadFiles.fields(fields)(req, res, (err) => {
      if (err) {
        return handleUploadError(err, req, res, next);
      }
      next();
    });
  };
};

// Error handling middleware
const handleUploadError = (error, req, res, next) => {  
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name in file upload.'
      });
    }
    if (error.code === 'LIMIT_FIELD_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many fields in form data.'
      });
    }
  }
  
  // Handle file type validation errors
  if (error.message && (
    error.message.includes('Invalid image type') || 
    error.message.includes('Invalid file type')
  )) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Handle other multer errors
  if (error.message && error.message.includes('Unexpected field')) {
    return res.status(400).json({
      success: false,
      message: 'Unexpected field in form data.'
    });
  }

  // Handle file system errors
  if (error.code === 'ENOENT') {
    return res.status(500).json({
      success: false,
      message: 'File system error occurred.'
    });
  }

  // Handle permission errors
  if (error.code === 'EACCES') {
    return res.status(500).json({
      success: false,
      message: 'Permission denied for file upload.'
    });
  }

  // Generic error response
  return res.status(500).json({
    success: false,
    message: 'File upload error occurred.',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  uploadSingleFile,
  uploadMultipleFiles,
  uploadFields,
  handleUploadError
}; 