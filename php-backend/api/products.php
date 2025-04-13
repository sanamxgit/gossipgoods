<?php
/**
 * Products API Endpoint
 * Handles CRUD operations for products
 */

// Include configuration
require_once '../include/config.php';

// Set content type to JSON
header('Content-Type: application/json');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle different HTTP methods
switch ($method) {
    case 'GET':
        // Get products or a specific product
        if (isset($_GET['id'])) {
            // Get specific product by ID
            $product = get_record_by_id('products', $_GET['id']);
            
            if ($product) {
                echo json_response(true, 'Product retrieved successfully', $product);
            } else {
                echo json_response(false, 'Product not found', null);
            }
        } else {
            // Get all products with optional filtering
            $query = "SELECT * FROM products";
            $params = [];
            
            // Filter by category if provided
            if (isset($_GET['category'])) {
                $query .= " WHERE category_id = ?";
                $params[] = $_GET['category'];
            }
            
            // Add ordering
            $query .= " ORDER BY name ASC";
            
            $products = db_query($query, $params);
            echo json_response(true, 'Products retrieved successfully', $products);
        }
        break;
        
    case 'POST':
        // Create a new product
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            echo json_response(false, 'Invalid input data', null);
            exit;
        }
        
        // Validate required fields
        $required_fields = ['name', 'description', 'price', 'category_id'];
        foreach ($required_fields as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                echo json_response(false, "Missing required field: {$field}", null);
                exit;
            }
        }
        
        // Sanitize input data
        $data = sanitize_data($input);
        
        // Insert the product
        $product_id = insert_record('products', $data);
        
        if ($product_id) {
            $product = get_record_by_id('products', $product_id);
            echo json_response(true, 'Product created successfully', $product);
        } else {
            echo json_response(false, 'Failed to create product', null);
        }
        break;
        
    case 'PUT':
        // Update an existing product
        if (!isset($_GET['id'])) {
            echo json_response(false, 'Product ID is required', null);
            exit;
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            echo json_response(false, 'Invalid input data', null);
            exit;
        }
        
        // Sanitize input data
        $data = sanitize_data($input);
        
        // Update the product
        $success = update_record('products', $_GET['id'], $data);
        
        if ($success) {
            $product = get_record_by_id('products', $_GET['id']);
            echo json_response(true, 'Product updated successfully', $product);
        } else {
            echo json_response(false, 'Failed to update product', null);
        }
        break;
        
    case 'DELETE':
        // Delete a product
        if (!isset($_GET['id'])) {
            echo json_response(false, 'Product ID is required', null);
            exit;
        }
        
        // Delete the product
        $success = delete_record('products', $_GET['id']);
        
        if ($success) {
            echo json_response(true, 'Product deleted successfully', null);
        } else {
            echo json_response(false, 'Failed to delete product', null);
        }
        break;
        
    default:
        // Method not allowed
        http_response_code(405);
        echo json_response(false, 'Method not allowed', null);
        break;
} 