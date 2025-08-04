const { promise } = require("../config/db");

/**
 * Delete a filled questionnaire for the authenticated user
 * DELETE /api/questionnaires/filled/:id
 */
const deleteFilledQuestionnaire = async (req, res) => {
  try {
    const filledId = req.params.id;
    const userId = req.user.id;
    if (!filledId || isNaN(parseInt(filledId))) {
      return res
        .status(400)
        .json({ success: false, message: "شناسه نامعتبر است." });
    }
    // Check if the filled questionnaire exists and belongs to the user
    const [rows] = await promise.execute(
      "SELECT id, file_url FROM filled_questionnaires WHERE id = ? AND user_id = ?",
      [filledId, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "پرسشنامه ارسال شده یافت نشد یا متعلق به شما نیست.",
      });
    }
    // Delete the file from disk securely (if file_url exists)
    const path = require('path');
    const fs = require('fs').promises;
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const fileUrl = rows[0].file_url;
    if (fileUrl) {
      // Only allow deletion if file is inside uploads dir
      const filePath = path.join(uploadsDir, fileUrl);
      if (filePath.startsWith(uploadsDir)) {
        try {
          await fs.unlink(filePath);
        } catch (err) {
          // Ignore file not found, log other errors
          if (err.code !== 'ENOENT') {
            console.error('Error deleting file for filled questionnaire:', err);
          }
        }
      } else {
        console.error('Attempted path traversal in file deletion:', filePath);
      }
    }
    // Delete the record from DB
    await promise.execute(
      "DELETE FROM filled_questionnaires WHERE id = ? AND user_id = ?",
      [filledId, userId]
    );
    res.json({
      success: true,
      message: "پرسشنامه ارسال شده با موفقیت حذف شد.",
    });
  } catch (error) {
    console.error("Error deleting filled questionnaire:", error);
    res
      .status(500)
      .json({ success: false, message: "خطا در حذف پرسشنامه ارسال شده." });
  }
};

// Export for router
module.exports = {
  deleteFilledQuestionnaire,
};
// Export for router
module.exports = {
  deleteFilledQuestionnaire,
};
