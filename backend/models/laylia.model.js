const db = require('../config/db');

class Laylia {
  static async findAll(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM laylia WHERE userId = ?';
      db.query(query, [userId], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static async create(data) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO laylia (name, newEnrollments, totalStudents, userId) VALUES (?, ?, ?, ?)';
      const values = [data.name, data.newEnrollments, data.totalStudents, data.userId];
      
      db.query(query, values, (err, result) => {
        if (err) reject(err);
        resolve({ id: result.insertId, ...data });
      });
    });
  }

  static async findOne(id, userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM laylia WHERE id = ? AND userId = ?';
      db.query(query, [id, userId], (err, results) => {
        if (err) reject(err);
        resolve(results[0]);
      });
    });
  }

  static async delete(id, userId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM laylia WHERE id = ? AND userId = ?';
      db.query(query, [id, userId], (err, result) => {
        if (err) reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  }
}

module.exports = Laylia; 