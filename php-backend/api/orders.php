<?php
header('Content-Type: application/json');
require_once '../include/orders.php';

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
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Get specific order
            getOrderEndpoint($id, $userId);
        } else {
            // Get all user orders
            getUserOrdersEndpoint($userId);
        }
        break;
    case 'POST':
        // Create new order
        createOrderEndpoint($userId);
        break;
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Order ID is required']);
            break;
        }
        
        if ($path === 'cancel') {
            // Cancel order
            cancelOrderEndpoint($id, $userId);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

// Get a specific order
function getOrderEndpoint($orderId, $userId) {
    // Admin can view any order
    if (isAdmin()) {
        $result = getOrderById($orderId);
    } else {
        // Regular users can only view their own orders
        $result = getOrderById($orderId, $userId);
    }
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode($result);
    }
}

// Get all orders for a user
function getUserOrdersEndpoint($userId) {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $skip = isset($_GET['skip']) ? (int)$_GET['skip'] : 0;
    
    $result = getUserOrders($userId, $limit, $skip);
    
    echo json_encode($result);
}

// Create a new order
function createOrderEndpoint($userId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['shipping_address']) || !isset($data['payment_method'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Shipping address and payment method are required']);
        return;
    }
    
    $result = createOrder($userId, $data['shipping_address'], $data['payment_method']);
    
    if ($result['success']) {
        http_response_code(201);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Cancel an order
function cancelOrderEndpoint($orderId, $userId) {
    $result = cancelOrder($orderId, $userId);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}
?> 