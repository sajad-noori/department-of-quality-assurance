const { promise } = require("../config/db");

class Department {
  static async create(data) {
    try {
      const query = `
                INSERT INTO departments (
                    user_id, name, new_enrollments, total_students,
                    graduation_cycles, establishment_year, number_of_students
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

      const [result] = await promise.execute(query, [
        data.userId,
        data.name,
        data.newEnrollments,
        data.totalStudents,
        data.graduationCycles,
        data.establishmentYear,
        data.numberOfStudents,
      ]);

      if (!result || !result.insertId) {
        throw new Error("Failed to create department record");
      }

      return {
        id: result.insertId,
        ...data,
      };
    } catch (error) {
      throw new Error(`Failed to create department: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const query = `
                SELECT * FROM departments 
                WHERE user_id = ?
                ORDER BY created_at DESC
            `;

      const [rows] = await promise.execute(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }
  }

  static async delete(id, userId) {
    try {
      const query = `
                DELETE FROM departments 
                WHERE id = ? AND user_id = ?
            `;

      const [result] = await promise.execute(query, [id, userId]);

      if (result.affectedRows === 0) {
        throw new Error("Department not found or unauthorized");
      }

      return true;
    } catch (error) {
      throw new Error(`Failed to delete department: ${error.message}`);
    }
  }
}

module.exports = Department;
