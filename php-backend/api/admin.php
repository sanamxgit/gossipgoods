<?php
header('Content-Type: application/json');
require_once '../include/admin.php';
require_once '../include/sellers.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure user is authenticated and is an admin
if (!isLoggedIn() || !isAdmin()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    case 'GET':
        switch ($path) {
            case 'dashboard':
                getDashboardStats();
                break;
            case 'users':
                getAllUsersEndpoint();
                break;
            case 'sellers':
                getAllSellersEndpoint();
                break;
            case 'orders':
                getAllOrdersEndpoint();
                break;
            case 'homepage-settings':
                getHomepageSettingsEndpoint();
                break;
            case 'logs':
                getSystemLogsEndpoint();
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                break;
        }
        break;
    case 'POST':
        switch ($path) {
            case 'homepage-settings':
                updateHomepageSettingsEndpoint();
                break;
            case 'featured-products':
                setFeaturedProductsEndpoint();
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                break;
        }
        break;
    case 'PUT':
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID is required']);
            break;
        }
        
        switch ($path) {
            case 'user-status':
                updateUserStatusEndpoint($id);
                break;
            case 'seller-status':
                updateSellerStatusEndpoint($id);
                break;
            case 'order-status':
                updateOrderStatusEndpoint($id);
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                break;
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

// Get admin dashboard stats
function getDashboardStats() {
    $result = getAdminDashboardStats();
    echo json_encode($result);
}

// Get all users
function getAllUsersEndpoint() {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $skip = isset($_GET['skip']) ? (int)$_GET['skip'] : 0;
    
    $filters = [];
    
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }
    
    if (isset($_GET['search'])) {
        $filters['search'] = $_GET['search'];
    }
    
    $result = getAllUsers($limit, $skip, $filters);
    
    echo json_encode($result);
}

// Get all sellers
function getAllSellersEndpoint() {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $skip = isset($_GET['skip']) ? (int)$_GET['skip'] : 0;
    
    $filters = [];
    
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }
    
    $result = getAllSellers($limit, $skip, $filters);
    
    echo json_encode($result);
}

// Get all orders
function getAllOrdersEndpoint() {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $skip = isset($_GET['skip']) ? (int)$_GET['skip'] : 0;
    
    $filters = [];
    
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }
    
    if (isset($_GET['payment_status'])) {
        $filters['payment_status'] = $_GET['payment_status'];
    }
    
    if (isset($_GET['user_id'])) {
        $filters['user_id'] = $_GET['user_id'];
    }
    
    $result = getAllOrders($limit, $skip, $filters);
    
    echo json_encode($result);
}

// Update user status
function updateUserStatusEndpoint($userId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Status is required']);
        return;
    }
    
    $result = updateUserStatus($userId, $data['status']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Update seller status
function updateSellerStatusEndpoint($sellerId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Status is required']);
        return;
    }
    
    $result = updateSellerStatus($sellerId, $data['status']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Update order status
function updateOrderStatusEndpoint($orderId) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['status'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Status is required']);
        return;
    }
    
    $result = updateOrderStatus($orderId, $data['status']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Update homepage settings
function updateHomepageSettingsEndpoint() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['settings'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Settings are required']);
        return;
    }
    
    $result = updateHomepageSettings($data['settings']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Get homepage settings
function getHomepageSettingsEndpoint() {
    $result = getHomepageSettings();
    echo json_encode($result);
}

// Set featured products
function setFeaturedProductsEndpoint() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['product_ids']) || !is_array($data['product_ids'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Product IDs array is required']);
        return;
    }
    
    $result = setFeaturedProducts($data['product_ids']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Get system logs
function getSystemLogsEndpoint() {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
    $skip = isset($_GET['skip']) ? (int)$_GET['skip'] : 0;
    $type = isset($_GET['type']) ? $_GET['type'] : null;
    
    $result = getSystemLogs($limit, $skip, $type);
    
    echo json_encode($result);
}
?> 