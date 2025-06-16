CREATE TABLE IF NOT EXISTS class_facilities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    equipment_count INT NOT NULL,
    equipment_status ENUM('excellent', 'good', 'average', 'poor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 