# PDF Processing API Documentation

## Overview
Your backend now has complete PDF processing capabilities including upload, extraction, generation, and download functionality.

## Installation
Libraries installed:
- **pdf-parse**: Extract text and metadata from PDF files
- **pdfkit**: Generate PDF documents programmatically

## Available Endpoints

### 1. Upload PDF & Extract Text
**POST** `/api/pdf/upload`

Upload a PDF file and automatically extract text content.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Body:**
- `pdf` (file): PDF file to upload (max 10MB)

**Success Response (200):**
```json
{
  "message": "PDF uploaded and processed successfully",
  "file": {
    "originalName": "document.pdf",
    "size": 15234,
    "path": "/path/to/uploads/pdfs/pdf-123456789.pdf"
  },
  "extracted": {
    "text": "First 500 characters of extracted text...",
    "fullText": "Complete extracted text from PDF",
    "numPages": 5
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/pdf/upload \
  -H "Authorization: Bearer <token>" \
  -F "pdf=@document.pdf"
```

---

### 2. Generate PDF Document
**POST** `/api/pdf/generate`

Generate a new PDF with custom content.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Document Title",
  "body": "Document body content",
  "fileName": "my-document"
}
```

**Success Response (201):**
```json
{
  "message": "PDF generated successfully",
  "pdf": {
    "fileName": "1684406400000-my-document.pdf",
    "path": "/path/to/uploads/1684406400000-my-document.pdf",
    "downloadUrl": "/api/pdf/download/1684406400000-my-document.pdf"
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Document",
    "body": "This is the content of my PDF",
    "fileName": "sample"
  }'
```

---

### 3. Download PDF File
**GET** `/api/pdf/download/:fileName`

Download a previously generated or uploaded PDF file.

**Example cURL:**
```bash
curl http://localhost:3000/api/pdf/download/1684406400000-my-document.pdf -o downloaded.pdf
```

---

### 4. Extract PDF Information & Metadata
**POST** `/api/pdf/info`

Upload a PDF and get detailed metadata about it.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Body:**
- `pdf` (file): PDF file to analyze

**Success Response (200):**
```json
{
  "message": "PDF information extracted",
  "info": {
    "fileName": "document.pdf",
    "size": 15234,
    "numPages": 5,
    "version": "1.4",
    "info": {
      "Producer": "Some PDF Generator",
      "CreationDate": "D:20230101120000"
    }
  }
}
```

---

## File Structure
```
backend/
├── utils/
│   ├── pdfProcessor.js      # PDF utility functions
│   └── sendEmail.js
├── routes/
│   ├── pdfRoutes.js         # PDF endpoints (NEW)
│   ├── courseRoutes.js
│   └── authRoutes.js
├── uploads/
│   └── pdfs/                # PDF storage directory (created automatically)
└── server.js                # Updated with PDF routes
```

## Utility Functions (pdfProcessor.js)

### extractPDFText(filePath)
Extracts text and metadata from a PDF file.

```javascript
const { extractPDFText } = require('../utils/pdfProcessor');

const result = await extractPDFText('/path/to/file.pdf');
// Returns: { success: true, text: '...', numPages: 5, version: '1.4', info: {...} }
```

### generatePDF(fileName, content)
Generates a new PDF document.

```javascript
const { generatePDF } = require('../utils/pdfProcessor');

const result = await generatePDF('myfile.pdf', {
  title: 'My Title',
  body: 'Content here',
  metadata: true
});
// Returns: { success: true, path: '...', fileName: '...' }
```

### validatePDFFile(file)
Validates if uploaded file is a valid PDF.

```javascript
const { validatePDFFile } = require('../utils/pdfProcessor');

const validation = validatePDFFile(req.file);
if (validation.valid) {
  // Process PDF
} else {
  console.log(validation.error);
}
```

## Security Features
✅ JWT authentication required (except for download endpoint - add if needed)
✅ PDF file validation (MIME type + extension check)
✅ File size limit: 10MB
✅ Automatic directory creation with security checks
✅ Protected upload endpoints

## Error Handling

### Common Error Responses

**400 - Bad Request**
```json
{ "error": "fileName is required" }
```

**401 - Unauthorized**
```json
{ "error": "Not authenticated" }
```

**404 - Not Found**
```json
{ "error": "File not found" }
```

**500 - Server Error**
```json
{ "error": "Failed to extract text from PDF", "details": "..." }
```

## Next Steps

1. **Test the endpoints** using Postman, Thunder Client, or cURL
2. **Integrate with Cloudinary** (optional) - modify pdfRoutes.js to use Cloudinary storage instead of local
3. **Add to database models** - create a PDF/Document model to track uploaded files
4. **Enhance features** - add PDF compression, merging, or splitting capabilities

## Optional: Use Cloudinary for PDF Storage

Replace the local storage in `pdfRoutes.js` with your existing Cloudinary setup:

```javascript
const cloudinaryUpload = require('../config/cloudinary');

router.post('/upload', protect, cloudinaryUpload.single('pdf'), async (req, res) => {
  // req.file.path will contain Cloudinary URL
  const pdfUrl = req.file.path;
  // ... rest of logic
});
```

---

Happy PDF processing! 🎉
