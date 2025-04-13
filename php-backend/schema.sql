-- Database schema for e-commerce application

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'admin') DEFAULT 'customer',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User activity logs
CREATE TABLE IF NOT EXISTS `user_activity_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `ip_address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `image_url` VARCHAR(255),
  `category` VARCHAR(100),
  `stock` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  `shipping_address` TEXT NOT NULL,
  `payment_method` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES 
('Admin User', 'admin@example.com', '$2y$10$GkxXEFG4RDe2MXcLxXn7y.GTv5BZgQodmLUcZP1/0vPh1KAqCHKne', 'admin');

-- Insert sample products
INSERT INTO `products` (`name`, `description`, `price`, `image_url`, `category`, `stock`) VALUES
('Smartphone X', 'Latest generation smartphone with advanced features', 999.99, 'images/products/smartphone-x.jpg', 'Electronics', 50),
('Designer T-Shirt', 'Premium cotton t-shirt with modern design', 49.99, 'images/products/tshirt.jpg', 'Apparel', 100),
('Smart Watch Pro', 'Fitness and health monitoring smartwatch', 199.99, 'images/products/smartwatch.jpg', 'Electronics', 30),
('Wireless Earbuds', 'True wireless earbuds with noise cancellation', 129.99, 'images/products/earbuds.jpg', 'Electronics', 75),
('Yoga Mat', 'Non-slip eco-friendly yoga mat', 29.99, 'images/products/yoga-mat.jpg', 'Fitness', 120); 