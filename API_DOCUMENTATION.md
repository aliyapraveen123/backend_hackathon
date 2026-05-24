# 🚀 NGSkillForge Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 📋 Authentication Endpoints

### 1. Register User (Send OTP)
**POST** `/auth/register`

**Description:** Register new user and send OTP to email

**Request Body:**
```json
{
  "name": "Aliya Parveen",
  "email": "aliya@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered! Please check your email for the OTP."
}
```

---

### 2. Verify OTP
**POST** `/auth/verify`

**Description:** Verify OTP sent to email

**Request Body:**
```json
{
  "email": "aliya@example.com",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account verified successfully! you can now login."
}
```

---

### 3. Login User
**POST** `/auth/login`

**Description:** Login with verified account

**Request Body:**
```json
{
  "email": "aliya@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "login successful!",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Aliya Parveen",
    "email": "aliya@example.com",
    "role": "student"
  }
}
```

---

### 4. Resend OTP
**POST** `/auth/resendOtp`

**Description:** Resend OTP if expired

**Request Body:**
```json
{
  "email": "aliya@example.com"
}
```

**Response (200):**
```json
{
  "message": "A fresh OTP has been sent to your email!"
}
```

---

### 5. Get User Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Aliya Parveen",
    "email": "aliya@example.com",
    "role": "student",
    "isVerified": true,
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

---

### 6. View All Users (Admin Only)
**GET** `/auth/admin/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer <adminToken>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "metadata": {
    "totalDocuments": 25,
    "totalPages": 3,
    "currentPage": 1,
    "limit": 10
  },
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Student Name",
      "email": "student@example.com",
      "role": "student",
      "isVerified": true,
      "createdAt": "2026-05-17T10:00:00.000Z"
    }
  ]
}
```

---

### 7. Delete User (Admin Only)
**DELETE** `/auth/admin/users/:userId`

**Headers:**
```
Authorization: Bearer <adminToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully!"
}
```

---

## 📚 Course Endpoints

### 1. Create Course (Admin Only)
**POST** `/courses/create`

**Headers:**
```
Authorization: Bearer <adminToken>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `title` (string, required): Course title
- `description` (string, required): Course description
- `courseImage` (file, optional): Course image

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/courses/create \
  -H "Authorization: Bearer <token>" \
  -F "title=Node.js Basics" \
  -F "description=Learn Node.js from scratch" \
  -F "courseImage=@image.jpg"
```

**Response (201):**
```json
{
  "message": "Course Created Successfully!",
  "course": {
    "_id": "65f2c3d4e5f6g7h8i9j0k1l2",
    "title": "Node.js Basics",
    "description": "Learn Node.js from scratch",
    "image": "https://cloudinary.com/...",
    "createdBy": "65f1a2b3c4d5e6f7a8b9c0d1",
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

---

### 2. Get All Courses
**GET** `/courses?page=1&limit=10&search=node&sortBy=createdAt&sortOrder=desc`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): 'asc' or 'desc' (default: asc)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "metadata": {
    "totalDocuments": 12,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 10
  },
  "data": [
    {
      "_id": "65f2c3d4e5f6g7h8i9j0k1l2",
      "title": "Node.js Basics",
      "description": "Learn Node.js from scratch",
      "image": "https://cloudinary.com/...",
      "createdBy": {
        "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "createdAt": "2026-05-17T10:00:00.000Z"
    }
  ]
}
```

---

### 3. Get Course By ID
**GET** `/courses/:courseId`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65f2c3d4e5f6g7h8i9j0k1l2",
    "title": "Node.js Basics",
    "description": "Learn Node.js from scratch",
    "image": "https://cloudinary.com/...",
    "createdBy": {
      "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Admin",
      "email": "admin@example.com"
    },
    "createdAt": "2026-05-17T10:00:00.000Z",
    "updatedAt": "2026-05-17T10:00:00.000Z"
  }
}
```

---

### 4. Update Course (Admin Only)
**PATCH** `/courses/:courseId`

**Headers:**
```
Authorization: Bearer <adminToken>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `title` (string, optional): Updated title
- `description` (string, optional): Updated description
- `courseImage` (file, optional): Updated image

**Response (200):**
```json
{
  "success": true,
  "message": "Course updated successfully!",
  "data": { ... }
}
```

---

### 5. Delete Course (Admin Only)
**DELETE** `/courses/:courseId`

**Headers:**
```
Authorization: Bearer <adminToken>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully!"
}
```

---

## 🎓 Student Endpoints

### 1. Enroll in Course
**POST** `/students/enroll/:courseId`

**Headers:**
```
Authorization: Bearer <studentToken>
```

**Response (201):**
```json
{
  "message": "Successfully enrolled in the course!",
  "data": {
    "_id": "65f3d4e5f6g7h8i9j0k1l2m3",
    "course": "65f2c3d4e5f6g7h8i9j0k1l2",
    "student": "65f1a2b3c4d5e6f7a8b9c0d1",
    "enrolledAt": "2026-05-17T10:30:00.000Z"
  }
}
```

---

### 2. Upload Assignment
**POST** `/students/upload-assignment/:courseId`

