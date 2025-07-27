# Express API with Mongoose Models

A simple Express.js API with User and Post models using Mongoose and MongoDB. Features password hashing with bcrypt.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB server (make sure MongoDB is running on localhost:27017)

3. Start the server:
```bash
node index.js
```

The server will run on `http://localhost:3000`

## API Endpoints

### Users

#### Create User
- **POST** `/api/users`
- **Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "_id": "60c72b2f9b1e8e1a4c8b4567",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

#### Get All Users
- **GET** `/api/users`
- **Response:**
```json
[
  {
    "_id": "60c72b2f9b1e8e1a4c8b4567",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2023-12-07T10:30:00.000Z"
  }
]
```

#### Get User by ID
- **GET** `/api/users/:id`
- **Response:**
```json
{
  "_id": "60c72b2f9b1e8e1a4c8b4567",
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

#### Update User
- **PUT** `/api/users/:id`
- **Body:**
```json
{
  "username": "john_updated",
  "email": "john.updated@example.com",
  "password": "newpassword123"
}
```
- **Response:**
```json
{
  "_id": "60c72b2f9b1e8e1a4c8b4567",
  "username": "john_updated",
  "email": "john.updated@example.com",
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

#### Delete User
- **DELETE** `/api/users/:id`
- **Response:**
```json
{
  "message": "User deleted successfully"
}
```

### Posts

#### Create Post
- **POST** `/api/posts`
- **Body:**
```json
{
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "author": "60c72b2f9b1e8e1a4c8b4567"
}
```
- **Response:**
```json
{
  "_id": "60c72b2f9b1e8e1a4c8b4568",
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "author": {
    "_id": "60c72b2f9b1e8e1a4c8b4567",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

#### Get All Posts
- **GET** `/api/posts`
- **Response:**
```json
[
  {
    "_id": "60c72b2f9b1e8e1a4c8b4568",
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "author": {
      "_id": "60c72b2f9b1e8e1a4c8b4567",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "createdAt": "2023-12-07T10:30:00.000Z"
  }
]
```

#### Get Post by ID
- **GET** `/api/posts/:id`
- **Response:**
```json
{
  "_id": "60c72b2f9b1e8e1a4c8b4568",
  "title": "My First Post",
  "content": "This is the content of my first post.",
  "author": {
    "_id": "60c72b2f9b1e8e1a4c8b4567",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

#### Get Posts by Author
- **GET** `/api/posts/author/:authorId`
- **Response:**
```json
[
  {
    "_id": "60c72b2f9b1e8e1a4c8b4568",
    "title": "My First Post",
    "content": "This is the content of my first post.",
    "author": {
      "_id": "60c72b2f9b1e8e1a4c8b4567",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "createdAt": "2023-12-07T10:30:00.000Z"
  }
]
```

#### Update Post
- **PUT** `/api/posts/:id`
- **Body:**
```json
{
  "title": "Updated Post Title",
  "content": "Updated content for the post."
}
```
- **Response:**
```json
{
  "_id": "60c72b2f9b1e8e1a4c8b4568",
  "title": "Updated Post Title",
  "content": "Updated content for the post.",
  "author": {
    "_id": "60c72b2f9b1e8e1a4c8b4567",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "createdAt": "2023-12-07T10:30:00.000Z"
}
```

#### Delete Post
- **DELETE** `/api/posts/:id`
- **Response:**
```json
{
  "message": "Post deleted successfully"
}
```

## Features

- **Password Hashing**: User passwords are automatically hashed using bcrypt before saving
- **Data Validation**: Mongoose schemas include validation for required fields and unique constraints
- **Population**: Post responses include populated author details
- **Error Handling**: Comprehensive error handling for all endpoints
- **CRUD Operations**: Full Create, Read, Update, Delete functionality for both Users and Posts

## Database Models

### User Model
- `username` (String, required, unique)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `createdAt` (Date, auto-generated)

### Post Model
- `title` (String, required)
- `content` (String, required)
- `author` (ObjectId, required, references User)
- `createdAt` (Date, auto-generated)

## Error Responses

All endpoints return appropriate HTTP status codes and error messages:

- `400` - Bad Request (validation errors, duplicate entries)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error (server errors)

Example error response:
```json
{
  "message": "User with this email or username already exists"
}
``` 