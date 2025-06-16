const StakeholderInvolvement = require("../models/stakeholder_involvement.model");

const stakeholderInvolvementController = {
  async createOrUpdate(req, res) {
    try {
      const { description } = req.body;
      const userId = req.user.id;

      if (!description) {
        return res.status(400).json({
          success: false,
          message: "توضیحات الزامی است"
        });
      }

      // Check if user already has a record
      const existingRecord = await StakeholderInvolvement.findByUserId(userId);

      if (existingRecord) {
        // Update existing record
        const updated = await StakeholderInvolvement.update(userId, description);
        if (updated) {
          return res.json({
            success: true,
            message: "اطلاعات با موفقیت بروزرسانی شد",
            data: { description }
          });
        }
      } else {
        // Create new record
        const id = await StakeholderInvolvement.create({
          user_id: userId,
          description
        });

        return res.json({
          success: true,
          message: "اطلاعات با موفقیت ثبت شد",
          data: { id, description }
        });
      }

      return res.status(500).json({
        success: false,
        message: "خطا در ثبت اطلاعات"
      });
    } catch (error) {
      console.error("Error in createOrUpdate:", error);
      return res.status(500).json({
        success: false,
        message: "خطا در سرور"
      });
    }
  },

  async getByUserId(req, res) {
    try {
      const userId = req.user.id;
      const record = await StakeholderInvolvement.findByUserId(userId);

      return res.json({
        success: true,
        data: record || { description: "" }
      });
    } catch (error) {
      console.error("Error in getByUserId:", error);
      return res.status(500).json({
        success: false,
        message: "خطا در دریافت اطلاعات"
      });
    }
  }
};

module.exports = stakeholderInvolvementController; 