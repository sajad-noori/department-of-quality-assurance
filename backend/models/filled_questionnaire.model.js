const db = require('../config/db');

class FilledQuestionnaire {
  static create({ questionnaire_id, user_id, file_name, file_url }) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO filled_questionnaires (questionnaire_id, user_id, file_name, file_url, filled_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      db.execute(query, [questionnaire_id, user_id, file_name, file_url], (err, result) => {
        if (err) {
          reject(new Error(`Error creating filled questionnaire: ${err.message}`));
        } else {
          resolve(result.insertId);
        }
      });
    });
  }

  static findByQuestionnaireId(questionnaire_id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM filled_questionnaires WHERE questionnaire_id = ? ORDER BY filled_at DESC`;
      db.execute(query, [questionnaire_id], (err, rows) => {
        if (err) {
          reject(new Error(`Error fetching filled questionnaires: ${err.message}`));
        } else {
          resolve(rows);
        }
      });
    });
  }

  static findByQuestionnaireIdAndUserId(questionnaire_id, user_id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM filled_questionnaires WHERE questionnaire_id = ? AND user_id = ? LIMIT 1`;
      db.execute(query, [questionnaire_id, user_id], (err, rows) => {
        if (err) {
          reject(new Error(`Error fetching filled questionnaire: ${err.message}`));
        } else {
          resolve(rows && rows.length > 0 ? rows[0] : null);
        }
      });
    });
  }

  static setChecked(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE filled_questionnaires SET checked = TRUE WHERE id = ?`;
      db.execute(query, [id], (err, result) => {
        if (err) {
          reject(new Error(`Error updating checked state: ${err.message}`));
        } else {
          resolve(result.affectedRows > 0);
        }
      });
    });
  }
}

module.exports = FilledQuestionnaire; 