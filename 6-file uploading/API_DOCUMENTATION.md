# Blog API Documentation

## Overview
This is a comprehensive REST API for a blog system with Users, Posts, Comments, and Categories.

## Base URL
```
http://localhost:${PORT}
```

## Common Query Parameters

### Pagination
- `page` (integer): Page number (default: 1)
- `limit` (integer): Number of items per page (default: 10)

### Sorting
- `sortBy` (string): Field to sort by (default: 'createdAt')
- `sortOrder` (string): 'asc' or 'desc' (default: 'desc')

### Search
- `search` (string): Search term for text fields

## Response Format
All responses follow this format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {...},
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Endpoints

### Users
Base path: `/users`

#### GET /users
Get all users with pagination and search
- Query params: `page`, `limit`, `search`, `role`, `isActive`, `sortBy`, `sortOrder`
- Search fields: `name`, `email`

#### GET /users/:id
Get user by ID

#### POST /users
Create new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user" // optional: admin, user, moderator
}
```

#### PUT /users/:id
Update user

#### DELETE /users/:id
Delete user

### Posts
Base path: `/posts`

#### GET /posts
Get all posts with pagination and search
- Query params: `page`, `limit`, `search`, `userId`, `sortBy`, `sortOrder`
- Search fields: `title`, `content`

#### GET /posts/:id
Get post by ID

#### POST /posts
Create new post
```json
{
  "title": "Post Title",
  "content": "Post content...",
  "user": "userId"
}
```

#### PUT /posts/:id
Update post

#### DELETE /posts/:id
Delete post

### Comments
Base path: `/comments`

#### GET /comments
Get all comments with pagination and search
- Query params: `page`, `limit`, `search`, `postId`, `userId`, `sortBy`, `sortOrder`
- Search fields: `content`

#### GET /comments/:id
Get comment by ID

#### POST /comments
Create new comment
```json
{
  "content": "Comment content...",
  "post": "postId",
  "user": "userId"
}
```

#### PUT /comments/:id
Update comment

#### DELETE /comments/:id
Delete comment

### Categories
Base path: `/categories`

#### GET /categories
Get all categories with pagination and search
- Query params: `page`, `limit`, `search`, `sortBy`, `sortOrder`
- Search fields: `name`, `description`

#### GET /categories/:id
Get category by ID

#### POST /categories
Create new category
```json
{
  "name": "Technology",
  "description": "Tech related posts",
  "posts": ["postId1", "postId2"] // optional
}
```

#### PUT /categories/:id
Update category

#### DELETE /categories/:id
Delete category

## Example Usage

### Get users with pagination
```
GET /users?page=1&limit=5&search=john&role=user
```

### Get posts by user
```
GET /posts?userId=64f1234567890abcdef12345&page=1&limit=10
```

### Get comments for a post
```
GET /comments?postId=64f1234567890abcdef12345&sortBy=createdAt&sortOrder=asc
```

### Search categories
```
GET /categories?search=technology&sortBy=name&sortOrder=asc
```

## Error Handling

### Common Error Responses
- 400 Bad Request: Invalid input data
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```
