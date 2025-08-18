const Document = require("../models/document.model");
const path = require("path");
const fs = require("fs").promises;

const ALLOWED_FILE_TYPES = {
  "image/jpeg": true,
  "image/png": true,
  "image/gif": true,
  "application/pdf": true,
  "application/msword": true,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": true,
  "application/vnd.ms-excel": true,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": true,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const documentController = {
  async uploadDocument(req, res) {
    try {
      console.log("=== Upload Document Request ===");
      console.log("Request details:", {
        file: req.file
          ? {
              originalname: req.file.originalname,
              mimetype: req.file.mimetype,
              size: req.file.size,
              path: req.file.path,
            }
          : null,
        body: req.body,
        user: req.user
          ? {
              id: req.user.id,
              role: req.user.role,
            }
          : null,
      });

      if (!req.file) {
        console.error("Upload failed: No file provided");
        return res.status(400).json({
          success: false,
          message: "فایل ارسال نشده است",
        });
      }

      if (!req.body.document_type) {
        console.error("Upload failed: No document type provided");
        return res.status(400).json({
          success: false,
          message: "نوع سند مشخص نشده است",
        });
      }

      const documentData = {
        user_id: req.user.id,
        document_type: req.body.document_type,
        file_name: req.file.originalname,
        file_path: req.file.path,
        file_type: req.file.mimetype,
        file_size: req.file.size,
      };

      console.log("Creating document:", documentData);

      const document = await Document.create(documentData);

      console.log("=== Upload Document Success ===");
      console.log("Created document:", {
        id: document.id,
        document_type: document.document_type,
        file_name: document.file_name,
        created_at: document.created_at,
      });

      return res.json({
        success: true,
        message: "سند با موفقیت بارگذاری شد",
        data: document,
      });
    } catch (error) {
      console.error("=== Error in Upload Document ===");
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });

      // If there's a file, try to remove it (async, safe)
      if (req.file) {
        try {
          const uploadRoot = path.resolve(__dirname, "..", "uploads");
          const safePath = path.resolve(req.file.path);
          if (safePath.startsWith(uploadRoot)) {
            await fs.unlink(safePath).catch((e) => {
              console.error("Failed to remove uploaded file:", e);
            });
          } else {
            console.warn(
              "Uploaded file outside upload dir, skipping unlink:",
              safePath
            );
          }
        } catch (unlinkError) {
          console.error("Error removing file:", unlinkError);
        }
      }

      return res.status(500).json({
        success: false,
        message:
          error.message === "Invalid file type"
            ? "نوع فایل مجاز نیست. فقط فایل‌های تصویر، PDF، Word و Excel مجاز هستند."
            : "خطا در بارگذاری سند",
      });
    }
  },

  async getDocuments(req, res) {
    try {
      console.log("=== Get Documents Request ===");
      console.log("Request details:", {
        headers: req.headers,
        cookies: req.cookies,
        user: req.user
          ? {
              id: req.user.id,
              role: req.user.role,
            }
          : null,
        query: req.query,
      });

      if (!req.user) {
        console.error("Authentication failed: No user found in request");
        return res.status(401).json({
          success: false,
          message: "شما وارد نشده اید",
        });
      }

      if (!req.user.id) {
        console.error("Authentication failed: No user ID found in request");
        return res.status(401).json({
          success: false,
          message: "شناسه کاربر یافت نشد",
        });
      }

      const userId = req.user.id;
      const { type } = req.query;

      console.log("Fetching documents:", {
        userId,
        type: type || "all documents",
      });

      let documents;
      if (type) {
        console.log("Fetching document by type:", type);
        const doc = await Document.findByType(userId, type);
        documents = doc ? [doc] : [];
        console.log(
          "Found document:",
          doc
            ? {
                id: doc.id,
                document_type: doc.document_type,
                file_name: doc.file_name,
                created_at: doc.created_at,
              }
            : "No document found"
        );
      } else {
        console.log("Fetching all documents for user");
        documents = await Document.findByUserId(userId);
        console.log("Found documents:", {
          count: documents.length,
          documents: documents.map((doc) => ({
            id: doc.id,
            document_type: doc.document_type,
            file_name: doc.file_name,
            created_at: doc.created_at,
          })),
        });
      }

      console.log("=== Get Documents Response ===");
      return res.json({
        success: true,
        data: Array.isArray(documents) ? documents : [],
      });
    } catch (error) {
      console.error("=== Error in Get Documents ===");
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      return res.status(500).json({
        success: false,
        message: "خطا در دریافت اسناد",
        error: error.message,
      });
    }
  },

  async deleteDocument(req, res) {
    try {
      console.log("=== Delete Document Request ===");
      console.log("Request details:", {
        params: req.params,
        user: req.user
          ? {
              id: req.user.id,
              role: req.user.role,
            }
          : null,
      });

      const { id } = req.params;
      const userId = req.user.id;

      console.log("Deleting document:", { id, userId });

      await Document.delete(id, userId);

      console.log("=== Delete Document Success ===");
      return res.json({
        success: true,
        message: "سند با موفقیت حذف شد",
      });
    } catch (error) {
      console.error("=== Error in Delete Document ===");
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      return res.status(500).json({
        success: false,
        message: "خطا در حذف سند",
        error: error.message,
      });
    }
  },
};

module.exports = documentController;
