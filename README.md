# CloudSek Backend API Documentation

## Overview

This API supports CRUD operations for **posts**, **comments**, and **user authentication**, with capabilities like creating posts, adding comments, managing replies, and authenticating users. The API is primarily intended to manage posts and associated comments/replies with user authentication.

### Base URL
`http://localhost:3000/api/v1`

---

## Table of Contents

- [Authentication](#authentication)
- [User API](#user-api)
- [Post API](#post-api)
- [Comment API](#comment-api)
- [Error Handling](#error-handling)
- [Usage Examples](#usage-examples)

---

### Cookies
The cookies are handled from the server side. The refresh token is part of cookies that is already assigned on login. 


### Authentication

Most API requests require Bearer token authentication. Include the token in the `Authorization` header for each request.

Example:
```http
Authorization: Bearer your_token_here
```

---

## User API

### Register User
- **Endpoint:** `POST /auth/register`
- **Description:** Register a new user.
- **Request:**
  ```json
  {
    "username": "exampleUser",
    "email": "example@example.com",
    "password": "securePassword"
  }
  ```
- **Response:**
  ```json
  {
    "id": "user_id",
    "username": "exampleUser",
    "email": "example@example.com",
    "createdAt": "timestamp"
  }
  ```

### Login
- **Endpoint:** `POST /auth/login`
- **Description:** Log in to receive an access token.
- **Request:**
  ```json
  {
    "email": "example@example.com",
    "password": "securePassword"
  }
  ```
- **Response:**
  ```json
  {
    "accessToken": "jwt_token",
    "user": {
      "id": "user_id",
      "username": "exampleUser"
    }
  }
  ```

### Verify Email
- **Endpoint:** `POST /auth/verifyEmail`
- **Description:** Sends a verification email to the user.
- **Request:**
  ```json
  {
    "email": "example@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Verification email sent"
  }
  ```

---

## Post API

### Create a Post
- **Endpoint:** `POST /posts`
- **Description:** Creates a new post.
- **Request:**
  ```json
  {
    "title": "Sample Post",
    "content": "This is a sample post",
    "authorId": "user_id"
  }
  ```
- **Response:**
  ```json
  {
    "id": "post_id",
    "title": "Sample Post",
    "content": "This is a sample post",
    "authorId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

### Get All Posts
- **Endpoint:** `GET /posts`
- **Description:** Retrieves a list of all posts.
- **Response:**
  ```json
  [
    {
      "id": "post_id",
      "title": "Sample Post",
      "content": "This is a sample post",
      "authorId": "user_id",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```

### Get Post by ID
**Endpoint:** GET /posts/:id

**Description:** Retrieves a specific post by its ID.

**Path Parameter:** 

id: The ID of the post to retrieve.


**Response:**

200 OK: Returns the post details.
404 Not Found: Post with the specified ID was not found.
Response Example:

```json
{
  "id": "post_id",
  "title": "Sample Post",
  "content": "This is a sample post",
  "authorId": "user_id",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Update a Post
- **Endpoint:** `PUT /posts/{post_id}`
- **Description:** Updates a post by ID.
- **Request:**
  ```json
  {
    "title": "Updated Post Title",
    "content": "Updated content"
  }
  ```
- **Response:**
  ```json
  {
    "id": "post_id",
    "title": "Updated Post Title",
    "content": "Updated content",
    "authorId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

### Delete a Post
- **Endpoint:** `DELETE /posts/{post_id}`
- **Description:** Deletes a post by ID.
- **Response:** `204 No Content`

---

## Comment API

### Create Comment or Reply
- **Endpoint:** `POST /comments`
- **Description:** Creates a new comment or reply.
- **Request:**
  ```json
  {
    "postId": "post_id",
    "content": "This is a comment",
    "authorId": "user_id",
    "parentCommentId": "optional_comment_id"
  }
  ```
- **Response:**
  ```json
  {
    "id": "comment_id",
    "postId": "post_id",
    "authorId": "user_id",
    "content": "This is a comment",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

### Get Comments by Post
- **Endpoint:** `GET /comments/post/{post_id}`
- **Description:** Retrieves all comments for a specific post.
- **Response:**
  ```json
  [
    {
      "id": "comment_id",
      "postId": "post_id",
      "authorId": "user_id",
      "content": "This is a comment",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
  ```

### Update a Comment
- **Endpoint:** `PUT /comments/{comment_id}`
- **Description:** Updates a comment.
- **Request:**
  ```json
  {
    "content": "Updated comment content"
  }
  ```
- **Response:**
  ```json
  {
    "id": "comment_id",
    "postId": "post_id",
    "authorId": "user_id",
    "content": "Updated comment content",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
  ```

### Delete a Comment
- **Endpoint:** `DELETE /comments/{comment_id}`
- **Description:** Deletes a comment by ID.
- **Response:** `204 No Content`

---

## Error Handling

### Common Error Responses
- **400 Bad Request**: Invalid input or missing fields.
- **401 Unauthorized**: Invalid or missing authentication token.
- **403 Forbidden**: Token errors
- **404 Not Found**: Requested resource not found.
- **500 Internal Server Error**: Unexpected server error.

---

## Usage Examples

### Registering a New User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register -H "Content-Type: application/json" -d '{
  "username": "exampleUser",
  "email": "example@example.com",
  "password": "securePassword"
}'
```

### Creating a New Post
```bash
curl -X POST http://localhost:3000/api/v1/posts -H "Content-Type: application/json" -d '{
  "title": "Sample Post",
  "content": "This is a sample post",
  "authorId": "user_id"
}'
```

### Adding a Comment to a Post
```bash
curl -X POST http://localhost:3000/api/v1/comments -H "Content-Type: application/json" -d '{
  "postId": "post_id",
  "content": "This is a comment",
  "authorId": "user_id"
}'
```

