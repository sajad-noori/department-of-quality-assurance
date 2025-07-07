const db = require('../config/db');

class Announcement {
  static create(announcementData) {
    return new Promise((resolve, reject) => {
      const { title, content, target_audience, created_by, attachment_path = null } = announcementData;
      const query = `
        INSERT INTO announcements (title, content, target_audience, created_by, attachment_path, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      db.execute(query, [title, content, target_audience, created_by, attachment_path], (err, result) => {
        if (err) {
          reject(new Error(`Error creating announcement: ${err.message}`));
        } else {
          resolve(result.insertId);
        }
      });
    });
  }

  static async findAll(options = {}) {
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
      query += options.target_audience ? ` AND a.created_by = ?` : ` WHERE a.created_by = ?`;
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
    
    try {
      const [rows] = await db.execute(query, params);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching announcements: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = `
      SELECT a.*, u.name as creator_name, u.email as creator_email
      FROM announcements a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = ?
    `;
    
    try {
      const [rows] = await db.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error fetching announcement: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    const { title, content, target_audience, attachment_path } = updateData;
    
    const query = `
      UPDATE announcements 
      SET title = ?, content = ?, target_audience = ?, attachment_path = ?, updated_at = NOW()
      WHERE id = ?
    `;
    
    try {
      const [result] = await db.execute(query, [title, content, target_audience, attachment_path, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating announcement: ${error.message}`);
    }
  }

  static async delete(id) {
    const query = `DELETE FROM announcements WHERE id = ?`;
    
    try {
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting announcement: ${error.message}`);
    }
  }

  static markAsEmailSent(id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE announcements 
        SET email_sent = 1, email_sent_at = NOW()
        WHERE id = ?
      `;
      db.execute(query, [id], (err, result) => {
        if (err) {
          reject(new Error(`Error marking announcement as sent: ${err.message}`));
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }

  static async getRecipientsByType(targetAudience) {
    return new Promise((resolve) => {
      let query = '';
      const params = [];
      
      switch (targetAudience) {
        case 'all':
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
          break;
        case 'institute':
          // For now, treat as all verified users since 'institute' role might not exist
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
          break;
        case 'user':
          query = `SELECT id, name, email, role FROM users WHERE role = 'user' AND is_verified = 1`;
          break;
        case 'employee':
          // For now, treat as all verified users since 'employee' role might not exist
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
          break;
        default:
          query = `SELECT id, name, email, role FROM users WHERE is_verified = 1`;
      }
      
      console.log('Executing query:', query);
      
      db.execute(query, params, (err, rows) => {
        if (err) {
          console.error('Database error in getRecipientsByType:', err);
          resolve([]);
          return;
        }
        
        console.log('Query result:', rows);
        console.log('Processed rows:', rows);
        resolve(Array.isArray(rows) ? rows : []);
      });
    });
  }

  // Get all available roles from the users table
  static async getAvailableRoles() {
    return new Promise((resolve) => {
      try {
        // First, let's check if the users table exists and has data
        db.execute('SELECT COUNT(*) as count FROM users', (err, userCountResult) => {
          if (err) {
            console.error('Error getting user count:', err);
            resolve([]);
            return;
          }
          
          console.log('Total users in database:', userCountResult[0]?.count || 0);
          
          // Get distinct roles
          db.execute('SELECT DISTINCT role FROM users WHERE role IS NOT NULL AND role != ""', (err, rows) => {
            if (err) {
              console.error('Error getting roles:', err);
              resolve([]);
              return;
            }
            
            console.log('Raw roles query result:', rows);
            
            if (!Array.isArray(rows)) {
              console.error('Rows is not an array:', rows);
              resolve([]);
              return;
            }
            
            const roles = rows
              .map(row => row && row.role ? row.role : null)
              .filter(role => role && role.trim() !== '');
            
            console.log('Final processed roles:', roles);
            resolve(roles);
          });
        });
        
      } catch (error) {
        console.error('Database error in getAvailableRoles:', error);
        resolve([]);
      }
    });
  }

  // Get recipients count by role
  static async getRecipientsCountByRole() {
    return new Promise((resolve) => {
      const query = `
        SELECT role, COUNT(*) as count 
        FROM users 
        WHERE is_verified = 1 
        GROUP BY role
      `;
      
      db.execute(query, (err, rows) => {
        if (err) {
          console.error('Error fetching recipients count by role:', err);
          resolve([]);
          return;
        }
        resolve(Array.isArray(rows) ? rows : []);
      });
    });
  }

  static async getStats() {
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
    
    try {
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching announcement stats: ${error.message}`);
    }
  }
}

module.exports = Announcement; 