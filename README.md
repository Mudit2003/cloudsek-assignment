#API Documentation

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
- **Description:** Log in to receive an access token, refresh token will directly be assigned to your cookies. 
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
- **Description:** Sends a verification email to the user. The verification email contains a 4 digit OTP. 
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


### Validate OTP
- **Endpoint:** `POST /auth/validateOTP`
- **Description:** Validates the four digit OTP against the stored otp. The otp is stored in redis cache. 
- **Request:**
  ```json
  {
    "email": "example@example.com",
    "otp": "4 digit Code"
  }
  ```
- **Response:**
  ```json
  {
    "message": "OTP is valid"
  }
  ```


### Update Password
- **Endpoint:** `POST /auth/updatePassword`
- **Description:** The password for the user is updated. 
- **Authorization:** Required bearer token in authentication header. The bearer token can be retrived from response header of OTP validation or can be present in the system post login. 
- **Request:**
  ```json
  {
    "password": "your_preferred_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password updated successfully"
  }
  ```

---

## Post API

### Create a Post
- **Endpoint:** `POST /posts`
- **Description:** Creates a new post. The created post is saved to postgres database as well as redis cache. On creation of a new post the first page redis cache is invalidated and data is provided from database. 
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
- **Description:** Retrieves a list of all posts.Uses pagination to retrive only the posts for that particular page. Posts are retrived from the redis cache if available else are fetched from PostgreSQL DB. If no page and limit values are provided by default first page will be fetched with a limit of 20. 
- **Request:**
  ```json
  {
    "page": 1,
    "limit": 6,
  }
  ```
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
- **Description:** Updates a post by ID. The page number is also required because the page cache is invalidated on updation. 
- **Request:**
  ```json
  {
    "title": "Updated Post Title",
    "content": "Updated content",
    "page":6
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

The API includes structured error responses for various scenarios, with detailed error messages and appropriate HTTP status codes. Below are common errors categorized by type.

## Common Error Responses

### Authentication & Authorization Errors

- **401 Unauthorized**:
  - **InvalidCredentialsError**: Incorrect username or password.
  - **UserNotAuthenticatedError**: User is not authenticated.
  - **AccessTokenMissingError**: Access token is missing.

- **403 Forbidden**:
  - **InvalidAccessTokenError**: Invalid or expired access token.
  - **InvalidRefreshTokenError**: Invalid or expired refresh token.
  - **RefreshTokenMissingError**: Refresh token is missing.
  - **PermissionDeniedError**: User lacks required permissions.

- **429 Too Many Requests**:
  - **RateLimitExceededError**: Rate limit for requests has been exceeded.

### User Errors

- **404 Not Found**:
  - **UserNotFoundError**: The specified user could not be found.

- **400 Bad Request**:
  - **EmailVerificationError**: Email verification failed.
  - **OTPValidationError**: Invalid OTP.
  - **PasswordChangeError**: Error during password change.

### Post Errors

- **404 Not Found**:
  - **PostNotFoundError**: The specified post could not be found.

- **400 Bad Request**:
  - **PostCreationError**: Error creating a post.
  - **PostUpdateError**: Error updating the post.

- **500 Internal Server Error**:
  - **PostDeletionError**: Error deleting the post.
  - **DatabaseConnectionError**: Failed to connect to the database.

### Comment Errors

- **404 Not Found**:
  - **CommentNotFoundError**: The specified comment could not be found.

- **400 Bad Request**:
  - **CommentCreationError**: Error creating a comment.
  - **CommentUpdateError**: Error updating a comment.

- **500 Internal Server Error**:
  - **CommentDeletionError**: Error deleting a comment.

### Notification Errors

- **500 Internal Server Error**:
  - **NotificationCreationError**: Error creating notification.
  - **NotificationRetrievalError**: Error retrieving notifications.
  - **NotificationDeletionError**: Error deleting notifications.

### General Errors

- **500 Internal Server Error**:
  - **DatabaseConnectionError**: An error occurred while connecting to the database.

### Example Error Response Structure

```json
{
  "error": {
    "name": "ErrorType",
    "status": 400,
    "message": "Detailed error message."
  }
}
```

## Notifications
Notifications are created and stored in the database if unread. If the user is connected then the notification is published to the redis queue and subscribed by the socket.io. On retriving the notification the notification is emitted via socket io channels. 

### Channels 
- **newComment**: Notification of a new comment to the author of the post. 
- **newReply**: Notification of reply to author of a comment. 
- **newPost**: Notification of new posts for users to retrive the posts further on requirement. 

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

