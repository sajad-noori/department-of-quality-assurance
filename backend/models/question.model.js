const db = require("../config/db");

class Question {
  // Create a new question
  static create(questionData) {
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

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [user_id, question, category, priority],
        (err, result) => {
          if (err) {
            console.error("Error creating question:", err);
            return reject(err);
          }
          resolve({ success: true, id: result.insertId });
        }
      );
    });
  }

  // Get all FAQ questions (questions that have been replied to and marked as FAQ)
  static getFAQQuestions() {
    const query = `
      SELECT q.*, u.name as user_name
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.is_faq = 1 AND q.is_replied = 1
      ORDER BY q.submitted_at DESC
    `;

    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          console.error("Error fetching FAQ questions:", err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Get user's questions
  static getUserQuestions(userId) {
    const query = `
      SELECT q.*, u.name as user_name
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.user_id = ?
      ORDER BY q.submitted_at DESC
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, rows) => {
        if (err) {
          console.error("Error fetching user questions:", err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Get question by ID
  static getById(questionId) {
    const query = `
      SELECT q.*, u.name as user_name
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [questionId], (err, rows) => {
        if (err) {
          console.error("Error fetching question by ID:", err);
          return reject(err);
        }
        resolve(rows[0] || null);
      });
    });
  }

  // Update question (for admin replies)
  static update(questionId, updateData) {
    const { answer, is_replied, is_faq, status, replied_by } = updateData;

    const query = `
      UPDATE questions 
      SET answer = ?, is_replied = ?, is_faq = ?, status = ?, replied_by = ?, replied_at = NOW()
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(
        query,
        [answer, is_replied, is_faq, status, replied_by, questionId],
        (err, result) => {
          if (err) {
            console.error("Error updating question:", err);
            return reject(err);
          }
          resolve({ success: true, affectedRows: result.affectedRows });
        }
      );
    });
  }

  // Edit question text (for admin/employee)
  static editQuestion(questionId, questionText) {
    const query = `
      UPDATE questions 
      SET question = ?
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [questionText, questionId], (err, result) => {
        if (err) {
          console.error("Error editing question:", err);
          return reject(err);
        }
        resolve({ success: true, affectedRows: result.affectedRows });
      });
    });
  }

  // Edit reply text (for admin/employee)
  static editReply(questionId, answerText) {
    const query = `
      UPDATE questions 
      SET answer = ?
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.query(query, [answerText, questionId], (err, result) => {
        if (err) {
          console.error("Error editing reply:", err);
          return reject(err);
        }
        resolve({ success: true, affectedRows: result.affectedRows });
      });
    });
  }

  // Get all questions with pagination (for admin/employee)
  static getAllQuestionsWithPagination(limit, offset) {
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
      LIMIT ? OFFSET ?
    `;

    return new Promise((resolve, reject) => {
      // First get total count
      db.query(countQuery, (err, countResult) => {
        if (err) {
          console.error("Error counting questions:", err);
          return reject(err);
        }

        const total = countResult[0].total;

        // Then get paginated data
        db.query(dataQuery, [limit, offset], (err, rows) => {
          if (err) {
            console.error("Error fetching all questions:", err);
            return reject(err);
          }
          resolve({
            questions: rows,
            total: total,
          });
        });
      });
    });
  }

  // Get all questions (for admin) - kept for backward compatibility
  static getAllQuestions() {
    const query = `
      SELECT q.*, u.name as user_name, r.name as replied_by_name
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      LEFT JOIN users r ON q.replied_by = r.id
      ORDER BY q.submitted_at DESC
    `;

    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          console.error("Error fetching all questions:", err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Get pending questions (for admin)
  static getPendingQuestions() {
    const query = `
      SELECT q.*, u.name as user_name
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.status = 'pending' OR q.status = 'in_progress'
      ORDER BY q.priority DESC, q.submitted_at ASC
    `;

    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          console.error("Error fetching pending questions:", err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Delete question
  static delete(questionId) {
    const query = "DELETE FROM questions WHERE id = ?";

    return new Promise((resolve, reject) => {
      db.query(query, [questionId], (err, result) => {
        if (err) {
          console.error("Error deleting question:", err);
          return reject(err);
        }
        resolve({ success: true, affectedRows: result.affectedRows });
      });
    });
  }

  // Search questions
  static search(searchTerm) {
    const query = `
      SELECT q.*, u.name as user_name
      FROM questions q
      LEFT JOIN users u ON q.user_id = u.id
      WHERE q.question LIKE ? OR q.answer LIKE ?
      ORDER BY q.submitted_at DESC
    `;

    return new Promise((resolve, reject) => {
      const searchPattern = `%${searchTerm}%`;
      db.query(query, [searchPattern, searchPattern], (err, rows) => {
        if (err) {
          console.error("Error searching questions:", err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  // Get count of unanswered questions
  static getUnansweredQuestionsCount() {
    const query = `
      SELECT COUNT(*) as count
      FROM questions q
      WHERE q.is_replied = 0 OR q.is_replied IS NULL
    `;

    return new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) {
          console.error("Error counting unanswered questions:", err);
          return reject(err);
        }
        resolve(rows[0].count);
      });
    });
  }

  /**
   * Get all unseen answers to the current user's questions
   * @param {number} userId
   * @returns {Promise<Array>}
   */
  static getUnseenAnswersToMyQuestions(userId) {
    const query = `
      SELECT q.id, q.question, q.answer, q.submitted_at, q.replied_at, q.answer_seen, n.name as replied_by_name
      FROM questions q
      LEFT JOIN users n ON q.replied_by = n.id
      WHERE q.user_id = ? AND q.is_replied = 1 AND q.answer_seen = 0
      ORDER BY q.replied_at DESC
    `;
    return new Promise((resolve, reject) => {
      db.query(query, [userId], (err, rows) => {
        if (err) {
          console.error("Error fetching unseen answers:", err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  /**
   * Mark a question's answer as seen
   * @param {number} questionId
   * @returns {Promise<void>}
   */
  static markAnswerAsSeen(questionId) {
    const query = `UPDATE questions SET answer_seen = 1 WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.query(query, [questionId], (err) => {
        if (err) {
          console.error("Error marking answer as seen:", err);
          return reject(err);
        }
        resolve();
      });
    });
  }
}

module.exports = Question;
