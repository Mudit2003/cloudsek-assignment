
# Cloudsek Assessment Frontend

A React and TypeScript application designed for managing user authentication, posts, pagination, and real-time updates with an interactive and responsive UI. The app is built with modern libraries and prioritizes form validation, state management, and an engaging user experience.

---

### Features

- **User Authentication**: Secure login, registration, and password reset flows.
- **Protected Routes**: Route protection for authenticated users only.
- **Post Management**: Enables users to create, view, edit, and delete posts.
- **Pagination**: Efficient data browsing through paginated views.
- **Real-time Updates**: Live updates using socket.io-client.
- **Form Handling**: Simplified with react-hook-form and yup for validation.

---

### Project Structure

This project follows a modular and scalable structure for better readability and management.

    src
    ├── @types                # Custom TypeScript type definitions used to have mention property
    ├── Pages                 # Main page components (Login, Register, Home, etc.)
    ├── contexts              # Context API files for global state management
    ├── controllers           # Functions for API requests and business logic
    ├── App.tsx               # Root component, setting up routes and contexts
    ├── AuthContext.tsx       # Authentication context provider
    ├── ProtectedRoute.tsx    # Higher-order component for protected routes
    ├── index.tsx             # Main entry point
    └── styles                # Global and component-specific styling

---

### Pages Directory Overview

The `Pages` folder holds the core pages of the application. Each page is a self-contained component, focusing on a specific feature or section of the app.

- **ForgotPassword**: This page allows users to initiate the password reset process by entering their email. They’ll receive a one-time password (OTP) to verify their identity and set a new password.

- **Home**: The main dashboard or landing page for logged-in users. It displays user-specific information, posts, or other relevant content.

- **Login**: The login page for user authentication, including form validation for credentials. The form utilizes `react-hook-form` for efficient handling and validation with yup.

- **MyPosts**: Displays posts created by the logged-in user, allowing them to edit, delete, or manage their content easily.

- **NewPasswordPage**: This page is where users finalize the password reset process, allowing them to enter a new password after OTP verification.

- **Otp**: Handles the OTP verification process during password resets, ensuring users’ identities are verified before sensitive actions.

- **Pagination**: Handles paginated views for lists, such as posts or users, allowing for better data handling and UX for large datasets.

- **PostCreation**: Page for creating new posts. It includes a form for title, content, and tags, with a rich text editor for enhanced content editing.

- **PostPage**: Displays a detailed view of a single post, including comments and reactions. It integrates real-time updates via socket.io to reflect new comments instantly.

- **Register**: The user registration page, allowing new users to sign up. It includes validation for username, email, and password fields, utilizing `react-hook-form` and yup for streamlined handling.

---

### Key Files and Directories

- **App.tsx**: Sets up the main router and wraps components in context providers.
- **AuthContext.tsx**: Manages global authentication state.
- **ProtectedRoute.tsx**: Higher-order component that protects routes based on user authentication.
- **controllers**: Encapsulates API calls, providing a clean interface for data fetching.

---

### TypeScript Usage

The project uses TypeScript to improve code quality and maintainability. Custom types are organized in the `@types` folder. Key type definitions include:

- **Auth Types**: User data, login payloads, error handling.
- **API Response Types**: Consistent structure for data returned by API calls.
- **Form Types**: Validation schemas integrated with yup.

---

### Getting Started

#### Prerequisites

- **Node.js**: v16 or later
- **npm**: v7 or later (included with Node.js)

#### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd cloudsekfrontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

---

### Available Scripts

- **`npm start`**: Runs the app in development mode.
- **`npm build`**: Builds the app for production.
- **`npm test`**: Runs tests.
- **`npm eject`**: Gives complete control over configuration.

---

### API & State Management

The app uses axios to handle API requests, organized within the `controllers` directory to provide modular data access. 

#### AuthContext

The `AuthContext` manages authentication data and actions, including:

- **Login**: Validates user credentials and updates the auth state.
- **Logout**: Clears auth data from the state.
- **Persistent Sessions**: Maintains user sessions across page reloads.

---

### Protected Routes

Protected routes restrict access to authenticated users only. The `ProtectedRoute` higher-order component guards secure routes and redirects unauthenticated users to the login page.

Example usage:

```tsx
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

---

### Contributing

We welcome contributions! Here’s how to get started:

1. Fork the repository and clone it locally.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Push to your branch and submit a pull request.

---

### License

This project is licensed under the MIT License.

---
