<?php
header('Content-Type: application/json');

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// API Documentation
$apiDocs = [
    'name' => 'E-commerce API',
    'version' => '1.0.0',
    'description' => 'API for e-commerce platform with user, seller, and admin functionalities',
    'base_url' => '/api',
    'endpoints' => [
        'Authentication' => [
            '/auth.php?action=register' => 'Register a new user',
            '/auth.php?action=login' => 'Login user',
            '/auth.php?action=logout' => 'Logout user',
            '/auth.php?action=profile' => 'Get/Update user profile',
            '/auth.php?action=change-password' => 'Change user password',
            '/auth.php?action=check' => 'Check authentication status'
        ],
        'Products' => [
            '/products.php' => 'Get all products',
            '/products.php?id={id}' => 'Get specific product',
            '/products.php?action=search&q={query}' => 'Search products',
            '/products.php?action=featured' => 'Get featured products',
            '/products.php?action=seller&seller_id={id}' => 'Get products by seller',
            '/products.php (POST)' => 'Add new product (seller only)',
            '/products.php?id={id} (PUT)' => 'Update product (seller only)',
            '/products.php?id={id} (DELETE)' => 'Delete product (seller only)'
        ],
        'Cart' => [
            '/cart.php' => 'Get cart contents',
            '/cart.php?action=add (POST)' => 'Add item to cart',
            '/cart.php (PUT)' => 'Update cart item quantity',
            '/cart.php?product_id={id} (DELETE)' => 'Remove item from cart',
            '/cart.php?action=clear (POST)' => 'Clear cart'
        ],
        'Orders' => [
            '/orders.php' => 'Get all user orders',
            '/orders.php?id={id}' => 'Get specific order',
            '/orders.php (POST)' => 'Create new order',
            '/orders.php?id={id}&action=cancel (PUT)' => 'Cancel order'
        ],
        'Sellers' => [
            '/sellers.php?action=register (POST)' => 'Register as a seller',
            '/sellers.php?action=dashboard' => 'Get seller dashboard stats',
            '/sellers.php?action=orders' => 'Get seller orders',
            '/sellers.php?action=store' => 'Get seller store information',
            '/sellers.php?action=public-store&id={id}' => 'Get public store information',
            '/sellers.php?action=update-store (POST)' => 'Update seller store information'
        ],
        'Admin' => [
            '/admin.php?action=dashboard' => 'Get admin dashboard stats',
            '/admin.php?action=users' => 'Get all users',
            '/admin.php?action=sellers' => 'Get all sellers',
            '/admin.php?action=orders' => 'Get all orders',
            '/admin.php?action=homepage-settings' => 'Get homepage settings',
            '/admin.php?action=homepage-settings (POST)' => 'Update homepage settings',
            '/admin.php?action=featured-products (POST)' => 'Set featured products',
            '/admin.php?action=user-status&id={id} (PUT)' => 'Update user status',
            '/admin.php?action=seller-status&id={id} (PUT)' => 'Update seller status',
            '/admin.php?action=order-status&id={id} (PUT)' => 'Update order status',
            '/admin.php?action=logs' => 'Get system logs'
        ]
    ],
    'authentication' => 'Authentication is handled via PHP sessions. Login first using the /auth.php?action=login endpoint.',
    'error_handling' => 'All endpoints return JSON with a "success" field indicating success or failure, and a "message" field with error details on failure.'
];

echo json_encode($apiDocs, JSON_PRETTY_PRINT);
?> 