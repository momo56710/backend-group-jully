# File Upload Guide

This guide explains how to use the multer middleware for file uploads in the Blog API.

## Features

- **Image uploads**: Separate middleware for images only (JPEG, PNG, GIF)
- **File uploads**: Separate middleware for all files (images + documents)
- **Single file upload**: Upload one file at a time
- **Multiple files upload**: Upload multiple files simultaneously
- **File type validation**: Different validation for images vs files
- **File size limits**: Maximum 5MB per file
- **File count limits**: Maximum 10 files per upload
- **Automatic directory creation**: Creates upload directories if they don't exist
- **Unique filename generation**: Prevents filename conflicts

## Supported File Types

### Image Uploads (Images Only)
- JPEG, JPG, PNG, GIF

### File Uploads (Images + Documents)
- Images: JPEG, JPG, PNG, GIF
- Documents: PDF, TXT, DOC, DOCX

## API Endpoints

### 1. User Avatar Upload

**POST** `/users` - Create user with avatar
**PUT** `/users/:id` - Update user with avatar

**Form Data:**
- `name` (string, required)
- `email` (string, required)
- `password` (string, required)
- `avatar` (file, optional) - Image file

### 2. Post Images Upload

**POST** `/posts` - Create post with multiple images
**PUT** `/posts/:id` - Update post with multiple images

**Form Data:**
- `title` (string, required)
- `content` (string, required)
- `images` (files, optional) - Up to 10 image files

### 3. Comment Attachments Upload

**POST** `/comments` - Create comment with attachments
**PUT** `/comments/:id` - Update comment with attachments

**Form Data:**
- `content` (string, required)
- `post` (string, required) - Post ID
- `user` (string, required) - User ID
- `attachments` (files, optional) - Up to 5 files

### 4. Middleware Functions

**Image Uploads:**
- `uploadSingleImage(fieldName)` - Single image upload
- `uploadMultipleImages(fieldName, maxCount)` - Multiple images upload

**File Uploads:**
- `uploadSingleFile(fieldName)` - Single file upload (images + documents)
- `uploadMultipleFiles(fieldName, maxCount)` - Multiple files upload (images + documents)
- `uploadFields(fields)` - Multiple fields with different file counts

## Usage Examples

### Using cURL

#### Upload User Avatar
```bash
curl -X POST http://localhost:3000/users \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "avatar=@/path/to/avatar.jpg"
```

#### Upload Post with Multiple Images
```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My Post" \
  -F "content=This is my post content" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.png" \
  -F "images=@/path/to/image3.gif"
```

#### Upload Comment with Attachments
```bash
curl -X POST http://localhost:3000/comments \
  -F "content=This is my comment" \
  -F "post=POST_ID" \
  -F "user=USER_ID" \
  -F "attachments=@/path/to/file1.pdf" \
  -F "attachments=@/path/to/file2.jpg"
```

### Using JavaScript/Fetch

#### Upload Single Image
```javascript
const formData = new FormData();
formData.append('avatar', imageInput.files[0]);

fetch('/users', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Upload Multiple Images
```javascript
const formData = new FormData();
formData.append('title', 'My Post');
formData.append('content', 'Post content');
for (let file of imageInput.files) {
  formData.append('images', file);
}

fetch('/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Upload Files (Images + Documents)
```javascript
const formData = new FormData();
formData.append('content', 'My comment');
formData.append('post', 'POST_ID');
formData.append('user', 'USER_ID');
for (let file of fileInput.files) {
  formData.append('attachments', file);
}

fetch('/comments', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```



## Response Format

### Success Response
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "filename": "file-1234567890-123456789.jpg",
    "originalname": "image.jpg",
    "path": "uploads/file-1234567890-123456789.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "File too large. Maximum size is 5MB."
}
```

## Error Handling

The middleware handles various upload errors:

- **File too large**: Files exceeding 5MB limit
- **Too many files**: Exceeding file count limits
- **Invalid file type**: Unsupported file formats
- **Unexpected field**: Wrong field name in form data

## File Storage

- Files are organized by model in separate folders:
  - `uploads/users/` - User avatars
  - `uploads/posts/` - Post images
  - `uploads/comments/` - Comment attachments
- Filenames are automatically generated with timestamps to prevent conflicts
- File paths are stored in the database for easy access

## Security Features

- File type validation prevents malicious file uploads
- File size limits prevent server overload
- Unique filename generation prevents path traversal attacks
- Automatic directory creation with proper permissions 