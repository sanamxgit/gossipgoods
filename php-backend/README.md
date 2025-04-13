# E-commerce PHP Backend with MongoDB

This is a PHP backend for an e-commerce platform that uses MongoDB for data storage. It provides API endpoints for users, sellers, and administrators.

## Features

- User authentication and registration
- Product management
- Shopping cart functionality
- Order processing
- Seller dashboard and store management
- Admin controls and analytics

## Requirements

- PHP 7.4 or higher
- MongoDB
- MongoDB PHP extension
- Web server (Apache or Nginx)

## Installation

1. Install MongoDB on your server or use a MongoDB cloud service
2. Install the MongoDB PHP extension:
   ```
   pecl install mongodb
   ```
3. Add the extension to your php.ini file:
   ```
   extension=mongodb.so
   ```
4. Set up a web server to serve the PHP files

## Configuration

Edit the `include/config.php` file to set your MongoDB connection details:

```php
$mongoHost = "localhost";
$mongoPort = 27017;
$mongoDatabase = "ecommerce";
```

## Database Setup

The application will automatically create the necessary collections in MongoDB.

- users: Store user accounts
- products: Store product information
- carts: Store user shopping carts
- orders: Store order information
- stores: Store seller store information
- reviews: Store product reviews
- settings: Store application settings
- logs: Store system logs

## API Endpoints

See the API documentation at the root endpoint (`/index.php`) for a complete list of available endpoints.

### Main Endpoint Groups:

- `/api/auth.php`: Authentication and user management
- `/api/products.php`: Product listing and management
- `/api/cart.php`: Shopping cart operations
- `/api/orders.php`: Order processing
- `/api/sellers.php`: Seller operations
- `/api/admin.php`: Admin controls

## User Roles

- **Regular Users**: Can browse products, add items to cart, place orders, and review products
- **Sellers**: Can manage their own store, add and edit products, and process orders
- **Administrators**: Can manage users, sellers, products, and site settings

## Integration with Frontend

To integrate with the frontend, make API calls to the provided endpoints. Authentication is handled via PHP sessions.

Example:

```javascript
fetch('/api/auth.php?action=login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  }),
  credentials: 'include' // Important for session cookies
})
.then(response => response.json())
.then(data => console.log(data));
```

## Security Considerations

- The API uses PHP sessions for authentication
- Passwords are hashed using PHP's `password_hash()` function
- API endpoints validate user roles and permissions

## License

MIT 