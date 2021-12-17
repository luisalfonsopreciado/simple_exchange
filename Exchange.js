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
   */
  submitBuyOrder(buyOrder) {
    this.buyOrders.push(buyOrder);
    this._fillMatchingOrders();
    // console.log("Buy order submitted")
    // console.log(this.buyOrders);
  }

  /**
   * Submits a sell order
   * @param {Order} sellOrder
   */
  submitSellOrder(sellOrder) {
    this.sellOrders.push(sellOrder);
    this._fillMatchingOrders();
    // console.log("Sell order submitted")
    // console.log(this.sellOrders);
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
          Math.min(topBuyOrder.quantity, topSellOrder.quantity)
      );
      if (topBuyOrder.quantity < topSellOrder.quantity) {
        topSellOrder.quantity -= topBuyOrder.quantity;
        this.filledOrders.push(this.buyOrders.pop());
      } else {
        topBuyOrder.quantity -= topSellOrder.quantity;
        topSellOrder.quantity = 0;
        this.filledOrders.push(this.sellOrders.pop());
        if (topBuyOrder.quantity == 0) {
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
    const bids = [];

    let lastPriceIdx = -1;

    // Get Bids
    for (let i = 0; i < Math.min(numOrders, this.sellOrders.heap.length); i++) {
      const price = this.sellOrders.heap[i].price;
      const quantity = this.sellOrders.heap[i].quantity;

      if (lastPriceIdx == -1 || bids[lastPriceIdx].price != price) {
        lastPriceIdx++;
        bids.push({
          price,
          quantity,
        });
      } else {
        bids[lastPriceIdx].quantity += quantity;
      }
    }

    const asks = [];
    lastPriceIdx = -1;

    // Get Asks
    for (let i = 0; i < Math.min(numOrders, this.buyOrders.heap.length); i++) {
      const price = this.buyOrders.heap[i].price;
      const quantity = this.buyOrders.heap[i].quantity;

      if (lastPriceIdx == -1 || asks[lastPriceIdx].price != price) {
        lastPriceIdx++;
        asks.push({
          price,
          quantity,
        });
      } else {
        asks[lastPriceIdx].quantity += quantity;
      }
    }

    bids.sort((a, b) => a.price - b.price);
    asks.sort((a, b) => b.price - a.price);

    return { bids, asks };
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
