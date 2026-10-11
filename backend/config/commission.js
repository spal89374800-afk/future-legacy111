// config/commission.js

// Read the commission rate from environment variables.
// Default to 5% if not specified.
const COMMISSION_RATE = parseFloat(process.env.COMMISSION_RATE) || 5.0;

if (isNaN(COMMISSION_RATE) || COMMISSION_RATE < 0 || COMMISSION_RATE > 100) {
  throw new Error('Invalid COMMISSION_RATE in .env file. Must be a number between 0 and 100.');
}

module.exports = {
  COMMISSION_RATE,
};
