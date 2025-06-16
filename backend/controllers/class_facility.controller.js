const ClassFacility = require('../models/class_facility.model');

const classFacilityController = {
  async createFacility(req, res) {
    try {
      const { name, equipment_name, equipment_count, equipment_status } = req.body;
      const user_id = req.user.id;

      if (!name || !equipment_name || !equipment_count || !equipment_status) {
        return res.status(400).json({
          success: false,
          message: 'تمام فیلدها الزامی می‌باشند'
        });
      }

      const facilityId = await ClassFacility.create({
        user_id,
        name,
        equipment_name,
        equipment_count,
        equipment_status
      });

      res.status(201).json({
        success: true,
        message: 'امکانات با موفقیت اضافه شد',
        data: { id: facilityId }
      });
    } catch (error) {
      console.error('Error in createFacility:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در ایجاد امکانات'
      });
    }
  },

  async getFacilities(req, res) {
    try {
      const user_id = req.user.id;
      const facilities = await ClassFacility.findByUserId(user_id);

      res.json({
        success: true,
        data: facilities
      });
    } catch (error) {
      console.error('Error in getFacilities:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در دریافت امکانات'
      });
    }
  },

  async deleteFacility(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const deleted = await ClassFacility.delete(id, user_id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'امکانات یافت نشد'
        });
      }

      res.json({
        success: true,
        message: 'امکانات با موفقیت حذف شد'
      });
    } catch (error) {
      console.error('Error in deleteFacility:', error);
      res.status(500).json({
        success: false,
        message: 'خطا در حذف امکانات'
      });
    }
  }
};

module.exports = classFacilityController; 