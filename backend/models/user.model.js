const db = require('../config/db');

/**
 * Create a new user with role defaulting to 'user'
 * @param {string} name
 * @param {string} email
 * @param {string} password - hashed password
 * @param {string} [role='user'] - user role (e.g. 'user', 'admin')
 * @param {string} token - email verification token
 * @returns {Promise<Object>} Result of insert query
 */
const createUser = (name, email, hashedPassword, role, token) => {
  const sql = `
    INSERT INTO users (name, email, password, role, verification_token)
    VALUES (?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [name, email, hashedPassword, role, token], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserByEmail = (email) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  return new Promise((resolve, reject) => {
    db.query(sql, [email], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

/**
 * Optional: Find user by ID
 * @param {number} id
 * @returns {Promise<Object|null>} User object or null if not found
 */
const findUserById = (id) => {
  const sql = 'SELECT * FROM users WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(sql, [id], (err, results) => {
      if (err) return reject(err);
      if (results.length === 0) return resolve(null);
      resolve(results[0]);
    });
  });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
