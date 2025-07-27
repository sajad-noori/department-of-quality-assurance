const { promise } = require("../config/db");

const ProfileImage = {
  /**
   * Create a new profile image record
   * @param {Object} imageData - Profile image data
   * @returns {Promise<Object>} Created profile image record
   */
  async create(imageData) {
    const query = `
      INSERT INTO profile_images (user_id, file_name, original_name, file_path, file_type, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      imageData.user_id,
      imageData.file_name,
      imageData.original_name,
      imageData.file_path,
      imageData.file_type,
      imageData.file_size,
    ];

    const [result] = await promise.execute(query, values);
    return { id: result.insertId, ...imageData };
  },

  /**
   * Find profile image by user ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Profile image record or null
   */
  async findByUserId(userId) {
    const query = `
      SELECT * FROM profile_images 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const [rows] = await promise.execute(query, [userId]);
    return rows[0] || null;
  },

  /**
   * Update profile image for a user
   * @param {number} userId - User ID
   * @param {Object} imageData - New image data
   * @returns {Promise<boolean>} Success status
   */
  async update(userId, imageData) {
    const query = `
      UPDATE profile_images 
      SET file_name = ?, original_name = ?, file_path = ?, file_type = ?, file_size = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `;
    const values = [
      imageData.file_name,
      imageData.original_name,
      imageData.file_path,
      imageData.file_type,
      imageData.file_size,
      userId,
    ];

    const [result] = await promise.execute(query, values);
    return result.affectedRows > 0;
  },

  /**
   * Delete profile image by user ID
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteByUserId(userId) {
    const query = "DELETE FROM profile_images WHERE user_id = ?";
    const [result] = await promise.execute(query, [userId]);
    return result.affectedRows > 0;
  },

  /**
   * Create or update profile image (upsert)
   * @param {number} userId - User ID
   * @param {Object} imageData - Image data
   * @returns {Promise<Object>} Profile image record
   */
  async upsert(userId, imageData) {
    const existingImage = await this.findByUserId(userId);

    if (existingImage) {
      await this.update(userId, imageData);
      return { id: existingImage.id, ...imageData };
    } else {
      return await this.create({ ...imageData, user_id: userId });
    }
  },
};

module.exports = ProfileImage;
