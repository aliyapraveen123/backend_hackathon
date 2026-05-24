const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractPDFText, generatePDF, validatePDFFile } = require('../utils/pdfProcessor');
const { protect } = require('../middleware/authMiddleware');

// Configure local storage for PDFs (fallback option)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/pdfs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload and extract text from PDF
router.post('/upload', protect, upload.single('pdf'), async (req, res) => {
  try {
    const validation = validatePDFFile(req.file);
    
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const pdfPath = req.file.path;
    const extractedData = await extractPDFText(pdfPath);

    if (!extractedData.success) {
      return res.status(500).json({ 
        error: 'Failed to extract text from PDF',
        details: extractedData.error 
      });
    }

    res.status(200).json({
      message: 'PDF uploaded and processed successfully',
      file: {
        originalName: req.file.originalname,
        size: req.file.size,
        path: req.file.path
      },
      extracted: {
        text: extractedData.text.substring(0, 500), // First 500 chars
        fullText: extractedData.text,
        numPages: extractedData.numPages
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate a PDF document
router.post('/generate', protect, async (req, res) => {
  try {
    const { title, body, fileName } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: 'fileName is required' });
    }

    if (!title || !body) {
      return res.status(400).json({ error: 'title and body are required' });
    }

    const pdfFileName = `${Date.now()}-${fileName}.pdf`;
    
    const result = await generatePDF(pdfFileName, {
      title,
      body,
      metadata: true
    });

    res.status(201).json({
      message: 'PDF generated successfully',
      pdf: {
        fileName: result.fileName,
        path: result.path,
        downloadUrl: `/api/pdf/download/${pdfFileName}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download PDF file
router.get('/download/:fileName', (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '../uploads', fileName);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.download(filePath, fileName);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get PDF info (extract metadata)
router.post('/info', protect, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    const extractedData = await extractPDFText(req.file.path);

    if (!extractedData.success) {
      return res.status(500).json({ error: extractedData.error });
    }

    res.status(200).json({
      message: 'PDF information extracted',
      info: {
        fileName: req.file.originalname,
        size: req.file.size,
        numPages: extractedData.numPages,
        version: extractedData.version,
        info: extractedData.info
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
