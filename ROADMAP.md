# FileDock Roadmap

This roadmap outlines the planned development of FileDock beyond the initial core file-management functionality. The focus is on improving storage, authentication, sharing, usability, and production readiness while keeping the project scope practical.

## Current Functionality

- User registration and login with local authentication
- Persistent user sessions
- Folder CRUD operations
- File uploads
- File details view
- File downloads
- File size validation

## Planned Features

### 1. Cloud Storage Integration

Migrate file storage from the local filesystem to Supabase Storage.

- Upload files to Supabase Storage
- Store the file storage path and/or URL in the database
- Download files from cloud storage
- Remove files from storage when their corresponding database records are deleted
- Keep storage access scoped to the owning user

### 2. File Validation

Strengthen upload validation before files are persisted.

- Restrict unsupported file types
- Enforce file-size limits
- Handle Multer validation errors
- Display clear upload error messages

### 3. OAuth 2.0 Authentication

Extend the existing local authentication system with OAuth 2.0.

- Add Google sign-in
- Support both local and OAuth-based accounts
- Handle duplicate email and account-linking scenarios

### 4. Expiring Folder Share Links

Allow authenticated users to generate public, time-limited links for folders.

- Generate secure share tokens
- Allow users to choose an expiration duration
- Add a public read-only `/share/:token` route
- Reject expired or invalid links
- Allow shared folders and their contents to be viewed without authentication

### 5. Multiple File Uploads

Extend the upload workflow to support multiple files in a single request.

- Add multi-file selection
- Set a maximum number of files per upload
- Upload multiple files to cloud storage
- Persist metadata for each uploaded file
- Handle partial upload failures safely

### 6. Search and Sorting

Improve file discovery and organization.

- Search files by filename
- Sort by filename
- Sort by upload date
- Sort by file size
- Optionally filter by file type

## Production Readiness

Before considering the project feature-complete:

- Add tests for critical authentication, file, and sharing flows
- Improve error handling
- Refactor duplicated logic into reusable services where appropriate
- Review authorization checks across protected routes
- Deploy the application
- Update project documentation
- Add screenshots and usage instructions

## Future Considerations

These features are intentionally outside the current scope but may be explored later:

- Nested folders
- Drag-and-drop uploads
- File previews
- Bulk file operations
- Storage usage quotas
- Trash and restore functionality
- Resumable or chunked uploads
