const { User } = require("./User");
const { UUID } = require("./UUID");

class UserAuthManager {
  constructor() {
    // Map userToken to userId
    this.userTokens = {};
    // Map userId to Auth Tokens
    this.userAuthTokens = {};
    // Map username to user
    this.userStore = {};
    // Map userId to user
    this.userIdSearch = {};
  }

  /**
   * Generate a unique user auth token that is unique to a particular user session.
   * @param {User} user
   * @returns authToken
   */
  generateAuthToken(user) {
    if (this.userAuthTokens[user.id]) {
      this.userTokens[this.userAuthTokens[user.id]] = user.id;
      return this.userAuthTokens[user.id];
    }
    const uuid = UUID.createUUID();
    this.userAuthTokens[user.id] = uuid;
    this.userTokens[uuid] = user.id;
    return uuid;
  }

  /**
   * Validates an Auth Token for a given user
   * @param {string} userId
   * @param {string} token
   * @returns isValidToken
   */
  validateToken(token) {
    return this.userTokens[token];
  }

  /**
   * Validates and inserts user into userStore.
   * @param {User} user
   * @returns insertSucess
   */
  createUser(user) {
    if (!User.validate(user)) return false;
    if (this.userStore[user.username]) return false;
    this.userStore[user.username] = user;
    this.userIdSearch[user.id] = user;
    return true;
  }

  /**
   * Authenticate a user.
   * Returns null if user does not exist or if password is invalid.
   * Returns an AuthToken on success.
   * @param {Username} username
   * @param {Password} password
   * @returns
   */
  authenticateUser(username, password) {
    if (!this.userStore[username]) return null;
    if (this.userStore[username].password != password) return null;
    return this.generateAuthToken(this.userStore[username]);
  }
}

module.exports = { UserAuthManager };
