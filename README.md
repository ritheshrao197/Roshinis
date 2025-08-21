# E-Commerce Platform with PhonePe & Delhivery Integration

A full-stack e-commerce application built with React frontend, Node.js backend, MongoDB database, PhonePe payment gateway, and Delhivery shipping integration.

## Features

- **Frontend**: React-based responsive UI with Material-UI components
- **Backend**: Node.js + Express REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based user authentication
- **Payments**: PhonePe payment gateway integration
- **Shipping**: Delhivery shipping and tracking integration
- **Admin Panel**: Product and order management

## Project Structure

```
RoshinisNew/
├── client/          # React frontend
├── server/          # Node.js backend
├── README.md        # Project documentation
└── .gitignore       # Git ignore file
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- PhonePe Business account
- Delhivery Business account

## Quick Start

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd RoshinisNew
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm start
```

### 4. Environment Variables
Create `.env` files in both `client/` and `server/` directories with your configuration.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

### Payments
- `POST /api/payments/initiate` - Initiate PhonePe payment
- `POST /api/payments/callback` - PhonePe webhook callback

### Shipping
- `POST /api/shipping/create` - Create Delhivery shipment
- `GET /api/shipping/track/:trackingId` - Track shipment

## Technologies Used

- **Frontend**: React, Material-UI, React Router, Axios
- **Backend**: Node.js, Express, Mongoose, JWT
- **Database**: MongoDB Atlas
- **Payment**: PhonePe API
- **Shipping**: Delhivery API
- **Development**: Nodemon, Concurrently

## License

MIT License
