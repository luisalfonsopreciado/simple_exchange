const { User } = require("../User");
const { UserAuthManager } = require("../UserAuthManager");

test("UserAuthManager generateAuthToken", () => {
  const user1 = new User("Luis", "Preciado", "luis", "password", 100);
  const manager = new UserAuthManager();

  const user2 = new User("Luis", "Preciado", "luis", "password", 100);
  const firstAuthToken = manager.generateAuthToken(user1);
  expect(firstAuthToken).toBeTruthy();
  expect(firstAuthToken.length).toBeTruthy();
  expect(firstAuthToken.length > 10).toBeTruthy();

  expect(firstAuthToken === manager.generateAuthToken(user1)).toBeTruthy();
  expect(firstAuthToken === manager.generateAuthToken(user1)).toBeTruthy();
  expect(firstAuthToken === manager.generateAuthToken(user1)).toBeTruthy();

  const secondAuthToken = manager.generateAuthToken(user2);

  expect(secondAuthToken).toBeTruthy();
  expect(secondAuthToken.length).toBeTruthy();
  expect(secondAuthToken.length > 10).toBeTruthy();

  expect(secondAuthToken === manager.generateAuthToken(user2)).toBeTruthy();
  expect(secondAuthToken === manager.generateAuthToken(user2)).toBeTruthy();
  expect(secondAuthToken === manager.generateAuthToken(user2)).toBeTruthy();

  expect(secondAuthToken != firstAuthToken).toBeTruthy();
});

test("UserAuthManager validate token", () => {
  const user1 = new User("Luis", "Preciado", "luis", "password", 100);
  const manager = new UserAuthManager();
  const firstAuthToken = manager.generateAuthToken(user1);

  expect(manager.validateToken(user1.id, firstAuthToken)).toBeTruthy();

  const user2 = new User("Luis", "Preciado", "luis", "password", 100);
  const secondAuthToken = manager.generateAuthToken(user2);

  expect(manager.validateToken(user2.id, secondAuthToken)).toBeTruthy();

  expect(manager.validateToken(user1.id, secondAuthToken)).toBeFalsy();
  expect(manager.validateToken(user2.id, firstAuthToken)).toBeFalsy();
});

test("Create / Authenticate User", () => {
  const user1 = new User("Luis", "Preciado", "luis", "password", 100);
  const manager = new UserAuthManager();

  expect(manager.createUser(user1)).toBeTruthy();
  expect(manager.createUser(user1)).toBeFalsy();
  expect(manager.createUser(user1)).toBeFalsy();

  expect(manager.authenticateUser("no", "chance")).toBeFalsy();
  expect(manager.authenticateUser("luis", "passwordd")).toBeFalsy();

  const authToken = manager.authenticateUser(user1.username, user1.password);
  expect(authToken).toBeTruthy();
  expect(typeof authToken === "string").toBeTruthy();
  expect(authToken.length > 5).toBeTruthy();

  const user2 = new User("Luis", "Preciado", "luis2", "password", 100);
  expect(manager.createUser(user2)).toBeTruthy();
  expect(manager.createUser(user2)).toBeFalsy();
  expect(manager.createUser(user2)).toBeFalsy();

  expect(manager.authenticateUser("no", "chance")).toBeFalsy();
  expect(manager.authenticateUser("luis2", "passwordd")).toBeFalsy();

  const authToken2 = manager.authenticateUser(user2.username, user2.password);
  expect(authToken2).toBeTruthy();
  expect(typeof authToken2 === "string").toBeTruthy();
  expect(authToken2.length > 5).toBeTruthy();

  expect(authToken === authToken2).toBeFalsy();
});
