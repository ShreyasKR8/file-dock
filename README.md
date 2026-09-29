# FileDock

FileDock is a file management and storage application built with Express and Prisma. It allows authenticated users to upload, organize, view, download, and delete files through a folder-based storage system.

This project is based on the [File Uploader project](https://www.theodinproject.com/lessons/nodejs-file-uploader) from The Odin Project's Node.js curriculum.

## Features

- User authentication with Passport.js
- Persistent database-backed user sessions
- Direct-to-cloud file uploads with Supabase Storage
- Resumable file uploads using `tus-js-client`
- Signed upload authorization
- Create, view, rename, and delete folders
- Upload files to the root directory or into folders
- View files contained within folders
- View file details including name, size, and upload date
- Download uploaded files
- Delete files from cloud storage and the database
- User-based ownership and access control
- File type and size validation

## Planned Features

- Google OAuth 2.0 authentication
- Multiple file uploads
- File and folder search
- Shareable folder links with configurable expiration

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Passport.js
- Supabase Storage
- `tus-js-client`
- EJS
- esbuild

## Getting Started

The project is currently under development. Setup and installation instructions will be added as the project progresses.

## License

This project is licensed under the MIT License.
