# School Recruitment API

This is a backend API for a school recruitment platform built with Hono (TypeScript), Prisma (ORM), and PostgreSQL. It handles user authentication, job postings, applications, direct recruitments, and more for students, companies, and admins.

## Quick Start

### Prerequisites
- Node.js (v18+)
- Bun (recommended for faster installs/runs)
- PostgreSQL (local or Docker)
- Prisma CLI: `npm install -g prisma` or `bun add -g prisma`

### Installation
1. Clone the repo:
   ```
   git clone <repo-url>
   cd jagoan-hosting-be
   ```

2. Install dependencies:
   ```
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=3002
   ```

4. Database Setup:
   - Run migrations:
     ```
     bunx prisma migrate dev --name init
     ```
   - Generate Prisma client:
     ```
     bunx prisma generate
     ```

### Running the Server
```
bun run dev
```

The server runs on `http://localhost:3002` by default.

### Health Check
GET `/` - Returns API status.

Example response:
```json
{
  "success": true,
  "message": "School Recruitment API is running",
  "version": "1.0.0"
}
```

## Authentication
- All protected routes require a JWT Bearer token in the `Authorization` header: `Bearer <token>`.
- Roles: `STUDENT`, `COMPANY`, `ADMIN`.
- Login/Register to obtain tokens.

## API Documentation

Base URL: `http://localhost:3002`

### 1. Auth Routes (`/auth`)
Handles user registration, login, and profile retrieval.

- **POST `/auth/register`**
  - Description: Register a new user (student/company/admin).
  - Body: `{ "email": string, "password": string, "role": "STUDENT|COMPANY|ADMIN", ...profileData }`
  - Response: `{ success: true, data: { user, token } }`
  - Auth: None

- **POST `/auth/login`**
  - Description: Login user.
  - Body: `{ "email": string, "password": string }`
  - Response: `{ success: true, data: { user, token } }`
  - Auth: None

- **GET `/auth/me`**
  - Description: Get current user profile.
  - Response: `{ success: true, data: user }`
  - Auth: Required

### 2. Students Routes (`/students`)
Student-specific operations.

- **GET `/students`**
  - Description: Get all students (admin only).
  - Query: `?limit=10&offset=0`
  - Response: `{ success: true, data: [students] }`
  - Auth: ADMIN

- **GET `/students/:userId`**
  - Description: Get student by user ID.
  - Response: `{ success: true, data: studentProfile }`
  - Auth: None (public) or Required

- **PUT `/students/:userId`**
  - Description: Update student profile.
  - Body: `{ fullName: string, address?: string, ... }`
  - Response: `{ success: true, data: updatedStudent }`
  - Auth: STUDENT (own profile)

- **POST `/students/:userId/cv`**
  - Description: Upload student CV.
  - Multipart form: `file` (PDF/DOC)
  - Response: `{ success: true, data: cv }`
  - Auth: STUDENT

### 3. Companies Routes (`/companies`)
Company-specific operations.

- **GET `/companies`**
  - Description: Get all companies.
  - Query: `?limit=10&offset=0`
  - Response: `{ success: true, data: [companies] }`
  - Auth: None

- **GET `/companies/:userId`**
  - Description: Get company by user ID.
  - Response: `{ success: true, data: companyProfile }`
  - Auth: None

- **PUT `/companies/:userId`**
  - Description: Update company profile.
  - Body: `{ companyName: string, address?: string, ... }`
  - Response: `{ success: true, data: updatedCompany }`
  - Auth: COMPANY (own profile)

### 4. Jobs Routes (`/jobs`)
Job postings and management.

- **GET `/jobs`**
  - Description: Get all active job postings.
  - Query: `?limit=10&offset=0&location=Jakarta&title=Developer`
  - Response: `{ success: true, data: [jobs] }`
  - Auth: None

- **POST `/jobs`**
  - Description: Create new job posting (company only, pending approval).
  - Body: `{ jobTitle: string, description: string, location?: string, salaryRange?: string, ... }`
  - Response: `{ success: true, data: job }`
  - Auth: COMPANY

