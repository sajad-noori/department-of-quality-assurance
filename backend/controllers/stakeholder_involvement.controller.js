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
  },

  // Get stakeholder involvement data by user ID (for admin/employee access)
  async getByUserIdForAdmin(req, res) {
    try {
      const { userId } = req.params;
      
      // Validate that userId is a number
      if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({ 
          success: false,
          message: 'شناسه کاربر نامعتبر است' 
        });
      }

      const record = await StakeholderInvolvement.findByUserId(userId);

      res.status(200).json({
        success: true,
        data: record || { description: "" }
      });
    } catch (error) {
      console.error('Error fetching stakeholder involvement by user ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching stakeholder involvement data',
        error: error.message
      });
    }
  }
};

module.exports = stakeholderInvolvementController; 