# 🚀 Hackathon Project - Backend aur Frontend Setup Guide

## 📋 Project Structure

```
backend_hackathon/
├── backend/                    # Express Server (Port 5000)
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── config/
│
├── frontend/                   # React App (Port 3000)
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── public/
│       └── index.html
│
└── package.json               # Root package.json (for running both)
```

---

## 🎯 Backend Server (Port 5000)

### Start Backend Only (Production)
```bash
npm run start:backend
```

### Start Backend with Auto-Reload (Development)
```bash
npm run dev:backend
```

---

## ⚛️ Frontend Server (Port 3000)

### Start Frontend Only
```bash
npm run start:frontend
```

### Start Frontend with Hot Reload
```bash
npm run dev:frontend
```

---

## 🔄 Run Both Servers Together

### Start Both Backend + Frontend (Development Mode)
```bash
npm run dev
```

This will run:
- **Backend** on `http://localhost:5000`
- **Frontend** on `http://localhost:3000`

---

## 📦 Installation

### Install All Dependencies (Root + Backend + Frontend)
```bash
npm run install:all
```

Or manually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

---

## 🌐 API Endpoints

Your frontend will communicate with backend at:
```
http://localhost:5000/api/
```

Make sure your frontend API calls use this base URL.

### Example API Calls:
- **Login**: `POST http://localhost:5000/api/auth/login`
- **Register**: `POST http://localhost:5000/api/auth/register`
- **Courses**: `GET http://localhost:5000/api/courses`
- **PDF Upload**: `POST http://localhost:5000/api/pdf/upload`

---

## ✨ Quick Commands Summary

| Command | Description | Runs |
|---------|-------------|------|
| `npm run start:backend` | Backend Production | Port 5000 |
| `npm run dev:backend` | Backend Development (nodemon) | Port 5000 |
| `npm run start:frontend` | Frontend Production | Port 3000 |
| `npm run dev:frontend` | Frontend Development | Port 3000 |
| `npm run dev` | Both Backend + Frontend | Ports 5000 & 3000 |
| `npm run install:all` | Install all dependencies | - |

---

## 🛠️ Troubleshooting

### Frontend not connecting to Backend?
- Check if backend is running on `http://localhost:5000`
- Verify API URLs in `frontend/src/App.js`
- Check browser console for CORS errors

### Port already in use?
```bash
# Find and kill process on port 5000 (Backend)
lsof -ti:5000 | xargs kill -9

# Find and kill process on port 3000 (Frontend)
lsof -ti:3000 | xargs kill -9
```

### Dependencies not installing?
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 .env File (Backend)

Make sure backend/.env has:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=HACKATHON_SECRET_KEY
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_secret
```

---

**Happy Coding! 🎉**