- **GET `/jobs/:id`**
  - Description: Get job by ID.
  - Response: `{ success: true, data: job }`
  - Auth: None

- **PUT `/jobs/:id`**
  - Description: Update job (company only).
  - Body: `{ status?: string, ... }`
  - Response: `{ success: true, data: updatedJob }`
  - Auth: COMPANY (own job)

### 5. Applications Routes (`/applications`)
Job applications.

- **POST `/applications/jobs/:jobId/apply`**
  - Description: Apply to a job (student only).
  - Body: `{ studentCvId: string, notes?: string }`
  - Response: `{ success: true, data: application }`
  - Auth: STUDENT
  - Note: Job must be ACTIVE.

- **GET `/applications/my`**
  - Description: Get my applications (student/company).
  - Query: `?status=PENDING&limit=10`
  - Response: `{ success: true, data: [applications] }`
  - Auth: STUDENT or COMPANY

- **GET `/applications/:id`**
  - Description: Get application by ID.
  - Response: `{ success: true, data: application }`
  - Auth: Required (owner or admin)

### 6. Admin Routes (`/admin`)
Admin-only operations.

- **GET `/admin/users`**
  - Description: Get all users.
  - Response: `{ success: true, data: [users] }`
  - Auth: ADMIN

- **PUT `/admin/users/:userId/role`**
  - Description: Update user role.
  - Body: `{ role: "STUDENT|COMPANY|ADMIN" }`
  - Response: `{ success: true, data: user }`
  - Auth: ADMIN

- **GET `/admin/jobs`**
  - Description: Get all job postings.
  - Response: `{ success: true, data: [jobs] }`
  - Auth: ADMIN

- **PUT `/admin/jobs/:jobId/status`**
  - Description: Update job status (e.g., APPROVE to ACTIVE).
  - Body: `{ status: string }`
  - Response: `{ success: true, data: job }`
  - Auth: ADMIN

- **GET `/admin/applications`**
  - Description: Get all applications.
  - Response: `{ success: true, data: [applications] }`
  - Auth: ADMIN

### 7. Public Routes (`/public`)
Public data (no auth).

- **GET `/public/news`**
  - Description: Get all news/berita.
  - Query: `?limit=10&offset=0&kategori=IT`
  - Response: `{ success: true, data: [news] }`

- **GET `/public/extracurriculars`**
  - Description: Get all ekskul.
  - Query: `?limit=10&offset=0&kategori=Sports`
  - Response: `{ success: true, data: [ekskul] }`

- **GET `/public/jobs`**
  - Description: Get public job listings (active only).
  - Response: `{ success: true, data: [jobs] }`

### 8. Bookmarks Routes (`/bookmarks`)
Student bookmarks for jobs.

- **GET `/bookmarks`**
  - Description: Get my bookmarks.
  - Response: `{ success: true, data: [bookmarks] }`
  - Auth: STUDENT

- **POST `/bookmarks`**
  - Description: Add job to bookmarks.
  - Body: `{ jobPostingId: string }`
  - Response: `{ success: true, data: bookmark }`
  - Auth: STUDENT

- **DELETE `/bookmarks/:id`**
  - Description: Remove bookmark.
  - Response: `{ success: true, message: "Deleted" }`
  - Auth: STUDENT

### 9. Reviews Routes (`/reviews`)
Company reviews by students.

- **GET `/reviews/company/:companyId`**
  - Description: Get reviews for a company.
  - Query: `?limit=10&offset=0`
  - Response: `{ reviews: [...], stats: { averageRating: number, totalReviews: number } }`
  - Auth: None

- **POST `/reviews`**
  - Description: Create review (after application/interview).
  - Body: `{ companyProfileId: string, rating: 1-5, title: string, comment?: string }`
  - Response: `{ success: true, data: review }`
  - Auth: STUDENT

- **GET `/reviews/my`**
  - Description: Get my reviews.
  - Response: `{ success: true, data: [reviews] }`
  - Auth: STUDENT

### 10. Portfolios Routes (`/portfolios`)
Student portfolios.

