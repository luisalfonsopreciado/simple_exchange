class UUID {}

/**
 * Creates a random UUID
 * @returns UUID
 */
UUID.createUUID = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

module.exports = {
  UUID,
};
