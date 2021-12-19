const { PriorityQueue } = require("./data_structures/PriorityQueue");

class Exchange {
  /**
   *
   * @param {string} instrument
   * @param {PriorityQueue} buyOrders - PriorityQueue
   * @param {PriorityQueue} sellOrders - PriorityQueue
   */
  constructor(instrument, buyOrders, sellOrders) {
    this.instrument = instrument;
    this.buyOrders = buyOrders;
    this.sellOrders = sellOrders;
    this.filledOrders = [];
  }

  /**
   * Submits a buy order
   * @param {Order} buyOrder
   * @param {User} user
   */
  submitBuyOrder(buyOrder, user) {
    user.buyOrders.push(buyOrder);
    buyOrder.exchangeQuantity = buyOrder.quantity;
    this.buyOrders.push(buyOrder);
    this._fillMatchingOrders();
  }

  /**
   * Submits a sell order
   * @param {Order} sellOrder
   * @param {User} user
   */
  submitSellOrder(sellOrder, user) {
    user.sellOrders.push(sellOrder);
    sellOrder.exchangeQuantity = sellOrder.quantity;
    this.sellOrders.push(sellOrder);
    this._fillMatchingOrders();
  }

  /**
   * Fills matching orders, placing them in filledOrders array.
   */
  _fillMatchingOrders() {
    while (
      !this.buyOrders.isEmpty() &&
      !this.sellOrders.isEmpty() &&
      this.buyOrders.peek().price >= this.sellOrders.peek().price
    ) {
      const topBuyOrder = this.buyOrders.peek();
      const topSellOrder = this.sellOrders.peek();
      console.log(
        "[Order Filled] Buy Price: " +
          topBuyOrder.price +
          " Sell Price: " +
          topSellOrder.price +
          " Quantity: " +
          Math.min(topBuyOrder.exchangeQuantity, topSellOrder.exchangeQuantity)
      );
      if (topBuyOrder.exchangeQuantity < topSellOrder.exchangeQuantity) {
        topSellOrder.exchangeQuantity -= topBuyOrder.exchangeQuantity;
        this.filledOrders.push(this.buyOrders.pop());
      } else {
        topBuyOrder.exchangeQuantity -= topSellOrder.exchangeQuantity;
        topSellOrder.exchangeQuantity = 0;
        this.filledOrders.push(this.sellOrders.pop());
        if (topBuyOrder.exchangeQuantity == 0) {
          this.filledOrders.push(this.buyOrders.pop());
        }
      }
    }
  }

  /**
   *
   * @param {Order} buyOrder
   */
  cancelBuyOrder(buyOrder) {
    this.buyOrders.remove(buyOrder);
  }

  /**
   *
   * @param {*} sellOrder
   */
  cancelSellOrder(sellOrder) {
    this.buyOrders.remove(buyOrder);
  }

  /**
   * Returns the current market bid price.
   * @returns bidPrice
   */
  getBid() {
    return this.buyOrders.peek().price;
  }

  /**
   * Returns the current market ask price.
   * @returns askPrice
   */
  getAsk() {
    return this.sellOrders.peek().price;
  }

  getMarketDepth(numOrders) {
    const bids = {};

    // Get Bids
    for (let i = 0; i < Math.min(numOrders, this.sellOrders.heap.length); i++) {
      const price = this.sellOrders.heap[i].price;
      const exchangeQuantity = this.sellOrders.heap[i].exchangeQuantity;

      if (!bids[price]) {
        bids[price] = exchangeQuantity;
      } else {
        bids[price] += exchangeQuantity;
      }
    }

    const asks = {};

    // Get Asks
    for (let i = 0; i < Math.min(numOrders, this.buyOrders.heap.length); i++) {
      const price = this.buyOrders.heap[i].price;
      const exchangeQuantity = this.buyOrders.heap[i].exchangeQuantity;

      if (!asks[price]) {
        asks[price] = exchangeQuantity;
      } else {
        asks[price] += exchangeQuantity;
      }
    }
    
    const bidsArray = Object.keys(bids).map((price) => [
      Number(price),
      bids[price],
    ]);
    const asksArray = Object.keys(asks).map((price) => [
      Number(price),
      asks[price],
    ]);

    bidsArray.sort((a, b) => a[0] - b[0]);
    asksArray.sort((a, b) => b[0] - a[0]);

    return { bids: bidsArray, asks: asksArray };
  }
}

/**
 * Comparator that orders items with increasing prices.
 * Used in the buyOrderQueue.
 * @param {Order} o1
 * @param {Order} o2
 * @returns
 */
Exchange.INCREASING_PRICE_COMPARATOR = (o1, o2) => {
  return o1.price < o2.price;
};

/**
 * Comparator that orders items with decreasing prices.
 * Used in the sellOrderQueue.
 * @param {Order} o1
 * @param {Order} o2
 * @returns
 */
Exchange.DECREASING_PRICE_COMPARATOR = (o1, o2) => {
  return o1.price > o2.price;
};

module.exports = { Exchange };