- **GET `/portfolios/public`**
  - Description: Get public portfolios.
  - Query: `?limit=10&offset=0`
  - Response: `{ success: true, data: [portfolios] }`
  - Auth: None

- **GET `/portfolios/my`**
  - Description: Get my portfolios.
  - Query: `?public=true` (filter public only)
  - Response: `{ success: true, data: [portfolios] }`
  - Auth: STUDENT

- **POST `/portfolios`**
  - Description: Create portfolio.
  - Body: `{ title: string, description?: string, url?: string, isPublic?: boolean }`
  - Response: `{ success: true, data: portfolio }`
  - Auth: STUDENT

- **GET `/portfolios/search`**
  - Description: Search portfolios.
  - Query: `?q=keyword`
  - Response: `{ success: true, data: [portfolios] }`
  - Auth: None

### 11. Direct Recruitments (`/direct-recruitments`)
Direct recruitment by companies to students.

- **GET `/direct-recruitments`**
  - Description: Get all (admin) or my recruitments.
  - Response: `{ success: true, data: [recruitments] }`
  - Auth: Required

- **POST `/direct-recruitments`**
  - Description: Create direct recruitment (company to student).
  - Body: `{ studentProfileId: string, message?: string, status: "PENDING" }`
  - Response: `{ success: true, data: recruitment }`
  - Auth: COMPANY

### 12. Notifications (`/notifications`)
User notifications.

- **GET `/notifications`**
  - Description: Get user notifications.
  - Query: `?read=false&limit=10`
  - Response: `{ success: true, data: [notifications] }`
  - Auth: Required

- **POST `/notifications/:id/read`**
  - Description: Mark notification as read.
  - Response: `{ success: true, data: notification }`
  - Auth: Required (own)

### 13. Interviews (`/interviews`)
Interview scheduling/management.

- **GET `/interviews`**
  - Description: Get my interviews.
  - Response: `{ success: true, data: [interviews] }`
  - Auth: Required

- **POST `/interviews`**
  - Description: Schedule interview.
  - Body: `{ applicationId: string, date: string, notes?: string }`
  - Response: `{ success: true, data: interview }`
  - Auth: COMPANY or ADMIN

### 14. Messages (`/messages`)
In-app messaging.

- **GET `/messages`**
  - Description: Get conversations/messages.
  - Query: `?conversationId=uuid&limit=20`
  - Response: `{ success: true, data: [messages] }`
  - Auth: Required

- **POST `/messages`**
  - Description: Send message.
  - Body: `{ recipientId: string, content: string }`
  - Response: `{ success: true, data: message }`
  - Auth: Required

### 15. Settings (`/settings`)
User settings.

- **GET `/settings`**
  - Description: Get user settings.
  - Response: `{ success: true, data: settings }`
  - Auth: Required

- **PUT `/settings`**
  - Description: Update settings (e.g., notifications, privacy).
  - Body: `{ emailNotifications: boolean, ... }`
  - Response: `{ success: true, data: settings }`
  - Auth: Required

### 16. Activity Logs (`/activity-logs`)
Admin activity logs.

- **GET `/activity-logs`**
  - Description: Get activity logs.
  - Query: `?userId=uuid&limit=50`
  - Response: `{ success: true, data: [logs] }`
  - Auth: ADMIN

### 17. Example Routes (`/example`)
Test/example endpoints.

- **GET `/example`**
  - Description: Example endpoint.
  - Response: `{ success: true, data: "Hello World" }`
  - Auth: None

## Error Handling
- Standard responses: `{ success: boolean, data?: any, error?: string }`
- HTTP Status: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error.

## Database
- PostgreSQL with Prisma ORM.
- Schema: See `prisma/schema.prisma`.
- Models: User, StudentProfile, CompanyProfile, JobPosting, JobApplication, etc.

## Testing
Use tools like curl, Postman, or Insomnia. Example curl for login:
```
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Deployment
- Use Docker: `docker build -t api . && docker run -p 3002:3002 api`
- Environment: Set DATABASE_URL and JWT_SECRET.

## Contributing
- Fork, branch, PR.
- Run `bun run lint` and `bunx prisma generate` before commit.

For questions, contact the maintainer.
