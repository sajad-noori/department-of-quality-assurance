-- User Logs Table
-- This table stores all user activities for admin monitoring
-- Only admins should have access to this data

CREATE TABLE IF NOT EXISTS user_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  details TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint for data integrity
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Indexes for better query performance
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at),
  INDEX idx_user_action (user_id, action),
  INDEX idx_user_created (user_id, created_at)
);

-- Create a view for easier querying of user logs with user information
CREATE OR REPLACE VIEW user_logs_with_user AS
SELECT 
  ul.id,
  ul.user_id,
  u.name as user_name,
  u.email as user_email,
  u.role as user_role,
  ul.action,
  ul.details,
  ul.ip_address,
  ul.user_agent,
  ul.created_at,
  ul.updated_at
FROM user_logs ul
JOIN users u ON ul.user_id = u.id
ORDER BY ul.created_at DESC;

-- Insert some sample log types for reference
-- These are just examples, actual logs will be inserted by the application
-- INSERT INTO user_logs (user_id, action, details, ip_address) VALUES 
-- (1, 'login', 'User logged in successfully', '192.168.1.1'),
-- (1, 'comment', 'Commented on news article ID: 5', '192.168.1.1'),
-- (1, 'download', 'Downloaded document: syllabus.pdf', '192.168.1.1'),
-- (1, 'visit', 'Visited homepage', '192.168.1.1'); 