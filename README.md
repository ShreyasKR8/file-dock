# FileDock

FileDock is a file management and storage application built with Express and Prisma. It allows authenticated users to upload, organize, view, and download files through a folder-based storage system.

This project is based on the [File Uploader project](https://www.theodinproject.com/lessons/nodejs-file-uploader) from The Odin Project's Node.js curriculum.

## Features

- User authentication with Passport.js
- Persistent database-backed user sessions
- File uploads with Multer
- Create, view, rename, and delete folders
- Upload files to the root directory or into folders
- View files contained within folders
- View file details including name, size, and upload date
- Download uploaded files
- User-based ownership and access control
- File type and size validation

## Planned Features

- Cloud file storage with Supabase Storage
- Google OAuth 2.0 authentication
- Multiple file uploads
- File and folder search
- File and folder deletion
- Shareable folder links with configurable expiration

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Passport.js
- Multer
- EJS

Cloud storage will be integrated using Supabase Storage.

## Getting Started

The project is currently under development. Setup and installation instructions will be added as the project progresses.

## License

This project is licensed under the MIT License.
