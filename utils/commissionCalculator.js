const { COMMISSION_RATE } = require('../config/commission');

/**
 * Calculates the commission and net amount from a total transaction amount.
 * @param {number} totalAmount - The total amount of the transaction in the smallest currency unit (e.g., paisa).
 * @returns {{commissionAmount: number, netAmount: number}}
 */
const calculateCommission = (totalAmount) => {
  if (typeof totalAmount !== 'number' || totalAmount < 0) {
    throw new Error('Invalid totalAmount provided for commission calculation.');
  }

  // Calculate commission, rounding to the nearest paisa to avoid floating-point issues
  const commissionAmount = Math.round(totalAmount * (COMMISSION_RATE / 100));
  const netAmount = totalAmount - commissionAmount;

  return {
    commissionAmount,
    netAmount,
  };
};

module.exports = calculateCommission;
