const VisionMission = require('../models/visionMission.model');

exports.getVisionMission = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const visionMission = await VisionMission.findByUserId(req.user.id);
        
        if (!visionMission) {
            return res.json({
                vision: '',
                mission: '',
                strategic_goals: ''
            });
        }

        res.json(visionMission);
    } catch (error) {
        console.error('Error in getVisionMission:', error);
        res.status(500).json({ 
            message: 'Error fetching vision mission',
            error: error.message
        });
    }
};

exports.createVisionMission = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const { vision, mission, strategicGoals } = req.body;

        // Validate required fields
        if (!vision || !mission || !strategicGoals) {
            return res.status(400).json({ 
                message: 'All fields are required',
                received: { vision, mission, strategicGoals }
            });
        }

        const data = {
            vision,
            mission,
            strategicGoals,
            userId: req.user.id
        };

        // Check if user already has a vision mission
        const existing = await VisionMission.findByUserId(req.user.id);
        
        if (existing) {
            // Update existing record
            const updated = await VisionMission.update(req.user.id, {
                vision,
                mission,
                strategicGoals
            });
            return res.json({ 
                message: 'Vision mission updated successfully',
                data: updated
            });
        }

        // Create new record
        const created = await VisionMission.create(data);

        res.status(201).json({ 
            message: 'Vision mission created successfully',
            data: created
        });
    } catch (error) {
        console.error('Error in createVisionMission:', error);
        res.status(500).json({ 
            message: 'Error creating vision mission',
            error: error.message
        });
    }
};

// Get vision mission data by user ID (for admin/employee access)
exports.getVisionMissionByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate that userId is a number
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ 
                success: false,
                message: 'شناسه کاربر نامعتبر است' 
            });
        }

        const visionMission = await VisionMission.findByUserId(userId);
        
        if (!visionMission) {
            return res.json({
                success: true,
                data: {
                    vision: '',
                    mission: '',
                    strategic_goals: ''
                }
            });
        }

        res.json({ 
            success: true,
            data: visionMission
        });
    } catch (error) {
        console.error('Error fetching vision mission by user ID:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching vision mission data',
            error: error.message
        });
    }
}; 