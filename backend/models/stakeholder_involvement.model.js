const db = require("../config/db");

const StakeholderInvolvement = {
  async create(data) {
    const query = `
      INSERT INTO stakeholder_involvement (user_id, description)
      VALUES (?, ?)
    `;
    const values = [data.user_id, data.description];
    const [result] = await db.promise().execute(query, values);
    return result.insertId;
  },

  async findByUserId(userId) {
    const query = `
      SELECT * FROM stakeholder_involvement
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const [rows] = await db.promise().execute(query, [userId]);
    return rows[0];
  },

  async update(userId, description) {
    const query = `
      UPDATE stakeholder_involvement
      SET description = ?
      WHERE user_id = ?
    `;
    const [result] = await db.promise().execute(query, [description, userId]);
    return result.affectedRows > 0;
  }
};

module.exports = StakeholderInvolvement; 