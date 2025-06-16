const db = require('../config/db');

class VisionMission {
    static async create(data) {
        try {
            const query = `
                INSERT INTO vision_mission (vision, mission, strategic_goals, userId) 
                VALUES (?, ?, ?, ?)
            `;
            
            const [result] = await db.promise().execute(query, [
                data.vision,
                data.mission,
                data.strategicGoals,
                data.userId
            ]);

            if (!result || !result.insertId) {
                throw new Error('Failed to create vision mission record');
            }

            return {
                id: result.insertId,
                vision: data.vision,
                mission: data.mission,
                strategic_goals: data.strategicGoals,
                userId: data.userId
            };
        } catch (error) {
            throw new Error(`Failed to create vision mission: ${error.message}`);
        }
    }

    static async findByUserId(userId) {
        try {
            const query = `
                SELECT * FROM vision_mission 
                WHERE userId = ?
                ORDER BY createdAt DESC
                LIMIT 1
            `;
            
            const [rows] = await db.promise().execute(query, [userId]);
            
            if (!rows || rows.length === 0) {
                return null;
            }
            
            return rows[0];
        } catch (error) {
            throw new Error(`Failed to find vision mission: ${error.message}`);
        }
    }

    static async update(userId, data) {
        try {
            const query = `
                UPDATE vision_mission 
                SET vision = ?, mission = ?, strategic_goals = ?
                WHERE userId = ?
            `;
            
            const [result] = await db.promise().execute(query, [
                data.vision,
                data.mission,
                data.strategicGoals,
                userId
            ]);

            if (!result || result.affectedRows === 0) {
                throw new Error('No vision mission record found to update');
            }

            return {
                userId,
                vision: data.vision,
                mission: data.mission,
                strategic_goals: data.strategicGoals
            };
        } catch (error) {
            throw new Error(`Failed to update vision mission: ${error.message}`);
        }
    }
}

module.exports = VisionMission; 