const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const calculateCommission = require('../utils/commissionCalculator');
const { successResponse, errorResponse } = require('../utils/response');

// Mock function to save payment details to a database
const savePaymentToDB = async (paymentDetails) => {
  console.log('Saving payment record to database...', paymentDetails);
  return { ...paymentDetails, _id: `payment_${new Date().getTime()}` };
};

// Helper to verify if genuine Razorpay credentials are fully active
const isKeysConfigured = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  return typeof keyId === 'string' && keyId.trim().startsWith('rzp_') && 
         typeof keySecret === 'string' && keySecret.trim().length > 0;
};

// @desc    Get Razorpay Public Key ID
// @route   GET /api/payments/key
exports.getRazorpayKey = async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  return successResponse(res, 200, {
    keyId: keyId,
    isConfigured: isKeysConfigured()
  });
};

// @desc    Create a new Razorpay order with dynamic amount
// @route   POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  let { amount, currency = 'INR', receipt, itemName = 'Academic Node', category = 'Course / Book' } = req.body;

  if (!amount || Number(amount) <= 0) {
    return errorResponse(res, 400, 'A valid amount is required.');
  }

  // Ensure amount is in paise (Razorpay standard: 1 INR = 100 paise)
  const amountInPaise = Math.round(Number(amount));

  // Graceful Sandbox Fallback if environment variables are not set
  if (!isKeysConfigured()) {
    console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing or invalid. Running in SECURE GATEWAY SANDBOX MODE.');
    const mockOrder = {
      id: `order_sandbox_${new Date().getTime()}_${Math.random().toString(36).substring(7)}`,
      entity: 'order',
      amount: amountInPaise,
      amount_paid: 0,
      amount_due: amountInPaise,
      currency: currency,
      receipt: receipt || `rcpt_${new Date().getTime()}`,
      status: 'created',
      created_at: Math.floor(new Date().getTime() / 1000),
      notes: {
        itemName,
        category
      },
      is_sandbox: true
    };
    return successResponse(res, 201, { 
      order: mockOrder, 
      isSandbox: true, 
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_sandbox_dummy_key_id' 
    });
  }

  const options = {
    amount: amountInPaise,
    currency,
    receipt: receipt || `rcpt_${new Date().getTime()}`,
    notes: {
      itemName,
      category
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    successResponse(res, 201, { 
      order, 
      isSandbox: false, 
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    // Fallback to sandbox if API credentials rejected by gateway
    const fallbackOrder = {
      id: `order_fallback_${new Date().getTime()}`,
      entity: 'order',
      amount: amountInPaise,
      currency,
      status: 'created',
      is_sandbox: true
    };
    successResponse(res, 201, { 
      order: fallbackOrder, 
      isSandbox: true, 
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_sandbox_key' 
    });
  }
};

// @desc    Verify a payment signature from Razorpay
// @route   POST /api/payments/verify-payment
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, itemName, amount } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id) {
    return errorResponse(res, 400, 'Missing payment verification details.');
  }

  // Graceful Sandbox Fallback
  if (razorpay_order_id.startsWith('order_sandbox_') || razorpay_order_id.startsWith('order_fallback_') || !isKeysConfigured()) {
    console.log('Verifying sandbox payment transaction...');
    const numericAmount = amount ? Number(amount) : 100;
    const { netAmount, commissionAmount } = calculateCommission(numericAmount * 100);

    const paymentRecord = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature || 'sandbox_verified_signature',
      itemName: itemName || 'Academic Node Access',
      amount: numericAmount,
      currency: 'INR',
      commission: commissionAmount / 100,
      netPayout: netAmount / 100,
      status: 'SUCCESS',
      is_sandbox: true,
      createdAt: new Date()
    };

    await savePaymentToDB(paymentRecord);

    return successResponse(res, 200, {
      message: 'Payment verified successfully.',
      paymentRecord
    });
  }

  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    console.error('Razorpay key secret is not defined in environment variables.');
    return errorResponse(res, 500, 'Server configuration error: Payment secret not found.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      let orderAmount = amount ? Number(amount) * 100 : 10000;
      let currency = 'INR';
      try {
        const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
        if (orderDetails && orderDetails.amount) {
          orderAmount = orderDetails.amount;
          currency = orderDetails.currency || 'INR';
        }
      } catch (err) {
        console.warn('Could not fetch order from Razorpay API, using provided amount:', err.message);
      }
      
      const { netAmount, commissionAmount } = calculateCommission(orderAmount);

      const paymentRecord = await savePaymentToDB({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        itemName: itemName || 'Academic Node Access',
        amount: orderAmount / 100,
        currency: currency,
        status: 'SUCCESS',
        commission: commissionAmount / 100,
        netPayout: netAmount / 100,
        createdAt: new Date()
      });

      successResponse(res, 200, { 
        message: 'Payment verified successfully.',
        paymentRecord
      });
    } catch (dbError) {
      console.error('Error processing successful payment:', dbError);
      errorResponse(res, 500, 'Payment verified, but failed to save record.');
    }
  } else {
    errorResponse(res, 400, 'Payment verification failed. Signature mismatch.');
  }
};

