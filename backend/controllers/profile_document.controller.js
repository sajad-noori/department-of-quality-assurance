const ProfileDocument = require("../models/profile_document.model");
const fs = require("fs").promises;
const path = require("path");
const { promise } = require("../config/db");

const UPLOAD_DIR = path.join(__dirname, "../uploads/profile");

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
        message: "No file uploaded",
      });
    }

    if (!req.body.document_type) {
      return res.status(400).json({
        success: false,
        message: "Document type is required",
      });
    }

    await ensureUploadDir();

    const uniqueFilename = generateUniqueFilename(req.file.originalname);
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    // Move the uploaded file to the profile directory
    await fs.rename(req.file.path, filePath);

    const relativePath = path.relative(path.join(__dirname, ".."), filePath);

    const documentData = {
      user_id: req.user.id,
      document_type: req.body.document_type,
      file_name: req.file.originalname,
      file_path: relativePath.replace(/\\/g, "/"),
      file_type: req.file.mimetype,
      file_size: req.file.size,
    };

    const document = await ProfileDocument.create(documentData);

    res.json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading document",
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
      documents = await ProfileDocument.findByUserId(req.user.id);
    }

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching documents",
    });
  }
};

// Get profile documents data by user ID (for admin/employee access)
exports.getDocumentsByUserIdForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that userId is a number
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        message: "شناسه کاربر نامعتبر است",
      });
    }

    const documents = await ProfileDocument.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("Error fetching profile documents by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile documents data",
      error: error.message,
    });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    // Accept document_type from body or query
    const document_type = req.body?.document_type || req.query?.document_type;
    if (!document_type) {
      return res
        .status(400)
        .json({ success: false, message: "Document type is required" });
    }
    const userId = req.user.id;

    if (!document_type) {
      return res
        .status(400)
        .json({ success: false, message: "Document type is required" });
    }

    // Fetch the document row by ID and user
    const [rows] = await promise.execute(
      "SELECT * FROM profile_documents WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }
    const row = rows[0];
    const filePath = row[document_type];
    console.log("filePath from DB:", filePath);
    if (!filePath) {
      return res
        .status(404)
        .json({ success: false, message: "Document file not found" });
    }
    // Delete the file from the filesystem
    const pathModule = require("path");
    const fs = require("fs/promises");
    const backendRoot = pathModule.resolve(__dirname, "..");
    const safeFilePath = pathModule
      .normalize(filePath)
      .replace(/^([.]+[\\/])+/, ""); // prevent directory traversal
    const fullPath = pathModule.join(backendRoot, safeFilePath);
    console.log("Attempting to delete file at:", fullPath);
    try {
      await fs.unlink(fullPath);
    } catch (e) {
      console.error("Error deleting file:", e);
    }
    // Set the column to null
    await promise.execute(
      `UPDATE profile_documents SET ${document_type} = NULL WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    res.json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting document",
    });
  }
};

// Download profile document
exports.downloadDocument = async (req, res) => {
  try {
    const { filePath } = req.params;

    console.log("Download request for file path:", filePath);

    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "File path is required",
      });
    }

    // Decode the file path
    const decodedPath = decodeURIComponent(filePath);
    console.log("Decoded file path:", decodedPath);

    // Construct the full file path - the stored path is relative to the backend root
    const fullPath = path.join(__dirname, "..", decodedPath);
    console.log("Full file path:", fullPath);

    // Check if file exists
    try {
      await fs.access(fullPath);
      console.log("File exists and is accessible");
    } catch (error) {
      console.error("File access error:", error);
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // Get file stats
    const stats = await fs.stat(fullPath);
    console.log("File stats:", stats);

    // Determine content type based on file extension
    const ext = path.extname(decodedPath).toLowerCase();
    let contentType = "application/octet-stream";

    switch (ext) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".doc":
        contentType = "application/msword";
        break;
      case ".docx":
        contentType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".xls":
        contentType = "application/vnd.ms-excel";
        break;
      case ".xlsx":
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
    }

    console.log("Content type determined:", contentType);

    // Set headers for file download
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(decodedPath)}"`
    );
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "no-cache");

    console.log("Headers set, starting file stream");

    // Stream the file
    const fileStream = require("fs").createReadStream(fullPath);

    fileStream.on("error", (error) => {
      console.error("File stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error streaming file",
        });
      }
    });

    fileStream.pipe(res);

    console.log("File stream started");
  } catch (error) {
    console.error("Error downloading document:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error downloading document",
      });
    }
  }
};

exports.uploadProfileDocument = async (req, res) => {
  try {
    const { document_type, is_profile } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "No file uploaded." });
    }

    // Check for and delete the old file if it exists
    const existingDoc = await ProfileDocument.findOne({
      where: { user_id: userId, document_type },
    });

    if (existingDoc && existingDoc.file_path) {
      const oldFilePath = path.join(__dirname, "..", existingDoc.file_path);
      try {
        await fs.unlink(oldFilePath);
        console.log(`Successfully deleted old file: ${oldFilePath}`);
      } catch (err) {
        console.error(
          `Failed to delete old file, but proceeding with upload: ${oldFilePath}`,
          err
        );
      }
      // Remove the old database entry to be replaced by the new one
      await existingDoc.destroy();
    }

    const newDocument = await ProfileDocument.create({
      user_id: userId,
      document_type,
      file_name: req.file.originalname,
      file_path: req.file.path,
      file_type: req.file.mimetype,
      is_profile,
    });

    res.status(201).send({
      success: true,
      message: "Document uploaded successfully",
      data: newDocument,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading document",
    });
  }
};
