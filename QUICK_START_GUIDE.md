# 🚀 Quick Start Guide

## Server Status: ✅ RUNNING

---

## 1️⃣ Start the Server

```bash
cd /home/sama/Desktop/backend_hackathon

# Option 1: Using npm start (recommended)
npm start

# Option 2: Direct node
cd backend && node server.js

# Option 3: Development mode with auto-reload
npm run dev
```

**Server running at:** `http://localhost:5000`

---

## 2️⃣ Test Endpoints with Postman

### Import Collection
1. Open Postman
2. Click **Import** → Select **Postman_Collection.json**
3. Set environment variables:
   - `base_url`: `http://localhost:5000/api`

### Test Flow (Step by Step)

**Step 1: Register User**
```
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "student"
}
```
Response: Check email for OTP

**Step 2: Verify OTP**
```
POST /api/auth/verify
{
  "email": "test@example.com",
  "otp": "123456"  // Replace with actual OTP from email
}
```

**Step 3: Login**
```
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```
Response: Get `accessToken` - Copy it!

**Step 4: View Profile**
```
GET /api/auth/profile
Headers: Authorization: Bearer <accessToken>
```

**Step 5: View All Courses**
```
GET /api/courses?page=1&limit=10
```

**Step 6: Create Course (Admin)**
```
POST /api/courses/create
Headers: Authorization: Bearer <admin_token>
Body (FormData):
- title: "Node.js Basics"
- description: "Learn Node.js"
- courseImage: <select file>
```

**Step 7: Enroll in Course**
```
POST /api/students/enroll/<course_id>
Headers: Authorization: Bearer <accessToken>
```

**Step 8: Upload Assignment**
```
POST /api/students/upload-assignment/<course_id>
Headers: Authorization: Bearer <accessToken>
Body (FormData):
- title: "Assignment 1"
- assignmentFile: <select PDF/Image>
```

**Step 9: View My Assignments**
```
GET /api/students/my-assignments/<course_id>
Headers: Authorization: Bearer <accessToken>
```

---

## 3️⃣ cURL Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Get All Courses
```bash
curl -X GET "http://localhost:5000/api/courses?page=1&limit=10"
```

### Enroll in Course
```bash
curl -X POST http://localhost:5000/api/students/enroll/COURSE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 4️⃣ Environment Variables

Located in `.env` file:
```
PORT=5000
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=HACKATHON_SECRET_KEY
JWT_REFRESH_SECRET=HACKATHON_REFRESH_SECRET_KEY
CLOUDINARY_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_key>
CLOUDINARY_API_SECRET=<your_cloudinary_secret>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>
```

---

## 5️⃣ API Endpoints Summary

### Authentication (6 endpoints)
- ✅ `POST /auth/register` - Register user
- ✅ `POST /auth/verify` - Verify OTP
- ✅ `POST /auth/login` - Login
- ✅ `POST /auth/resendOtp` - Resend OTP
- ✅ `GET /auth/profile` - Get profile
- ✅ `GET /auth/admin/users` - View all users (admin)
- ✅ `DELETE /auth/admin/users/:id` - Delete user (admin)

### Courses (5 endpoints)
- ✅ `POST /courses/create` - Create course (admin)
- ✅ `GET /courses` - Get all courses
- ✅ `GET /courses/:id` - Get single course
- ✅ `PATCH /courses/:id` - Update course (admin)
- ✅ `DELETE /courses/:id` - Delete course (admin)

### Students (4 endpoints)
- ✅ `POST /students/enroll/:courseId` - Enroll in course
- ✅ `POST /students/upload-assignment/:courseId` - Upload assignment
- ✅ `GET /students/assignments/:courseId` - Get all assignments
- ✅ `GET /students/my-assignments/:courseId` - Get my assignments

### PDF (4 endpoints)
- ✅ `POST /pdf/upload` - Upload & extract PDF
- ✅ `POST /pdf/generate` - Generate PDF
- ✅ `GET /pdf/download/:fileName` - Download PDF
- ✅ `POST /pdf/info` - Get PDF info

---

## 6️⃣ File Locations

### Important Files
- **Server:** `/backend/server.js`
- **Database:** MongoDB (Atlas/Local)
- **Uploads:** Cloudinary
- **API Docs:** `API_DOCUMENTATION.md`
- **Postman Collection:** `Postman_Collection.json`
- **Checklist:** `HACKATHON_CHECKLIST.md`

### Routes
- **Auth:** `/backend/routes/authRoutes.js`
- **Courses:** `/backend/routes/courseRoutes.js`
- **Students:** `/backend/routes/studentRoutes.js`
- **PDF:** `/backend/routes/pdfRoutes.js`

### Middleware
- **Auth:** `/backend/middleware/authMiddleware.js`
- **Logger:** `/backend/middleware/loggerMiddleware.js`
- **Error Handler:** `/backend/middleware/errorHandler.js`
- **Validation:** `/backend/middleware/validationMiddleware.js`

---

## 7️⃣ Common Commands

```bash
# Start server
npm start

# Development mode (auto-reload)
npm run dev

# Install dependencies
npm install

# Check logs
tail -f logs/*

# Stop server
Ctrl + C
```

---

## 8️⃣ Troubleshooting

### Server won't start
```bash
# Check port is not in use
lsof -i :5000

# Kill process on port 5000
kill -9 <PID>
```

### MongoDB connection error
- Check `.env` has correct `MONGODB_URI`
- Ensure MongoDB is running
- Check network access in MongoDB Atlas

### Cloudinary error
- Verify `.env` has correct credentials
- Check file size (max 10MB)
- Ensure file is PDF or image

### Email not sending
- Check `.env` email credentials
- Enable "Less secure apps" for Gmail
- Check spam folder

---

## 9️⃣ Project Status

```
Backend:        ✅ 100% Complete
Authentication: ✅ Complete (OTP + JWT)
Courses:        ✅ Complete (CRUD)
Assignments:    ✅ Complete (Upload + View)
Admin:          ✅ Complete (User management)
Middleware:     ✅ Complete (Auth, Log, Error, Validation)
Documentation:  ✅ Complete (API Docs + Postman)
Testing:        ✅ Ready (Use Postman Collection)
```

---

## 🔟 Support Files

1. **API_DOCUMENTATION.md** - Detailed endpoint documentation
2. **Postman_Collection.json** - Ready-to-import collection
3. **HACKATHON_CHECKLIST.md** - Requirements verification
4. **PROJECT_COMPLETION_SUMMARY.md** - What was added
5. **PDF_API_DOCUMENTATION.md** - PDF processing guide

---

**Everything is ready! Start testing now! 🎉**
