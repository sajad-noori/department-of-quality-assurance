const { promise } = require("../config/db");

// Get the current user's stage status
exports.getStageStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const [results] = await promise.execute(
      "SELECT stage1, stage2, stage3 FROM stages WHERE user_id = ?",
      [userId]
    );

    if (results.length === 0) {
      // If no record, create one with all stages false
      await promise.execute(
        "INSERT INTO stages (user_id, stage1, stage2, stage3) VALUES (?, 0, 0, 0)",
        [userId]
      );
      return res.json({
        success: true,
        data: { stage1: false, stage2: false, stage3: false },
      });
    } else {
      const { stage1, stage2, stage3 } = results[0];
      return res.json({
        success: true,
        data: {
          stage1: !!stage1,
          stage2: !!stage2,
          stage3: !!stage3,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching stage status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark a stage as complete for the current user
exports.completeStage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stage } = req.body; // expects { stage: 1 | 2 | 3 }

    if (![1, 2, 3].includes(stage)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid stage number" });
    }

    // First, check if the row exists
    const [results] = await promise.execute(
      "SELECT id FROM stages WHERE user_id = ?",
      [userId]
    );

    if (results.length === 0) {
      // Insert new row with the correct stage set to 1
      const stageFields = [0, 0, 0];
      stageFields[stage - 1] = 1;
      await promise.execute(
        "INSERT INTO stages (user_id, stage1, stage2, stage3) VALUES (?, ?, ?, ?)",
        [userId, ...stageFields]
      );
      return res.json({
        success: true,
        message: `Stage ${stage} marked as complete.`,
      });
    } else {
      // Update the existing row
      await promise.execute(
        `UPDATE stages SET stage${stage} = 1 WHERE user_id = ?`,
        [userId]
      );
      return res.json({
        success: true,
        message: `Stage ${stage} marked as complete.`,
      });
    }
  } catch (error) {
    console.error("Error completing stage:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
