const db = require("../config/db");

const ClassFacility = {
  async create(facilityData) {
    const { user_id, name, equipment_name, equipment_count, equipment_status } = facilityData;
    const query = `
      INSERT INTO class_facilities (user_id, name, equipment_name, equipment_count, equipment_status)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [user_id, name, equipment_name, equipment_count, equipment_status];
    const [result] = await db.promise().execute(query, values);
    return result.insertId;
  },

  async findByUserId(userId) {
    const query = `
      SELECT * FROM class_facilities 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `;
    const [rows] = await db.promise().execute(query, [userId]);
    return rows;
  },

  async delete(id, userId) {
    const query = `
      DELETE FROM class_facilities 
      WHERE id = ? AND user_id = ?
    `;
    const [result] = await db.promise().execute(query, [id, userId]);
    return result.affectedRows > 0;
  }
};

module.exports = ClassFacility; 