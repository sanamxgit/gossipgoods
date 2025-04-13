-- Create products table
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `discount_price` DECIMAL(10,2) DEFAULT NULL,
  `category_id` INT,
  `seller_id` INT NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `main_image` VARCHAR(255),
  `is_featured` BOOLEAN DEFAULT FALSE,
  `status` ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`seller_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create product_images table for multiple images per product
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `sort_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create product_features table for product features/specifications
CREATE TABLE IF NOT EXISTS `product_features` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `feature_name` VARCHAR(100) NOT NULL,
  `feature_value` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT,
  `parent_id` INT DEFAULT NULL,
  `image` VARCHAR(255),
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create product_reviews table
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `rating` INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  `review_text` TEXT,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create a trigger to update average rating for products
DELIMITER //
CREATE TRIGGER update_product_rating AFTER INSERT ON product_reviews
FOR EACH ROW
BEGIN
  UPDATE products SET 
    rating = (SELECT AVG(rating) FROM product_reviews WHERE product_id = NEW.product_id AND status = 'approved'),
    reviews_count = (SELECT COUNT(*) FROM product_reviews WHERE product_id = NEW.product_id AND status = 'approved')
  WHERE id = NEW.product_id;
END //
DELIMITER ;

-- Insert sample categories
INSERT INTO `categories` (`name`, `description`, `status`) VALUES
('Electronics', 'Electronic devices and accessories', 'active'),
('Clothing', 'Fashion apparel and accessories', 'active'),
('Home & Kitchen', 'Home decor and kitchen accessories', 'active'),
('Books', 'Books and publications', 'active'),
('Toys & Games', 'Toys, games and entertainment items', 'active');

-- Insert subcategories
INSERT INTO `categories` (`name`, `description`, `parent_id`, `status`) VALUES
('Smartphones', 'Mobile phones and accessories', 1, 'active'),
('Laptops', 'Laptop computers and accessories', 1, 'active'),
('Men\'s Clothing', 'Clothing for men', 2, 'active'),
('Women\'s Clothing', 'Clothing for women', 2, 'active'),
('Kitchen Appliances', 'Appliances for the kitchen', 3, 'active'); 