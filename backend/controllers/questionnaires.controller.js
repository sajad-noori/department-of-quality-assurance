const Questionnaire = require('../models/questionnaire.model');
const path = require('path');

class QuestionnairesController {
  // Create a new questionnaire
  static async createQuestionnaire(req, res) {
    try {
      const { title, description } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Title is required' });
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
        file_url
      });

      res.status(201).json({
        success: true,
        message: 'Questionnaire created successfully',
        data: { id: questionnaireId, title, description, file_name, file_url }
      });
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      res.status(500).json({ success: false, message: 'Error creating questionnaire', error: error.message });
    }
  }

  // Get all questionnaires
  static async getAllQuestionnaires(req, res) {
    try {
      const db = require('../config/db');
      const query = `SELECT id, title, description, file_name, file_url FROM questionnaires ORDER BY created_at DESC`;
      db.execute(query, (err, rows) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error fetching questionnaires', error: err.message });
        }
        res.status(200).json({ success: true, data: rows });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching questionnaires', error: error.message });
    }
  }

  // Delete a questionnaire
  static async deleteQuestionnaire(req, res) {
    try {
      const { id } = req.params;
      const db = require('../config/db');
      const fs = require('fs');
      // Get file path
      db.execute('SELECT file_url FROM questionnaires WHERE id = ?', [id], (err, rows) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error finding questionnaire', error: err.message });
        }
        if (!rows || rows.length === 0) {
          return res.status(404).json({ success: false, message: 'پرسشنامه پیدا نشد' });
        }
        const fileUrl = rows[0].file_url;
        // Delete from DB
        db.execute('DELETE FROM questionnaires WHERE id = ?', [id], (err2, result) => {
          if (err2) {
            return res.status(500).json({ success: false, message: 'Error deleting questionnaire', error: err2.message });
          }
          // Remove file if exists
          if (fileUrl && fs.existsSync(path.join(__dirname, '..', 'uploads', fileUrl))) {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads', fileUrl));
          }
          res.status(200).json({ success: true });
        });
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error deleting questionnaire', error: error.message });
    }
  }

  // Update a questionnaire
  static async updateQuestionnaire(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const db = require('../config/db');
      const fs = require('fs');
      // Get current file
      db.execute('SELECT file_url FROM questionnaires WHERE id = ?', [id], (err, rows) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error finding questionnaire', error: err.message });
        }
        if (!rows || rows.length === 0) {
          return res.status(404).json({ success: false, message: 'پرسشنامه پیدا نشد' });
        }
        let file_name = rows[0].file_name;
        let file_url = rows[0].file_url;
        // If new file uploaded, update and remove old
        if (req.file) {
          if (file_url && fs.existsSync(path.join(__dirname, '..', 'uploads', file_url))) {
            fs.unlinkSync(path.join(__dirname, '..', 'uploads', file_url));
          }
          file_name = req.file.filename;
          file_url = `questionnaires/${file_name}`;
        }
        // Ensure no undefined values
        file_name = file_name ?? null;
        file_url = file_url ?? null;
        db.execute(
          'UPDATE questionnaires SET title = ?, description = ?, file_name = ?, file_url = ?, updated_at = NOW() WHERE id = ?',
          [title, description, file_name, file_url, id],
          (err2, result) => {
            if (err2) {
              return res.status(500).json({ success: false, message: 'Error updating questionnaire', error: err2.message });
            }
            res.status(200).json({ success: true, data: { id, title, description, file_name, file_url } });
          }
        );
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error updating questionnaire', error: error.message });
    }
  }
}

module.exports = QuestionnairesController; 