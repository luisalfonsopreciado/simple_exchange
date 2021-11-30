const top = 0;
const parent = (i) => ((i + 1) >>> 1) - 1;
const left = (i) => (i << 1) + 1;
const right = (i) => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b, equals = (a, b) => a == b) {
    this._heap = [];
    this._comparator = comparator;
    this._equals = equals;
  }

  /**
   * Returns the size of the Priority Queue.
   * @returns
   */
  size() {
    return this._heap.length;
  }

  /**
   * Returns true if the Priority Queue is empty, false otherwise.
   * @returns
   */
  isEmpty() {
    return this.size() == 0;
  }

  /**
   * Returns the element with the highest priority in the queue without removal.
   * @returns
   */
  peek() {
    return this._heap[top];
  }

  /**
   * Inserts a new element into the priority queue.
   * @param  {...Object} values
   * @returns
   */
  push(...values) {
    values.forEach((value) => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }

  /**
   * Removes the element with the highest priority in the queue.
   * @returns
   */
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top) {
      this._swap(top, bottom);
    }
    this._heap.pop();
    this._siftDown(top);
    return poppedValue;
  }

  /**
   * Replaces the element with the highest priority with the input value.
   * @param {Object} value
   * @returns
   */
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top] = value;
    this._siftDown(top);
    return replacedValue;
  }

  /**
   * Removes a particular element in the priority queue.
   * @param {Object} value
   * @returns
   */
  remove(value) {
    for (let idx in this._heap) {
      if (this._equals(value, this._heap[idx])) {
        const bottom = this.size() - 1;
        this._swap(idx, bottom);
        this._heap.pop();
        if (bottom != idx) {
          this._siftDown(idx);
        }
        return;
      }
    }
  }

  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }

  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }

  _siftUp() {
    let node = this.size() - 1;
    while (node > top && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  
  _siftDown(node) {
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild =
        right(node) < this.size() && this._greater(right(node), left(node))
          ? right(node)
          : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}

module.exports = { PriorityQueue };
