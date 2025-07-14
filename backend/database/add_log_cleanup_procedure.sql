-- Create stored procedure to clean up old logs (older than 2 months)
DELIMITER //

CREATE PROCEDURE CleanupOldLogs()
BEGIN
    -- Delete logs older than 2 months
    DELETE FROM user_logs 
    WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 MONTH);
    
    -- Optional: Log the cleanup operation
    INSERT INTO user_logs (user_id, action, details, ip_address, user_agent, created_at)
    VALUES (1, 'system_cleanup', 'Cleaned up logs older than 2 months', '127.0.0.1', 'System Cleanup', NOW());
END //

DELIMITER ;

-- Create event to run cleanup daily at 2 AM
CREATE EVENT IF NOT EXISTS cleanup_logs_event
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
    CALL CleanupOldLogs(); 