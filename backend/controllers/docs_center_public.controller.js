const fs = require("fs");
const path = require("path");
const db = require("../config/db");

exports.uploadDocument = async (req, res) => {
  try {
    const { name, category, description, video_link } = req.body;
    const fileName = req.file.filename;

    await db.execute(
      "INSERT INTO docs_center_and_uploads (name, category, description, fileName, video_link) VALUES (?, ?, ?, ?, ?)",
      [name, category, description, fileName, video_link]
    );

    res.status(201).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading document" });
  }
};

exports.getDocuments = (req, res) => {
  db.execute(
    "SELECT * FROM docs_center_and_uploads ORDER BY id DESC",
    (err, results) => {
      if (err) {
        console.error("Error fetching documents:", err);
        return res.status(500).json({ message: "Failed to fetch documents" });
      }
      res.json(results);
    }
  );
};

exports.deleteDocument = (req, res) => {
  const { id } = req.params;

  db.execute(
    "SELECT fileName FROM docs_center_and_uploads WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching document:", err);
        return res
          .status(500)
          .json({ message: "Failed to find document for deletion" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Document not found" });
      }

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "files",
        results[0].fileName
      );

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== "ENOENT") {
          console.error("Error deleting file:", unlinkErr);
          return res
            .status(500)
            .json({ message: "Error deleting associated file" });
        }

        db.execute(
          "DELETE FROM docs_center_and_uploads WHERE id = ?",
          [id],
          (deleteErr, deleteResults) => {
            if (deleteErr) {
              console.error("Error deleting document:", deleteErr);
              return res
                .status(500)
                .json({ message: "Failed to delete document" });
            }

            res.json({ message: "Document and file deleted successfully" });
          }
        );
      });
    }
  );
};

exports.updateDocumentWithFile = (req, res) => {
  const { id } = req.params;
  const { name, category, description, video_link } = req.body;
  const newFile = req.file;

  if (!newFile) {
    return db.execute(
      "UPDATE docs_center_and_uploads SET name = ?, category = ?, description = ?, video_link = ? WHERE id = ?",
      [name, category, description, video_link, id],
      (err, results) => {
        if (err) {
          console.error("Error updating document:", err);
          return res.status(500).json({ message: "Failed to update document" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Document not found" });
        }
        res.json({ message: "Document metadata updated successfully" });
      }
    );
  }

  const newFileName = newFile.filename;

  // First get the old filename
  db.execute(
    "SELECT fileName FROM docs_center_and_uploads WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching existing file for update:", err);
        return res
          .status(500)
          .json({ message: "Failed to fetch existing document" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Document not found" });
      }

      const oldFilePath = path.join(
        __dirname,
        "..",
        "uploads",
        "files",
        results[0].fileName
      );

      // Try deleting the old file
      fs.unlink(oldFilePath, (unlinkErr) => {
        if (unlinkErr && unlinkErr.code !== "ENOENT") {
          console.error("Error deleting old file during update:", unlinkErr);
          return res
            .status(500)
            .json({ message: "Error replacing the old file" });
        }

        // Continue to update DB
        db.execute(
          "UPDATE docs_center_and_uploads SET name = ?, category = ?, description = ?, fileName = ?, video_link = ? WHERE id = ?",
          [name, category, description, newFileName, video_link, id],
          (updateErr, updateResults) => {
            if (updateErr) {
              console.error("Error updating document with file:", updateErr);
              return res
                .status(500)
                .json({ message: "Failed to update document" });
            }
            if (updateResults.affectedRows === 0) {
              return res.status(404).json({ message: "Document not found" });
            }
            res.json({ message: "Document and file updated successfully" });
          }
        );
      });
    }
  );
};

exports.getDocumentsByType = (req, res) => {
  const { type } = req.query;

  if (!type) {
    return res.status(400).json({ message: "Type is required" });
  }

  db.execute(
    "SELECT * FROM docs_center_and_uploads WHERE category = ? ORDER BY id DESC",
    [type],
    (err, results) => {
      if (err) {
        console.error("Error fetching documents:", err);
        return res.status(500).json({ message: "Server error" });
      }
      res.json(results);
    }
  );
};
