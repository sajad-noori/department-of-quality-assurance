const Standard = require("../models/standard.model");
const path = require("path");
const fs = require("fs").promises;
const fsSync = require("fs");
const { promise } = require("../config/db");

// Define upload directories
const tempDir = path.join(__dirname, "../uploads/temp");
const filesDir = path.join(__dirname, "../uploads/files");

// Map of MIME types to simpler file types
const mimeTypeMap = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

exports.createStandard = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { standardTitle, description } = req.body;
    if (!standardTitle || !description) {
      return res
        .status(400)
        .json({ message: "Standard title and description are required" });
    }

    // Generate unique filename
    const uniqueFileName = Standard.generateUniqueFileName(
      req.file.originalname
    );
    const filePath = path.join(filesDir, uniqueFileName);

    // Move the file from temp to final location
    await fs.rename(req.file.path, filePath);

    // Get simplified file type
    const fileType = mimeTypeMap[req.file.mimetype] || "unknown";

    const data = {
      userId: req.user.id,
      standardTitle,
      description,
      fileName: uniqueFileName,
      originalFileName: req.file.originalname,
      filePath,
      fileType,
    };

    const standard = await Standard.create(data);

    res.status(201).json({
      message: "Standard created successfully",
      data: standard,
    });
  } catch (error) {
    console.error("Error in createStandard:", error);
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error cleaning up temp file:", unlinkError);
      }
    }
    res.status(500).json({
      message: "Error creating standard",
      error: error.message,
    });
  }
};

exports.getStandards = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const standards = await Standard.findByUserId(req.user.id);
    res.json(standards);
  } catch (error) {
    console.error("Error in getStandards:", error);
    res.status(500).json({
      message: "Error fetching standards",
      error: error.message,
    });
  }
};

exports.deleteStandard = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { id } = req.params;
    await Standard.delete(id, req.user.id);

    res.json({ message: "Standard deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStandard:", error);
    res.status(500).json({
      message: "Error deleting standard",
      error: error.message,
    });
  }
};

// Get standards data by user ID (for admin/employee access)
exports.getStandardsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that userId is a number
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({
        success: false,
        message: "شناسه کاربر نامعتبر است",
      });
    }

    const standards = await Standard.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: standards,
    });
  } catch (error) {
    console.error("Error fetching standards by user ID:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching standards data",
      error: error.message,
    });
  }
};

// Download standard file by ID (for admin/employee access)
exports.downloadStandardFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that id is a number
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "شناسه فایل نامعتبر است",
      });
    }

    // Get the standard file information
    const [standards] = await promise.execute(
      "SELECT * FROM standards WHERE id = ?",
      [id]
    );

    if (standards.length === 0) {
      return res.status(404).json({
        success: false,
        message: "فایل یافت نشد",
      });
    }

    const standard = standards[0];
    const filePath = standard.file_path;
    const fileName = standard.original_file_name;

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "فایل در سرور یافت نشد",
      });
    }

    // Get file stats for content length
    const stats = await fs.stat(filePath);

    // Set headers for file download
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(fileName)}"`
    );
    res.setHeader("Content-Length", stats.size);

    // Stream the file
    const fileStream = fsSync.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error downloading standard file:", error);
    res.status(500).json({
      success: false,
      message: "Error downloading file",
      error: error.message,
    });
  }
};
