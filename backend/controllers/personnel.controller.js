const db = require('../config/db');

// Validate personnel data - now accepts missing fields
const validatePersonnelData = (data) => {
  // Define all possible fields with their default values
  const allFields = {
    teachers_phd: 0,
    teachers_master: 0,
    teachers_bachelor: 0,
    technical_phd: 0,
    technical_master: 0,
    technical_bachelor: 0,
    technical_above_baccalaureate: 0,
    technical_baccalaureate: 0,
    technical_elementary: 0,
    admin_phd: 0,
    admin_master: 0,
    admin_bachelor: 0,
    admin_above_baccalaureate: 0,
    admin_baccalaureate: 0,
    admin_elementary: 0,
    service_bachelor: 0,
    service_above_baccalaureate: 0,
    service_baccalaureate: 0,
    service_elementary: 0
  };

  // Check if any provided value is invalid
  for (const [key, value] of Object.entries(data)) {
    if (allFields.hasOwnProperty(key)) {
      const num = parseInt(value);
      if (isNaN(num) || num < 0 || num > 1000) {
        return false;
      }
    }
  }

  return true;
};

// Sanitize personnel data - now handles missing fields
const sanitizePersonnelData = (data) => {
  const sanitized = {
    teachers_phd: 0,
    teachers_master: 0,
    teachers_bachelor: 0,
    technical_phd: 0,
    technical_master: 0,
    technical_bachelor: 0,
    technical_above_baccalaureate: 0,
    technical_baccalaureate: 0,
    technical_elementary: 0,
    admin_phd: 0,
    admin_master: 0,
    admin_bachelor: 0,
    admin_above_baccalaureate: 0,
    admin_baccalaureate: 0,
    admin_elementary: 0,
    service_bachelor: 0,
    service_above_baccalaureate: 0,
    service_baccalaureate: 0,
    service_elementary: 0
  };

  // Process only the fields that were provided
  Object.entries(data).forEach(([key, value]) => {
    if (sanitized.hasOwnProperty(key)) {
      const num = parseInt(value);
      sanitized[key] = isNaN(num) ? 0 : Math.max(0, Math.min(1000, num));
    }
  });

  return sanitized;
};

// Get personnel data for a user
exports.getPersonnel = async (req, res) => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM personnel WHERE user_id = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.json({
                teachers_phd: 0,
                teachers_master: 0,
                teachers_bachelor: 0,
                technical_phd: 0,
                technical_master: 0,
                technical_bachelor: 0,
                technical_above_baccalaureate: 0,
                technical_baccalaureate: 0,
                technical_elementary: 0,
                admin_phd: 0,
                admin_master: 0,
                admin_bachelor: 0,
                admin_above_baccalaureate: 0,
                admin_baccalaureate: 0,
                admin_elementary: 0,
                service_bachelor: 0,
                service_above_baccalaureate: 0,
                service_baccalaureate: 0,
                service_elementary: 0
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching personnel data:', error);
        res.status(500).json({ message: 'Error fetching personnel data' });
    }
};

