// Simple Min-Heap for tracking top URLs by click count
interface HeapItem {
  shortId: string;
  clicks: number;
  originalUrl: string;
}

export class MinHeap {
  private items: HeapItem[] = [];
  private maxSize: number;
  private shortIdIndex: Map<string, number> = new Map(); // Track shortId position for O(1) lookup

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  // Get parent index
  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  // Get left child index
  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  // Get right child index
  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  // Swap two items and update index map
  private swap(index1: number, index2: number): void {
    [this.items[index1], this.items[index2]] = [this.items[index2], this.items[index1]];
    this.shortIdIndex.set(this.items[index1].shortId, index1);
    this.shortIdIndex.set(this.items[index2].shortId, index2);
  }

  // Move item up to maintain heap property
  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.items[index].clicks < this.items[parentIndex].clicks) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  // Move item down to maintain heap property
  private sinkDown(index: number): void {
    while (true) {
      let smallest = index;
      const leftIndex = this.getLeftChildIndex(index);
      const rightIndex = this.getRightChildIndex(index);

      if (
        leftIndex < this.items.length &&
        this.items[leftIndex].clicks < this.items[smallest].clicks
      ) {
        smallest = leftIndex;
      }

      if (
        rightIndex < this.items.length &&
        this.items[rightIndex].clicks < this.items[smallest].clicks
      ) {
        smallest = rightIndex;
      }

      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else {
        break;
      }
    }
  }

  // Add or update item (prevents duplicates)
  add(item: HeapItem): void {
    // Check if shortId already exists in heap
    const existingIndex = this.shortIdIndex.get(item.shortId);

    if (existingIndex !== undefined) {
      // Update existing item
      const oldClicks = this.items[existingIndex].clicks;
      this.items[existingIndex] = item;

      // Re-heapify based on whether clicks increased or decreased
      if (item.clicks < oldClicks) {
        this.bubbleUp(existingIndex);
      } else if (item.clicks > oldClicks) {
        this.sinkDown(existingIndex);
      }
      return;
    }

    // Add new item if heap not full
    if (this.items.length < this.maxSize) {
      const newIndex = this.items.length;
      this.items.push(item);
      this.shortIdIndex.set(item.shortId, newIndex);
      this.bubbleUp(newIndex);
      return;
    }

    // Heap is full - replace root if new item has more clicks
    if (item.clicks > this.items[0].clicks) {
      this.shortIdIndex.delete(this.items[0].shortId);
      this.items[0] = item;
      this.shortIdIndex.set(item.shortId, 0);
      this.sinkDown(0);
    }
  }

  // Get all items sorted by clicks (highest first)
  getTopItems(): HeapItem[] {
    return [...this.items].sort((a, b) => b.clicks - a.clicks);
  }

  // Get heap size
  size(): number {
    return this.items.length;
  }

  // Clear heap
  clear(): void {
    this.items = [];
    this.shortIdIndex.clear();
  }
};

