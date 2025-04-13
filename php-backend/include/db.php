<?php
require_once 'config.php';

/**
 * MySQL Database Functions
 */

/**
 * Get user by email
 * 
 * @param string $email User email
 * @return array|null User data or null if not found
 */
function getUserByEmail($email) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return null;
    }
    
    return $result->fetch_assoc();
}

/**
 * Create a new user
 * 
 * @param string $name User name
 * @param string $email User email
 * @param string $password Plain text password (will be hashed)
 * @param string $role User role (default: 'user')
 * @return int|bool New user ID or false on failure
 */
function createUser($name, $email, $password, $role = 'user') {
    global $conn;
    
    // Hash password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssss", $name, $email, $password_hash, $role);
    
    if ($stmt->execute()) {
        return $conn->insert_id;
    }
    
    return false;
}

/**
 * Check if email already exists
 * 
 * @param string $email Email to check
 * @return bool True if email exists, false otherwise
 */
function emailExists($email) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    return $result->num_rows > 0;
}

/**
 * Get user by ID
 * 
 * @param int $id User ID
 * @return array|null User data or null if not found
 */
function getUserById($id) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ? LIMIT 1");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        return null;
    }
    
    return $result->fetch_assoc();
}

/**
 * Log user activity
 * 
 * @param int $user_id User ID
 * @param string $action Action performed
 * @param string $details Additional details
 * @return void
 */
