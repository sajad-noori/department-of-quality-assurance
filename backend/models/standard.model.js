const { promise } = require("../config/db");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

class Standard {
  static async create(data) {
    try {
      const query = `
                INSERT INTO standards (
                    user_id, standard_title, description, 
                    file_name, original_file_name, file_path, file_type
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

      const [result] = await promise.execute(query, [
        data.userId,
        data.standardTitle,
        data.description,
        data.fileName,
        data.originalFileName,
        data.filePath,
        data.fileType,
      ]);

      if (!result || !result.insertId) {
        throw new Error("Failed to create standard record");
      }

      return {
        id: result.insertId,
        ...data,
      };
    } catch (error) {
      throw new Error(`Failed to create standard: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
                SELECT * FROM standards 
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;

      const [rows] = await promise.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Failed to find standards: ${error.message}`);
    }
  }

  static async delete(id, userId) {
    try {
      // First get the file path
      const [rows] = await promise.execute(
        "SELECT file_path FROM standards WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      if (rows.length === 0) {
        throw new Error("Standard not found");
      }

      // Delete the file
      const filePath = rows[0].file_path;
      await fs.unlink(filePath);

      // Delete the database record
      const [result] = await promise.execute(
        "DELETE FROM standards WHERE id = ? AND user_id = ?",
        [id, userId]
      );

      if (!result || result.affectedRows === 0) {
        throw new Error("Failed to delete standard");
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete standard: ${error.message}`);
    }
  }

  static generateUniqueFileName(originalFileName) {
    const timestamp = Date.now();
    const uniqueId = uuidv4();
    const extension = path.extname(originalFileName);
    return `${timestamp}-${uniqueId}${extension}`;
  }
}

module.exports = Standard;
