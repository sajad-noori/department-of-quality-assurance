const { promise } = require("../config/db");

class Laylia {
  static async findAll(userId) {
    try {
      const query = "SELECT * FROM laylia WHERE userId = ?";
      const [results] = await promise.execute(query, [userId]);
      return results;
    } catch (error) {
      throw new Error(`Failed to fetch laylia data: ${error.message}`);
    }
  }

  static async create(data) {
    try {
      const query =
        "INSERT INTO laylia (name, newEnrollments, totalStudents, userId) VALUES (?, ?, ?, ?)";
      const values = [
        data.name,
        data.newEnrollments,
        data.totalStudents,
        data.userId,
      ];

      const [result] = await promise.execute(query, values);
      return { id: result.insertId, ...data };
    } catch (error) {
      throw new Error(`Failed to create laylia data: ${error.message}`);
    }
  }

  static async findOne(id, userId) {
    try {
      const query = "SELECT * FROM laylia WHERE id = ? AND userId = ?";
      const [results] = await promise.execute(query, [id, userId]);
      return results[0];
    } catch (error) {
      throw new Error(`Failed to fetch laylia data: ${error.message}`);
    }
  }

  static async delete(id, userId) {
    try {
      const query = "DELETE FROM laylia WHERE id = ? AND userId = ?";
      const [result] = await promise.execute(query, [id, userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete laylia data: ${error.message}`);
    }
  }
}

module.exports = Laylia;
