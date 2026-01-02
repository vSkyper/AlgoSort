import { SortGenerator } from 'interfaces/types';

// Helper to yield state
function yieldState(
  array: number[],
  activeIndices: number[],
  sortedIndices: number[],
  pivotIndex?: number
) {
  return {
    array: [...array],
    activeIndices: [...activeIndices],
    sortedIndices: [...sortedIndices],
    pivotIndex,
  };
}

// Helper to dynamically calculate sorted suffix (elements at the end that are in final position)
function getSortedSuffixIndices(arr: number[]): number[] {
  const n = arr.length;
  const sortedIndices: number[] = [];

  // 1. Precompute running maximums from the left
  // maxLeft[i] contains the maximum value in arr[0...i-1]
  const maxLeft = new Array(n).fill(-Infinity);
  let curMax = -Infinity;
  for (let i = 0; i < n; i++) {
    maxLeft[i] = curMax;
    curMax = Math.max(curMax, arr[i]);
  }

  // 2. Precompute running minimums from the right
  // minRight[i] contains the minimum value in arr[i+1...n-1]
  const minRight = new Array(n).fill(Infinity);
  let curMin = Infinity;
  for (let i = n - 1; i >= 0; i--) {
    minRight[i] = curMin;
    curMin = Math.min(curMin, arr[i]);
  }

  // 3. Identify elements that are in their sorted position
  // An element at i is sorted if it is >= everything to the left AND <= everything to the right
  const isSortedPos = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (arr[i] >= maxLeft[i] && arr[i] <= minRight[i]) {
      isSortedPos[i] = true;
    }
  }

  // 4. We only want to visualize the contiguous block at the end of the array
  // So we scan backwards from n-1 and stop as soon as we hit a non-sorted element
  for (let i = n - 1; i >= 0; i--) {
    if (isSortedPos[i]) {
      sortedIndices.push(i);
    } else {
      break; // Stop at the first unsorted element from the right
    }
  }

  return sortedIndices;
}

// --- Basic Sorts ---

export function* bubbleSort(arr: number[]): SortGenerator {
  const n = arr.length;
  let sortedIndices: number[] = [];
  let swapped = true;

  for (let i = 0; i < n; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield yieldState(arr, [j, j + 1], sortedIndices);

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        yield yieldState(arr, [j, j + 1], sortedIndices);
      }
    }
    sortedIndices.push(n - i - 1);
    if (!swapped) break;
  }
  for (let i = 0; i < n; i++)
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  yield yieldState(arr, [], sortedIndices);
}

export function* selectionSort(arr: number[]): SortGenerator {
  const n = arr.length;
  const sortedIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield yieldState(arr, [i, j, minIdx], sortedIndices);
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield yieldState(arr, [i, minIdx], sortedIndices);
    }
    sortedIndices.push(i);
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: n }, (_, i) => i)
  );
}

export function* insertionSort(arr: number[]): SortGenerator {
  const n = arr.length;
  // Visualizing the sorted partition 0..i-1 growing
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    // Indices 0 to i-1 are considered "sorted" (relative to themselves)
    let sortedIndices = Array.from({ length: i }, (_, k) => k);

    yield yieldState(arr, [i, j], sortedIndices);
    while (j >= 0 && arr[j] > key) {
      yield yieldState(arr, [j, j + 1], sortedIndices);
      arr[j + 1] = arr[j];
      j = j - 1;
      const tempArr = [...arr];
      tempArr[j + 1] = key;
      yield yieldState(tempArr, [j + 1], sortedIndices);
    }
    arr[j + 1] = key;
    // After insertion, 0..i is sorted
    yield yieldState(
      arr,
      [j + 1],
      Array.from({ length: i + 1 }, (_, k) => k)
    );
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: n }, (_, i) => i)
  );
}

export function* gnomeSort(arr: number[]): SortGenerator {
  let index = 0;
  while (index < arr.length) {
    if (index === 0) index++;
    // Visualize sorted partition approx 0..index
    const sortedIndices = Array.from({ length: index }, (_, k) => k);

    yield yieldState(arr, [index, index - 1], sortedIndices);
    if (arr[index] >= arr[index - 1]) {
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      yield yieldState(arr, [index, index - 1], sortedIndices);
      index--;
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}

export function* cocktailShakerSort(arr: number[]): SortGenerator {
  let swapped = true;
  let start = 0;
  let end = arr.length;
  let sortedIndices: number[] = [];

  while (swapped) {
    swapped = false;
    for (let i = start; i < end - 1; ++i) {
      yield yieldState(arr, [i, i + 1], sortedIndices);
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        yield yieldState(arr, [i, i + 1], sortedIndices);
      }
    }
    sortedIndices.push(end - 1);
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end - 1; i >= start; i--) {
      yield yieldState(arr, [i, i + 1], sortedIndices);
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        yield yieldState(arr, [i, i + 1], sortedIndices);
      }
    }
    sortedIndices.push(start);
    start++;
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}

