const db = require("../config/db");

class AcademyFacility {
  static async create(data) {
    const { user_id, name, basic_facilities, equipment_count, equipment_status } = data;
    const query = `
      INSERT INTO academy_facilities (user_id, name, basic_facilities, equipment_count, equipment_status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [user_id, name, basic_facilities, equipment_count, equipment_status];
    
    try {
      const [result] = await db.promise().execute(query, values);
      return { id: result.insertId, ...data };
    } catch (error) {
      throw error;
    }
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM academy_facilities WHERE user_id = ?';
    try {
      const [facilities] = await db.promise().execute(query, [userId]);
      return facilities;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM academy_facilities WHERE id = ? AND user_id = ?';
    try {
      const [result] = await db.promise().execute(query, [id, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AcademyFacility; 