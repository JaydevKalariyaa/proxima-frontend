/**
 * Calculate price per piece based on MRP and discount
 * @param {number} mrp - Maximum Retail Price
 * @param {string} discountType - 'percent' or 'amount'
 * @param {number} discountValue - Discount value
 * @returns {number} Price per piece after discount
 */
export const calculatePricePerPiece = (mrp, discountType, discountValue) => {
  if (!mrp || !discountValue) return mrp || 0;
  
  if (discountType === 'percent') {
    return mrp - (mrp * discountValue / 100);
  } else if (discountType === 'amount') {
    return Math.max(0, mrp - discountValue);
  }
  
  return mrp;
};

/**
 * Calculate total amount for a product
 * @param {number} pricePerPiece - Price per piece after discount
 * @param {number} quantity - Quantity
 * @returns {number} Total amount
 */
export const calculateTotalAmount = (pricePerPiece, quantity) => {
  return (pricePerPiece || 0) * (quantity || 0);
};

/**
 * Calculate grand total for multiple products
 * @param {Array} products - Array of product objects
 * @returns {number} Grand total
 */
export const calculateGrandTotal = (products) => {
  return products.reduce((total, product) => {
    const pricePerPiece = calculatePricePerPiece(
      product.mrp,
      product.discount_type,
      product.discount_value
    );
    const productTotal = calculateTotalAmount(pricePerPiece, product.quantity);
    return total + productTotal;
  }, 0);
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Generate unique ID for products
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calculate discount percentage from amount
 * @param {number} mrp - Maximum Retail Price
 * @param {number} discountAmount - Discount amount
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercentage = (mrp, discountAmount) => {
  if (!mrp || !discountAmount) return 0;
  return (discountAmount / mrp) * 100;
};

/**
 * Calculate savings amount
 * @param {number} mrp - Maximum Retail Price
 * @param {number} finalPrice - Final price after discount
 * @returns {number} Savings amount
 */
export const calculateSavings = (mrp, finalPrice) => {
  return Math.max(0, mrp - finalPrice);
};

