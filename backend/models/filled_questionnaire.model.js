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
}

module.exports = FilledQuestionnaire; 