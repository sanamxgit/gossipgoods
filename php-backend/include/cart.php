<?php
require_once 'config.php';

// Function to add item to cart
function addToCart($userId, $productId, $quantity = 1) {
    global $db;
    
    try {
        // Check if product exists and is in stock
        $product = $db->products->findOne(['_id' => new MongoDB\BSON\ObjectId($productId)]);
        
        if (!$product) {
            return ['success' => false, 'message' => 'Product not found'];
        }
        
        if ($product['stock'] < $quantity) {
            return ['success' => false, 'message' => 'Not enough stock available'];
        }
        
        // Check if cart exists for user
        $cart = $db->carts->findOne(['user_id' => $userId]);
        
        if (!$cart) {
            // Create new cart
            $cartData = [
                'user_id' => $userId,
                'items' => [
                    [
                        'product_id' => $productId,
                        'quantity' => $quantity,
                        'added_at' => new MongoDB\BSON\UTCDateTime()
                    ]
                ],
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'updated_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $result = $db->carts->insertOne($cartData);
            
            if ($result->getInsertedCount()) {
                return ['success' => true, 'message' => 'Product added to cart'];
            } else {
                return ['success' => false, 'message' => 'Failed to add product to cart'];
            }
        } else {
            // Check if product already in cart
            $itemExists = false;
            $items = $cart['items'];
            
            foreach ($items as &$item) {
                if ($item['product_id'] === $productId) {
                    // Update quantity
                    $newQuantity = $item['quantity'] + $quantity;
                    
                    // Check if new quantity exceeds stock
                    if ($newQuantity > $product['stock']) {
                        return ['success' => false, 'message' => 'Not enough stock available'];
                    }
                    
                    $item['quantity'] = $newQuantity;
                    $itemExists = true;
                    break;
                }
            }
            
            if (!$itemExists) {
                // Add new item to cart
                $items[] = [
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'added_at' => new MongoDB\BSON\UTCDateTime()
                ];
            }
            
            // Update cart
            $result = $db->carts->updateOne(
                ['user_id' => $userId],
                [
                    '$set' => [
                        'items' => $items,
                        'updated_at' => new MongoDB\BSON\UTCDateTime()
                    ]
                ]
            );
            
            if ($result->getModifiedCount()) {
                return ['success' => true, 'message' => 'Cart updated successfully'];
            } else {
                return ['success' => false, 'message' => 'Failed to update cart'];
            }
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error adding to cart: ' . $e->getMessage()];
    }
}

// Function to update cart item quantity
function updateCartItemQuantity($userId, $productId, $quantity) {
    global $db;
    
    try {
        // Check if product exists and is in stock
        $product = $db->products->findOne(['_id' => new MongoDB\BSON\ObjectId($productId)]);
        
        if (!$product) {
            return ['success' => false, 'message' => 'Product not found'];
        }
        
        if ($product['stock'] < $quantity) {
            return ['success' => false, 'message' => 'Not enough stock available'];
        }
        
        // Get user's cart
        $cart = $db->carts->findOne(['user_id' => $userId]);
        
        if (!$cart) {
            return ['success' => false, 'message' => 'Cart not found'];
        }
        
        // Update quantity or remove item if quantity is 0
        $items = $cart['items'];
        $itemFound = false;
        
        foreach ($items as $key => $item) {
            if ($item['product_id'] === $productId) {
                if ($quantity <= 0) {
                    // Remove item from cart
                    unset($items[$key]);
                } else {
                    // Update quantity
                    $items[$key]['quantity'] = $quantity;
                }
                $itemFound = true;
                break;
            }
        }
        
        if (!$itemFound) {
            return ['success' => false, 'message' => 'Item not found in cart'];
        }
        
        // Reindex array after potential removal
        $items = array_values($items);
        
        // Update cart
        $result = $db->carts->updateOne(
            ['user_id' => $userId],
            [
                '$set' => [
                    'items' => $items,
                    'updated_at' => new MongoDB\BSON\UTCDateTime()
                ]
            ]
        );
        
        if ($result->getModifiedCount()) {
            return ['success' => true, 'message' => 'Cart updated successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to update cart'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating cart: ' . $e->getMessage()];
    }
}

// Function to remove item from cart
function removeFromCart($userId, $productId) {
    global $db;
    
    try {
        // Get user's cart
        $cart = $db->carts->findOne(['user_id' => $userId]);
        
        if (!$cart) {
            return ['success' => false, 'message' => 'Cart not found'];
        }
        
        // Remove item from cart
        $items = $cart['items'];
        $itemFound = false;
        
        foreach ($items as $key => $item) {
            if ($item['product_id'] === $productId) {
                unset($items[$key]);
                $itemFound = true;
                break;
            }
        }
        
        if (!$itemFound) {
            return ['success' => false, 'message' => 'Item not found in cart'];
        }
        
        // Reindex array after removal
        $items = array_values($items);
        
        // Update cart
        $result = $db->carts->updateOne(
            ['user_id' => $userId],
            [
                '$set' => [
                    'items' => $items,
                    'updated_at' => new MongoDB\BSON\UTCDateTime()
                ]
            ]
        );
        
        if ($result->getModifiedCount()) {
            return ['success' => true, 'message' => 'Item removed from cart'];
        } else {
            return ['success' => false, 'message' => 'Failed to remove item from cart'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error removing item from cart: ' . $e->getMessage()];
    }
}

// Function to get user's cart with product details
function getCart($userId) {
    global $db;
    
    try {
        // Get user's cart
        $cart = $db->carts->findOne(['user_id' => $userId]);
        
        if (!$cart || empty($cart['items'])) {
            return [
                'success' => true,
                'cart' => [
                    'items' => [],
                    'total' => 0
                ]
            ];
        }
        
        // Get product details for cart items
        $cartItems = [];
        $total = 0;
        
        foreach ($cart['items'] as $item) {
            $productId = $item['product_id'];
            $quantity = $item['quantity'];
            
            $product = $db->products->findOne(['_id' => new MongoDB\BSON\ObjectId($productId)]);
            
            if ($product) {
                $price = isset($product['discount_price']) && $product['discount_price'] > 0 
                    ? $product['discount_price'] 
                    : $product['price'];
                
                $itemTotal = $price * $quantity;
                $total += $itemTotal;
                
                $cartItems[] = [
                    'product_id' => $productId,
                    'name' => $product['name'],
                    'price' => $price,
                    'original_price' => $product['price'],
                    'quantity' => $quantity,
                    'stock' => $product['stock'],
                    'image' => isset($product['images'][0]) ? $product['images'][0] : null,
                    'item_total' => $itemTotal
                ];
            }
        }
        
        return [
            'success' => true,
            'cart' => [
                'items' => $cartItems,
                'total' => $total
            ]
        ];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error retrieving cart: ' . $e->getMessage()];
    }
}

// Function to clear the cart
function clearCart($userId) {
    global $db;
    
    try {
        $result = $db->carts->updateOne(
            ['user_id' => $userId],
            [
                '$set' => [
                    'items' => [],
                    'updated_at' => new MongoDB\BSON\UTCDateTime()
                ]
            ]
        );
        
        return ['success' => true, 'message' => 'Cart cleared successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error clearing cart: ' . $e->getMessage()];
    }
}
?> 