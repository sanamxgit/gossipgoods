<?php
require_once 'config.php';

// Function to register a new user
function registerUser($name, $email, $password, $role = 'user') {
    global $db;
    
    // Check if user already exists
    $existingUser = $db->users->findOne(['email' => $email]);
    if ($existingUser) {
        return ['success' => false, 'message' => 'Email already registered'];
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Create user document
    $user = [
        'name' => $name,
        'email' => $email,
        'password' => $hashedPassword,
        'role' => $role,
        'created_at' => new MongoDB\BSON\UTCDateTime(),
        'status' => 'active'
    ];
    
    // Insert user into database
    $result = $db->users->insertOne($user);
    
    if ($result->getInsertedCount()) {
        return ['success' => true, 'message' => 'User registered successfully', 'user_id' => (string)$result->getInsertedId()];
    } else {
        return ['success' => false, 'message' => 'Failed to register user'];
    }
}

// Function to authenticate user login
function loginUser($email, $password) {
    global $db;
    
    // Find user by email
    $user = $db->users->findOne(['email' => $email]);
    
    if (!$user) {
        return ['success' => false, 'message' => 'User not found'];
    }
    
    // Check if user is blocked
    if (isset($user['status']) && $user['status'] === 'blocked') {
        return ['success' => false, 'message' => 'Your account has been blocked. Please contact support.'];
    }
    
    // Verify password
    if (password_verify($password, $user['password'])) {
        // Set session data
        $_SESSION['user_id'] = (string)$user['_id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        
        return ['success' => true, 'message' => 'Login successful', 'user' => $user];
    } else {
        return ['success' => false, 'message' => 'Invalid password'];
    }
}

// Function to log out user
function logoutUser() {
    // Unset all session variables
    $_SESSION = [];
    
    // Destroy the session
    session_destroy();
    
    return ['success' => true, 'message' => 'Logged out successfully'];
}

// Function to get current user data
function getCurrentUser() {
    global $db;
    
    if (!isLoggedIn()) {
        return null;
    }
    
    $userId = $_SESSION['user_id'];
    
    try {
        $user = $db->users->findOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);
        return $user;
    } catch (Exception $e) {
        return null;
    }
}

// Function to update user profile
function updateUserProfile($userId, $data) {
    global $db;
    
    try {
        $updateData = [];
        
        // Only allow certain fields to be updated
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        
        if (isset($data['email'])) {
            // Check if email is already taken by another user
            $existingUser = $db->users->findOne([
                'email' => $data['email'],
                '_id' => ['$ne' => new MongoDB\BSON\ObjectId($userId)]
            ]);
            
            if ($existingUser) {
                return ['success' => false, 'message' => 'Email already in use by another account'];
            }
            
            $updateData['email'] = $data['email'];
        }
        
        if (!empty($updateData)) {
            $result = $db->users->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($userId)],
                ['$set' => $updateData]
            );
            
            if ($result->getModifiedCount()) {
                // Update session data if current user
                if (isLoggedIn() && $_SESSION['user_id'] === $userId) {
                    if (isset($data['name'])) {
                        $_SESSION['user_name'] = $data['name'];
                    }
                    if (isset($data['email'])) {
                        $_SESSION['user_email'] = $data['email'];
                    }
                }
                
                return ['success' => true, 'message' => 'Profile updated successfully'];
            } else {
                return ['success' => false, 'message' => 'No changes made'];
            }
        } else {
            return ['success' => false, 'message' => 'No valid data provided for update'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error updating profile: ' . $e->getMessage()];
    }
}

// Function to change user password
function changePassword($userId, $currentPassword, $newPassword) {
    global $db;
    
    try {
        $user = $db->users->findOne(['_id' => new MongoDB\BSON\ObjectId($userId)]);
        
        if (!$user) {
            return ['success' => false, 'message' => 'User not found'];
        }
        
        // Verify current password
        if (!password_verify($currentPassword, $user['password'])) {
            return ['success' => false, 'message' => 'Current password is incorrect'];
        }
        
        // Hash new password
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        // Update password
        $result = $db->users->updateOne(
            ['_id' => new MongoDB\BSON\ObjectId($userId)],
            ['$set' => ['password' => $hashedPassword]]
        );
        
        if ($result->getModifiedCount()) {
            return ['success' => true, 'message' => 'Password updated successfully'];
        } else {
            return ['success' => false, 'message' => 'Failed to update password'];
        }
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Error changing password: ' . $e->getMessage()];
    }
}
?> 