<?php
require_once 'config.php';
require_once 'cart.php';

// Function to create a new order from cart
function createOrder($userId, $shippingAddress, $paymentMethod) {
    global $db;
    
    try {
        // Get user's cart
        $cartResult = getCart($userId);
        
        if (!$cartResult['success'] || empty($cartResult['cart']['items'])) {
            return ['success' => false, 'message' => 'Cart is empty'];
        }
        
        $cart = $cartResult['cart'];
        $cartItems = $cart['items'];
        $totalAmount = $cart['total'];
        
        // Check stock availability and prepare order items
        $orderItems = [];
        $stockValid = true;
        $outOfStockItems = [];
        
        foreach ($cartItems as $item) {
            $productId = $item['product_id'];
            $quantity = $item['quantity'];
            
            // Check current stock
            $product = $db->products->findOne(['_id' => new MongoDB\BSON\ObjectId($productId)]);
            
            if (!$product) {
                return ['success' => false, 'message' => 'Product not found: ' . $item['name']];
            }
            
            if ($product['stock'] < $quantity) {
                $stockValid = false;
                $outOfStockItems[] = $item['name'];
                continue;
            }
            
            // Add to order items
            $orderItems[] = [
                'product_id' => $productId,
                'name' => $item['name'],
                'price' => $item['price'],
                'quantity' => $quantity,
                'item_total' => $item['item_total']
            ];
            
            // Update product stock
            $db->products->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($productId)],
                ['$inc' => ['stock' => -$quantity]]
            );
        }
        
        if (!$stockValid) {
            return [
                'success' => false,
                'message' => 'Some items are out of stock',
                'out_of_stock_items' => $outOfStockItems
            ];
        }
        
        // Create order
        $order = [
            'user_id' => $userId,
            'items' => $orderItems,
            'total_amount' => $totalAmount,
            'shipping_address' => $shippingAddress,
            'payment_method' => $paymentMethod,
            'payment_status' => 'pending',
            'order_status' => 'placed',
            'created_at' => new MongoDB\BSON\UTCDateTime(),
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ];
        
        $result = $db->orders->insertOne($order);
        
        if (!$result->getInsertedCount()) {
            return ['success' => false, 'message' => 'Failed to create order'];
        }
        
        $orderId = (string)$result->getInsertedId();
        
        // Clear the cart
        clearCart($userId);
        
        return [
            'success' => true,
            'message' => 'Order placed successfully',
            'order_id' => $orderId
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error creating order: ' . $e->getMessage()];
    }
}

// Function to get order by ID
function getOrderById($orderId, $userId = null) {
    global $db;
    
    try {
        $query = ['_id' => new MongoDB\BSON\ObjectId($orderId)];
        
        // If userId is provided, verify the order belongs to the user
        if ($userId) {
            $query['user_id'] = $userId;
        }
        
        $order = $db->orders->findOne($query);
        
        if (!$order) {
            return ['success' => false, 'message' => 'Order not found'];
        }
        
        return ['success' => true, 'order' => $order];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving order: ' . $e->getMessage()];
    }
}

// Function to get user orders
function getUserOrders($userId, $limit = 10, $skip = 0) {
    global $db;
    
    try {
        $orders = $db->orders->find(
            ['user_id' => $userId],
            [
                'limit' => (int)$limit,
                'skip' => (int)$skip,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        $count = $db->orders->countDocuments(['user_id' => $userId]);
        
        return [
            'success' => true,
            'orders' => $orders,
            'total' => $count
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving orders: ' . $e->getMessage()];
    }
}

// Function to update order status
function updateOrderStatus($orderId, $status, $userId = null) {
    global $db;
    
    try {
        $query = ['_id' => new MongoDB\BSON\ObjectId($orderId)];
        
        // If userId is provided, verify the order belongs to the user or is admin
        if ($userId && !isAdmin()) {
            $query['user_id'] = $userId;
        }
        
        $result = $db->orders->updateOne(
            $query,
            [
                '$set' => [
                    'order_status' => $status,
                    'updated_at' => new MongoDB\BSON\UTCDateTime()
                ]
            ]
        );
        
        if (!$result->getModifiedCount()) {
            return ['success' => false, 'message' => 'Failed to update order status or order not found'];
        }
        
        return ['success' => true, 'message' => 'Order status updated successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating order status: ' . $e->getMessage()];
    }
}

// Function to update payment status
function updatePaymentStatus($orderId, $status, $transactionId = null) {
    global $db;
    
    try {
        $updateData = [
            'payment_status' => $status,
            'updated_at' => new MongoDB\BSON\UTCDateTime()
        ];
        
        if ($transactionId) {
            $updateData['transaction_id'] = $transactionId;
        }
        
        $result = $db->orders->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($orderId)],
            ['$set' => $updateData]
        );
        
        if (!$result->getModifiedCount()) {
            return ['success' => false, 'message' => 'Failed to update payment status or order not found'];
        }
        
        return ['success' => true, 'message' => 'Payment status updated successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating payment status: ' . $e->getMessage()];
    }
}

// Function to cancel order
function cancelOrder($orderId, $userId) {
    global $db;
    
    try {
        // Verify the order belongs to the user
        $orderResult = getOrderById($orderId, $userId);
        
        if (!$orderResult['success']) {
            return $orderResult;
        }
        
        $order = $orderResult['order'];
        
        // Check if order can be cancelled
        $allowedStatuses = ['placed', 'processing'];
        
        if (!in_array($order['order_status'], $allowedStatuses)) {
            return ['success' => false, 'message' => 'Order cannot be cancelled in its current status'];
        }
        
        // Update order status
        $updateResult = updateOrderStatus($orderId, 'cancelled', $userId);
        
        if (!$updateResult['success']) {
            return $updateResult;
        }
        
        // Restore product stock
        foreach ($order['items'] as $item) {
            $db->products->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($item['product_id'])],
                ['$inc' => ['stock' => $item['quantity']]]
            );
        }
        
        return ['success' => true, 'message' => 'Order cancelled successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error cancelling order: ' . $e->getMessage()];
    }
}

// Function to get all orders (admin only)
function getAllOrders($limit = 10, $skip = 0, $filters = []) {
    global $db;
    
    if (!isAdmin()) {
        return ['success' => false, 'message' => 'Unauthorized access'];
    }
    
    try {
        $query = [];
        
        // Apply filters
        if (isset($filters['status']) && !empty($filters['status'])) {
            $query['order_status'] = $filters['status'];
        }
        
        if (isset($filters['payment_status']) && !empty($filters['payment_status'])) {
            $query['payment_status'] = $filters['payment_status'];
        }
        
        if (isset($filters['user_id']) && !empty($filters['user_id'])) {
            $query['user_id'] = $filters['user_id'];
        }
        
        $orders = $db->orders->find(
            $query,
            [
                'limit' => (int)$limit,
                'skip' => (int)$skip,
                'sort' => ['created_at' => -1]
            ]
        )->toArray();
        
        $count = $db->orders->countDocuments($query);
        
        return [
            'success' => true,
            'orders' => $orders,
            'total' => $count
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving orders: ' . $e->getMessage()];
    }
}
?> 