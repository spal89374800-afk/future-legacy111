# Future Legacy - Backend Architecture & Documentation

## 📂 Directory Structure

```
backend/
├── config/
│   ├── app.js               # Application configuration and limits
│   ├── commission.js        # Platform commission rates and splits
│   ├── db.js                # MongoDB connection handler with offline resilience
│   └── razorpay.js          # Razorpay payment gateway client instance
├── controllers/
│   ├── dataController.js    # Data exchange and resource management
│   ├── orderController.js   # Course purchases, orders, and receipts
│   ├── paymentController.js # Razorpay order creation, webhooks, and verification
│   └── userController.js    # User registration, JWT login, and profile access
├── middleware/
│   ├── authMiddleware.js    # Bearer token JWT verification guard
│   └── errorMiddleware.js   # Centralized error handler and response formatting
├── models/
│   ├── orderModel.js        # Mongoose schema for Course Orders & Invoices
│   ├── paymentModel.js      # Mongoose schema for Transaction Logs & Webhook events
│   └── userModel.js         # Mongoose schema for User profiles and roles
├── routes/
│   ├── dataRoutes.js        # Endpoints under /api/data
│   ├── orderRoutes.js       # Endpoints under /api/orders
│   ├── paymentRoutes.js     # Endpoints under /api/payments
│   └── userRoutes.js        # Endpoints under /api/users
├── utils/
│   ├── commissionCalculator.js # Calculates teacher vs platform revenue split
│   ├── logger.js               # Structured request & transaction logger
│   └── response.js             # Standard JSON API response envelopes
└── server.js                # Modular Express API router mounting all routes
```

## 🔌 API Endpoints Summary

### 1. User Management (`/api/users`)
- `POST /api/users/register` - Create account (Student, Teacher, Farmer)
- `POST /api/users/login` - Authenticate with email/mobile and return JWT
- `GET /api/users/profile` - Protected profile fetch (requires `Authorization: Bearer <token>`)

### 2. Payments & Checkout (`/api/payments`)
- `GET /api/payments/key` - Fetch client publishable Razorpay Key ID
- `POST /api/payments/create-order` - Create order with amount and currency
- `POST /api/payments/verify` - HMAC SHA-256 signature verification

### 3. Course Orders (`/api/orders`)
- `POST /api/orders` - Record course enrollment and unlock access
- `GET /api/orders/my-orders` - Fetch authenticated user purchases

## 🔑 Environment Variables
Defined in `.env.example`:
- `MONGO_URI`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `JWT_SECRET`
- `MERCHANT_UPI_ID`
- `GEMINI_API_KEY`
