<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Include database connection and functions
require_once '../../include/config.php';
require_once '../../include/db.php';

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit();
}

$email = trim($data['email']);
$password = $data['password'];

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit();
}

// Get user by email
$user = getUserByEmail($email);

if (!$user) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit();
}

// Verify password
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit();
}

// Generate JWT token
require_once '../../vendor/autoload.php'; // Ensure you have firebase/php-jwt installed

use Firebase\JWT\JWT;

$issuedAt = time();
$expirationTime = $issuedAt + 3600; // Token valid for 1 hour
$payload = [
    'iat' => $issuedAt,
    'exp' => $expirationTime,
    'user_id' => $user['id'],
    'email' => $user['email'],
    'name' => $user['name'],
    'role' => $user['role']
];

$jwt = JWT::encode($payload, JWT_SECRET, 'HS256');

// Return response with token
echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'token' => $jwt,
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role']
    ]
]); 