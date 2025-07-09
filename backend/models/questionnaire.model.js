const db = require('../config/db');

class Questionnaire {
  static create({ title, description, file_name, file_url }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO questionnaires (title, description, file_name, file_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
      db.execute(query, [title, description, file_name, file_url], (err, result) => {
        if (err) {
          reject(new Error(`Error creating questionnaire: ${err.message}`));
        } else {
          resolve(result.insertId);
        }
      });
    });
  }
}

module.exports = Questionnaire; 