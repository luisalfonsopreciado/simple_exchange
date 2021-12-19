const { UUID } = require("./UUID");

class User {
  constructor(firstName, lastName, username, password, funds) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
    this.funds = funds;
    this.buyOrders = [];
    this.sellOrders = [];
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

User.validateRequest = (user) => {
  if (!user) return false;
  if (
    !user.firstName ||
    typeof user.firstName != "string" ||
    user.firstName.length > 20
  ) {
    return false;
  }
  if (
    !user.lastName ||
    typeof user.lastName != "string" ||
    user.lastName.length > 20
  ) {
    return false;
  }
  if (
    !user.username ||
    typeof user.username != "string" ||
    user.username.length > 20
  ) {
    return false;
  }
  if (
    !user.password ||
    typeof user.password != "string" ||
    user.password.length > 20 ||
    user.password.length < 5
  ) {
    return false;
  }
  return true;
};

User.validate = (user) => {
  if (!user) return false;
  if (
    !user.firstName ||
    typeof user.firstName != "string" ||
    user.firstName.length > 20
  ) {
    return false;
  }
  if (
    !user.lastName ||
    typeof user.lastName != "string" ||
    user.lastName.length > 20
  ) {
    return false;
  }
  if (
    !user.username ||
    typeof user.username != "string" ||
    user.username.length > 20
  ) {
    return false;
  }
  if (
    !user.password ||
    typeof user.password != "string" ||
    user.password.length > 20 ||
    user.password.length < 5
  ) {
    return false;
  }
  if (!user.funds || typeof user.funds != "number" || user.funds < 0) {
    return false;
  }
  return true;
};

module.exports = {
  User,
};
