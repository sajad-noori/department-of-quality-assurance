-- Migration: Add reset token and reset code fields to users table
-- Date: 2025-01-29
-- Description: Adds reset_token, reset_token_expiry, reset_code, and reset_code_expiry fields for password reset functionality

ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(255) NULL,
ADD COLUMN reset_token_expiry TIMESTAMP NULL,
ADD COLUMN reset_code VARCHAR(6) NULL,
ADD COLUMN reset_code_expiry TIMESTAMP NULL,
ADD INDEX idx_reset_token (reset_token),
ADD INDEX idx_reset_token_expiry (reset_token_expiry),
ADD INDEX idx_reset_code (reset_code),
ADD INDEX idx_reset_code_expiry (reset_code_expiry);

-- Add comment to document the purpose
ALTER TABLE users 
MODIFY COLUMN reset_token VARCHAR(255) NULL COMMENT 'Token for final password reset step (5 minutes validity)',
MODIFY COLUMN reset_token_expiry TIMESTAMP NULL COMMENT 'Expiry time for reset token (5 minutes from creation)',
MODIFY COLUMN reset_code VARCHAR(6) NULL COMMENT '6-digit code for password reset verification (10 minutes validity)',
MODIFY COLUMN reset_code_expiry TIMESTAMP NULL COMMENT 'Expiry time for reset code (10 minutes from creation)'; 