const { promise } = require("../config/db");

class Stage {
  static async findByUserId(userId) {
    try {
      const query =
        "SELECT stage1, stage2, stage3 FROM stages WHERE user_id = ?";
      const [results] = await promise.execute(query, [userId]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error finding stage by user ID: ${error.message}`);
    }
  }

  static async create(
    userId,
    stageData = { stage1: false, stage2: false, stage3: false }
  ) {
    try {
      const query =
        "INSERT INTO stages (user_id, stage1, stage2, stage3) VALUES (?, ?, ?, ?)";
      const [result] = await promise.execute(query, [
        userId,
        stageData.stage1 ? 1 : 0,
        stageData.stage2 ? 1 : 0,
        stageData.stage3 ? 1 : 0,
      ]);
      return result.insertId;
    } catch (error) {
      throw new Error(`Error creating stage: ${error.message}`);
    }
  }

  static async updateStage(userId, stageNumber, completed = true) {
    try {
      if (![1, 2, 3].includes(stageNumber)) {
        throw new Error("Invalid stage number. Must be 1, 2, or 3.");
      }

      const query = `UPDATE stages SET stage${stageNumber} = ? WHERE user_id = ?`;
      const [result] = await promise.execute(query, [
        completed ? 1 : 0,
        userId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating stage: ${error.message}`);
    }
  }

  static async updateAllStages(userId, stageData) {
    try {
      const query =
        "UPDATE stages SET stage1 = ?, stage2 = ?, stage3 = ? WHERE user_id = ?";
      const [result] = await promise.execute(query, [
        stageData.stage1 ? 1 : 0,
        stageData.stage2 ? 1 : 0,
        stageData.stage3 ? 1 : 0,
        userId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error updating all stages: ${error.message}`);
    }
  }

  static async deleteByUserId(userId) {
    try {
      const query = "DELETE FROM stages WHERE user_id = ?";
      const [result] = await promise.execute(query, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting stage: ${error.message}`);
    }
  }

  static async getAllStages() {
    try {
      const query = "SELECT * FROM stages ORDER BY user_id";
      const [results] = await promise.execute(query);
      return results;
    } catch (error) {
      throw new Error(`Error fetching all stages: ${error.message}`);
    }
  }
}

module.exports = Stage;