export function* combSort(arr: number[]): SortGenerator {
  let gap = arr.length;
  const shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < arr.length; i++) {
      // Use dynamic check to show green bars at the end
      const sortedIndices = getSortedSuffixIndices(arr);
      yield yieldState(arr, [i, i + gap], sortedIndices);

      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        sorted = false;
        yield yieldState(arr, [i, i + gap], sortedIndices);
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}

export function* oddEvenSort(arr: number[]): SortGenerator {
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < arr.length - 1; i += 2) {
      const sortedIndices = getSortedSuffixIndices(arr);
      yield yieldState(arr, [i, i + 1], sortedIndices);
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield yieldState(arr, [i, i + 1], sortedIndices);
      }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      const sortedIndices = getSortedSuffixIndices(arr);
      yield yieldState(arr, [i, i + 1], sortedIndices);
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield yieldState(arr, [i, i + 1], sortedIndices);
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}

// --- Efficient Sorts ---

export function* mergeSort(arr: number[]): SortGenerator {
  yield* mergeSortRecursive(arr, 0, arr.length - 1);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}
function* mergeSortRecursive(
  arr: number[],
  l: number,
  r: number
): SortGenerator {
  if (l >= r) return;
  const m = l + Math.floor((r - l) / 2);
  yield* mergeSortRecursive(arr, l, m);
  yield* mergeSortRecursive(arr, m + 1, r);
  yield* merge(arr, l, m, r);
}
function* merge(arr: number[], l: number, m: number, r: number): SortGenerator {
  const n1 = m - l + 1;
  const n2 = r - m;
  const L = arr.slice(l, m + 1);
  const R = arr.slice(m + 1, r + 1);
  let i = 0,
    j = 0,
    k = l;

  while (i < n1 && j < n2) {
    yield yieldState(arr, [k], [], k);
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    yield yieldState(arr, [k], [], k);
    k++;
  }
  while (i < n1) {
    yield yieldState(arr, [k], [], k);
    arr[k] = L[i];
    i++;
    k++;
  }
  while (j < n2) {
    yield yieldState(arr, [k], [], k);
    arr[k] = R[j];
    j++;
    k++;
  }
}

export function* quickSort(arr: number[]): SortGenerator {
  const sortedIndices: number[] = [];
  yield* quickSortRecursive(arr, 0, arr.length - 1, sortedIndices);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}
function* quickSortRecursive(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[]
): SortGenerator {
  if (low < high) {
    const pivotIndex = yield* partition(arr, low, high, sortedIndices);

    // Pivot is now finalized
    if (!sortedIndices.includes(pivotIndex)) sortedIndices.push(pivotIndex);
    yield yieldState(arr, [], sortedIndices);

    yield* quickSortRecursive(arr, low, pivotIndex - 1, sortedIndices);
    yield* quickSortRecursive(arr, pivotIndex + 1, high, sortedIndices);
  } else if (low === high) {
    if (!sortedIndices.includes(low)) sortedIndices.push(low);
    yield yieldState(arr, [], sortedIndices);
  }
}
function* partition(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[]
): Generator<any, number, any> {
  const pivot = arr[high];
  let i = low - 1;
  yield yieldState(arr, [high], sortedIndices, high);
  for (let j = low; j < high; j++) {
    yield yieldState(arr, [j, high], sortedIndices, high);
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield yieldState(arr, [i, j], sortedIndices, high);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield yieldState(arr, [i + 1, high], sortedIndices, i + 1);
  return i + 1;
}

export function* heapSort(arr: number[]): SortGenerator {
  const n = arr.length;
  let sortedIndices: number[] = [];
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--)
    yield* heapify(arr, n, i, sortedIndices);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    sortedIndices.push(i);
    yield yieldState(arr, [0, i], sortedIndices);
    yield* heapify(arr, i, 0, sortedIndices);
  }
  sortedIndices.push(0);
  yield yieldState(arr, [], sortedIndices);
}
function* heapify(
  arr: number[],
  n: number,
  i: number,
  sortedIndices: number[] = []
): SortGenerator {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[l] > arr[largest]) largest = l;
  if (r < n && arr[r] > arr[largest]) largest = r;
  if (largest !== i) {
    yield yieldState(arr, [i, largest], sortedIndices);
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield yieldState(arr, [i, largest], sortedIndices);
    yield* heapify(arr, n, largest, sortedIndices);
  }
}

