-- Add comment_replies table for storing replies to comments
CREATE TABLE IF NOT EXISTS comment_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reply_text TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_parent_comment (parent_comment_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add reply_count column to comments table
ALTER TABLE comments ADD COLUMN reply_count INT DEFAULT 0;
ALTER TABLE comment_replies ADD COLUMN seen BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE questions ADD COLUMN answer_seen BOOLEAN NOT NULL DEFAULT 0; 