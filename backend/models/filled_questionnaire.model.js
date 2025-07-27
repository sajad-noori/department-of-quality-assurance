const { promise } = require("../config/db");

class FilledQuestionnaire {
  static async create({ questionnaire_id, user_id, file_name, file_url }) {
    try {
      const query = `
        INSERT INTO filled_questionnaires (questionnaire_id, user_id, file_name, file_url, filled_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      const [result] = await promise.execute(query, [
        questionnaire_id,
        user_id,
        file_name,
        file_url,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating filled questionnaire: ${error.message}`);
    }
  }

  static async findByQuestionnaireId(questionnaire_id) {
    try {
      const query = `SELECT * FROM filled_questionnaires WHERE questionnaire_id = ? ORDER BY filled_at DESC`;
      const [rows] = await promise.execute(query, [questionnaire_id]);
      return rows;
    } catch (error) {
      throw new Error(`Error fetching filled questionnaires: ${error.message}`);
    }
  }

  static async findByQuestionnaireIdAndUserId(questionnaire_id, user_id) {
    try {
      const query = `SELECT * FROM filled_questionnaires WHERE questionnaire_id = ? AND user_id = ? LIMIT 1`;
      const [rows] = await promise.execute(query, [questionnaire_id, user_id]);
      return rows && rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error fetching filled questionnaire: ${error.message}`);
    }
  }

  static async setChecked(id) {
    try {
      const query = `UPDATE filled_questionnaires SET checked = TRUE WHERE id = ?`;
      const [result] = await promise.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating checked state: ${error.message}`);
    }
  }
}

module.exports = FilledQuestionnaire;
