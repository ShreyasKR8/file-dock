# FileDock

[Live Demo](https://file-dock-u0me.onrender.com/)

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
- File type validation and a 50 MiB upload limit
- Upload progress feedback and file deletion confirmation
- Public, read-only folder links with selectable expiration
- Shared file downloads through short-lived signed URLs
- Inline form errors and duplicate folder-name feedback

## Planned Features

- Google OAuth 2.0 / OpenID Connect authentication
- Management and revocation of existing folder share links
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

### Prerequisites

- Node.js compatible with the installed Prisma 7 dependencies
- A PostgreSQL database
- A Supabase project with a private Storage bucket

### Installation and Configuration

From the repository root, install dependencies and create a local environment file:

```bash
npm install
cp .env.example .env
```

Set these values in `.env`:

| Variable | Purpose |
| --- | --- |
| `APP_URL` | Application origin used to generate share links, such as `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Long random secret for sessions |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Server-side Supabase secret key |
| `SUPABASE_BUCKET` | Existing private Storage bucket name |
| `PORT` | Optional server port; defaults to `3000` |

Keep the Supabase secret key server-side and do not commit `.env`.

Generate the Prisma client and browser upload bundle, apply the committed database migrations, and start the server:

```bash
npm run build
npm run db:deploy
npm start
```

Open `http://localhost:3000` (or your configured port). `npm start` only launches the server; run the build separately before starting a fresh checkout or deployment.

### Development

After changing the browser upload code, run `npm run build:client`, or use `npm run dev:client` to rebuild it automatically. Run `npm run db:generate` after schema changes.

### Usage

Register or log in, create a folder, and upload a file into that folder or the root directory. Supported upload types are JPEG, PNG, WebP, MP4, PDF, plain text, and ZIP, up to 50 MiB per file.

Generate a share link from a folder and choose an expiration duration. Anyone with the link can view that folder and download its files without signing in. Invalid links return 404 and expired links return 410. Deleting a folder removes its share-link records; individual link revocation is still planned.

There is currently no automated test suite; `npm test` is a placeholder that exits with an error.

## Development Status

FileDock's core file-management functionality and cloud storage integration are implemented.

Expiring folder sharing and public downloads are implemented. Remaining work includes share-link management and revocation, Google authentication, multiple file uploads, search, automated tests, and production hardening.

## License

This project is licensed under the MIT License.
