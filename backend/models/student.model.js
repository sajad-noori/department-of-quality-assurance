const { promise } = require("../config/db");

class Student {
  static validateStudentData(studentData) {
    const {
      newEnrollments,
      totalStudents,
      graduationCycles,
      establishmentYear,
    } = studentData;

    // Convert string values to numbers and validate
    const validatedData = {
      ...studentData,
      newEnrollments: parseInt(newEnrollments) || 0,
      totalStudents: parseInt(totalStudents) || 0,
      graduationCycles: parseInt(graduationCycles) || 0,
      establishmentYear: parseInt(establishmentYear) || 0,
    };

    // Validate numeric fields
    if (validatedData.newEnrollments < 0)
      throw new Error("New enrollments cannot be negative");
    if (validatedData.totalStudents < 0)
      throw new Error("Total students cannot be negative");
    if (validatedData.graduationCycles < 0)
      throw new Error("Graduation cycles cannot be negative");

    // More lenient establishment year validation
    const currentYear = new Date().getFullYear();
    if (
      validatedData.establishmentYear < 1300 ||
      validatedData.establishmentYear > currentYear
    ) {
      throw new Error(
        "Establishment year must be between 1300 and current year"
      );
    }

    return validatedData;
  }

  static async create(studentData) {
    try {
      const validatedData = this.validateStudentData(studentData);
      const {
        userId,
        name,
        newEnrollments,
        totalStudents,
        graduationCycles,
        establishmentYear,
      } = validatedData;

      const query = `
        INSERT INTO students (userId, name, newEnrollments, totalStudents, graduationCycles, establishmentYear, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const [results] = await promise.execute(query, [
        userId,
        name,
        newEnrollments,
        totalStudents,
        graduationCycles,
        establishmentYear,
      ]);

      if (!results || !results.insertId) {
        throw new Error("Failed to insert student record");
      }

      return { id: results.insertId, ...validatedData };
    } catch (error) {
      if (error.message.includes("Validation error")) {
        throw error;
      }
      throw new Error(`Error creating student: ${error.message}`);
    }
  }

  static async findAll(userId) {
    try {
      const query = `
        SELECT * FROM students 
        WHERE userId = ? 
        ORDER BY createdAt DESC
      `;

      const [results] = await promise.execute(query, [userId]);
      return results;
    } catch (error) {
      throw new Error(`Error fetching students: ${error.message}`);
    }
  }

  static async findOne(id, userId) {
    try {
      const query = `
        SELECT * FROM students 
        WHERE id = ? AND userId = ?
      `;

      const [results] = await promise.execute(query, [id, userId]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error fetching student: ${error.message}`);
    }
  }

  static async update(id, userId, updateData) {
    try {
      const validatedData = this.validateStudentData(updateData);
      const {
        name,
        newEnrollments,
        totalStudents,
        graduationCycles,
        establishmentYear,
      } = validatedData;

      const query = `
        UPDATE students 
        SET name = ?, 
            newEnrollments = ?, 
            totalStudents = ?, 
            graduationCycles = ?, 
            establishmentYear = ?,
            updatedAt = NOW()
        WHERE id = ? AND userId = ?
      `;

      const [results] = await promise.execute(query, [
        name,
        newEnrollments,
        totalStudents,
        graduationCycles,
        establishmentYear,
        id,
        userId,
      ]);

      if (results.affectedRows === 0) {
        throw new Error("No record found to update");
      }

      return { id, ...validatedData };
    } catch (error) {
      if (error.message.includes("Validation error")) {
        throw error;
      }
      throw new Error(`Error updating student: ${error.message}`);
    }
  }

  static async delete(id, userId) {
    try {
      const query = `
        DELETE FROM students 
        WHERE id = ? AND userId = ?
      `;

      const [results] = await promise.execute(query, [id, userId]);
      return results.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting student: ${error.message}`);
    }
  }
}

module.exports = Student;
