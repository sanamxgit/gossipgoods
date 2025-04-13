<?php
header('Content-Type: application/json');
require_once '../include/cart.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure user is authenticated
if (!isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$userId = $_SESSION['user_id'];

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'GET':
        // Get cart contents
        getCartEndpoint($userId);
        break;
    case 'POST':
        // Add item to cart
        if ($path === 'add') {
            addToCartEndpoint($userId);
        } else if ($path === 'clear') {
            clearCartEndpoint($userId);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;
    case 'PUT':
        // Update cart item quantity
        updateCartEndpoint($userId);
        break;
    case 'DELETE':
        // Remove item from cart
        if (isset($_GET['product_id'])) {
            removeFromCartEndpoint($userId, $_GET['product_id']);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

// Get cart contents
function getCartEndpoint($userId) {
    $result = getCart($userId);
    echo json_encode($result);
}

// Add item to cart
function addToCartEndpoint($userId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['product_id'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product ID is required']);
        return;
    }
    
    $quantity = isset($data['quantity']) ? (int)$data['quantity'] : 1;
    
    if ($quantity <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Quantity must be greater than 0']);
        return;
    }
    
    $result = addToCart($userId, $data['product_id'], $quantity);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Update cart item quantity
function updateCartEndpoint($userId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['product_id']) || !isset($data['quantity'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product ID and quantity are required']);
        return;
    }
    
    $quantity = (int)$data['quantity'];
    
    $result = updateCartItemQuantity($userId, $data['product_id'], $quantity);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Remove item from cart
function removeFromCartEndpoint($userId, $productId) {
    $result = removeFromCart($userId, $productId);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Clear cart
function clearCartEndpoint($userId) {
    $result = clearCart($userId);
    echo json_encode($result);
}
?> 