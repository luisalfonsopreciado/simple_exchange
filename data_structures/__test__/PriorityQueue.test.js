const { PriorityQueue } = require("../PriorityQueue");
const { Order } = require("../../Order");
const { Exchange } = require("../../Exchange");
const { Random } = require("../../Random");

const order = new Order(100, "BUY_CALL", new Date().toISOString());
const order1 = new Order(120, "BUY_STOP", new Date().toISOString());
const order2 = new Order(140, "BUY_STOP", new Date().toISOString());
const order3 = new Order(80, "BUY_STOP", new Date().toISOString());
const order4 = new Order(160, "BUY_STOP", new Date().toISOString());
const order5 = new Order(70, "BUY_STOP", new Date().toISOString());
const order6 = new Order(100, "BUY_CALL", new Date().toISOString());

generateRandomBuyOrder = () => {
  return {
    price: Random.randBetween(1, 100),
    orderType: Order.BUY_MARKET,
    quantity: Random.randBetween(1, 100),
  };
};

generateRandomSellOrder = () => {
  return {
    price: Random.randBetween(1, 100),
    orderType: Order.SELL_MARKET,
    quantity: Random.randBetween(1, 100),
  };
};

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

const assertAscending = (sellQueue) => {
  if (sellQueue.isEmpty()) return;
  let top = sellQueue.pop();

  while (!sellQueue.isEmpty()) {
    const t = sellQueue.pop();
    expect(top.price - t.price <= 0).toBeTruthy();
    top = t;
  }
};

const assertDescending = (buyQueue) => {
  if (buyQueue.isEmpty()) return;
  let top = buyQueue.pop();

  while (!buyQueue.isEmpty()) {
    const t = buyQueue.pop();
    expect(top.price - t.price >= 0).toBeTruthy();
    top = t;
  }
};

test("Priority Queue ordering: descending", () => {
  const queue = new PriorityQueue();
  queue.push(10, 20, 30, 40, 50);
  let top = Infinity;
  while (!queue.isEmpty()) {
    const t = queue.pop();
    expect(top).toBeGreaterThanOrEqual(t);
    top = t;
  }
});

test("Priority Queue ordering: ascending", () => {
  const queue = new PriorityQueue((a, b) => a < b);
  queue.push(10, 20, 30, 40, 50);
  let top = -Infinity;
  while (!queue.isEmpty()) {
    const t = queue.pop();
    expect(top).toBeLessThanOrEqual(t);
    top = t;
  }
});

test("Priority Queue ordering: Buy Orders", () => {
  const buyQueue = constructBuyOrderQueue();

  let top = buyQueue.pop();

  while (!buyQueue.isEmpty()) {
    const t = buyQueue.pop();
    expect(top.price - t.price >= 0).toBeTruthy();
    top = t;
  }
});

test("Priority Queue ordering: Buy Orders Random", () => {
  const buyOrders = new PriorityQueue(Exchange.DECREASING_PRICE_COMPARATOR);

  for (let i = 0; i < 100; i++) {
    buyOrders.push(generateRandomBuyOrder());
  }

  let top = buyOrders.pop();

  while (!buyOrders.isEmpty()) {
    const t = buyOrders.pop();
    expect(top.price - t.price >= 0).toBeTruthy();
    top = t;
  }
});

test("Priority Queue ordering: Sell Orders", () => {
  const sellQueue = constructSellOrderQueue();

  let top = sellQueue.pop();

  while (!sellQueue.isEmpty()) {
    const t = sellQueue.pop();
    expect(top.price - t.price <= 0).toBeTruthy();
    top = t;
  }
});

test("Priority Queue ordering: Sell Orders Random", () => {
  const sellOrders = new PriorityQueue(Exchange.INCREASING_PRICE_COMPARATOR);

  for (let i = 0; i < 100; i++) {
    sellOrders.push(generateRandomSellOrder());
  }

  let top = sellOrders.pop();

  while (!sellOrders.isEmpty()) {
    const t = sellOrders.pop();
    expect(top.price - t.price <= 0).toBeTruthy();
    top = t;
  }
});

test("Priority Queue ordering with remove: Sell Orders", () => {
  let sellQueue = constructSellOrderQueue();
  sellQueue.remove(sorder);
  assertAscending(sellQueue);

  sellQueue = constructSellOrderQueue();
  sellQueue.remove(sorder1);
  assertAscending(sellQueue);

  sellQueue = constructSellOrderQueue();
  sellQueue.remove(sorder2);
  assertAscending(sellQueue);

  sellQueue = constructSellOrderQueue();
  sellQueue.remove(sorder3);
  assertAscending(sellQueue);

  sellQueue = constructSellOrderQueue();
  sellQueue.remove(sorder4);
  assertAscending(sellQueue);

  sellQueue = constructSellOrderQueue();
  sellQueue.remove(sorder5);
  assertAscending(sellQueue);

  sellQueue = constructSellOrderQueue();
  sellQueue.remove(sorder6);
  assertAscending(sellQueue);
});

test("Priority Queue Ordering with remove: Buy Orders", () => {
  let buyQueue = constructBuyOrderQueue();
  buyQueue.remove(order);
  assertDescending(buyQueue);

  buyQueue = constructBuyOrderQueue();
  buyQueue.remove(order1);
  assertDescending(buyQueue);

  buyQueue = constructBuyOrderQueue();
  buyQueue.remove(order2);
  assertDescending(buyQueue);

  buyQueue = constructBuyOrderQueue();
  buyQueue.remove(order3);
  assertDescending(buyQueue);

  buyQueue = constructBuyOrderQueue();
  buyQueue.remove(order4);
  assertDescending(buyQueue);

  buyQueue = constructBuyOrderQueue();
  buyQueue.remove(order5);
  assertDescending(buyQueue);

  buyQueue = constructBuyOrderQueue();
  buyQueue.remove(order6);
  assertDescending(buyQueue);
});
