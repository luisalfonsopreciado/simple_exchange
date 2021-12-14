const { User } = require("../User");

test("User equals", () => {
  const user1 = new User("Luis", "Preciado", "luis", "password", 100);
  const user2 = new User("Ana", "Preciado", "luis", "password", 100);
  const user3 = new User("Luis", "Preciado", "luis", "password", 100);

  expect(user1.equals(user1)).toBeTruthy();

  expect(user1.equals(user3)).toBeTruthy();
  expect(user3.equals(user1)).toBeTruthy();

  expect(user1.equals(user2)).toBeFalsy();
  expect(user2.equals(user1)).toBeFalsy();

  user3.firstName = "Luis2";
  expect(user1.equals(user3)).toBeFalsy();
  expect(user3.equals(user1)).toBeFalsy();

  user3.firstName = user1.firstName;
  user3.lastName = "Preciado2";
  expect(user1.equals(user3)).toBeFalsy();
  expect(user3.equals(user1)).toBeFalsy();

  user3.lastName = user1.lastName;
  user3.username = "luis2";
  expect(user1.equals(user3)).toBeFalsy();
  expect(user3.equals(user1)).toBeFalsy();

  user3.username = user1.username;
  user3.password = "password2";
  expect(user1.equals(user3)).toBeFalsy();
  expect(user3.equals(user1)).toBeFalsy();

  user3.password = user1.password;
  user3.funds = 101;
  expect(user1.equals(user3)).toBeFalsy();
  expect(user3.equals(user1)).toBeFalsy();
});

test("User validate", () => {
  const user1 = new User("Luis", "Preciado", "luis", "password", 100);
  const userLongFirstName = new User("Thisisaverylonglastnameforsureexceedstwentychars", "Preciado", "luis", "password", 100);
  const userLongLastName = new User("Luis", "Thisisaverylonglastnameforsureexceedstwentychars", "luis", "password", 100);
  const userLongUsername = new User("Luis", "Preciado", "Thisisaverylonglastnameforsureexceedstwentychars", "password", 100);
  const userShortPassword = new User("Luis", "Preciado", "luis", "pswd", 100);
  const userLongPassword = new User("Luis", "Preciado", "luis", "Thisisaverylonglastnameforsureexceedstwentychars", 100);

  expect(User.validate(user1)).toBeTruthy();
  expect(User.validate(userLongFirstName)).toBeFalsy();
  expect(User.validate(userLongLastName)).toBeFalsy();
  expect(User.validate(userLongUsername)).toBeFalsy();
  expect(User.validate(userShortPassword)).toBeFalsy();
  expect(User.validate(userLongPassword)).toBeFalsy();
})
