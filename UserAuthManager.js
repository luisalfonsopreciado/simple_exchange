class UserAuthManger {
  constructor() {
    this.users = {};
  }

  /**
   * Generate a unique user auth token that is unique to a particular user session.
   */
  static generateAuthToken() {}

  /**
   * Validates a user auth token.
   */
  static validateToken() {}
}

module.exports = { UserManger };
