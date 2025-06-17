const db = require('../config/db');

class Student {
  static validateStudentData(studentData) {
    const { newEnrollments, totalStudents, graduationCycles, establishmentYear } = studentData;
    
    // Convert string values to numbers and validate
    const validatedData = {
      ...studentData,
      newEnrollments: parseInt(newEnrollments) || 0,
      totalStudents: parseInt(totalStudents) || 0,
      graduationCycles: parseInt(graduationCycles) || 0,
      establishmentYear: parseInt(establishmentYear) || 0
    };

    // Validate numeric fields
    if (validatedData.newEnrollments < 0) throw new Error('New enrollments cannot be negative');
    if (validatedData.totalStudents < 0) throw new Error('Total students cannot be negative');
    if (validatedData.graduationCycles < 0) throw new Error('Graduation cycles cannot be negative');
    
    // More lenient establishment year validation
    const currentYear = new Date().getFullYear();
    if (validatedData.establishmentYear < 1300 || validatedData.establishmentYear > currentYear) {
      throw new Error('Establishment year must be between 1300 and current year');
    }

    return validatedData;
  }

  static async create(studentData) {
    try {
      const validatedData = this.validateStudentData(studentData);
      const { userId, name, newEnrollments, totalStudents, graduationCycles, establishmentYear } = validatedData;
      
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO students (userId, name, newEnrollments, totalStudents, graduationCycles, establishmentYear, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
        `;
        
        db.query(
          query,
          [userId, name, newEnrollments, totalStudents, graduationCycles, establishmentYear],
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            
            if (!results || !results.insertId) {
              reject(new Error('Failed to insert student record'));
              return;
            }
            
            resolve({ id: results.insertId, ...validatedData });
          }
        );
      });
    } catch (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
  }

  static async findAll(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM students 
        WHERE userId = ? 
        ORDER BY createdAt DESC
      `;
      
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static async findOne(id, userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM students 
        WHERE id = ? AND userId = ?
      `;
      
      db.query(query, [id, userId], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  static async update(id, userId, updateData) {
    try {
      const validatedData = this.validateStudentData(updateData);
      const { name, newEnrollments, totalStudents, graduationCycles, establishmentYear } = validatedData;
      
      return new Promise((resolve, reject) => {
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
        
        db.query(
          query,
          [name, newEnrollments, totalStudents, graduationCycles, establishmentYear, id, userId],
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            
            if (results.affectedRows === 0) {
              reject(new Error('No record found to update'));
              return;
            }
            
            resolve({ id, ...validatedData });
          }
        );
      });
    } catch (error) {
      throw new Error(`Validation error: ${error.message}`);
    }
  }

  static async delete(id, userId) {
    return new Promise((resolve, reject) => {
      const query = `
        DELETE FROM students 
        WHERE id = ? AND userId = ?
      `;
      
      db.query(query, [id, userId], (err, results) => {
        if (err) reject(err);
        resolve(results.affectedRows > 0);
      });
    });
  }
}

module.exports = Student; 