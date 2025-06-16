const Laylia = require('../models/laylia.model');

// Get all laylia entries for the authenticated user
exports.getLaylia = async (req, res) => {
  try {
    const laylia = await Laylia.findAll(req.user.id);
    res.json({ success: true, data: laylia });
  } catch (error) {
    console.error('Error in getLaylia:', error);
    res.status(500).json({ success: false, message: 'Error fetching laylia data' });
  }
};

// Add a new laylia entry
exports.addLaylia = async (req, res) => {
  try {
    const { name, newEnrollments, totalStudents } = req.body;
    
    const laylia = await Laylia.create({
      name,
      newEnrollments,
      totalStudents,
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: laylia });
  } catch (error) {
    console.error('Error in addLaylia:', error);
    res.status(500).json({ success: false, message: 'Error adding laylia data' });
  }
};

// Delete a laylia entry
exports.deleteLaylia = async (req, res) => {
  try {
    const { id } = req.params;
    
    const laylia = await Laylia.findOne(id, req.user.id);

    if (!laylia) {
      return res.status(404).json({ success: false, message: 'Laylia entry not found' });
    }

    const deleted = await Laylia.delete(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Failed to delete laylia entry' });
    }

    res.json({ success: true, message: 'Laylia entry deleted successfully' });
  } catch (error) {
    console.error('Error in deleteLaylia:', error);
    res.status(500).json({ success: false, message: 'Error deleting laylia data' });
  }
}; 