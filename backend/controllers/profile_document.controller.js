const ProfileDocument = require('../models/profile_document.model');
const fs = require('fs').promises;
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '../uploads/profile');

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
};

// Generate unique filename with profile_ prefix
const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const ext = path.extname(originalFilename);
  return `profile_${timestamp}_${randomString}${ext}`;
};

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (!req.body.document_type) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required'
      });
    }

    await ensureUploadDir();

    const uniqueFilename = generateUniqueFilename(req.file.originalname);
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // Move the uploaded file to the profile directory
    await fs.rename(req.file.path, filePath);

    const relativePath = path.relative(path.join(__dirname, '..'), filePath);

    const documentData = {
      user_id: req.user.id,
      document_type: req.body.document_type,
      file_name: req.file.originalname,
      file_path: relativePath.replace(/\\/g, '/'),
      file_type: req.file.mimetype,
      file_size: req.file.size
    };

    const document = await ProfileDocument.create(documentData);

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: document
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading document'
    });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const { type } = req.query;
    let documents;

    if (type) {
      const document = await ProfileDocument.findByType(req.user.id, type);
      documents = document ? [document] : [];
    } else {
      const docs = await ProfileDocument.findByUserId(req.user.id);
      documents = Object.values(docs);
    }

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching documents'
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Get the document first to get its file path
    const document = await ProfileDocument.findByType(req.user.id, type);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, '..', document.file_path);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await ProfileDocument.delete(req.user.id, type);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting document'
    });
  }
}; 