-- Table for questionnaire templates
CREATE TABLE IF NOT EXISTS questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255),         -- The uploaded file's name (PDF, DOCX, etc.)
    file_url VARCHAR(500),          -- The URL/path to the uploaded file
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for filled (submitted) questionnaires
CREATE TABLE IF NOT EXISTS filled_questionnaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    questionnaire_id INT NOT NULL,         -- Reference to the questionnaire template
    user_id INT NOT NULL,                  -- The user who filled it
   file_name VARCHAR(255),         -- The uploaded file's name (PDF, DOCX, etc.)
    file_url VARCHAR(500),          -- The URL/path to the uploaded file
     filled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (questionnaire_id) REFERENCES questionnaires(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 