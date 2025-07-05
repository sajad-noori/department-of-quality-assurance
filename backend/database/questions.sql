-- Questions and Answers Table
-- This table stores all questions (both user questions and FAQ)
-- When a question is replied, it automatically becomes part of the FAQ

CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `answer` text DEFAULT NULL,
  `is_replied` tinyint(1) DEFAULT 0,
  `is_faq` tinyint(1) DEFAULT 0,
  `status` enum('pending', 'in_progress', 'replied', 'closed') DEFAULT 'pending',
  `priority` enum('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `category` varchar(100) DEFAULT 'general',
  `submitted_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `replied_at` timestamp NULL DEFAULT NULL,
  `replied_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_is_replied` (`is_replied`),
  KEY `idx_is_faq` (`is_faq`),
  KEY `idx_submitted_at` (`submitted_at`),
  KEY `idx_category` (`category`),
  KEY `idx_priority` (`priority`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`replied_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

