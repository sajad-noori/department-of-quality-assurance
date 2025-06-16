CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  newEnrollments INT NOT NULL,
  totalStudents INT NOT NULL,
  graduationCycles INT NOT NULL,
  establishmentYear INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (newEnrollments >= 0),
  CHECK (totalStudents >= 0),
  CHECK (graduationCycles >= 0),
  CHECK (establishmentYear >= 1300 AND establishmentYear <= 1500)
); 