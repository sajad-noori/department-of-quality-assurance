const AcademyFacility = require('../models/academy_facility.model');

const createFacility = async (req, res) => {
  try {
    const { name, basic_facilities, equipment_count, equipment_status } = req.body;
    const user_id = req.user.id;

    if (!name || !basic_facilities || !equipment_count || !equipment_status) {
      return res.status(400).json({
        success: false,
        message: 'تمام فیلدها الزامی هستند'
      });
    }

    const facility = await AcademyFacility.create({
      user_id,
      name,
      basic_facilities,
      equipment_count,
      equipment_status
    });

    res.status(201).json({
      success: true,
      data: facility,
      message: 'امکانات با موفقیت اضافه شد'
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد امکانات'
    });
  }
};

const getFacilities = async (req, res) => {
  try {
    const user_id = req.user.id;
    const facilities = await AcademyFacility.findByUserId(user_id);

    res.json({
      success: true,
      data: facilities
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات امکانات'
    });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const deleted = await AcademyFacility.delete(id, user_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'امکانات مورد نظر یافت نشد'
      });
    }

    res.json({
      success: true,
      message: 'امکانات با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Error deleting facility:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف امکانات'
    });
  }
};

// Get academy facilities data by user ID (for admin/employee access)
const getFacilitiesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate that userId is a number
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ 
        success: false,
        message: 'شناسه کاربر نامعتبر است' 
      });
    }

    const facilities = await AcademyFacility.findByUserId(userId);

    res.status(200).json({
      success: true,
      data: facilities
    });
  } catch (error) {
    console.error('Error fetching academy facilities by user ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching academy facilities data',
      error: error.message
    });
  }
};

module.exports = {
  createFacility,
  getFacilities,
  deleteFacility,
  getFacilitiesByUserId
}; 