
# FileDock

FileDock is a file management and storage application built with Express and Prisma. It allows authenticated users to upload, organize, view, download, and delete files through a folder-based storage system.

This project is based on the [File Uploader project](https://www.theodinproject.com/lessons/nodejs-file-uploader) from The Odin Project's Node.js curriculum.

## Features

- User registration and login with Passport.js
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

- Shareable folder links with configurable expiration and revocation
- Google OAuth 2.0 / OpenID Connect authentication
- Multiple file uploads
- File search and sorting
- Automated testing and security improvements
- Production deployment

See [ROADMAP.md](./ROADMAP.md) for the detailed development roadmap.

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Passport.js

### Frontend
- EJS
- JavaScript
- esbuild

### Cloud Storage
- Supabase Storage
- `tus-js-client`

## Getting Started

FileDock is currently under development. Complete installation and environment configuration instructions will be added as the project progresses.

### Run the Application

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm start
```

The start script automatically builds the browser upload bundle before launching the application.

### Running Directly with Node.js

If starting the application directly:

```bash
npm run build:client
node app.js
```

Run `npm run build:client` again after pulling changes that affect the frontend upload code.

### Environment Configuration

The application requires PostgreSQL and Supabase Storage configuration.

Refer to `.env.example` for the required environment variables.

Do not commit `.env` files containing credentials or secrets.

## Development Status

FileDock's core file-management functionality and cloud storage integration are implemented.

Current development is focused on expiring folder share links, followed by OAuth authentication, multiple file uploads, and search functionality.

## License

This project is licensed under the MIT License.
