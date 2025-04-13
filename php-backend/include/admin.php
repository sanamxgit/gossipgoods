<?php
require_once 'config.php';

// Function to check if user is admin
function checkAdminAccess() {
    if (!isAdmin()) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
        exit;
    }
}

// Function to get admin dashboard stats
function getAdminDashboardStats() {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        // Get user stats
        $totalUsers = $db->users->countDocuments(['role' => 'user']);
        $totalSellers = $db->users->countDocuments(['role' => 'seller']);
        $pendingSellers = $db->stores->countDocuments(['status' => 'pending']);
        
        // Get product stats
        $totalProducts = $db->products->countDocuments();
        $featuredProducts = $db->products->countDocuments(['is_featured' => true]);
        
        // Get order stats
        $totalOrders = $db->orders->countDocuments();
        $pendingOrders = $db->orders->countDocuments(['order_status' => 'placed']);
        $processingOrders = $db->orders->countDocuments(['order_status' => 'processing']);
        $shippedOrders = $db->orders->countDocuments(['order_status' => 'shipped']);
        $deliveredOrders = $db->orders->countDocuments(['order_status' => 'delivered']);
        
        // Calculate revenue
        $allOrders = $db->orders->find()->toArray();
        $totalRevenue = 0;
        
        foreach ($allOrders as $order) {
            if ($order['payment_status'] === 'paid') {
                $totalRevenue += $order['total_amount'];
            }
        }
        
        // Get today's stats
        $startOfDay = new MongoDB\BSON\UTCDateTime(strtotime('today midnight') * 1000);
        $todayOrders = $db->orders->countDocuments(['created_at' => ['$gte' => $startOfDay]]);
        $todayUsers = $db->users->countDocuments(['created_at' => ['$gte' => $startOfDay]]);
        
        // Calculate monthly revenue (last 30 days)
        $thirtyDaysAgo = new MongoDB\BSON\UTCDateTime(strtotime('-30 days') * 1000);
        $recentOrders = $db->orders->find(['created_at' => ['$gte' => $thirtyDaysAgo]])->toArray();
        $monthlyRevenue = 0;
        
        foreach ($recentOrders as $order) {
            if ($order['payment_status'] === 'paid') {
                $monthlyRevenue += $order['total_amount'];
            }
        }
        
        return [
            'success' => true,
            'stats' => [
                'users' => [
                    'total' => $totalUsers,
                    'new_today' => $todayUsers
                ],
                'sellers' => [
                    'total' => $totalSellers,
                    'pending' => $pendingSellers
                ],
                'products' => [
                    'total' => $totalProducts,
                    'featured' => $featuredProducts
                ],
                'orders' => [
                    'total' => $totalOrders,
                    'today' => $todayOrders,
                    'pending' => $pendingOrders,
                    'processing' => $processingOrders,
                    'shipped' => $shippedOrders,
                    'delivered' => $deliveredOrders
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'monthly' => $monthlyRevenue
                ]
            ]
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving dashboard stats: ' . $e->getMessage()];
    }
}

// Function to update homepage settings
function updateHomepageSettings($settings) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        // Check if homepage settings exist
        $existingSettings = $db->settings->findOne(['type' => 'homepage']);
        
        if ($existingSettings) {
            // Update existing settings
            $result = $db->settings->updateOne(
                ['type' => 'homepage'],
                ['$set' => ['settings' => $settings, 'updated_at' => new MongoDB\BSON\UTCDateTime()]]
            );
            
            if (!$result->getModifiedCount()) {
                return ['success' => false, 'message' => 'Failed to update homepage settings'];
            }
        } else {
            // Create new settings
            $settingsDoc = [
                'type' => 'homepage',
                'settings' => $settings,
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $result = $db->settings->insertOne($settingsDoc);
            
            if (!$result->getInsertedCount()) {
                return ['success' => false, 'message' => 'Failed to create homepage settings'];
            }
        }
        
        return ['success' => true, 'message' => 'Homepage settings updated successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating homepage settings: ' . $e->getMessage()];
    }
}

// Function to get homepage settings
function getHomepageSettings() {
    global $db;
    
    try {
        $settings = $db->settings->findOne(['type' => 'homepage']);
        
        if (!$settings) {
            return [
                'success' => true,
                'settings' => [
                    'hero_carousel' => [],
                    'featured_categories' => [],
                    'featured_products' => [],
                    'promo_banners' => []
                ]
            ];
        }
        
        return ['success' => true, 'settings' => $settings['settings']];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving homepage settings: ' . $e->getMessage()];
    }
}

// Function to set featured products
function setFeaturedProducts($productIds) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        // First, reset all featured products
        $db->products->updateMany(
            ['is_featured' => true],
            ['$set' => ['is_featured' => false]]
        );
        
        // Then set new featured products
        $updateCount = 0;
        
        foreach ($productIds as $productId) {
            $result = $db->products->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($productId)],
                ['$set' => ['is_featured' => true]]
            );
            
            $updateCount += $result->getModifiedCount();
        }
        
        return [
            'success' => true,
            'message' => $updateCount . ' products set as featured'
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error setting featured products: ' . $e->getMessage()];
    }
}

// Function to manage user accounts (block/unblock users)
function updateUserStatus($userId, $status) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        $result = $db->users->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($userId)],
            ['$set' => ['status' => $status]]
        );
        
        if (!$result->getModifiedCount()) {
            return ['success' => false, 'message' => 'Failed to update user status or user not found'];
        }
        
        return ['success' => true, 'message' => 'User status updated successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating user status: ' . $e->getMessage()];
    }
}

// Function to get all users (admin only)
function getAllUsers($limit = 10, $skip = 0, $filters = []) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        $query = ['role' => 'user'];
        
        // Apply filters
        if (isset($filters['status']) && !empty($filters['status'])) {
            $query['status'] = $filters['status'];
        }
        
        if (isset($filters['search']) && !empty($filters['search'])) {
            $searchRegex = new MongoDB\BSON\Regex($filters['search'], 'i');
            $query['$or'] = [
                ['name' => $searchRegex],
                ['email' => $searchRegex]
            ];
        }
        
        $users = $db->users->find(
            $query,
            [
                'limit' => (int)$limit,
                'skip' => (int)$skip,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        $count = $db->users->countDocuments($query);
        
        return [
            'success' => true,
            'users' => $users,
            'total' => $count
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving users: ' . $e->getMessage()];
    }
}

// Function to get system logs (for monitoring)
function getSystemLogs($limit = 100, $skip = 0, $type = null) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        $query = [];
        
        if ($type) {
            $query['type'] = $type;
        }
        
        $logs = $db->logs->find(
            $query,
            [
                'limit' => (int)$limit,
                'skip' => (int)$skip,
                'sort' => ['timestamp' => -1]
            ]
        )->toArray();
        
        $count = $db->logs->countDocuments($query);
        
        return [
            'success' => true,
            'logs' => $logs,
            'total' => $count
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving logs: ' . $e->getMessage()];
    }
}

// Function to log system activity
function logSystemActivity($type, $action, $details, $userId = null) {
    global $db;
    
    try {
        $log = [
            'type' => $type,
            'action' => $action,
            'details' => $details,
            'user_id' => $userId,
            'timestamp' => new MongoDB\BSON\UTCDateTime()
        ];
        
        $db->logs->insertOne($log);
        
        return ['success' => true];
    } catch (Exception $e) {
        // Just fail silently
        return ['success' => false];
    }
}
?> 