-- Drop existing table if exists
DROP TABLE IF EXISTS personnel;

-- Create personnel table
CREATE TABLE IF NOT EXISTS personnel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    teachers_phd INT NOT NULL DEFAULT 0,
    teachers_master INT NOT NULL DEFAULT 0,
    teachers_bachelor INT NOT NULL DEFAULT 0,
    technical_phd INT NOT NULL DEFAULT 0,
    technical_master INT NOT NULL DEFAULT 0,
    technical_bachelor INT NOT NULL DEFAULT 0,
    technical_above_baccalaureate INT NOT NULL DEFAULT 0,
    technical_baccalaureate INT NOT NULL DEFAULT 0,
    technical_elementary INT NOT NULL DEFAULT 0,
    admin_phd INT NOT NULL DEFAULT 0,
    admin_master INT NOT NULL DEFAULT 0,
    admin_bachelor INT NOT NULL DEFAULT 0,
    admin_above_baccalaureate INT NOT NULL DEFAULT 0,
    admin_baccalaureate INT NOT NULL DEFAULT 0,
    admin_elementary INT NOT NULL DEFAULT 0,
    service_bachelor INT NOT NULL DEFAULT 0,
    service_above_baccalaureate INT NOT NULL DEFAULT 0,
    service_baccalaureate INT NOT NULL DEFAULT 0,
    service_elementary INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 