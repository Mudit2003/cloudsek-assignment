# Backend (Node + Express + TS + Prisma)

## Table of Contents
- [Project Overview](#project-overview)
- [Backend Structure](#backend-structure)
  - [Folder Description](#folder-description)
- [API Docs](#api-docs)
  - [Authentication](#authentication)
  - [User API](#user-api)
  - [Post API](#post-api)
  - [Comment API](#comment-api)
- [Error Handling](#error-handling)
  - [Common Error Responses](#common-error-responses)


## Project Overview

This project is a robust backend API designed to manage posts, comments, and user authentication, along with efficient caching, real-time notifications, and a highly resilient architecture. Below is an outline of the key technologies and features implemented in this project:

## Key Technologies Used

- **Node.js**: The primary backend framework for building the API.
- **Express.js**: Used to handle HTTP requests and routing.
- **PostgreSQL**: The structured relational database used for storing posts and user data, with Prisma as the ORM.
- **MongoDB**: Used for storing notifications due to its unstructured nature and TTL support.
- **Redis**: Provides caching for posts and a Redis queue for Pub/Sub architecture in notifications.
- **Socket.io**: Used for real-time notifications using WebSockets.
- **Prisma ORM**: A type-safe ORM for managing PostgreSQL database interactions.
- **JWT**: Used for user authentication via access and refresh tokens.
- **Zod**: Centralized validation schema for API request bodies.
- **Helmet**: Adds security headers to the application for enhanced security.
- **Winston**: A versatile logging library used for logging application events and errors.
- **Redis Queue**: Used for Pub/Sub mechanism for notification handling.

# System Design
![Architecture](https://github.com/Mudit2003/cloudsek-assignment/blob/main/image.jpg?raw=true)

## Features and Functionality

### 1. **Caching with Redis**
   - Posts are cached using Redis, with pagination handled via the Redis cache keys, and cache invalidation is done on post creation or updates.
   - Redis is leveraged for handling the Pub/Sub mechanism for real-time notifications.

### 2. **Pagination and Post Management**
   - Posts are retrieved with pagination support, and Redis cache is used for faster retrieval. The `id` field in posts is used for caching, ensuring efficient access.

### 3. **Authentication and Security**
   - The API uses **Bearer tokens** for authentication. Middleware ensures that refresh tokens and access tokens are validated.
   - Refresh tokens are stored in cookies for secure, seamless user sessions.
   - Custom error handling with appropriate status codes is implemented to handle various errors like unauthorized access or invalid credentials.
   - **Helmet** is used for setting secure HTTP headers to protect against common vulnerabilities.
   - **Winston** provides detailed logging of system events, errors, and API interactions.

### 4. **Database Management**
   - **PostgreSQL** is used for structured data storage, especially for posts and user-related data. Prisma is utilized to manage database queries in a type-safe manner.
   - **MongoDB** stores notifications due to its flexibility and TTL support, allowing automatic expiration of notifications after a set period.

### 5. **Real-time Notifications**
   - Notifications are sent using **Socket.io** and are published to the Redis queue for real-time delivery.
   - Different channels like `newComment`, `newReply`, and `newPost` are used to notify users about relevant events.

### 6. **Retry Mechanism**
   - The application has a resilient architecture with retry mechanisms for Redis, MongoDB, and PostgreSQL connections to ensure high availability and fault tolerance.

### 7. **Clean Coding Practices**
   - The project follows clean code principles with a structured folder architecture to enhance maintainability.
   - Centralized validation using **Zod** ensures consistent and secure validation of incoming API requests.

## APIs Overview

The API supports CRUD operations for **posts**, **comments**, and **user authentication**, with capabilities like creating posts, adding comments, managing replies, and authenticating users. The API ensures seamless user experience with features such as:

- **User Authentication**: Register, login, and verify email with OTP stored in Redis.
- **Posts Management**: Create, retrieve, update, and delete posts, with caching and pagination.
- **Comments Management**: Create, update, and delete comments or replies on posts.
- **Error Handling**: Structured error responses with appropriate HTTP status codes for common errors like authentication failure and resource not found.

## Security Features

- **JWT Authentication** for secure API access.
- **Refresh tokens** stored in cookies for maintaining sessions.
- **Secure Headers** set by Helmet to prevent common web vulnerabilities.
- **Rate Limiting** and **Retry Logic** to prevent system overload and ensure high availability.

## Logging and Monitoring

- **Winston** is used for logging all requests, responses, and errors to help with debugging and monitoring the application.

## Backend Structure

Below is the folder structure of the project:

```plaintext
.
├── .env
├── .gitignore
├── ca.pem
├── package-lock.json
├── package.json
├── server.cert
├── server.key
├── tsconfig.json
└── src
    ├── app.ts
    ├── server.ts
    ├── config
    │   ├── logger.config.ts
    │   ├── mail.config.ts
    │   ├── mongo.config.ts
    │   ├── prisma.config.ts
    │   ├── redis.config.ts
    │   └── socket.config.ts
    ├── controllers
    │   ├── auth.controller.ts
    │   ├── comment.controller.ts
    │   ├── post.controller.ts
    │   └── user.controller.ts
    ├── errors
    │   ├── auth.error.ts
    │   ├── comment.error.ts
    │   ├── config.error.ts
    │   ├── notification.error.ts
    │   └── post.error.ts
    ├── interfaces
    │   ├── claim.interface.ts
    │   ├── comment.interface.ts
    │   ├── error.interface.ts
    │   ├── post.interface.ts
    │   ├── replies.interface.ts
    │   └── user.interface.ts
    ├── middlewares
    │   ├── auth.middleware.ts
    │   ├── error.middleware.ts
    │   ├── socketauth.middleware.ts
    │   ├── validate.middleware.ts
    │   └── verifyauth.middleware.ts
    ├── models
    │   └── notification.model.ts
    ├── routes
    │   ├── auth.route.ts
    │   ├── comment.route.ts
    │   ├── post.route.ts
    │   └── user.route.ts
    ├── services
    │   ├── auth.service.ts
    │   ├── comment.service.ts
    │   ├── notification.service.ts
    │   ├── post.service.ts
    │   └── user.service.ts
    ├── utils
    │   ├── cache.util.ts
    │   ├── content.util.ts
    │   ├── error.util.ts
    │   ├── request.util.ts
    │   ├── shutdown.util.ts
    │   ├── socket.util.ts
    │   └── token.util.ts
    └── validation
        ├── comment.schema.ts
        ├── post.schema.ts
        └── user.schema.ts
```

## Folder Description

### 1. **`src/`**
   The main source code directory where all the application code resides. This is where most of the files relevant to the business logic, routing, services, etc., are located.

#### 1.1 **`config/`**
   Contains configuration files for setting up services like logging, email, MongoDB, Redis, etc.

- `logger.config.ts`: Configuration for the logging service.
- `mail.config.ts`: Mail service configuration.
- `mongo.config.ts`: MongoDB configuration.
- `prisma.config.ts`: Configuration for Prisma ORM.
- `redis.config.ts`: Redis configuration for caching.
- `socket.config.ts`: Socket.io configuration.

#### 1.2 **`controllers/`**
   Houses the controller files that handle HTTP requests and responses. Controllers typically interface between the routes and services.

- `auth.controller.ts`: Handles authentication-related requests.
- `comment.controller.ts`: Handles requests related to comments.
- `post.controller.ts`: Manages posts and related requests.
- `user.controller.ts`: Handles user-related requests.

#### 1.3 **`errors/`**
   Contains custom error handling classes for various modules in the app.

- `auth.error.ts`: Error handling related to authentication issues.
- `comment.error.ts`: Error handling related to comment functionalities.
- `config.error.ts`: General configuration errors.
- `notification.error.ts`: Errors associated with notifications.
- `post.error.ts`: Error handling related to posts.

#### 1.4 **`interfaces/`**
   Defines TypeScript interfaces for various entities such as users, posts, comments, etc., ensuring type safety throughout the application.

- `claim.interface.ts`: Interface for claims in the system.
- `comment.interface.ts`: Defines the structure for comment objects.
- `error.interface.ts`: Defines the error structure used in the application.
- `post.interface.ts`: Interface for post objects.
- `replies.interface.ts`: Interface for replies related to posts or comments.
- `user.interface.ts`: Interface for user-related data.

#### 1.5 **`middlewares/`**
   Contains middleware files that are used to process requests before they reach the controllers.

- `auth.middleware.ts`: Middleware to check authentication for protected routes.
- `error.middleware.ts`: Handles error responses.
- `socketauth.middleware.ts`: Middleware for socket authentication.
- `validate.middleware.ts`: Middleware to validate incoming data.
- `verifyauth.middleware.ts`: Verifies the authenticity of requests.

#### 1.6 **`models/`**
   Contains the data models used by the application, typically for interacting with a database.

- `notification.model.ts`: Model representing notification data.

#### 1.7 **`routes/`**
   This directory holds the route definitions for the application. It maps HTTP requests to specific controller methods.

- `auth.route.ts`: Routes related to user authentication.
- `comment.route.ts`: Routes related to comment management.
- `post.route.ts`: Routes for handling posts.
- `user.route.ts`: User-related routes.

#### 1.8 **`services/`**
   Contains the business logic and services for the application. Services perform operations and interact with models and databases.

- `auth.service.ts`: Service for authentication operations.
- `comment.service.ts`: Business logic for comment handling.
- `notification.service.ts`: Service to handle notification logic.
- `post.service.ts`: Service for managing posts.
- `user.service.ts`: Service for user operations.

#### 1.9 **`utils/`**
   Utility functions that provide common functionalities like token generation, error handling, and caching.

- `cache.util.ts`: Caching utility for optimization.
- `content.util.ts`: Utility functions for content formatting.
- `error.util.ts`: Error-related utility functions.
- `request.util.ts`: Utility functions for HTTP requests.
- `shutdown.util.ts`: Functions to handle graceful shutdown of the server.
- `socket.util.ts`: Socket-related utilities.
- `token.util.ts`: Token generation and validation utilities.

#### 1.10 **`validation/`**
   Contains schema files for validating incoming request data using tools like Joi or class-validator.

- `comment.schema.ts`: Validation schema for comment data.
- `post.schema.ts`: Validation schema for post data.
- `user.schema.ts`: Validation schema for user-related data.

---

## Nomenclature Overview

### 1. **File Naming Conventions**
   - **PascalCase** is used for naming files for consistency and easy identification, such as `auth.controller.ts`, `user.service.ts`.
   - **Directories** are generally lowercase (e.g., `config/`, `controllers/`, `services/`) to maintain consistency.

### 2. **Module Structure**
   Each major feature is separated into its own folder (e.g., `controllers/`, `services/`, `models/`) for easier maintenance and organization. Each file inside the folders corresponds to a specific part of the feature, such as authentication, user handling, or post management.

### 3. **Configuration Files**
   Configuration files like `mongo.config.ts`, `redis.config.ts` are grouped together in the `config/` folder to centralize configuration management.

This structure follows the standard Node.js + TypeScript setup and provides a clean and modular way to organize the project for both development and production environments.


# API Docs

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

