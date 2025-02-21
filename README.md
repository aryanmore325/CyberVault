# File Upload & Authentication System

## Live Demo
[Live Application](https://jazzy-pothos-64ba05.netlify.app)

## Overview
This is a full-stack file upload and user authentication system built with **Node.js/Express** for the backend and a **React-based frontend** featuring a **futuristic-retro design**. The system allows users to register, log in, upload, preview, download, and delete files securely.

## Features

### Backend (Node.js/Express)
- **User Authentication**: Secure login and registration using **JWT**.
- **Password Hashing**: Implements bcrypt for password security.
- **File Upload API**: Supports uploading all file types using **Multer**.
- **File Validation**: Restricts file types and sizes for security.
- **CRUD Operations**: Users can **upload, preview, download, and delete** their files.
- **Static File Serving**: Uploaded files can be accessed via URL.
- **Error Handling**: Comprehensive validation and error responses.

### Frontend (React + TailwindCSS)
- **Futuristic-Retro Design**: A modern yet nostalgic UI experience.
- **User Authentication UI**: Login and register forms with validation.
- **Drag & Drop File Upload**: Interactive upload experience.
- **File Preview**: Real-time previews for images, videos, and documents.
- **Progress Bar**: Displays real-time upload progress.
- **File Management**: List of uploaded files with options to preview, download, or delete.
- **Smooth UI Animations**: Enhances user experience with animations.

## Installation & Setup

### Backend Setup
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```sh
   PORT=5000
   JWT_SECRET=your_secret_key
   MONGO_URI=your_mongodb_connection_string
   ```
4. Run the server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## Usage
1. **Register/Login** to the application.
2. **Upload files** via drag-and-drop or the upload button.
3. **Preview files** (images, videos, documents) before download.
4. **Download or delete files** as needed.

## Technologies Used
- **Backend:** Node.js, Express, MongoDB, Multer, JWT, Bcrypt
- **Frontend:** React, TailwindCSS, Axios, React Dropzone
- **Hosting:** Netlify (Frontend), Heroku/Vercel (Backend)

## Future Enhancements
- Add real-time notifications for uploads.
- Implement file categorization.
- Add multi-user collaboration features.

## Contributing
Feel free to submit issues or pull requests to enhance the system!

## License
This project is open-source under the MIT License.

