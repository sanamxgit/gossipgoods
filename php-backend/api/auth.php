<?php
header('Content-Type: application/json');
require_once '../include/auth.php';

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get request method and path
$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'POST':
        switch ($path) {
            case 'login':
                handleLogin();
                break;
            case 'register':
                handleRegister();
                break;
            case 'logout':
                handleLogout();
                break;
            case 'profile':
                updateProfile();
                break;
            case 'change-password':
                changeUserPassword();
                break;
            default:
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
                break;
        }
        break;
    case 'GET':
        switch ($path) {
            case 'profile':
                getProfile();
                break;
            case 'check':
                checkAuth();
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

// Handle user login
function handleLogin() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and password are required']);
        return;
    }
    
    $result = loginUser($data['email'], $data['password']);
    
    if ($result['success']) {
        // Remove sensitive data
        unset($result['user']['password']);
        echo json_encode($result);
    } else {
        http_response_code(401);
        echo json_encode($result);
    }
}

// Handle user registration
function handleRegister() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, email, and password are required']);
        return;
    }
    
    $result = registerUser($data['name'], $data['email'], $data['password']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Handle user logout
function handleLogout() {
    $result = logoutUser();
    echo json_encode($result);
}

// Get user profile
function getProfile() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $user = getCurrentUser();
    
    if ($user) {
        // Remove sensitive data
        unset($user['password']);
        
        echo json_encode([
            'success' => true,
            'user' => $user
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
}

// Update user profile
function updateProfile() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $_SESSION['user_id'];
    
    $result = updateUserProfile($userId, $data);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Change user password
function changeUserPassword() {
    if (!isLoggedIn()) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['current_password']) || !isset($data['new_password'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Current password and new password are required']);
        return;
    }
    
    $userId = $_SESSION['user_id'];
    
    $result = changePassword($userId, $data['current_password'], $data['new_password']);
    
    if ($result['success']) {
        echo json_encode($result);
    } else {
        http_response_code(400);
        echo json_encode($result);
    }
}

// Check authentication status
function checkAuth() {
    if (isLoggedIn()) {
        echo json_encode([
            'success' => true,
            'authenticated' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'email' => $_SESSION['user_email'],
                'role' => $_SESSION['user_role']
            ]
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'authenticated' => false
        ]);
    }
}
?> 