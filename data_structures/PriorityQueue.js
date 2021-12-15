const parent = (i) => ((i + 1) >>> 1) - 1;
const leftChild = (i) => 2 * i + 1;
const rightChild = (i) => 2 * i + 2;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b, equals = (a, b) => a == b) {
    this.heap = [];
    this.comparator = comparator;
    this.equals = equals;
    this.top = 0;
  }

  /**
   * Returns the size of the Priority Queue.
   * @returns size
   */
  size() {
    return this.heap.length;
  }

  /**
   * Returns true if the Priority Queue is empty, false otherwise.
   * @returns isEmpty
   */
  isEmpty() {
    return this.size() == 0;
  }

  /**
   * Returns the element with the highest priority in the queue without removal.
   * @returns top
   */
  peek() {
    return this.heap[this.top];
  }

  /**
   * Inserts a set new element into the priority queue.
   * @param  {...Object} values
   * @returns
   */
  push(...values) {
    values.forEach((value) => {
      this.heap.push(value);
      this.siftUp();
    });
    return this.size();
  }

  /**
   * Removes the element with the highest priority in the queue.
   * @returns poppedValue
   */
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > this.top) {
      this.swap(this.top, bottom);
    }
    this.heap.pop();
    this.siftDown(this.top);
    return poppedValue;
  }

  /**
   * Replaces the element with the highest priority with the input value.
   * @param {Object} value
   * @returns replacedValue
   */
  replace(value) {
    const replacedValue = this.peek();
    this.heap[this.top] = value;
    this.siftDown(this.top);
    return replacedValue;
  }

  /**
   * Removes a particular element in the priority queue.
   * @param {Object} value
   * @returns removedValue
   */
  remove(value) {
    for (let idx in this.heap) {
      if (this.equals(value, this.heap[idx])) {
        const bottom = this.size() - 1;
        this.swap(idx, bottom);
        this.heap.pop();
        if (bottom != idx) {
          this.siftDown(idx);
        }
        return;
      }
    }
  }

  /**
   * Returns true if element at index i is greater than
   * element at location j in the heap array.
   * @param {Number} i - index i
   * @param {Number} j - index j
   * @returns isGreater
   */
  greater(i, j) {
    return this.comparator(this.heap[i], this.heap[j]);
  }

  /**
   * Swaps two elements in an array.
   * @param {Number} i - index i
   * @param {Number} j - index j
   */
  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Sift up the last element in the heap.
   */
  siftUp() {
    let nodeIdx = this.size() - 1;
    while (nodeIdx > this.top && this.greater(nodeIdx, parent(nodeIdx))) {
      this.swap(nodeIdx, parent(nodeIdx));
      nodeIdx = parent(nodeIdx);
    }
  }

  /**
   * Sift an element down.
   * @param {Number} nodeIdx
   */
  siftDown(nodeIdx) {
    while (
      (leftChild(nodeIdx) < this.size() &&
        this.greater(leftChild(nodeIdx), nodeIdx)) ||
      (rightChild(nodeIdx) < this.size() &&
        this.greater(rightChild(nodeIdx), nodeIdx))
    ) {
      let maxChild =
        rightChild(nodeIdx) < this.size() &&
        this.greater(rightChild(nodeIdx), leftChild(nodeIdx))
          ? rightChild(nodeIdx)
          : leftChild(nodeIdx);
      this.swap(nodeIdx, maxChild);
      nodeIdx = maxChild;
    }
  }
}

module.exports = { PriorityQueue };
