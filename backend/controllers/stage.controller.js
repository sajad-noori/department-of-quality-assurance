const db = require('../config/db');

// Get the current user's stage status
exports.getStageStatus = (req, res) => {
  const userId = req.user.id;
  db.query('SELECT stage1, stage2, stage3 FROM stages WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error fetching stage status:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    if (results.length === 0) {
      // If no record, create one with all stages false
      db.query('INSERT INTO stages (user_id, stage1, stage2, stage3) VALUES (?, 0, 0, 0)', [userId], (insertErr) => {
        if (insertErr) {
          console.error('Error inserting stage row:', insertErr);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        return res.json({
          success: true,
          data: { stage1: false, stage2: false, stage3: false }
        });
      });
    } else {
      const { stage1, stage2, stage3 } = results[0];
      return res.json({
        success: true,
        data: {
          stage1: !!stage1,
          stage2: !!stage2,
          stage3: !!stage3
        }
      });
    }
  });
};

// Mark a stage as complete for the current user
exports.completeStage = (req, res) => {
  const userId = req.user.id;
  const { stage } = req.body; // expects { stage: 1 | 2 | 3 }
  if (![1, 2, 3].includes(stage)) {
    return res.status(400).json({ success: false, message: 'Invalid stage number' });
  }
  // First, check if the row exists
  db.query('SELECT id FROM stages WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error checking stage row:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
    if (results.length === 0) {
      // Insert new row with the correct stage set to 1
      const stageFields = [0, 0, 0];
      stageFields[stage - 1] = 1;
      db.query('INSERT INTO stages (user_id, stage1, stage2, stage3) VALUES (?, ?, ?, ?)', [userId, ...stageFields], (insertErr) => {
        if (insertErr) {
          console.error('Error inserting stage row:', insertErr);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        return res.json({ success: true, message: `Stage ${stage} marked as complete.` });
      });
    } else {
      // Update the existing row
      db.query(`UPDATE stages SET stage${stage} = 1 WHERE user_id = ?`, [userId], (updateErr) => {
        if (updateErr) {
          console.error('Error updating stage row:', updateErr);
          return res.status(500).json({ success: false, message: 'Server error' });
        }
        return res.json({ success: true, message: `Stage ${stage} marked as complete.` });
      });
    }
  });
}; 