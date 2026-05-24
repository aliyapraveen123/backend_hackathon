const PDFParse = require('pdf-parse');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Extract text from PDF
const extractPDFText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await PDFParse(dataBuffer);
    return {
      success: true,
      text: data.text,
      numPages: data.numpages,
      version: data.version,
      info: data.info
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate a simple PDF
const generatePDF = (fileName, content) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filePath = path.join(__dirname, '../uploads', fileName);
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);
      
      // Add content to PDF
      doc.fontSize(16).text(content.title || 'Document', 100, 100);
      doc.fontSize(12).text(content.body || '', 100, 150);
      
      if (content.metadata) {
        doc.fontSize(10).text(`Created: ${new Date().toLocaleString()}`, 100, 300);
      }

      doc.end();

      stream.on('finish', () => {
        resolve({
          success: true,
          path: filePath,
          fileName: fileName
        });
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Validate PDF file
const validatePDFFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  const allowedMimeTypes = ['application/pdf'];
  const allowedExtensions = ['.pdf'];

  // Check MIME type
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { valid: false, error: 'Invalid file type. Only PDFs are allowed' };
  }

  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return { valid: false, error: 'Invalid file extension' };
  }

  return { valid: true };
};

module.exports = {
  extractPDFText,
  generatePDF,
  validatePDFFile
};
