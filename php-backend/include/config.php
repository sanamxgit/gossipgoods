<?php
/**
 * Database configuration
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_NAME', 'ecommerce');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Session configuration
session_start();

// Database connection
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    
    $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (PDOException $e) {
    error_log('Connection Error: ' . $e->getMessage());
    die('Database connection failed. Please check the configuration.');
}

// Set default timezone
date_default_timezone_set('UTC');

// Base URL
$base_url = 'http://' . $_SERVER['HTTP_HOST'] . '/';

// API response headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Include database utility functions
require_once 'db.php';

// JWT configuration
define('JWT_SECRET', 'your_jwt_secret_key_here'); // Change this to a strong random key in production
define('JWT_EXPIRY', 3600); // Token expiry in seconds (1 hour)

// Site configuration
define('SITE_URL', 'http://localhost/ecommerce');

// Connect to database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Check connection
if ($conn->connect_error) {
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json');
    die(json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Include utility functions
require_once __DIR__ . '/db.php';

// MongoDB configuration
define('MONGO_URI', 'mongodb://localhost:27017');
define('MONGO_DB', 'ecommerce');

// Application URL
define('APP_URL', 'http://localhost:8000');

// Configure MongoDB connection (requires the MongoDB PHP extension)
try {
    $mongoClient = new MongoDB\Client(MONGO_URI);
    $mongodb = $mongoClient->selectDatabase(MONGO_DB);
} catch (Exception $e) {
    // If MongoDB connection fails, log the error but don't stop execution
    // This allows the application to still function with MySQL only
    error_log("MongoDB Connection failed: " . $e->getMessage());
}

// Log errors to file instead of displaying them
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/error.log');

// Session settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);

// Create log directory if it doesn't exist
if (!file_exists(__DIR__ . '/../logs')) {
    mkdir(__DIR__ . '/../logs', 0755, true);
}

// Base URL of the site
$baseUrl = "http://localhost/ecommerce";

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Function to check if user is admin
function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

// Function to check if user is seller
function isSeller() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'seller';
}

// Function to redirect with error message
function redirectWithError($location, $error) {
    $_SESSION['error_message'] = $error;
    header("Location: $location");
    exit();
}

// Function to redirect with success message
function redirectWithSuccess($location, $message) {
    $_SESSION['success_message'] = $message;
    header("Location: $location");
    exit();
}
?> 