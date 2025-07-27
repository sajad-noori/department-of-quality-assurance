const { promise } = require("../config/db");

// Get step progress for the current user
exports.getStepProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
    }

    const sql = `
      SELECT 
        current_step,
        step_submission_status,
        created_at,
        updated_at
      FROM step_progress 
      WHERE user_id = ?
      ORDER BY id DESC
      LIMIT 1
    `;

    const [results] = await promise.execute(sql, [userId]);

    if (results.length === 0) {
      // Create initial progress record
      const initialProgress = {
        current_step: 1,
        step_submission_status: JSON.stringify({
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
          7: false,
          8: false,
          9: false,
          10: false,
        }),
      };

      const insertSql = `
        INSERT INTO step_progress (user_id, current_step, step_submission_status)
        VALUES (?, ?, ?)
      `;

      await promise.execute(insertSql, [
        userId,
        initialProgress.current_step,
        initialProgress.step_submission_status,
      ]);

      return res.json({
        current_step: initialProgress.current_step,
        step_submission_status: JSON.parse(
          initialProgress.step_submission_status
        ),
      });
    } else {
      const progress = results[0];
      return res.json({
        current_step: progress.current_step,
        step_submission_status:
          typeof progress.step_submission_status === "string"
            ? JSON.parse(progress.step_submission_status)
            : progress.step_submission_status,
      });
    }
  } catch (error) {
    console.error("Error in getStepProgress:", error);
    res.status(500).json({ message: "خطا در دریافت پیشرفت مراحل" });
  }
};

// Update step progress for the current user
exports.updateStepProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
    }

    const { current_step, step_submission_status } = req.body;

    // Validate inputs
    if (!current_step || !step_submission_status) {
      return res.status(400).json({ message: "اطلاعات ناقص است" });
    }

    if (current_step < 1 || current_step > 10) {
      return res.status(400).json({ message: "شماره مرحله نامعتبر است" });
    }

    // Check if progress record exists
    const checkSql = "SELECT id FROM step_progress WHERE user_id = ?";

    const [results] = await promise.execute(checkSql, [userId]);

    const stepStatusJson = JSON.stringify(step_submission_status);

    if (results.length === 0) {
      // Create new progress record
      const insertSql = `
        INSERT INTO step_progress (user_id, current_step, step_submission_status)
        VALUES (?, ?, ?)
      `;

      await promise.execute(insertSql, [userId, current_step, stepStatusJson]);

      return res.json({
        message: "پیشرفت با موفقیت ذخیره شد",
        current_step,
        step_submission_status,
      });
    } else {
      // Update existing progress record
      const updateSql = `
        UPDATE step_progress 
        SET current_step = ?, step_submission_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;

      await promise.execute(updateSql, [current_step, stepStatusJson, userId]);

      return res.json({
        message: "پیشرفت با موفقیت بروزرسانی شد",
        current_step,
        step_submission_status,
      });
    }
  } catch (error) {
    console.error("Error in updateStepProgress:", error);
    res.status(500).json({ message: "خطا در بروزرسانی پیشرفت" });
  }
};

// Mark a specific step as submitted
exports.markStepAsSubmitted = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
    }

    const { stepNumber } = req.body;

    if (!stepNumber || stepNumber < 1 || stepNumber > 10) {
      return res.status(400).json({ message: "شماره مرحله نامعتبر است" });
    }

    // Get current progress
    const getSql =
      "SELECT step_submission_status FROM step_progress WHERE user_id = ?";

    const [results] = await promise.execute(getSql, [userId]);

    let stepStatus = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
    };

    if (results.length > 0) {
      const statusRaw = results[0].step_submission_status;
      stepStatus =
        typeof statusRaw === "string" ? JSON.parse(statusRaw) : statusRaw;
    }

    // Mark the step as submitted
    stepStatus[stepNumber] = true;

    const stepStatusJson = JSON.stringify(stepStatus);

    if (results.length === 0) {
      // Create new progress record
      const insertSql = `
        INSERT INTO step_progress (user_id, current_step, step_submission_status)
        VALUES (?, ?, ?)
      `;

      await promise.execute(insertSql, [userId, stepNumber, stepStatusJson]);

      return res.json({
        message: `مرحله ${stepNumber} با موفقیت ثبت شد`,
        step_submission_status: stepStatus,
      });
    } else {
      // Update existing progress record
      const updateSql = `
        UPDATE step_progress 
        SET step_submission_status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;

      await promise.execute(updateSql, [stepStatusJson, userId]);

      return res.json({
        message: `مرحله ${stepNumber} با موفقیت ثبت شد`,
        step_submission_status: stepStatus,
      });
    }
  } catch (error) {
    console.error("Error in markStepAsSubmitted:", error);
    res.status(500).json({ message: "خطا در ثبت مرحله" });
  }
};

// Reset progress for the current user
exports.resetProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
    }

    const resetSql = `
      UPDATE step_progress 
      SET current_step = 1, 
          step_submission_status = '{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false,"9":false,"10":false}',
          updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;

    const [result] = await promise.execute(resetSql, [userId]);

    if (result.affectedRows === 0) {
      // Create new progress record if none exists
      const insertSql = `
        INSERT INTO step_progress (user_id, current_step, step_submission_status)
        VALUES (?, 1, '{"1":false,"2":false,"3":false,"4":false,"5":false,"6":false,"7":false,"8":false,"9":false,"10":false}')
      `;

      await promise.execute(insertSql, [userId]);
    }

    return res.json({
      message: "پیشرفت با موفقیت بازنشانی شد",
      current_step: 1,
      step_submission_status: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
      },
    });
  } catch (error) {
    console.error("Error in resetProgress:", error);
    res.status(500).json({ message: "خطا در بازنشانی پیشرفت" });
  }
};
