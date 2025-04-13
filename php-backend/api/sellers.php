<?php
header('Content-Type: application/json');
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

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['action']) ? $_GET['action'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : null;

switch ($method) {
    case 'GET':
        // Check if user is logged in for protected routes
        if ($path === 'dashboard' || $path === 'orders' || $path === 'store') {
            if (!isLoggedIn() || !isSeller()) {
                http_response_code(403);
                echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
                exit;
            }
        }
        
        switch ($path) {
            case 'dashboard':
                getSellerDashboardEndpoint();
                break;
            case 'orders':
                getSellerOrdersEndpoint();
                break;
            case 'store':
                getSellerStoreEndpoint();
                break;
            case 'public-store':
                if ($id) {
                    getPublicStoreEndpoint($id);
                } else {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Store ID is required']);
                }
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                break;
        }
        break;
    case 'POST':
        switch ($path) {
            case 'register':
                registerSellerEndpoint();
                break;
            default:
                if (!isLoggedIn() || !isSeller()) {
                    http_response_code(403);
                    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
                    exit;
                }
                
                switch ($path) {
                    case 'update-store':
                        updateSellerStoreEndpoint();
                        break;
                    default:
                        http_response_code(404);
                        echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                        break;
                }
                break;
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}

// Register a new seller
function registerSellerEndpoint() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate user data
    if (!isset($data['user']) || !isset($data['store'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User and store data are required']);
        return;
    }
    
    $userData = $data['user'];
    $storeData = $data['store'];
    
    // Check required fields
    $userRequired = ['name', 'email', 'password'];
    $storeRequired = ['store_name'];
    
    foreach ($userRequired as $field) {
        if (!isset($userData[$field]) || empty($userData[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => ucfirst($field) . ' is required']);
            return;
        }
    }
    
    foreach ($storeRequired as $field) {
        if (!isset($storeData[$field]) || empty($storeData[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => ucfirst(str_replace('_', ' ', $field)) . ' is required']);
            return;
        }
    }
    
    $result = registerSeller($userData, $storeData);
    
    if ($result['success']) {
        http_response_code(201);
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Get seller dashboard stats
function getSellerDashboardEndpoint() {
    $sellerId = $_SESSION['user_id'];
    
    $result = getSellerDashboardStats($sellerId);
    
    echo json_encode($result);
}

// Get seller orders
function getSellerOrdersEndpoint() {
    $sellerId = $_SESSION['user_id'];
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $skip = isset($_GET['skip']) ? (int)$_GET['skip'] : 0;
    
    $filters = [];
    
    if (isset($_GET['status'])) {
        $filters['status'] = $_GET['status'];
    }
    
    $result = getSellerOrders($sellerId, $limit, $skip, $filters);
    
    echo json_encode($result);
}

// Get seller store information
function getSellerStoreEndpoint() {
    $sellerId = $_SESSION['user_id'];
    
    $result = getStoreBySellerId($sellerId);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode($result);
    }
}

// Get public store information
function getPublicStoreEndpoint($storeId) {
    $result = getStoreById($storeId);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode($result);
    }
}

// Update seller store information
function updateSellerStoreEndpoint() {
    $sellerId = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['store']) || !is_array($data['store'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Store data is required']);
        return;
    }
    
    $result = updateStore($sellerId, $data['store']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}
?> 