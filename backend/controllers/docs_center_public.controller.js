const fs = require("fs");
const path = require("path");
const { promise } = require("../config/db");

exports.uploadDocument = async (req, res) => {
  try {
    const { name, category, description, video_link } = req.body;
    const fileName = req.file.filename;

    await promise.execute(
      "INSERT INTO docs_center_and_uploads (name, category, description, fileName, video_link) VALUES (?, ?, ?, ?, ?)",
      [name, category, description, fileName, video_link]
    );

    res.status(201).json({ message: "Document uploaded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading document" });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const [results] = await promise.execute(
      "SELECT * FROM docs_center_and_uploads ORDER BY id DESC"
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    // First get the filename
    const [results] = await promise.execute(
      "SELECT fileName FROM docs_center_and_uploads WHERE id = ?",
      [id]
    );

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

    // Try to delete the file asynchronously and safely
    try {
      const uploadRoot = path.resolve(__dirname, "..", "uploads");
      const safePath = path.resolve(uploadRoot, "files", results[0].fileName);
      if (safePath.startsWith(uploadRoot)) {
        await fs.promises.unlink(safePath).catch((err) => {
          if (err && err.code !== "ENOENT") throw err;
        });
      } else {
        console.warn("Attempted to delete file outside upload dir:", safePath);
      }
    } catch (unlinkErr) {
      console.error("Error deleting file:", unlinkErr);
      return res
        .status(500)
        .json({ message: "Error deleting associated file" });
    }

    // Delete from database
    const [deleteResults] = await promise.execute(
      "DELETE FROM docs_center_and_uploads WHERE id = ?",
      [id]
    );

    res.json({ message: "Document and file deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Failed to delete document" });
  }
};

exports.updateDocumentWithFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, video_link } = req.body;
    const newFile = req.file;

    if (!newFile) {
      // Update without file
      const [results] = await promise.execute(
        "UPDATE docs_center_and_uploads SET name = ?, category = ?, description = ?, video_link = ? WHERE id = ?",
        [name, category, description, video_link, id]
      );

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Document not found" });
      }

      res.json({ message: "Document metadata updated successfully" });
      return;
    }

    const newFileName = newFile.filename;

    // First get the old filename
    const [results] = await promise.execute(
      "SELECT fileName FROM docs_center_and_uploads WHERE id = ?",
      [id]
    );

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

    // Try deleting the old file asynchronously and safely
    try {
      const uploadRoot = path.resolve(__dirname, "..", "uploads");
      const safeOldPath = path.resolve(
        uploadRoot,
        "files",
        results[0].fileName
      );
      if (safeOldPath.startsWith(uploadRoot)) {
        await fs.promises.unlink(safeOldPath).catch((err) => {
          if (err && err.code !== "ENOENT") throw err;
        });
      } else {
        console.warn(
          "Attempted to delete file outside upload dir:",
          safeOldPath
        );
      }
    } catch (unlinkErr) {
      console.error("Error deleting old file during update:", unlinkErr);
      return res.status(500).json({ message: "Error replacing the old file" });
    }

    // Update database with new file
    const [updateResults] = await promise.execute(
      "UPDATE docs_center_and_uploads SET name = ?, category = ?, description = ?, fileName = ?, video_link = ? WHERE id = ?",
      [name, category, description, newFileName, video_link, id]
    );

    if (updateResults.affectedRows === 0) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document and file updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Failed to update document" });
  }
};

exports.getDocumentsByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    const [results] = await promise.execute(
      "SELECT * FROM docs_center_and_uploads WHERE category = ? ORDER BY id DESC",
      [type]
    );

    res.json(results);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ message: "Server error" });
  }
};