// Get personnel data by user ID (for admin/employee access)
exports.getPersonnelByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate that userId is a number
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ message: 'شناسه کاربر نامعتبر است' });
        }

        const [rows] = await db.promise().query('SELECT * FROM personnel WHERE user_id = ?', [userId]);
        if (rows.length === 0) {
            return res.json({
                teachers_phd: 0,
                teachers_master: 0,
                teachers_bachelor: 0,
                technical_phd: 0,
                technical_master: 0,
                technical_bachelor: 0,
                technical_above_baccalaureate: 0,
                technical_baccalaureate: 0,
                technical_elementary: 0,
                admin_phd: 0,
                admin_master: 0,
                admin_bachelor: 0,
                admin_above_baccalaureate: 0,
                admin_baccalaureate: 0,
                admin_elementary: 0,
                service_bachelor: 0,
                service_above_baccalaureate: 0,
                service_baccalaureate: 0,
                service_elementary: 0
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching personnel data:', error);
        res.status(500).json({ message: 'Error fetching personnel data' });
    }
};

// Update personnel data
exports.updatePersonnel = async (req, res) => {
    try {
        // Validate input data
        const validatePersonnelData = (data) => {
            const fields = [
                'teachers_phd', 'teachers_master', 'teachers_bachelor',
                'technical_phd', 'technical_master', 'technical_bachelor',
                'technical_above_baccalaureate', 'technical_baccalaureate', 'technical_elementary',
                'admin_phd', 'admin_master', 'admin_bachelor',
                'admin_above_baccalaureate', 'admin_baccalaureate', 'admin_elementary',
                'service_bachelor', 'service_above_baccalaureate', 'service_baccalaureate', 'service_elementary'
            ];

            for (const field of fields) {
                // Convert empty strings, null, or undefined to 0
                if (!data[field] || data[field] === '') {
                    data[field] = 0;
                } else {
                    // Convert to number and validate
                    const num = Number(data[field]);
                    if (isNaN(num) || num < 0 || num > 1000) {
                        return false;
                    }
                    data[field] = num;
                }
            }
            return true;
        };

        // Sanitize input data
        const sanitizePersonnelData = (data) => {
            const sanitized = {};
            const fields = [
                'teachers_phd', 'teachers_master', 'teachers_bachelor',
                'technical_phd', 'technical_master', 'technical_bachelor',
                'technical_above_baccalaureate', 'technical_baccalaureate', 'technical_elementary',
                'admin_phd', 'admin_master', 'admin_bachelor',
                'admin_above_baccalaureate', 'admin_baccalaureate', 'admin_elementary',
                'service_bachelor', 'service_above_baccalaureate', 'service_baccalaureate', 'service_elementary'
            ];

            fields.forEach(field => {
                // Convert empty strings, null, or undefined to 0
                if (!data[field] || data[field] === '') {
                    sanitized[field] = 0;
                } else {
                    // Convert to number
                    const num = Number(data[field]);
                    sanitized[field] = isNaN(num) ? 0 : num;
                }
            });

            return sanitized;
        };

        // Validate the input data
        if (!validatePersonnelData(req.body)) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Sanitize the data
        const sanitizedData = sanitizePersonnelData(req.body);

        // Check if record exists
        const [existing] = await db.promise().query(
            'SELECT * FROM personnel WHERE user_id = ?',
            [req.user.id]
        );

        if (existing.length > 0) {
            // Update existing record
            await db.promise().query(
                `UPDATE personnel SET 
                teachers_phd = ?, teachers_master = ?, teachers_bachelor = ?,
                technical_phd = ?, technical_master = ?, technical_bachelor = ?,
                technical_above_baccalaureate = ?, technical_baccalaureate = ?, technical_elementary = ?,
                admin_phd = ?, admin_master = ?, admin_bachelor = ?,
                admin_above_baccalaureate = ?, admin_baccalaureate = ?, admin_elementary = ?,
                service_bachelor = ?, service_above_baccalaureate = ?, service_baccalaureate = ?, service_elementary = ?
                WHERE user_id = ?`,
                [
                    sanitizedData.teachers_phd,
                    sanitizedData.teachers_master,
                    sanitizedData.teachers_bachelor,
                    sanitizedData.technical_phd,
                    sanitizedData.technical_master,
                    sanitizedData.technical_bachelor,
                    sanitizedData.technical_above_baccalaureate,
                    sanitizedData.technical_baccalaureate,
                    sanitizedData.technical_elementary,
                    sanitizedData.admin_phd,
                    sanitizedData.admin_master,
                    sanitizedData.admin_bachelor,
                    sanitizedData.admin_above_baccalaureate,
                    sanitizedData.admin_baccalaureate,
                    sanitizedData.admin_elementary,
                    sanitizedData.service_bachelor,
                    sanitizedData.service_above_baccalaureate,
                    sanitizedData.service_baccalaureate,
                    sanitizedData.service_elementary,
                    req.user.id
                ]
            );
        } else {
            // Insert new record
            await db.promise().query(
                `INSERT INTO personnel (
                    user_id, teachers_phd, teachers_master, teachers_bachelor,
                    technical_phd, technical_master, technical_bachelor,
                    technical_above_baccalaureate, technical_baccalaureate, technical_elementary,
                    admin_phd, admin_master, admin_bachelor,
                    admin_above_baccalaureate, admin_baccalaureate, admin_elementary,
                    service_bachelor, service_above_baccalaureate, service_baccalaureate, service_elementary
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    req.user.id,
                    sanitizedData.teachers_phd,
                    sanitizedData.teachers_master,
                    sanitizedData.teachers_bachelor,
                    sanitizedData.technical_phd,
                    sanitizedData.technical_master,
                    sanitizedData.technical_bachelor,
                    sanitizedData.technical_above_baccalaureate,
                    sanitizedData.technical_baccalaureate,
                    sanitizedData.technical_elementary,
                    sanitizedData.admin_phd,
                    sanitizedData.admin_master,
                    sanitizedData.admin_bachelor,
                    sanitizedData.admin_above_baccalaureate,
                    sanitizedData.admin_baccalaureate,
                    sanitizedData.admin_elementary,
                    sanitizedData.service_bachelor,
                    sanitizedData.service_above_baccalaureate,
                    sanitizedData.service_baccalaureate,
                    sanitizedData.service_elementary
                ]
            );
        }
        
        res.json({ message: 'Personnel data updated successfully' });
    } catch (error) {
        console.error('Error updating personnel data:', error);
        res.status(500).json({ message: 'Error updating personnel data' });
    }
}; 