const { promise } = require("../config/db");

/**
 * Create a new user with role defaulting to 'user'
 * @param {string} name
 * @param {string} email
 * @param {string} password - hashed password
 * @param {string} [role='user'] - user role (e.g. 'user', 'admin')
 * @param {string} token - email verification token
 * @returns {Promise<Object>} Result of insert query
 */
const createUser = async (name, email, hashedPassword, role, token) => {
  try {
    const sql = `
      INSERT INTO users (name, email, password, role, verification_token)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await promise.execute(sql, [
      name,
      email,
      hashedPassword,
      role,
      token,
    ]);
    return result;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByEmail = async (email) => {
  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await promise.execute(sql, [email]);
    return results.length === 0 ? null : results[0];
  } catch (error) {
    throw new Error(`Error finding user by email: ${error.message}`);
  }
};

/**
 * Optional: Find user by ID
 * @param {number} id
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserById = async (id) => {
  try {
    const sql = "SELECT * FROM users WHERE id = ?";
    const [results] = await promise.execute(sql, [id]);
    return results.length === 0 ? null : results[0];
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