function logUserActivity($user_id, $action, $details = '') {
    global $conn;
    
    $stmt = $conn->prepare("INSERT INTO user_activity_logs (user_id, action, details, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("iss", $user_id, $action, $details);
    $stmt->execute();
}

// Function to update user information
function updateUser($id, $data) {
    global $mysql;
    
    $fields = [];
    $values = [];
    $types = "";
    
    foreach ($data as $field => $value) {
        if ($field === 'password') {
            $value = password_hash($value, PASSWORD_DEFAULT);
        }
        $fields[] = "$field = ?";
        $values[] = $value;
        $types .= "s"; // Treat all as strings for simplicity
    }
    
    // Add ID to values array and types
    $values[] = $id;
    $types .= "i";
    
    $query = "UPDATE users SET " . implode(", ", $fields) . " WHERE id = ?";
    $stmt = $mysql->prepare($query);
    $stmt->bind_param($types, ...$values);
    
    return $stmt->execute();
}

/**
 * MongoDB Product Functions
 */

// Function to get all products
function getAllProducts($limit = 20, $skip = 0) {
    global $mongodb;
    
    $collection = $mongodb->selectCollection('products');
    $options = [
        'limit' => $limit,
        'skip' => $skip,
        'sort' => ['created_at' => -1]
    ];
    
    $products = [];
    $cursor = $collection->find([], $options);
    
    foreach ($cursor as $document) {
        $document['_id'] = (string) $document['_id'];
        $products[] = $document;
    }
    
    return $products;
}

// Function to get a single product by ID
function getProductById($id) {
    global $mongodb;
    
    $collection = $mongodb->selectCollection('products');
    $objectId = new MongoDB\BSON\ObjectId($id);
    $product = $collection->findOne(['_id' => $objectId]);
    
    if ($product) {
        $product['_id'] = (string) $product['_id'];
        return $product;
    }
    
    return null;
}

// Function to create a new product
function createProduct($productData) {
    global $mongodb;
    
    $collection = $mongodb->selectCollection('products');
    $productData['created_at'] = new MongoDB\BSON\UTCDateTime();
    $productData['updated_at'] = new MongoDB\BSON\UTCDateTime();
    
    $result = $collection->insertOne($productData);
    
    if ($result->getInsertedCount() > 0) {
        $productData['_id'] = (string) $result->getInsertedId();
        return $productData;
    }
    
    return false;
}

// Function to update a product
function updateProduct($id, $productData) {
    global $mongodb;
    
    $collection = $mongodb->selectCollection('products');
    $objectId = new MongoDB\BSON\ObjectId($id);
    $productData['updated_at'] = new MongoDB\BSON\UTCDateTime();
    
    $result = $collection->updateOne(
        ['_id' => $objectId],
        ['$set' => $productData]
    );
    
    return $result->getModifiedCount() > 0;
}

// Function to delete a product
function deleteProduct($id) {
    global $mongodb;
    
    $collection = $mongodb->selectCollection('products');
    $objectId = new MongoDB\BSON\ObjectId($id);
    
    $result = $collection->deleteOne(['_id' => $objectId]);
    
    return $result->getDeletedCount() > 0;
}

/**
 * Database utility functions
 */

/**
 * Execute a query and return the result
 * 
 * @param string $query The SQL query to execute
 * @param array $params Parameters to bind to the query
 * @param bool $fetchAll Whether to fetch all results or just one
 * @return mixed Query result
 */
function db_query($query, $params = [], $fetchAll = true) {
    global $conn;
    
    try {
        $stmt = $conn->prepare($query);
        
        // Bind parameters
        if (!empty($params)) {
            foreach ($params as $key => $value) {
                $param_type = is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR;
                $stmt->bindValue(is_numeric($key) ? $key + 1 : $key, $value, $param_type);
            }
        }
        
        $stmt->execute();
        
        // For SELECT queries
        if (stripos($query, 'SELECT') === 0) {
            return $fetchAll ? $stmt->fetchAll(PDO::FETCH_ASSOC) : $stmt->fetch(PDO::FETCH_ASSOC);
        }
        
        // For INSERT queries, return last insert ID
        if (stripos($query, 'INSERT') === 0) {
            return $conn->lastInsertId();
        }
        
        // For UPDATE or DELETE queries, return affected rows
        return $stmt->rowCount();
        
    } catch (PDOException $e) {
        error_log('Database Error: ' . $e->getMessage());
        return false;
    }
}

/**
 * Get a single record by ID
 * 
 * @param string $table Table name
 * @param int $id Record ID
 * @return array|false Record data or false if not found
 */
function get_record_by_id($table, $id) {
    $query = "SELECT * FROM `$table` WHERE id = :id LIMIT 1";
    return db_query($query, ['id' => $id], false);
}

/**
 * Insert a record into a table
 * 
 * @param string $table Table name
 * @param array $data Associative array of column => value pairs
 * @return int|false Last insert ID or false on failure
 */
function insert_record($table, $data) {
    $columns = array_keys($data);
    $placeholders = array_map(function($col) { 
        return ":$col"; 
    }, $columns);
    
    $query = "INSERT INTO `$table` (`" . implode('`, `', $columns) . "`) 
              VALUES (" . implode(', ', $placeholders) . ")";
    
    return db_query($query, $data);
}

/**
 * Update a record in a table
 * 
 * @param string $table Table name
 * @param int $id Record ID
 * @param array $data Associative array of column => value pairs
 * @return int|false Number of affected rows or false on failure
 */
function update_record($table, $id, $data) {
    $set_clause = [];
    foreach ($data as $column => $value) {
        $set_clause[] = "`$column` = :$column";
    }
    
    $query = "UPDATE `$table` SET " . implode(', ', $set_clause) . " WHERE id = :id";
    $data['id'] = $id;
    
    return db_query($query, $data);
}

/**
 * Delete a record from a table
 * 
 * @param string $table Table name
 * @param int $id Record ID
 * @return int|false Number of affected rows or false on failure
 */
function delete_record($table, $id) {
    $query = "DELETE FROM `$table` WHERE id = :id";
    return db_query($query, ['id' => $id]);
}

/**
 * Sanitize user input data
 * 
 * @param mixed $data Data to sanitize
 * @return mixed Sanitized data
 */
function sanitize_data($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitize_data($value);
        }
        return $data;
    }
    
    // Trim whitespace
    $data = trim($data);
    
    // Strip HTML and PHP tags
    $data = strip_tags($data);
    
    // Convert special characters to HTML entities
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    
    return $data;
}

/**
 * Generate a JSON response
 * 
 * @param bool $success Operation success status
 * @param string $message Response message
 * @param array $data Additional data to include
 * @return string JSON encoded response
 */
function json_response($success, $message, $data = []) {
    $response = [
        'success' => $success,
        'message' => $message
    ];
    
    if (!empty($data)) {
        $response['data'] = $data;
    }
    
    // Set appropriate content type header
    header('Content-Type: application/json');
    
    // Return JSON encoded response
    return json_encode($response);
} 