const db = require('../config/db');

class Student {
  static async create(studentData) {
    const { userId, name, newEnrollments, totalStudents, graduationCycles, establishmentYear } = studentData;
    
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO students (userId, name, newEnrollments, totalStudents, graduationCycles, establishmentYear, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      db.query(
        query,
        [userId, name, newEnrollments, totalStudents, graduationCycles, establishmentYear],
        (err, results) => {
          if (err) reject(err);
          resolve({ id: results.insertId, ...studentData });
        }
      );
    });
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
    const { name, newEnrollments, totalStudents, graduationCycles, establishmentYear } = updateData;
    
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
          if (err) reject(err);
          resolve({ id, ...updateData });
        }
      );
    });
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