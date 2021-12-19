const { Exchange } = require("../Exchange");
const { Order } = require("../Order");
const { PriorityQueue } = require("../data_structures/PriorityQueue");
const { User } = require("../User");

const order = new Order(100, "BUY_CALL", new Date().toISOString());
const order1 = new Order(120, "BUY_STOP", new Date().toISOString());
const order2 = new Order(140, "BUY_STOP", new Date().toISOString());
const order3 = new Order(80, "BUY_STOP", new Date().toISOString());
const order4 = new Order(160, "BUY_STOP", new Date().toISOString());
const order5 = new Order(70, "BUY_STOP", new Date().toISOString());
const order6 = new Order(100, "BUY_CALL", new Date().toISOString());

const user1 = new User("Luis", "Preciado", "luis", "password123", 1000);

const constructBuyOrderQueue = () => {
  const buyQueue = new PriorityQueue(
    Exchange.DECREASING_PRICE_COMPARATOR,
    Order.equals
  );
  buyQueue.push(order);
  buyQueue.push(order1);
  buyQueue.push(order2);
  buyQueue.push(order3);
  buyQueue.push(order4);
  buyQueue.push(order5);
  buyQueue.push(order6);
  return buyQueue;
};

const sorder = new Order(100, "SELL_CALL", new Date().toISOString());
const sorder1 = new Order(120, "SELL_STOP", new Date().toISOString());
const sorder2 = new Order(140, "SELL_STOP", new Date().toISOString());
const sorder3 = new Order(80, "SELL_STOP", new Date().toISOString());
const sorder4 = new Order(160, "SELL_STOP", new Date().toISOString());
const sorder5 = new Order(70, "SELL_STOP", new Date().toISOString());
const sorder6 = new Order(100, "SELL_CALL", new Date().toISOString());

const constructSellOrderQueue = () => {
  const sellQueue = new PriorityQueue(
    Exchange.INCREASING_PRICE_COMPARATOR,
    Order.equals
  );

  sellQueue.push(sorder);
  sellQueue.push(sorder1);
  sellQueue.push(sorder2);
  sellQueue.push(sorder3);
  sellQueue.push(sorder4);
  sellQueue.push(sorder5);
  sellQueue.push(sorder6);
  return sellQueue;
};

test("Creates an Exchange", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );

  expect(exchange.buyOrders).toBeTruthy();
  expect(exchange.sellOrders).toBeTruthy();
  expect(exchange.buyOrders.size() == 0).toBeTruthy();
  expect(exchange.sellOrders.size() == 0).toBeTruthy();
});

test("Submits Buy Order", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );
  const buyOrder = new Order(170, "BUY_CALL", new Date().toISOString());
  exchange.submitBuyOrder(buyOrder, user1);

  expect(exchange.buyOrders.size() == 1).toBeTruthy();
  expect(exchange.buyOrders.pop().equals(buyOrder)).toBeTruthy();
  expect(exchange.buyOrders.size() == 0).toBeTruthy();
});

test("Submits Sell Order", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );
  const sellOrder = new Order(170, "SELL_CALL", new Date().toISOString());
  exchange.submitSellOrder(sellOrder, user1);

  expect(exchange.sellOrders.size() == 1).toBeTruthy();
  expect(exchange.sellOrders.pop().equals(sellOrder)).toBeTruthy();
  expect(exchange.sellOrders.size() == 0).toBeTruthy();
});

test("Returns proper bid ask spread", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );
  const sellOrder = new Order(170, "SELL_CALL", new Date().toISOString());
  exchange.submitSellOrder(sellOrder, user1);
  const buyOrder = new Order(160, "SELL_CALL", new Date().toISOString());
  exchange.submitBuyOrder(buyOrder, user1);

  expect(exchange.getAsk() == 170).toBeTruthy();
  expect(exchange.getBid() == 160).toBeTruthy();
});

