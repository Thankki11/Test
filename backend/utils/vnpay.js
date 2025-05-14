const crypto = require("crypto");

/**
 * Sorts an object by its keys in alphabetical order.
 * @param {Object} obj - The object to sort.
 * @returns {Object} - A new object with sorted keys.
 */
function sortObject(obj) {
  if (!obj || typeof obj !== "object") {
    throw new Error("Invalid object provided for sorting.");
  }

  const sorted = {};
  const keys = Object.keys(obj).sort();
  keys.forEach((key) => {
    sorted[key] = obj[key];
  });
  return sorted;
}

/**
 * Creates a secure hash using HMAC-SHA512.
 * @param {string} secret - The secret key for hashing.
 * @param {string} data - The data to hash.
 * @returns {string} - The generated hash.
 */
function createSecureHash(secret, data) {
  if (!secret || !data) {
    throw new Error("Secret key and data are required to create a secure hash.");
  }

  return crypto.createHmac("sha512", secret).update(data).digest("hex");
}

/**
 * Logs the sorted parameters and hash for debugging.
 * @param {Object} params - The parameters to log.
 * @param {string} hash - The generated hash.
 */
function logDebugInfo(params, hash) {
  console.log("Sorted Parameters:", params);
  console.log("Generated Hash:", hash);
}

module.exports = { sortObject, createSecureHash, logDebugInfo };
