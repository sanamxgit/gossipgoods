<?php
require_once 'config.php';

// Function to register a new seller
function registerSeller($userData, $storeData) {
    global $db;
    
    try {
        // Check if email is already registered
        $existingUser = $db->users->findOne(['email' => $userData['email']]);
        
        if ($existingUser) {
            return ['success' => false, 'message' => 'Email already registered'];
        }
        
        // Hash password
        $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);
        
        // Create user with seller role
        $user = [
            'name' => $userData['name'],
            'email' => $userData['email'],
            'password' => $hashedPassword,
            'role' => 'seller',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'status' => 'active'
        ];
        
        $result = $db->users->insertOne($user);
        
        if (!$result->getInsertedCount()) {
            return ['success' => false, 'message' => 'Failed to register seller account'];
        }
        
        $userId = (string)$result->getInsertedId();
        
        // Create seller store
        $store = [
            'seller_id' => $userId,
            'name' => $storeData['store_name'],
            'description' => $storeData['description'] ?? '',
            'logo' => $storeData['logo'] ?? null,
            'address' => $storeData['address'] ?? [],
            'contact_email' => $userData['email'],
            'contact_phone' => $storeData['phone'] ?? '',
            'website' => $storeData['website'] ?? '',
            'social_media' => $storeData['social_media'] ?? [],
            'rating' => 0,
            'review_count' => 0,
            'status' => 'pending',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ];
        
        $storeResult = $db->stores->insertOne($store);
        
        if (!$storeResult->getInsertedCount()) {
            // Rollback user creation if store creation fails
            $db->users->deleteOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);
            return ['success' => false, 'message' => 'Failed to create store profile'];
        }
        
        return [
            'success' => true,
            'message' => 'Seller registered successfully',
            'user_id' => $userId,
            'store_id' => (string)$storeResult->getInsertedId()
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error registering seller: ' . $e->getMessage()];
    }
}

// Function to update seller store information
function updateStore($sellerId, $storeData) {
    global $db;
    
    try {
        // Get the store by seller ID
        $store = $db->stores->findOne(['seller_id' => $sellerId]);
        
        if (!$store) {
            return ['success' => false, 'message' => 'Store not found'];
        }
        
        $updateData = [];
        
        // Fields that can be updated
        $allowedFields = [
            'name', 'description', 'logo', 'address', 
            'contact_phone', 'website', 'social_media'
        ];
        
        foreach ($allowedFields as $field) {
            if (isset($storeData[$field])) {
                $updateData[$field] = $storeData[$field];
            }
        }
        
        if (empty($updateData)) {
            return ['success' => false, 'message' => 'No valid data provided for update'];
        }
        
        $updateData['updated_at'] = new MongoDB\BSON\UTCDateTime();
        
        $result = $db->stores->updateOne(
            ['seller_id' => $sellerId],
            ['$set' => $updateData]
        );
        
        if ($result->getModifiedCount()) {
            return ['success' => true, 'message' => 'Store information updated successfully'];
        } else {
            return ['success' => false, 'message' => 'No changes made to store information'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating store information: ' . $e->getMessage()];
    }
}

// Function to get seller store information
function getStoreById($storeId) {
    global $db;
    
    try {
        $store = $db->stores->findOne(['_id' => new MongoDB\BSON\ObjectId($storeId)]);
        
        if (!$store) {
            return ['success' => false, 'message' => 'Store not found'];
        }
        
        return ['success' => true, 'store' => $store];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving store information: ' . $e->getMessage()];
    }
}

// Function to get store by seller ID
function getStoreBySellerId($sellerId) {
    global $db;
    
    try {
        $store = $db->stores->findOne(['seller_id' => $sellerId]);
        
        if (!$store) {
            return ['success' => false, 'message' => 'Store not found'];
        }
        
        return ['success' => true, 'store' => $store];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving store information: ' . $e->getMessage()];
    }
}

// Function to update seller account status (admin only)
function updateSellerStatus($sellerId, $status) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        // Update user status
        $userResult = $db->users->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($sellerId), 'role' => 'seller'],
            ['$set' => ['status' => $status]]
        );
        
        if (!$userResult->getModifiedCount()) {
            return ['success' => false, 'message' => 'Failed to update seller status or seller not found'];
        }
        
        // Update store status
        $storeResult = $db->stores->updateOne(
            ['seller_id' => $sellerId],
            ['$set' => ['status' => $status, 'updated_at' => new MongoDB\BSON\UTCDateTime()]]
        );
        
        return ['success' => true, 'message' => 'Seller status updated successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating seller status: ' . $e->getMessage()];
    }
}