**Headers:**
```
Authorization: Bearer <studentToken>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `title` (string, required): Assignment title
- `assignmentFile` (file, required): PDF or Image file

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/students/upload-assignment/65f2c3d4e5f6g7h8i9j0k1l2 \
  -H "Authorization: Bearer <token>" \
  -F "title=Assignment 1" \
  -F "assignmentFile=@assignment.pdf"
```

**Response (201):**
```json
{
  "message": "Assignment uploaded successfully!",
  "data": {
    "_id": "65f4e5f6g7h8i9j0k1l2m3n4",
    "course": "65f2c3d4e5f6g7h8i9j0k1l2",
    "student": "65f1a2b3c4d5e6f7a8b9c0d1",
    "title": "Assignment 1",
    "fileUrl": "https://cloudinary.com/...",
    "createdAt": "2026-05-17T11:00:00.000Z"
  }
}
```

---

### 3. Get All Assignments for a Course
**GET** `/students/assignments/:courseId?page=1&limit=10`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "metadata": {
    "totalDocuments": 3,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  },
  "data": [
    {
      "_id": "65f4e5f6g7h8i9j0k1l2m3n4",
      "course": {
        "_id": "65f2c3d4e5f6g7h8i9j0k1l2",
        "title": "Node.js Basics"
      },
      "student": {
        "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
        "name": "Student Name",
        "email": "student@example.com"
      },
      "title": "Assignment 1",
      "fileUrl": "https://cloudinary.com/...",
      "createdAt": "2026-05-17T11:00:00.000Z"
    }
  ]
}
```

---

### 4. Get My Assignments for a Course
**GET** `/students/my-assignments/:courseId`

**Headers:**
```
Authorization: Bearer <studentToken>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65f4e5f6g7h8i9j0k1l2m3n4",
      "course": {
        "_id": "65f2c3d4e5f6g7h8i9j0k1l2",
        "title": "Node.js Basics"
      },
      "title": "Assignment 1",
      "fileUrl": "https://cloudinary.com/...",
      "createdAt": "2026-05-17T11:00:00.000Z"
    }
  ]
}
```

---

## 📄 PDF Processing Endpoints

### 1. Upload & Extract PDF
**POST** `/pdf/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `pdf` (file): PDF file to upload

**Response (200):**
```json
{
  "message": "PDF uploaded and processed successfully",
  "file": {
    "originalName": "document.pdf",
    "size": 15234,
    "path": "/path/to/file"
  },
  "extracted": {
    "text": "First 500 characters...",
    "fullText": "Complete text...",
    "numPages": 5
  }
}
```

---

### 2. Generate PDF
**POST** `/pdf/generate`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Document Title",
  "body": "Document content here",
  "fileName": "my-document"
}
```

**Response (201):**
```json
{
  "message": "PDF generated successfully",
  "pdf": {
    "fileName": "1684406400000-my-document.pdf",
    "path": "/path/to/file",
    "downloadUrl": "/api/pdf/download/1684406400000-my-document.pdf"
  }
}
```

---

### 3. Download PDF
**GET** `/pdf/download/:fileName`

**Response:** File download (200)

---

### 4. Extract PDF Information
**POST** `/pdf/info`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `pdf` (file): PDF file

**Response (200):**
```json
{
  "message": "PDF information extracted",
  "info": {
    "fileName": "document.pdf",
    "size": 15234,
    "numPages": 5,
    "version": "1.4"
  }
}
```

---

## ⚠️ Error Responses

### 400 - Bad Request
```json
{
  "error": {
    "status": 400,
    "message": "Invalid input or missing required fields"
  }
}
```

### 401 - Unauthorized
```json
{
  "error": {
    "status": 401,
    "message": "No token provided or invalid token"
  }
}
```

### 403 - Forbidden
```json
{
  "error": {
    "status": 403,
    "message": "You don't have permission to perform this action"
  }
}
```

### 404 - Not Found
```json
{
  "error": {
    "status": 404,
    "message": "Resource not found"
  }
}
```

### 500 - Server Error
```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error"
  }
}
```

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <accessToken>
```

**Token Structure:**
- Access Token: Valid for 15 minutes
- Refresh Token: Valid for 7 days

---

## 📊 User Roles

| Role | Permissions |
|------|------------|
| **admin** | Create/Update/Delete courses, View all users, Delete users |
| **student** | View courses, Enroll in courses, Upload assignments, View own assignments |

---

## 🧪 Testing with Postman

1. **Register & Verify**
   - POST /auth/register → Get OTP
   - POST /auth/verify → Verify OTP
   - POST /auth/login → Get tokens

2. **Courses (Admin)**
   - POST /courses/create → Create course
   - GET /courses → List all courses
   - GET /courses/:id → Get specific course
   - PATCH /courses/:id → Update course
   - DELETE /courses/:id → Delete course

3. **Enroll & Submit (Student)**
   - POST /students/enroll/:courseId → Enroll
   - POST /students/upload-assignment/:courseId → Upload assignment
   - GET /students/assignments/:courseId → View all assignments
   - GET /students/my-assignments/:courseId → View my assignments

---

**Server Status:** ✅ Running on http://localhost:5000
**Database:** ✅ MongoDB Connected
