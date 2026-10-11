const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: String, // Can be a reference to a Class model if it exists on backend
          required: true,
        },
      },
    ],
    paymentMethod: {
      type: String,
      required: true,
      default: 'Razorpay',
    },
    paymentResult: {
      id: { type: String }, // razorpay_payment_id
      order_id: { type: String }, // razorpay_order_id
      signature: { type: String },
      status: { type: String },
      update_time: { type: String },
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
