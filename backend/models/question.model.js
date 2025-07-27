const { promise } = require("../config/db");

class Question {
  // Create a new question
  static async create(questionData) {
    try {
      const {
        user_id,
        question,
        category = "general",
        priority = "medium",
      } = questionData;

      const query = `
        INSERT INTO questions (user_id, question, category, priority, status, submitted_at)
        VALUES (?, ?, ?, ?, 'pending', NOW())
      `;

      const [result] = await promise.execute(query, [
        user_id,
        question,
        category,
        priority,
      ]);
      return { success: true, id: result.insertId };
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  }

  // Get all FAQ questions (questions that have been replied to and marked as FAQ)
  static async getFAQQuestions() {
    try {
      const query = `
        SELECT q.*, u.name as user_name
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        WHERE q.is_faq = 1 AND q.is_replied = 1
        ORDER BY q.submitted_at DESC
      `;

      const [rows] = await promise.execute(query);
      return rows;
    } catch (error) {
      console.error("Error fetching FAQ questions:", error);
      throw error;
    }
  }

  // Get user's questions
  static async getUserQuestions(userId) {
    try {
      const query = `
        SELECT q.*, u.name as user_name
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        WHERE q.user_id = ?
        ORDER BY q.submitted_at DESC
      `;

      const [rows] = await promise.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Error fetching user questions:", error);
      throw error;
    }
  }

  // Get question by ID
  static async getById(questionId) {
    try {
      const query = `
        SELECT q.*, u.name as user_name
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        WHERE q.id = ?
      `;

      const [rows] = await promise.execute(query, [questionId]);
      return rows[0] || null;
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      throw error;
    }
  }

  // Update question (for admin replies)
  static async update(questionId, updateData) {
    try {
      const { answer, is_replied, is_faq, status, replied_by } = updateData;

      const query = `
        UPDATE questions 
        SET answer = ?, is_replied = ?, is_faq = ?, status = ?, replied_by = ?, replied_at = NOW()
        WHERE id = ?
      `;

      const [result] = await promise.execute(query, [
        answer,
        is_replied,
        is_faq,
        status,
        replied_by,
        questionId,
      ]);
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  }

  // Edit question text (for admin/employee)
  static async editQuestion(questionId, questionText) {
    try {
      const query = `
        UPDATE questions 
        SET question = ?
        WHERE id = ?
      `;

      const [result] = await promise.execute(query, [questionText, questionId]);
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error editing question:", error);
      throw error;
    }
  }

  // Edit reply text (for admin/employee)
  static async editReply(questionId, answerText) {
    try {
      const query = `
        UPDATE questions 
        SET answer = ?
        WHERE id = ?
      `;

      const [result] = await promise.execute(query, [answerText, questionId]);
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error editing reply:", error);
      throw error;
    }
  }

  // Get all questions with pagination (for admin/employee)
  static async getAllQuestionsWithPagination(limit, offset) {
    try {
      const countQuery = `
        SELECT COUNT(*) as total
        FROM questions q
      `;

      const dataQuery = `
        SELECT q.*, u.name as user_name, r.name as replied_by_name
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        LEFT JOIN users r ON q.replied_by = r.id
        ORDER BY q.submitted_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      // First get total count
      const [countResult] = await promise.execute(countQuery);
      const total = countResult[0].total;

      // Then get paginated data
      const [rows] = await promise.execute(dataQuery);

      return {
        questions: rows,
        total: total,
      };
    } catch (error) {
      console.error("Error fetching all questions with pagination:", error);
      throw error;
    }
  }

  // Get all questions (for admin) - kept for backward compatibility
  static async getAllQuestions() {
    try {
      const query = `
        SELECT q.*, u.name as user_name, r.name as replied_by_name
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        LEFT JOIN users r ON q.replied_by = r.id
        ORDER BY q.submitted_at DESC
      `;

      const [rows] = await promise.execute(query);
      return rows;
    } catch (error) {
      console.error("Error fetching all questions:", error);
      throw error;
    }
  }

  // Get pending questions (for admin)
  static async getPendingQuestions() {
    try {
      const query = `
        SELECT q.*, u.name as user_name
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        WHERE q.status = 'pending' OR q.status = 'in_progress'
        ORDER BY q.priority DESC, q.submitted_at ASC
      `;

      const [rows] = await promise.execute(query);
      return rows;
    } catch (error) {
      console.error("Error fetching pending questions:", error);
      throw error;
    }
  }

  // Delete question
  static async delete(questionId) {
    try {
      const query = "DELETE FROM questions WHERE id = ?";

      const [result] = await promise.execute(query, [questionId]);
      return { success: true, affectedRows: result.affectedRows };
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  }

  // Search questions
  static async search(searchTerm) {
    try {
      const query = `
        SELECT q.*, u.name as user_name
        FROM questions q
        LEFT JOIN users u ON q.user_id = u.id
        WHERE q.question LIKE ? OR q.answer LIKE ?
        ORDER BY q.submitted_at DESC
      `;

      const searchPattern = `%${searchTerm}%`;
      const [rows] = await promise.execute(query, [
        searchPattern,
        searchPattern,
      ]);
      return rows;
    } catch (error) {
      console.error("Error searching questions:", error);
      throw error;
    }
  }

  // Get count of unanswered questions
  static async getUnansweredQuestionsCount() {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM questions q
        WHERE q.is_replied = 0 OR q.is_replied IS NULL
      `;

      const [rows] = await promise.execute(query);
      return rows[0].count;
    } catch (error) {
      console.error("Error counting unanswered questions:", error);
      throw error;
    }
  }

  /**
   * Get all unseen answers to the current user's questions
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  static async getUnseenAnswersToMyQuestions(userId) {
    try {
      const query = `
        SELECT q.id, q.question, q.answer, q.submitted_at, q.replied_at, q.answer_seen, n.name as replied_by_name
        FROM questions q
        LEFT JOIN users n ON q.replied_by = n.id
        WHERE q.user_id = ? AND q.is_replied = 1 AND q.answer_seen = 0
        ORDER BY q.replied_at DESC
      `;

      const [rows] = await promise.execute(query, [userId]);
      return rows;
    } catch (error) {
      console.error("Error fetching unseen answers:", error);
      throw error;
    }
  }

  /**
   * Mark a question's answer as seen
   * @param {number} questionId
   * @returns {Promise<void>}
   */
  static async markAnswerAsSeen(questionId) {
    try {
      const query = `UPDATE questions SET answer_seen = 1 WHERE id = ?`;
      await promise.execute(query, [questionId]);
    } catch (error) {
      console.error("Error marking answer as seen:", error);
      throw error;
    }
  }
}

module.exports = Question;