export function* introSort(arr: number[]): SortGenerator {
  const maxDepth = Math.floor(Math.log2(arr.length)) * 2;
  yield* introSortRecursive(arr, 0, arr.length - 1, maxDepth);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}
function* introSortRecursive(
  arr: number[],
  low: number,
  high: number,
  depth: number
): SortGenerator {
  if (high - low < 16) {
    yield* insertionSortSub(arr, low, high);
  } else if (depth === 0) {
    yield* heapSortSub(arr, low, high);
  } else {
    // We can't easily pass sortedIndices here without changing signature significantly.
    // Keeping basic implementation for now.
    const pivot = yield* partition(arr, low, high, []);
    yield* introSortRecursive(arr, low, pivot - 1, depth - 1);
    yield* introSortRecursive(arr, pivot + 1, high, depth - 1);
  }
}
function* insertionSortSub(
  arr: number[],
  low: number,
  high: number
): SortGenerator {
  for (let i = low + 1; i <= high; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= low && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      yield yieldState(arr, [j + 1, i], []);
    }
    arr[j + 1] = key;
    yield yieldState(arr, [j + 1], []);
  }
}
function* heapSortSub(arr: number[], low: number, high: number): SortGenerator {
  const n = high - low + 1;
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapifySub(arr, n, i, low);
  }
  // Extract
  for (let i = n - 1; i > 0; i--) {
    [arr[low], arr[low + i]] = [arr[low + i], arr[low]];
    yield yieldState(arr, [low, low + i], []);
    yield* heapifySub(arr, i, 0, low);
  }
}
function* heapifySub(
  arr: number[],
  n: number,
  i: number,
  offset: number
): SortGenerator {
  let largest = i;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && arr[offset + l] > arr[offset + largest]) largest = l;
  if (r < n && arr[offset + r] > arr[offset + largest]) largest = r;
  if (largest !== i) {
    [arr[offset + i], arr[offset + largest]] = [
      arr[offset + largest],
      arr[offset + i],
    ];
    yield yieldState(arr, [offset + i, offset + largest], []);
    yield* heapifySub(arr, n, largest, offset);
  }
}

export function* timSort(arr: number[]): SortGenerator {
  const RUN = 32;
  const n = arr.length;
  for (let i = 0; i < n; i += RUN) {
    yield* insertionSortSub(arr, i, Math.min(i + RUN - 1, n - 1));
  }
  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      let mid = left + size - 1;
      let right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        yield* merge(arr, left, mid, right);
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}

export function* dualPivotQuickSort(arr: number[]): SortGenerator {
  const sortedIndices: number[] = [];
  yield* dualPivotQuickSortRecursive(arr, 0, arr.length - 1, sortedIndices);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}
function* dualPivotQuickSortRecursive(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[]
): SortGenerator {
  if (low < high) {
    if (arr[low] > arr[high]) {
      [arr[low], arr[high]] = [arr[high], arr[low]];
      yield yieldState(arr, [low, high], sortedIndices);
    }
    const [lp, rp] = yield* partitionDual(arr, low, high, sortedIndices);

    if (!sortedIndices.includes(lp)) sortedIndices.push(lp);
    if (!sortedIndices.includes(rp)) sortedIndices.push(rp);
    yield yieldState(arr, [], sortedIndices);

    yield* dualPivotQuickSortRecursive(arr, low, lp - 1, sortedIndices);
    yield* dualPivotQuickSortRecursive(arr, lp + 1, rp - 1, sortedIndices);
    yield* dualPivotQuickSortRecursive(arr, rp + 1, high, sortedIndices);
  } else if (low === high) {
    if (!sortedIndices.includes(low)) sortedIndices.push(low);
    yield yieldState(arr, [], sortedIndices);
  }
}
function* partitionDual(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[]
): Generator<any, [number, number], any> {
  let lp = arr[low];
  let rp = arr[high];
  let i = low + 1;
  let k = low + 1;
  let j = high - 1;
  yield yieldState(arr, [low, high], sortedIndices, low);

  while (k <= j) {
    yield yieldState(arr, [k, i, j], sortedIndices, low);
    if (arr[k] < lp) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      i++;
    } else if (arr[k] >= rp) {
      while (arr[j] > rp && k < j) j--;
      [arr[k], arr[j]] = [arr[j], arr[k]];
      j--;
      if (arr[k] < lp) {
        [arr[k], arr[i]] = [arr[i], arr[k]];
        i++;
      }
    }
    k++;
  }
  i--;
  j++;
  [arr[low], arr[i]] = [arr[i], arr[low]];
  [arr[high], arr[j]] = [arr[j], arr[high]];
  yield yieldState(arr, [i, j], sortedIndices, i);
  return [i, j];
}

