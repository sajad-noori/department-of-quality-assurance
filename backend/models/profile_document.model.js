const db = require("../config/db");

const getValidFileTypes = (index) => {
  if (index < 3) {
    return [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
  } else {
    return ['application/zip', 'application/x-zip-compressed'];
  }
};

class ProfileDocument {
  static async create(data) {
    try {
      console.log('=== Profile Document Creation Started ===');
      console.log('Input data:', {
        user_id: data.user_id,
        document_type: data.document_type,
        file_name: data.file_name,
        file_path: data.file_path,
        file_type: data.file_type,
        file_size: data.file_size
      });
      
      const match = data.document_type.match(/doc(\d+)_path/);
      const index = match ? parseInt(match[1], 10) - 1 : -1;
      const validTypes = getValidFileTypes(index);
      if (!validTypes.includes(data.file_type)) {
        throw new Error(index < 3 ? 'Invalid file type' : 'Only zip files are allowed for this field');
      }

      // Get the column name from document_type (e.g., doc1_path)
      const columnName = data.document_type;
      
      // First check if a record exists for this user
      const checkQuery = 'SELECT id FROM profile_documents WHERE user_id = ?';
      const [existingRows] = await db.promise().execute(checkQuery, [data.user_id]);
      
      let result;
      if (existingRows.length === 0) {
        // Create new record
        const insertQuery = `
          INSERT INTO profile_documents (user_id, ${columnName})
          VALUES (?, ?)
        `;
        [result] = await db.promise().execute(insertQuery, [
          data.user_id,
          data.file_path
        ]);
      } else {
        // Update existing record
        const updateQuery = `
          UPDATE profile_documents 
          SET ${columnName} = ?
          WHERE user_id = ?
        `;
        [result] = await db.promise().execute(updateQuery, [
          data.file_path,
          data.user_id
        ]);
      }

      if (!result || (result.affectedRows === 0 && !result.insertId)) {
        throw new Error('Failed to create/update profile document record');
      }

      const createdDocument = {
        id: result.insertId || existingRows[0].id,
        user_id: data.user_id,
        document_type: data.document_type,
        file_name: data.file_name,
        file_path: data.file_path,
        file_type: data.file_type,
        file_size: data.file_size,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      return createdDocument;
    } catch (error) {
      console.error('=== Profile Document Creation Failed ===');
      console.error('Error details:', error);
      throw new Error(`Failed to create profile document: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
        SELECT * FROM profile_documents 
        WHERE user_id = ?
      `;
      
      const [rows] = await db.promise().execute(query, [userId]);
      
      // Transform the flat structure into a more usable format
      const documents = [];
      if (rows.length > 0) {
        const row = rows[0];
        for (let i = 1; i <= 15; i++) {
          const columnName = `doc${i}_path`;
          if (row[columnName]) {
            // Extract file name from the path
            const fileName = row[columnName].split('/').pop() || 'document';
            // Determine file type from extension
            const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
            let fileType = 'application/octet-stream';
            
            switch (fileExt) {
              case 'pdf':
                fileType = 'application/pdf';
                break;
              case 'jpg':
              case 'jpeg':
                fileType = 'image/jpeg';
                break;
              case 'png':
                fileType = 'image/png';
                break;
              case 'gif':
                fileType = 'image/gif';
                break;
              case 'doc':
                fileType = 'application/msword';
                break;
              case 'docx':
                fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
              case 'xls':
                fileType = 'application/vnd.ms-excel';
                break;
              case 'xlsx':
                fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                break;
            }
            
            documents.push({
              id: row.id,
              user_id: row.user_id,
              document_type: columnName,
              file_path: row[columnName],
              file_name: fileName,
              file_type: fileType,
              created_at: row.created_at,
              updated_at: row.updated_at
            });
          }
        }
      }
      
      return documents;
    } catch (error) {
      console.error('=== Error Finding Profile Documents ===');
      console.error('Error details:', error);
      throw new Error(`Failed to fetch profile documents: ${error.message}`);
    }
  }

  static async findByType(userId, documentType) {
    try {
      const query = `
        SELECT * FROM profile_documents 
        WHERE user_id = ? AND ${documentType} IS NOT NULL
      `;
      
      const [rows] = await db.promise().execute(query, [userId]);
      
      if (rows.length === 0) {
        return null;
      }

      const row = rows[0];
      const filePath = row[documentType];
      
      // Extract file name from the path
      const fileName = filePath.split('/').pop() || 'document';
      // Determine file type from extension
      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
      let fileType = 'application/octet-stream';
      
      switch (fileExt) {
        case 'pdf':
          fileType = 'application/pdf';
          break;
        case 'jpg':
        case 'jpeg':
          fileType = 'image/jpeg';
          break;
        case 'png':
          fileType = 'image/png';
          break;
        case 'gif':
          fileType = 'image/gif';
          break;
        case 'doc':
          fileType = 'application/msword';
          break;
        case 'docx':
          fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case 'xls':
          fileType = 'application/vnd.ms-excel';
          break;
        case 'xlsx':
          fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
      }
      
      return {
        id: row.id,
        user_id: row.user_id,
        document_type: documentType,
        file_path: filePath,
        file_name: fileName,
        file_type: fileType,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    } catch (error) {
      console.error('=== Error Finding Profile Document by Type ===');
      console.error('Error details:', error);
      throw new Error(`Failed to fetch profile document: ${error.message}`);
    }
  }

  static async delete(userId, documentType) {
    try {
      const query = `
        UPDATE profile_documents 
        SET ${documentType} = NULL
        WHERE user_id = ?
      `;
      
      const [result] = await db.promise().execute(query, [userId]);
      
      if (result.affectedRows === 0) {
        throw new Error('Profile document not found or unauthorized');
      }
      
      return true;
    } catch (error) {
      console.error('=== Error Deleting Profile Document ===');
      console.error('Error details:', error);
      throw new Error(`Failed to delete profile document: ${error.message}`);
    }
  }
}

module.exports = ProfileDocument; 