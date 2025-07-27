const { promise } = require("../config/db");

class Announcement {
  static async create(announcementData) {
    try {
      const {
        title,
        content,
        target_audience,
        created_by,
        attachment_path = null,
      } = announcementData;
      const query = `
        INSERT INTO announcements (title, content, target_audience, created_by, attachment_path, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      const [result] = await promise.execute(query, [
        title,
        content,
        target_audience,
        created_by,
        attachment_path,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating announcement: ${error.message}`);
    }
  }

  static async findAll(options = {}) {
    try {
      let query = `
        SELECT a.*, u.name as creator_name, u.email as creator_email
        FROM announcements a
        LEFT JOIN users u ON a.created_by = u.id
      `;

      const params = [];

      if (options.target_audience) {
        query += ` WHERE a.target_audience = ?`;
        params.push(options.target_audience);
      }

      if (options.created_by) {
        query += options.target_audience
          ? ` AND a.created_by = ?`
          : ` WHERE a.created_by = ?`;
        params.push(options.created_by);
      }

      query += ` ORDER BY a.created_at DESC`;

      if (options.limit) {
        query += ` LIMIT ?`;
        params.push(options.limit);
      }

      if (options.offset) {
        query += ` OFFSET ?`;
        params.push(options.offset);
      }

      const [rows] = await promise.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching announcements: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const query = `
        SELECT a.*, u.name as creator_name, u.email as creator_email
        FROM announcements a
        LEFT JOIN users u ON a.created_by = u.id
        WHERE a.id = ?
      `;

      const [rows] = await promise.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching announcement: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const { title, content, target_audience, attachment_path } = updateData;

      const query = `
        UPDATE announcements 
        SET title = ?, content = ?, target_audience = ?, attachment_path = ?, updated_at = NOW()
        WHERE id = ?
      `;

      const [result] = await promise.execute(query, [
        title,
        content,
        target_audience,
        attachment_path,
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating announcement: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const query = `DELETE FROM announcements WHERE id = ?`;
      const [result] = await promise.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting announcement: ${error.message}`);
    }
  }

  static async markAsEmailSent(id) {
    try {
      const query = `
        UPDATE announcements 
        SET email_sent = 1, email_sent_at = NOW()
        WHERE id = ?
      `;
      const [result] = await promise.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error marking announcement as sent: ${error.message}`);
    }
  }

  static async getRecipientsByType(targetAudience) {
    try {
      let query = "";
      const params = [];

      switch (targetAudience) {
        case "all":
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
          break;
        case "institute":
          // For now, treat as all verified users since 'institute' role might not exist
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
          break;
        case "user":
          query = `SELECT id, name, email, role FROM users WHERE role = 'user' AND is_verified = 1`;
          break;
        case "employee":
          // For now, treat as all verified users since 'employee' role might not exist
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
          break;
        default:
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
      }

      const [rows] = await promise.execute(query, params);
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error("Database error in getRecipientsByType:", error);
      return [];
    }
  }

  // Get all available roles from the users table
  static async getAvailableRoles() {
    try {
      // First, let's check if the users table exists and has data
      const [userCountResult] = await promise.execute(
        "SELECT COUNT(*) as count FROM users"
      );

      // Get distinct roles
      const [rows] = await promise.execute(
        'SELECT DISTINCT role FROM users WHERE role IS NOT NULL AND role != ""'
      );

      if (!Array.isArray(rows)) {
        console.error("Rows is not an array:", rows);
        return [];
      }

      const roles = rows
        .map((row) => (row && row.role ? row.role : null))
        .filter((role) => role && role.trim() !== "");

      return roles;
    } catch (error) {
      console.error("Database error in getAvailableRoles:", error);
      return [];
    }
  }

  // Get recipients count by role
  static async getRecipientsCountByRole() {
    try {
      const query = `
        SELECT role, COUNT(*) as count 
        FROM users 
        WHERE is_verified = 1 
        GROUP BY role
      `;

      const [rows] = await promise.execute(query);
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      console.error("Error fetching recipients count by role:", error);
      return [];
    }
  }

  static async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_announcements,
          COUNT(CASE WHEN email_sent = 1 THEN 1 END) as sent_announcements,
          COUNT(CASE WHEN email_sent = 0 THEN 1 END) as pending_announcements,
          target_audience,
          DATE(created_at) as date
        FROM announcements 
        GROUP BY target_audience, DATE(created_at)
        ORDER BY date DESC
      `;

      const [rows] = await promise.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching announcement stats: ${error.message}`);
    }
  }
}

module.exports = Announcement;
