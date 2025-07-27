const { promise } = require("../config/db");

const VALID_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

class Document {
  static async create(data) {
    try {
      console.log("=== Document Creation Started ===");
      console.log("Input data:", {
        user_id: data.user_id,
        document_type: data.document_type,
        file_name: data.file_name,
        file_type: data.file_type,
        file_size: data.file_size,
      });

      // Validate file type
      console.log("Validating file type:", data.file_type);
      if (!VALID_FILE_TYPES.includes(data.file_type)) {
        console.error("Invalid file type:", data.file_type);
        throw new Error("Invalid file type");
      }
      console.log("File type validation passed");

      const query = `
        INSERT INTO documents (
          user_id, document_type, file_name, file_path, 
          file_type, file_size
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      console.log("Executing SQL query:", query);
      console.log("Query parameters:", [
        data.user_id,
        data.document_type,
        data.file_name,
        data.file_path,
        data.file_type,
        data.file_size,
      ]);

      const [result] = await promise.execute(query, [
        data.user_id,
        data.document_type,
        data.file_name,
        data.file_path,
        data.file_type,
        data.file_size,
      ]);

      console.log("Query result:", result);

      if (!result || !result.insertId) {
        console.error(
          "Failed to create document record - No insert ID returned"
        );
        throw new Error("Failed to create document record");
      }

      const createdDocument = {
        id: result.insertId,
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      };

      console.log("=== Document Creation Successful ===");
      console.log("Created document:", createdDocument);

      return createdDocument;
    } catch (error) {
      console.error("=== Document Creation Failed ===");
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    try {
      console.log("=== Finding Documents by User ID ===");
      console.log("User ID:", userId);

      const query = `
        SELECT * FROM documents 
        WHERE user_id = ?
        ORDER BY created_at DESC
      `;

      console.log("Executing SQL query:", query);
      console.log("Query parameters:", [userId]);

      const [rows] = await promise.execute(query, [userId]);

      console.log("Query results:", {
        count: rows.length,
        documents: rows.map((doc) => ({
          id: doc.id,
          document_type: doc.document_type,
          file_name: doc.file_name,
          file_type: doc.file_type,
          created_at: doc.created_at,
        })),
      });

      return rows || [];
    } catch (error) {
      console.error("=== Error Finding Documents by User ID ===");
      console.error("Error details:", {
        userId,
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw new Error(`Failed to fetch documents: ${error.message}`);
    }
  }

  static async findByType(userId, documentType) {
    try {
      console.log("=== Finding Document by Type ===");
      console.log("Search parameters:", { userId, documentType });

      const query = `
        SELECT * FROM documents 
        WHERE user_id = ? AND document_type = ?
        ORDER BY created_at DESC
        LIMIT 1
      `;

      console.log("Executing SQL query:", query);
      console.log("Query parameters:", [userId, documentType]);

      const [rows] = await promise.execute(query, [userId, documentType]);

      const result = rows[0] || null;
      console.log(
        "Query result:",
        result
          ? {
              id: result.id,
              document_type: result.document_type,
              file_name: result.file_name,
              file_type: result.file_type,
              created_at: result.created_at,
            }
          : "No document found"
      );

      return result;
    } catch (error) {
      console.error("=== Error Finding Document by Type ===");
      console.error("Error details:", {
        userId,
        documentType,
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw new Error(`Failed to fetch document: ${error.message}`);
    }
  }

  static async delete(id, userId) {
    try {
      console.log("=== Deleting Document ===");
      console.log("Delete parameters:", { id, userId });

      const query = `
        DELETE FROM documents 
        WHERE id = ? AND user_id = ?
      `;

      console.log("Executing SQL query:", query);
      console.log("Query parameters:", [id, userId]);

      const [result] = await promise.execute(query, [id, userId]);

      console.log("Delete result:", {
        affectedRows: result.affectedRows,
        message: result.message,
      });

      if (result.affectedRows === 0) {
        console.error("Document not found or unauthorized");
        throw new Error("Document not found or unauthorized");
      }

      console.log("=== Document Deletion Successful ===");
      return true;
    } catch (error) {
      console.error("=== Error Deleting Document ===");
      console.error("Error details:", {
        id,
        userId,
        message: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }
}

module.exports = Document;