test("Fills Matching Orders: Same Price, Same Quantity", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );
  const sellOrder = new Order(170, "SELL_CALL", new Date().toISOString(), 1);
  exchange.submitSellOrder(sellOrder, user1);
  const buyOrder = new Order(170, "SELL_CALL", new Date().toISOString(), 1);
  exchange.submitBuyOrder(buyOrder, user1);

  expect(exchange.sellOrders.size() == 0).toBeTruthy();
  expect(exchange.buyOrders.size() == 0).toBeTruthy();
  expect(exchange.filledOrders.length == 2).toBeTruthy();
});

test("Fills Matching Orders: Same Price, Different Quantity", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );
  const sellOrder = new Order(170, "SELL_CALL", new Date().toISOString(), 2);
  exchange.submitSellOrder(sellOrder, user1);
  const buyOrder = new Order(170, "BUY_CALL", new Date().toISOString(), 1);
  exchange.submitBuyOrder(buyOrder, user1);

  expect(exchange.sellOrders.size() == 1).toBeTruthy();
  expect(exchange.buyOrders.size() == 0).toBeTruthy();
  expect(exchange.filledOrders.length == 1).toBeTruthy();
});

test("Fills Matching Orders: Same Price, Same Quantity", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );
  const sellOrder = new Order(170, "SELL_CALL", new Date().toISOString(), 2);
  exchange.submitSellOrder(sellOrder, user1);
  const buyOrder = new Order(170, "BUY_CALL", new Date().toISOString(), 1);
  exchange.submitBuyOrder(buyOrder, user1);
  const buyOrder1 = new Order(180, "BUY_CALL", new Date().toISOString(), 1);
  exchange.submitBuyOrder(buyOrder1, user1);

  expect(exchange.sellOrders.size() == 0).toBeTruthy();
  expect(exchange.buyOrders.size() == 0).toBeTruthy();
  expect(exchange.filledOrders.length == 3).toBeTruthy();
});

test("Fills Matching Orders: Different Quantity, Different Prices", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );

  const sellOrder = new Order(170, "SELL_CALL", new Date().toISOString(), 20);
  exchange.submitSellOrder(sellOrder, user1);
  const buyOrder = new Order(170, "BUY_CALL", new Date().toISOString(), 15);
  exchange.submitBuyOrder(buyOrder, user1);
  const buyOrder1 = new Order(180, "BUY_CALL", new Date().toISOString(), 2);
  exchange.submitBuyOrder(buyOrder1, user1);
  const buyOrder2 = new Order(180, "BUY_CALL", new Date().toISOString(), 3);
  exchange.submitBuyOrder(buyOrder2, user1);

  expect(exchange.sellOrders.size() == 0).toBeTruthy();
  expect(exchange.buyOrders.size() == 0).toBeTruthy();
  expect(exchange.filledOrders.length == 4).toBeTruthy();
});

test("Fills Matching Orders: Different Quantity, Different Prices, filled Orders is ok", () => {
  const exchange = new Exchange(
    "AMZN",
    new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR),
    new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR)
  );

  const sellOrder = new Order(170, "SELL_CALL", new Date().toISOString(), 20);
  exchange.submitSellOrder(sellOrder, user1);
  const buyOrder = new Order(170, "BUY_CALL", new Date().toISOString(), 15);
  exchange.submitBuyOrder(buyOrder, user1);
  const buyOrder1 = new Order(180, "BUY_CALL", new Date().toISOString(), 2);
  exchange.submitBuyOrder(buyOrder1, user1);
  const buyOrder2 = new Order(180, "BUY_CALL", new Date().toISOString(), 3);
  exchange.submitBuyOrder(buyOrder2, user1);

  expect(exchange.sellOrders.size() == 0).toBeTruthy();
  expect(exchange.buyOrders.size() == 0).toBeTruthy();
  expect(exchange.filledOrders.length == 4).toBeTruthy();

  expect(exchange.filledOrders[0].equals(buyOrder)).toBeTruthy();
  expect(exchange.filledOrders[1].equals(buyOrder1)).toBeTruthy();
});
