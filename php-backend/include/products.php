<?php
require_once 'config.php';

// Function to add a new product
function addProduct($productData, $sellerId) {
    global $db;
    
    try {
        // Create product document
        $product = [
            'name' => $productData['name'],
            'description' => $productData['description'],
            'price' => (float)$productData['price'],
            'discount_price' => isset($productData['discount_price']) ? (float)$productData['discount_price'] : null,
            'category' => $productData['category'],
            'seller_id' => $sellerId,
            'stock' => (int)$productData['stock'],
            'images' => $productData['images'] ?? [],
            'features' => $productData['features'] ?? [],
            'rating' => 0,
            'reviews_count' => 0,
            'is_featured' => isset($productData['is_featured']) ? (bool)$productData['is_featured'] : false,
            'status' => 'active',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ];
        
        // Insert product into database
        $result = $db->products->insertOne($product);
        
        if ($result->getInsertedCount()) {
            return [
                'success' => true, 
                'message' => 'Product added successfully',
                'product_id' => (string)$result->getInsertedId()
            ];
        } else {
            return ['success' => false, 'message' => 'Failed to add product'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error adding product: ' . $e->getMessage()];
    }
}

// Function to update a product
function updateProduct($productId, $productData) {
    global $db;
    
    try {
        $updateData = [];
        
        // Fields that can be updated
        $allowedFields = [
            'name', 'description', 'price', 'discount_price', 
            'category', 'stock', 'images', 'features', 
            'is_featured', 'status'
        ];
        
        foreach ($allowedFields as $field) {
            if (isset($productData[$field])) {
                if ($field === 'price' || $field === 'discount_price') {
                    $updateData[$field] = (float)$productData[$field];
                } elseif ($field === 'stock') {
                    $updateData[$field] = (int)$productData[$field];
                } elseif ($field === 'is_featured') {
                    $updateData[$field] = (bool)$productData[$field];
                } else {
                    $updateData[$field] = $productData[$field];
                }
            }
        }
        
        // Add updated timestamp
        $updateData['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        // Update product in database
        $result = $db->products->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($productId)],
            ['$set' => $updateData]
        );
        
        if ($result->getModifiedCount()) {
            return ['success' => true, 'message' => 'Product updated successfully'];
        } else {
            return ['success' => false, 'message' => 'No changes made to product'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating product: ' . $e->getMessage()];
    }
}

// Function to delete a product
function deleteProduct($productId) {
    global $db;
    
    try {
        // Check if product exists
        $product = $db->products->findOne(['_id' => new MongoDB\BSON\ObjectId($productId)]);
        
        if (!$product) {
            return ['success' => false, 'message' => 'Product not found'];
        }
        
        // Delete product
        $result = $db->products->deleteOne(['_id' => new MongoDB\BSON\ObjectId($productId)]);
        
        if ($result->getDeletedCount()) {
            return ['success' => true, 'message' => 'Product deleted successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to delete product'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error deleting product: ' . $e->getMessage()];
    }
}

// Function to get a product by ID
function getProductById($productId) {
    global $db;
    
    try {
        $product = $db->products->findOne(['_id' => new MongoDB\BSON\ObjectId($productId)]);
        
        if ($product) {
            return ['success' => true, 'product' => $product];
        } else {
            return ['success' => false, 'message' => 'Product not found'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving product: ' . $e->getMessage()];
    }
}

// Function to get products by seller
function getProductsBySeller($sellerId, $limit = 10, $skip = 0) {
    global $db;
    
    try {
        $products = $db->products->find(
            ['seller_id' => $sellerId],
            [
                'limit' => (int)$limit,
                'skip' => (int)$skip,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        $count = $db->products->countDocuments(['seller_id' => $sellerId]);
        
        return [
            'success' => true,
            'products' => $products,
            'total' => $count
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving products: ' . $e->getMessage()];
    }
}

// Function to search products
function searchProducts($query, $filters = [], $limit = 10, $skip = 0) {
    global $db;
    
    try {
        $searchCriteria = [];
        
        // Text search if query provided
        if (!empty($query)) {
            $searchCriteria['$text'] = ['$search' => $query];
        }
        
        // Apply additional filters
        if (!empty($filters)) {
            // Category filter
            if (isset($filters['category']) && !empty($filters['category'])) {
                $searchCriteria['category'] = $filters['category'];
            }
            
            // Price range filter
            if (isset($filters['min_price']) || isset($filters['max_price'])) {
                $priceFilter = [];
                
                if (isset($filters['min_price'])) {
                    $priceFilter['$gte'] = (float)$filters['min_price'];
                }
                
                if (isset($filters['max_price'])) {
                    $priceFilter['$lte'] = (float)$filters['max_price'];
                }
                
                $searchCriteria['price'] = $priceFilter;
            }
            
            // Seller filter
            if (isset($filters['seller_id']) && !empty($filters['seller_id'])) {
                $searchCriteria['seller_id'] = $filters['seller_id'];
            }
            
            // Rating filter
            if (isset($filters['min_rating'])) {
                $searchCriteria['rating'] = ['$gte' => (float)$filters['min_rating']];
            }
        }
        
        // Default filter for active products only
        $searchCriteria['status'] = 'active';
        
        // Execute search
        $products = $db->products->find(
            $searchCriteria,
            [
                'limit' => (int)$limit,
                'skip' => (int)$skip,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        $count = $db->products->countDocuments($searchCriteria);
        
        return [
            'success' => true,
            'products' => $products,
            'total' => $count
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error searching products: ' . $e->getMessage()];
    }
}

// Function to get featured products for homepage
function getFeaturedProducts($limit = 8) {
    global $db;
    
    try {
        $products = $db->products->find(
            [
                'is_featured' => true,
                'status' => 'active'
            ],
            [
                'limit' => (int)$limit,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        return [
            'success' => true,
            'products' => $products
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving featured products: ' . $e->getMessage()];
    }
}

// Function to add review to product
function addProductReview($productId, $userId, $rating, $comment) {
    global $db;
    
    try {
        // Create review document
        $review = [
            'product_id' => $productId,
            'user_id' => $userId,
            'rating' => (float)$rating,
            'comment' => $comment,
            'created_at' => new MongoDB\BSON\UTCDateTime()
        ];
        
        // Insert review
        $result = $db->reviews->insertOne($review);
        
        if (!$result->getInsertedCount()) {
            return ['success' => false, 'message' => 'Failed to add review'];
        }
        
        // Update product ratings
        $allReviews = $db->reviews->find(['product_id' => $productId])->toArray();
        $reviewsCount = count($allReviews);
        
        $totalRating = 0;
        foreach ($allReviews as $rev) {
            $totalRating += $rev['rating'];
        }
        
        $averageRating = $reviewsCount > 0 ? $totalRating / $reviewsCount : 0;
        
        // Update product with new rating
        $db->products->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($productId)],
            [
                '$set' => [
                    'rating' => $averageRating,
                    'reviews_count' => $reviewsCount
                ]
            ]
        );
        
        return ['success' => true, 'message' => 'Review added successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error adding review: ' . $e->getMessage()];
    }
}
?> 