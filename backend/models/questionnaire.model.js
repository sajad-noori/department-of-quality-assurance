const { promise } = require("../config/db");

class Questionnaire {
  static async create({ title, description, file_name, file_url }) {
    try {
      const query = `
        INSERT INTO questionnaires (title, description, file_name, file_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
      const [result] = await promise.execute(query, [
        title,
        description,
        file_name,
        file_url,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating questionnaire: ${error.message}`);
    }
  }
}

module.exports = Questionnaire;
