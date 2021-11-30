const { UUID } = require("./UUID");

class User {
  constructor(firstName, lastName, username, password, funds) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.funds = funds;
    this.orders = {};
    this.id = UUID.createUUID();
  }

  /**
   * Returns true if two User objects are equal.
   * @param {User} u2 
   * @returns 
   */
  equals(u2) {
    if (!u2) return false;
    return (
      this.firstName == u2.firstName &&
      this.lastName == u2.lastName &&
      this.username == u2.username &&
      this.password == u2.password &&
      this.funds == u2.funds
    );
  }
}

module.exports = {
  User,
};
