class Random {}

/**
 * Generate a random integer between a range [min, max] (inclusive).
 * Extracted from : https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
 * @param {number} min must be less than max
 * @param {number} max must be greater than min
 */
Random.randBetween = (min, max) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

module.exports = { Random };
