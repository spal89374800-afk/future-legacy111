/**
 * Sends a standardized success response.
 * @param {object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {object} data - The payload to send in the response.
 */
const successResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({
    success: true,
    ...data,
  });
};

/**
 * Sends a standardized error response.
 * @param {object} res - The Express response object.
 * @param {number} statusCode - The HTTP status code.
 * @param {string} message - The error message.
 */
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