// Function to get all sellers (admin only)
function getAllSellers($limit = 10, $skip = 0, $filters = []) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        $query = ['role' => 'seller'];
        
        // Apply filters
        if (isset($filters['status']) && !empty($filters['status'])) {
            $query['status'] = $filters['status'];
        }
        
        $sellers = $db->users->find(
            $query,
            [
                'limit' => (int)$limit,
                'skip' => (int)$skip,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        // Enhance with store information
        $enhancedSellers = [];
        
        foreach ($sellers as $seller) {
            $sellerId = (string)$seller['_id'];
            $store = $db->stores->findOne(['seller_id' => $sellerId]);
            
            $enhancedSellers[] = [
                'user' => $seller,
                'store' => $store
            ];
        }
        
        $count = $db->users->countDocuments($query);
        
        return [
            'success' => true,
            'sellers' => $enhancedSellers,
            'total' => $count
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving sellers: ' . $e->getMessage()];
    }
}

// Function to get seller dashboard stats
function getSellerDashboardStats($sellerId) {
    global $db;
    
    try {
        // Get total products
        $totalProducts = $db->products->countDocuments(['seller_id' => $sellerId]);
        
        // Get total orders
        $allOrders = $db->orders->find()->toArray();
        $sellerOrders = [];
        $totalSales = 0;
        
        foreach ($allOrders as $order) {
            $isSellerOrder = false;
            $sellerOrderTotal = 0;
            
            foreach ($order['items'] as $item) {
                $product = $db->products->findOne(['_id' => new MongoDB\BSON\ObjectId($item['product_id'])]);
                
                if ($product && $product['seller_id'] === $sellerId) {
                    $isSellerOrder = true;
                    $sellerOrderTotal += $item['item_total'];
                }
            }
            
            if ($isSellerOrder) {
                $sellerOrders[] = $order;
                $totalSales += $sellerOrderTotal;
            }
        }
        
        // Calculate stats
        $totalOrders = count($sellerOrders);
        $pendingOrders = 0;
        $shippedOrders = 0;
        $completedOrders = 0;
        
        foreach ($sellerOrders as $order) {
            if ($order['order_status'] === 'placed' || $order['order_status'] === 'processing') {
                $pendingOrders++;
            } elseif ($order['order_status'] === 'shipped') {
                $shippedOrders++;
            } elseif ($order['order_status'] === 'delivered') {
                $completedOrders++;
            }
        }
        
        return [
            'success' => true,
            'stats' => [
                'total_products' => $totalProducts,
                'total_orders' => $totalOrders,
                'pending_orders' => $pendingOrders,
                'shipped_orders' => $shippedOrders,
                'completed_orders' => $completedOrders,
                'total_sales' => $totalSales
            ]
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving dashboard stats: ' . $e->getMessage()];
    }
}

// Function to get seller orders
function getSellerOrders($sellerId, $limit = 10, $skip = 0, $filters = []) {
    global $db;
    
    try {
        // Get all products by seller
        $products = $db->products->find(['seller_id' => $sellerId])->toArray();
        $productIds = [];
        
        foreach ($products as $product) {
            $productIds[] = (string)$product['_id'];
        }
        
        if (empty($productIds)) {
            return [
                'success' => true,
                'orders' => [],
                'total' => 0
            ];
        }
        
        // Get all orders
        $allOrders = $db->orders->find(
            isset($filters['status']) ? ['order_status' => $filters['status']] : [],
            [
                'limit' => (int)$limit + 100, // Add buffer for filtering
                'skip' => (int)$skip,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        // Filter orders containing seller's products
        $sellerOrders = [];
        
        foreach ($allOrders as $order) {
            $isSellerOrder = false;
            $sellerItems = [];
            $sellerTotal = 0;
            
            foreach ($order['items'] as $item) {
                if (in_array($item['product_id'], $productIds)) {
                    $isSellerOrder = true;
                    $sellerItems[] = $item;
                    $sellerTotal += $item['item_total'];
                }
            }
            
            if ($isSellerOrder) {
                $order['seller_items'] = $sellerItems;
                $order['seller_total'] = $sellerTotal;
                $sellerOrders[] = $order;
                
                if (count($sellerOrders) >= $limit) {
                    break;
                }
            }
        }
        
        // Count total orders for pagination
        $totalOrders = 0;
        $allOrdersCount = $db->orders->find(isset($filters['status']) ? ['order_status' => $filters['status']] : [])->toArray();
        
        foreach ($allOrdersCount as $order) {
            foreach ($order['items'] as $item) {
                if (in_array($item['product_id'], $productIds)) {
                    $totalOrders++;
                    break;
                }
            }
        }
        
        return [
            'success' => true,
            'orders' => $sellerOrders,
            'total' => $totalOrders
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving seller orders: ' . $e->getMessage()];
    }
}
?> 