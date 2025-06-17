CREATE TABLE IF NOT EXISTS profile_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- Document paths
    doc1_path VARCHAR(255) UNIQUE,
    doc2_path VARCHAR(255) UNIQUE,
    doc3_path VARCHAR(255) UNIQUE,
    doc4_path VARCHAR(255) UNIQUE,
    doc5_path VARCHAR(255) UNIQUE,
    doc6_path VARCHAR(255) UNIQUE,
    doc7_path VARCHAR(255) UNIQUE,
    doc8_path VARCHAR(255) UNIQUE,
    doc9_path VARCHAR(255) UNIQUE,
    doc10_path VARCHAR(255) UNIQUE,
    doc11_path VARCHAR(255) UNIQUE,
    doc12_path VARCHAR(255) UNIQUE,
    doc13_path VARCHAR(255) UNIQUE,
    doc14_path VARCHAR(255) UNIQUE,
    doc15_path VARCHAR(255) UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 