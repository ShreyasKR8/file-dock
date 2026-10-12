
# FileDock Roadmap

This roadmap outlines the development of FileDock beyond its initial file-management functionality. The focus is on authentication, secure file sharing, usability, and production readiness while keeping the project scope practical.

## Completed Features

### 1. Authentication and Authorization

- User registration and login using Passport.js Local Strategy
- Persistent database-backed user sessions
- Password hashing
- User-based ownership and access control
- Protected routes for authenticated users

### 2. File and Folder Management

- Create, view, rename, and delete folders
- Upload files to the root directory or specific folders
- View files within folders
- View file metadata, including name, size, and upload date
- Download files
- Delete files from cloud storage and the database

### 3. Cloud Storage Integration

- Integrate Supabase Storage for cloud-based file storage
- Implement direct-to-cloud uploads
- Support resumable uploads using `tus-js-client`
- Generate signed upload authorization
- Store cloud storage paths in PostgreSQL using Prisma
- Download files from Supabase Storage
- Remove cloud objects when files are deleted
- Enforce ownership checks for file operations

### 4. File Validation

- Restrict uploads to supported MIME types
- Enforce configurable file-size limits
- Reject unsupported uploads
- Display upload errors to users

## Planned Features

### 1. Expiring Folder Share Links — Next Priority

Allow authenticated users to generate public, time-limited links for folders.

- [ ] Design a database model for share links
- [ ] Generate cryptographically secure share tokens
- [ ] Allow users to choose an expiration duration
- [ ] Add a public, read-only `/share/:token` route
- [ ] Validate tokens and reject expired or invalid links
- [ ] Allow unauthenticated users to view shared folders and their contents
- [ ] Provide controlled access to files and downloads
- [ ] Prevent access to folders outside the shared scope
- [ ] Allow folder owners to revoke existing share links

### 2. OAuth 2.0 Authentication

Extend the existing local authentication system with Google sign-in using OAuth 2.0/OpenID Connect.

- [ ] Add Google sign-in
- [ ] Support both local and Google-authenticated accounts
- [ ] Integrate OAuth identities with existing Prisma user records
- [ ] Handle duplicate email addresses and account-linking scenarios
- [ ] Maintain session compatibility with Passport.js
- [ ] Handle authentication failures and callback errors

### 3. Multiple File Uploads

Extend the upload workflow to support multiple files in a single operation.

- [ ] Add multi-file selection
- [ ] Set a configurable maximum number of files per upload
- [ ] Upload files directly to Supabase Storage
- [ ] Persist metadata for each successfully uploaded file
- [ ] Display individual upload progress and errors
- [ ] Handle partial upload failures safely
- [ ] Prevent orphaned storage objects and inconsistent database records

### 4. Search and Sorting

Improve file discovery and organization.

- [ ] Search files by filename
- [ ] Sort files by filename
- [ ] Sort by upload date
- [ ] Sort by file size
- [ ] Optionally filter by file type
- [ ] Ensure search results are scoped to the authenticated user

## Production Readiness

Before considering FileDock feature-complete:

- [ ] Add automated tests for critical authentication, authorization, file, and sharing flows
- [ ] Test expired, revoked, and invalid share links
- [ ] Review authorization checks across protected routes
- [ ] Improve centralized error handling and user-facing error messages
- [ ] Handle inconsistencies between database records and cloud storage
- [ ] Validate configuration and environment variables
- [ ] Review rate limiting and security measures for authentication and public sharing
- [ ] Refactor duplicated logic into reusable services where appropriate
- [ ] Prepare production database migrations
- [ ] Deploy the application
- [ ] Add installation and environment setup instructions
- [ ] Update the README with screenshots and usage examples

## Future Considerations

These features are intentionally outside the current scope but may be explored later:

- Nested folders
- Drag-and-drop uploads
- File previews
- Bulk file operations
- Storage usage quotas
- Trash and restore functionality
- AI-assisted file search and organization

## Development Priorities

1. Expiring folder share links
2. Google OAuth 2.0/OpenID Connect authentication
3. Multiple file uploads
4. File search and sorting
5. Automated testing and security hardening
6. Deployment and documentation

**Goal:** Build a reliable, secure, and maintainable file-management application while gaining practical experience with Express.js, Prisma, PostgreSQL, Passport.js, cloud storage, authentication, and backend system design.
