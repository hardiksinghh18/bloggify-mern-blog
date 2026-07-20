# Bloggify ✍️

Bloggify is a modern, responsive **MERN (MongoDB, Express, React, Node.js)** blogging application featuring rich content writing, administrative content moderation, real-time social/admin notifications, Google OAuth authentication, and user profile management.

---

## 🚀 Key Features

* **Content Moderation**: Dynamic Admin Dashboard to manage users, roles (User vs Admin), and delete violating blog posts or comments.
* **Notification System**: Navbar alerts telling users when they receive likes, comments, new followers, or when an admin deletes their content (with selected reasons).
* **Rich Writing Space**: Interactive rich text editor (React Quill) supporting header tags, lists, links, and image uploads.
* **Social Connections**: Follow and unfollow users, view follower/following directories, and explore trending posts with time-decay algorithms.
* **Google OAuth**: Fast login and registration using Google authentication.
* **Cloudinary Media Integrations**: Profile picture crops and blog banner uploads processed securely on the cloud.

---

## 🛠️ Project Structure

```text
bloggify/
├── backend/            # Express, Node server & MongoDB schemas
│   ├── middleware/     # verifyuser & verifyadmin checks
│   ├── models/         # User, Blog, Comment, and Notification models
│   └── index.js        # API routers & server bootstrap
└── client/             # React front-end (Redux RTK Query)
    ├── src/
    │   ├── components/ # Navigation, route guards, and UI components
    │   ├── features/   # RTK Query apiSlices (auth, admin, notifications)
    │   └── Pages/      # Page layout views (Dashboard, User Profile)
    └── tailwind.config.js
```

---

## 📦 Setup Instructions

### 1. Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v16+ recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account

---

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the sample:
   ```bash
   cp .env.sample .env
   ```
4. Configure the environment variables in `.env`:
   * Set your `MONGO_USERNAME` and `MONGO_PASSWORD` credentials.
   * Set `ACCESS_TOKEN_KEY` and `REFRESH_TOKEN_KEY` (secure random strings).
   * Fill in your **Cloudinary** credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
   * Set your `GOOGLE_CLIENT_ID` for authentication.
5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(Running by default on `http://localhost:4000`)*

---

### 3. Frontend Client Setup
1. Open a new terminal in the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the sample:
   ```bash
   cp .env.sample .env
   ```
4. Configure the environment variables in `.env`:
   * Set `REACT_APP_BASE_URL` to point to the backend URL (`http://localhost:4000`).
   * Set `REACT_APP_GOOGLE_CLIENT_ID` to match the Google client ID configured in your backend.
5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(Running by default on `http://localhost:3000`)*

---

### 4. Admin Privileges Setup
Since new users default to the `'user'` role:
1. Register a new account on the application.
2. Open your MongoDB collection (Atlas console or Compass).
3. Update your record in the `registers` collection to assign admin rights:
   ```javascript
   db.registers.updateOne(
       { email: "your-registered-email@example.com" }, 
       { $set: { role: "admin" } }
   )
   ```
4. Log back in on the site, and you will see the **Admin Dashboard** option appear in the profile dropdown!