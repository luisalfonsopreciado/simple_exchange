const { UUID } = require("./UUID");

class Order {
  static BUY_MARKET = "BUY_MARKET";

  static types = {
    [Order.BUY_MARKET]: true,
  };

  constructor(price, orderType, date, quantity = 1) {
    this.price = price;
    this.date = date;
    this.orderType = orderType;
    this.quantity = quantity;
    this.initialQuantity = quantity;
    this.id = UUID.createUUID();
  }

  /**
   * Compares with order.
   * @param {Order} o2
   * @returns
   */
  compareTo(o2) {
    if (!o2) return false;
    if (this.price != o2.price) return this.price - o2.price;
    return this.date - o2.date;
  }

  /**
   * Returns true if Orders is equal to o2
   * @param {Order} o2 Order
   */
  equals(o2) {
    if (!o2) return false;
    return (
      this.price == o2.price &&
      this.date == o2.date &&
      this.orderType == o2.orderType
    );
  }
}

/**
 * Compares two orders.
 * Returns false if either orders are falsy.
 * Returns true if o1.price > o2.price.
 * @param {Order} o1
 * @param {Order} o2
 * @returns
 */
Order.orderBuyComparator = (o1, o2) => {
  if (!o1 || !o2) return false;
  if (o1.price != o2.price) return o2.price < o1.price;
  return o1.date - o2.date;
};

Order.orderSellComparator = (o1, o2) => {
  if (!o1 || !o2) return false;
  if (o1.price != o2.price) return o2.price > o1.price;
  return o1.date - o2.date;
};

Order.equals = (o1, o2) => {
  return o1.id == o2.id;
};

Order.validate = (order) => {
  if (!order) return false;
  if (!order.price || typeof order.price != "number") {
    console.log("Invalid price");
    return false;
  }
  if (!order.orderType || Order.types[order.orderType] == undefined) {
    console.log("invalid orderType");
    return false;
  }
  if (!order.quantity || typeof order.quantity != "number") {
    console.log("invalid quantity");
    return false;
  }
  if (!order.date || typeof order.date != "string") {
    console.log("invalid Date");
    return false;
  }
  return true;
};

module.exports = { Order };
