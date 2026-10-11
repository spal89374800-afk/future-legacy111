const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema(
  {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: { type: Number, required: true }, // in rupees
    currency: { type: String, required: true },
    status: { 
      type: String, 
      required: true, 
      enum: ['created', 'verified', 'failed'],
      default: 'created' 
    },
    commission: { type: Number, required: true },
    netPayout: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);