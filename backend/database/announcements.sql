-- Create announcements table
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `target_audience` enum('all','institute','user','employee') NOT NULL DEFAULT 'all',
  `attachment_path` varchar(500) DEFAULT NULL,
  `email_sent` tinyint(1) DEFAULT '0',
  `email_sent_at` timestamp NULL DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `target_audience` (`target_audience`),
  KEY `email_sent` (`email_sent`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci; 