const mysql = require("mysql2");
require("dotenv").config();

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DATABASE_USER_NAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  // Connection pool settings
  connectionLimit: 10, // Maximum number of connections in the pool
  acquireTimeout: 60000, // Timeout for acquiring a connection (60 seconds)
  timeout: 60000, // Query timeout (60 seconds)
  reconnect: true, // Automatically reconnect if connection is lost

  // SSL configuration for production
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false, // Set to true in production with proper SSL certificates
        }
      : false,

  // Additional production settings
  charset: "utf8mb4",
  timezone: "UTC",

  // Connection settings
  waitForConnections: true,
  queueLimit: 0, // No limit on queue size
});

// Get a promise wrapper for the pool
const promisePool = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    // Don't throw error, let the application handle it gracefully
    return;
  }

  console.log("Database pool created successfully");
  connection.release();
});

// Handle pool errors
pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
  // In production, you might want to send this to a logging service
});

// Handle process termination
process.on("SIGINT", () => {
  pool.end((err) => {
    if (err) {
      console.error("Error closing database pool:", err.message);
    } else {
      console.log("Database pool closed successfully");
    }
    process.exit(0);
  });
});

// Export both the pool and promise pool
module.exports = {
  pool,
  promise: promisePool,
};
