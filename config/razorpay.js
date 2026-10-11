const Razorpay = require('razorpay');

let instance;

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

const hasProductionOrTestKeys = typeof keyId === 'string' && 
                                keyId.trim().startsWith('rzp_') && 
                                typeof keySecret === 'string' && 
                                keySecret.trim().length > 0;

if (hasProductionOrTestKeys) {
  try {
    instance = new Razorpay({
      key_id: keyId.trim(),
      key_secret: keySecret.trim(),
    });
    console.log('Razorpay fully initialized with keys starting with rzp_');
  } catch (err) {
    console.error('Razorpay initialization error with keys:', err);
    instance = null;
  }
}

if (!instance) {
  console.warn('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is invalid or missing. Emulating sandbox driver...');
  instance = {
    isSandboxEmulator: true,
    orders: {
      create: async (options) => {
        return {
          id: `order_sandbox_${new Date().getTime()}_${Math.random().toString(36).substring(7)}`,
          entity: 'order',
          amount: options.amount,
          amount_paid: 0,
          amount_due: options.amount,
          currency: options.currency || 'INR',
          receipt: options.receipt,
          status: 'created',
          created_at: Math.floor(new Date().getTime() / 1000),
          is_sandbox: true
        };
      },
      fetch: async (orderId) => {
        return {
          id: orderId,
          amount: 10000, 
          currency: 'INR',
          status: 'paid'
        };
      }
    }
  };
}

module.exports = instance;

