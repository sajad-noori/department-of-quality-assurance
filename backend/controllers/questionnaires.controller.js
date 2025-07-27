const Questionnaire = require("../models/questionnaire.model");
const path = require("path");
const FilledQuestionnaire = require("../models/filled_questionnaire.model");
const { promise } = require("../config/db");

class QuestionnairesController {
  // Create a new questionnaire
  static async createQuestionnaire(req, res) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res
          .status(400)
          .json({ success: false, message: "Title is required" });
      }

      let file_name = null;
      let file_url = null;
      if (req.file) {
        file_name = req.file.filename;
        file_url = `questionnaires/${file_name}`;
      }

      const questionnaireId = await Questionnaire.create({
        title,
        description,
        file_name,
        file_url,
      });

      res.status(201).json({
        success: true,
        message: "Questionnaire created successfully",
        data: { id: questionnaireId, title, description, file_name, file_url },
      });
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error creating questionnaire",
          error: error.message,
        });
    }
  }

  // Get all questionnaires
  static async getAllQuestionnaires(req, res) {
    try {
      const query = `SELECT id, title, description, file_name, file_url FROM questionnaires ORDER BY created_at DESC`;
      const [rows] = await promise.execute(query);
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching questionnaires",
          error: error.message,
        });
    }
  }

  // Delete a questionnaire
  static async deleteQuestionnaire(req, res) {
    try {
      const { id } = req.params;
      const fs = require("fs");

      // Get file path
      const [rows] = await promise.execute(
        "SELECT file_url FROM questionnaires WHERE id = ?",
        [id]
      );

      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "پرسشنامه پیدا نشد" });
      }

      const fileUrl = rows[0].file_url;

      // Delete from DB
      await promise.execute("DELETE FROM questionnaires WHERE id = ?", [id]);

      // Remove file if exists
      if (
        fileUrl &&
        fs.existsSync(path.join(__dirname, "..", "uploads", fileUrl))
      ) {
        fs.unlinkSync(path.join(__dirname, "..", "uploads", fileUrl));
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting questionnaire:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error deleting questionnaire",
          error: error.message,
        });
    }
  }

  // Update a questionnaire
  static async updateQuestionnaire(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const fs = require("fs");

      // Get current file
      const [rows] = await promise.execute(
        "SELECT file_url FROM questionnaires WHERE id = ?",
        [id]
      );

      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "پرسشنامه پیدا نشد" });
      }

      let file_name = rows[0].file_name;
      let file_url = rows[0].file_url;

      // If new file uploaded, update and remove old
      if (req.file) {
        if (
          file_url &&
          fs.existsSync(path.join(__dirname, "..", "uploads", file_url))
        ) {
          fs.unlinkSync(path.join(__dirname, "..", "uploads", file_url));
        }
        file_name = req.file.filename;
        file_url = `questionnaires/${file_name}`;
      }

      // Ensure no undefined values
      file_name = file_name ?? null;
      file_url = file_url ?? null;

      await promise.execute(
        "UPDATE questionnaires SET title = ?, description = ?, file_name = ?, file_url = ?, updated_at = NOW() WHERE id = ?",
        [title, description, file_name, file_url, id]
      );

      res
        .status(200)
        .json({
          success: true,
          data: { id, title, description, file_name, file_url },
        });
    } catch (error) {
      console.error("Error updating questionnaire:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error updating questionnaire",
          error: error.message,
        });
    }
  }

  // Upload a filled questionnaire
  static async uploadFilledQuestionnaire(req, res) {
    try {
      const { questionnaire_id } = req.body;
      const user_id = req.user.id;
      if (!questionnaire_id) {
        return res
          .status(400)
          .json({ success: false, message: "questionnaire_id is required" });
      }
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "فایل الزامی است" });
      }
      // Prevent duplicate upload
      const existing = await FilledQuestionnaire.findByQuestionnaireIdAndUserId(
        questionnaire_id,
        user_id
      );
      if (existing) {
        return res
          .status(400)
          .json({
            success: false,
            message: "شما قبلاً برای این پرسشنامه فایل ارسال کرده‌اید.",
          });
      }
      const file_name = req.file.filename;
      const file_url = `questionnaires/${file_name}`;
      const filledId = await FilledQuestionnaire.create({
        questionnaire_id,
        user_id,
        file_name,
        file_url,
      });
      res.status(201).json({
        success: true,
        message: "پرسشنامه با موفقیت ارسال شد",
        data: { id: filledId, questionnaire_id, user_id, file_name, file_url },
      });
    } catch (error) {
      console.error("Error uploading filled questionnaire:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "خطا در ارسال پرسشنامه",
          error: error.message,
        });
    }
  }

  // Get all filled questionnaires for a questionnaire
  static async getFilledQuestionnaires(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "questionnaire_id is required" });
      }
      const filled = await FilledQuestionnaire.findByQuestionnaireId(id);
      res.status(200).json({ success: true, data: filled });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching filled questionnaires",
          error: error.message,
        });
    }
  }

  // Get all filled questionnaires for the current user
  static async getFilledQuestionnairesForUser(req, res) {
    try {
      const user_id = req.user.id;
      const [rows] = await promise.execute(
        "SELECT * FROM filled_questionnaires WHERE user_id = ?",
        [user_id]
      );
      res.status(200).json({ success: true, data: rows });
    } catch (error) {
      console.error("Error fetching filled questionnaires for user:", error);
      res
        .status(500)
        .json({
          success: false,
          message: "Error fetching filled questionnaires",
          error: error.message,
        });
    }
  }

  // Mark a filled questionnaire as checked
  static async checkFilledQuestionnaire(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({
            success: false,
            message: "filled questionnaire id is required",
          });
      }
      const updated = await FilledQuestionnaire.setChecked(id);
      if (updated) {
        res
          .status(200)
          .json({
            success: true,
            message: "پرسشنامه به عنوان خوانده شده علامت‌گذاری شد",
          });
      } else {
        res.status(404).json({ success: false, message: "پرسشنامه پیدا نشد" });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "خطا در بروزرسانی وضعیت",
          error: error.message,
        });
    }
  }

  // Get count of unchecked filled questionnaires for a questionnaire
  static async getUncheckedFilledCount(req, res) {
    try {
      const { id } = req.params;

      // Input validation and sanitization
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valid questionnaire_id is required",
        });
      }

      const questionnaireId = parseInt(id);

      const query = `
        SELECT COUNT(*) as count 
        FROM filled_questionnaires 
        WHERE questionnaire_id = ? AND checked = 0
      `;

      const [rows] = await promise.execute(query, [questionnaireId]);

      const count = rows[0] ? parseInt(rows[0].count) : 0;
      res.status(200).json({
        success: true,
        data: { count: count },
      });
    } catch (error) {
      console.error("Error in getUncheckedFilledCount:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching unchecked count",
      });
    }
  }

  // Get total count of unchecked filled questionnaires
  static async getTotalUncheckedFilledCount(req, res) {
    try {
      const query = `
        SELECT COUNT(*) as count 
        FROM filled_questionnaires 
        WHERE checked = 0
      `;

      const [rows] = await promise.execute(query);

      const count = rows[0] ? parseInt(rows[0].count) : 0;
      res.status(200).json({
        success: true,
        data: { count: count },
      });
    } catch (error) {
      console.error("Error in getTotalUncheckedFilledCount:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching total unchecked count",
      });
    }
  }
}

module.exports = QuestionnairesController;
