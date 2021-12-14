const { Order } = require("../Order");

test("Order validate", () => {
  const order1 = new Order(
    100,
    Order.BUY_MARKET,
    new Date().toISOString(),
    100
  );

  const order2 = new Order(
    "100",
    Order.BUY_MARKET,
    new Date().toISOString(),
    100
  );

  const order3 = new Order(
    100,
    Order.BUY_MARKET,
    new Date().toISOString(),
    "100"
  );

  const order4 = new Order(
    100,
    "INVALID_ORDER_TYPE_AFASDFDSA",
    new Date().toISOString(),
    100
  );

  const order5 = new Order(100, Order.BUY_MARKET, {}, 100);

  //   const order6 = new Order(100, Order.BUY_MARKET, "Invalid ISO String!", 100);

  console.log(typeof order1.price);
  console.log(Order.types[Order.BUY_MARKET]);
  console.log(Order.types["Order.BUY_MARKET"] == undefined);
  expect(typeof order1.price === "number").toBeTruthy();
  expect(Order.validate(order1)).toBeTruthy();
  expect(Order.validate(order2)).toBeFalsy();
  expect(Order.validate(order3)).toBeFalsy();
  expect(Order.validate(order4)).toBeFalsy();
  expect(Order.validate(order5)).toBeFalsy();
  // expect(Order.validate(order6)).toBeFalsy();
});
