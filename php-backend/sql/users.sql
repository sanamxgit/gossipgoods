-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('user', 'seller', 'admin') NOT NULL DEFAULT 'user',
  `status` ENUM('active', 'inactive', 'blocked') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create seller_stores table
CREATE TABLE IF NOT EXISTS `seller_stores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `seller_id` INT NOT NULL,
  `store_name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `logo` VARCHAR(255),
  `banner` VARCHAR(255),
  `address` TEXT,
  `contact_email` VARCHAR(100),
  `contact_phone` VARCHAR(20),
  `status` ENUM('pending', 'active', 'suspended') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create a default admin user (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`) 
VALUES ('Admin', 'admin@example.com', '$2y$10$6hMIVHk1OHmfnj0CiZ9.2.PAFPonQz0yiaXl7EjJZCBCL6vT.sHse', 'admin')
ON DUPLICATE KEY UPDATE `name` = 'Admin'; 