// --- Distribution Sorts ---

export function* countingSort(arr: number[]): SortGenerator {
  if (arr.length === 0) return;
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;
  const count = new Array(range).fill(0);
  const output = new Array(arr.length).fill(0);

  // Count frequencies
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
    yield yieldState(arr, [i], []);
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
    yield yieldState(arr, [i], []);
  }

  const sortedIndices: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
    sortedIndices.push(i);
    yield yieldState(arr, [i], sortedIndices, i);
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}

export function* bucketSort(arr: number[]): SortGenerator {
  if (arr.length === 0) return;
  const bucketCount = 10;
  const max = Math.max(...arr, 100);
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  // Scatter
  for (let i = 0; i < arr.length; i++) {
    const bucketIdx = Math.floor((arr[i] / (max + 1)) * bucketCount);
    buckets[bucketIdx].push(arr[i]);
    yield yieldState(arr, [i], []);
  }

  // Sort buckets and Gather
  const sortedIndices: number[] = [];
  let idx = 0;
  for (let i = 0; i < bucketCount; i++) {
    buckets[i].sort((a, b) => a - b);
    for (let j = 0; j < buckets[i].length; j++) {
      arr[idx++] = buckets[i][j];
      sortedIndices.push(idx - 1);
      yield yieldState(arr, [idx - 1], sortedIndices, idx - 1);
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}

export function* radixSort(arr: number[]): SortGenerator {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const isLastPass = Math.floor(max / (exp * 10)) === 0;
    yield* countingSortRadix(arr, exp, isLastPass);
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}
function* countingSortRadix(
  arr: number[],
  exp: number,
  isLastPass: boolean
): SortGenerator {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const index = Math.floor(arr[i] / exp) % 10;
    count[index]++;
    yield yieldState(arr, [i], []);
  }
  for (let i = 1; i < 10; i++) count[i] += count[i - 1];

  for (let i = n - 1; i >= 0; i--) {
    const index = Math.floor(arr[i] / exp) % 10;
    output[count[index] - 1] = arr[i];
    count[index]--;
  }

  const sortedIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    if (isLastPass) sortedIndices.push(i);
    yield yieldState(arr, [i], isLastPass ? sortedIndices : []);
  }
}

// --- Fun Sorts ---

export function* bogoSort(arr: number[]): SortGenerator {
  const isSorted = (a: number[]) => {
    for (let i = 0; i < a.length - 1; i++) if (a[i] > a[i + 1]) return false;
    return true;
  };

  // Safety break after 500 iterations
  let attempts = 0;
  while (!isSorted(arr) && attempts < 500) {
    // Shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield yieldState(arr, [i, j], []);
    }
    attempts++;
  }
  yield yieldState(
    arr,
    [],
    isSorted(arr) ? Array.from({ length: arr.length }, (_, i) => i) : []
  );
}

export function* sleepSort(arr: number[]): SortGenerator {
  // Visualize Sleep Sort by iterating through 'time' (values)
  // and swapping matching elements to the sorted position.

  const max = Math.max(...arr);
  const sortedIndices: number[] = [];

  // Iterate 'time'
  for (let t = 0; t <= max; t++) {
    // Scan the unsorted portion of the array for the current time value
    // Note: multiple elements might share the same value
    for (let i = sortedIndices.length; i < arr.length; i++) {
      if (arr[i] === t) {
        // Visualize "waking up"
        yield yieldState(arr, [i], sortedIndices);

        // Move to correct position (swap with first unsorted index)
        const insertIndex = sortedIndices.length;
        if (i !== insertIndex) {
          [arr[insertIndex], arr[i]] = [arr[i], arr[insertIndex]];
          yield yieldState(arr, [insertIndex, i], sortedIndices);
        }

        sortedIndices.push(insertIndex);
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i)
  );
}
