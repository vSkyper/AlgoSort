import { SortGenerator } from 'interfaces/types';

const yieldState = (
  array: number[],
  activeIndices: number[],
  sortedIndices: number[],
  pivotIndex?: number,
  auxiliaryArray?: number[],
  metadata?: Record<string, any>
) => ({
  array: [...array],
  activeIndices: [...activeIndices],
  sortedIndices: [...sortedIndices],
  pivotIndex,
  auxiliaryArray: auxiliaryArray ? [...auxiliaryArray] : undefined,
  metadata,
});

// Helper to calculate sorted suffix indices
function getSortedSuffixIndices(arr: number[]): number[] {
  const n = arr.length;
  const sortedIndices: number[] = [];

  // Precompute maxLeft and minRight arrays
  const maxLeft = new Array(n).fill(-Infinity);
  let curMax = -Infinity;
  for (let i = 0; i < n; i++) {
    maxLeft[i] = curMax;
    curMax = Math.max(curMax, arr[i]);
  }

  const minRight = new Array(n).fill(Infinity);
  let curMin = Infinity;
  for (let i = n - 1; i >= 0; i--) {
    minRight[i] = curMin;
    curMin = Math.min(curMin, arr[i]);
  }

  const isSortedPos = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    if (arr[i] >= maxLeft[i] && arr[i] <= minRight[i]) {
      isSortedPos[i] = true;
    }
  }

  for (let i = n - 1; i >= 0; i--) {
    if (isSortedPos[i]) {
      sortedIndices.push(i);
    } else {
      break;
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
      yield yieldState(arr, [j, j + 1], sortedIndices, undefined, undefined, {
        description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
        type: 'compare',
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
        yield yieldState(arr, [j, j + 1], sortedIndices, undefined, undefined, {
          description: `Swapping ${arr[j]} and ${arr[j + 1]}`,
          type: 'swap',
        });
      }
    }
    sortedIndices.push(n - i - 1);
    if (!swapped) break;
  }
  for (let i = 0; i < n; i++)
    if (!sortedIndices.includes(i)) sortedIndices.push(i);
  yield yieldState(arr, [], sortedIndices, undefined, undefined, {
    description: 'Sorting completed',
    type: 'success',
  });
}

export function* selectionSort(arr: number[]): SortGenerator {
  const n = arr.length;
  const sortedIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield yieldState(
        arr,
        [i, j, minIdx],
        sortedIndices,
        undefined,
        undefined,
        {
          description: `Comparing ${arr[j]} and current min ${arr[minIdx]}`,
          type: 'compare',
        }
      );
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield yieldState(arr, [i, minIdx], sortedIndices, undefined, undefined, {
        description: `Swapping minimum ${arr[minIdx]} and ${arr[i]}`,
        type: 'swap',
      });
    }
    sortedIndices.push(i);
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}

export function* insertionSort(arr: number[]): SortGenerator {
  const n = arr.length;
  // Visualizing the sorted partition 0..i-1 growing
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    // Indices 0 to i are strictly sorted (or processing i into sorted part)
    let sortedIndices = Array.from({ length: i + 1 }, (_, k) => k);

    yield yieldState(arr, [i, j], sortedIndices, undefined, undefined, {
      description: `Selected ${key} to insert`,
      type: 'info',
    });
    while (j >= 0 && arr[j] > key) {
      yield yieldState(arr, [j, j + 1], sortedIndices, undefined, undefined, {
        description: `Moving ${arr[j]} to position ${j + 1}`,
        type: 'move',
      });
      arr[j + 1] = arr[j];
      j = j - 1;
      const tempArr = [...arr];
      tempArr[j + 1] = key;
      yield yieldState(tempArr, [j + 1], sortedIndices, undefined, undefined, {
        description: `Moving ${arr[j + 1]} to position ${j + 1}`,
        type: 'move',
      });
    }
    arr[j + 1] = key;
    // After insertion, 0..i is sorted
    yield yieldState(
      arr,
      [j + 1],
      Array.from({ length: i + 1 }, (_, k) => k),
      undefined,
      undefined,
      { description: `Inserted ${key} at position ${j + 1}`, type: 'move' }
    );
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: n }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}

export function* gnomeSort(arr: number[]): SortGenerator {
  let index = 0;
  let sortedBoundary = 0;

  while (index < arr.length) {
    if (index === 0) index++;
    sortedBoundary = Math.max(sortedBoundary, index);

    // Visualize sorted partition 0..sortedBoundary
    const sortedIndices = Array.from(
      { length: sortedBoundary + 1 },
      (_, k) => k
    );

    yield yieldState(
      arr,
      [index, index - 1],
      sortedIndices,
      undefined,
      undefined,
      {
        description: `Comparing ${arr[index]} and ${arr[index - 1]}`,
        type: 'compare',
      }
    );
    if (arr[index] >= arr[index - 1]) {
      index++;
    } else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      yield yieldState(
        arr,
        [index, index - 1],
        sortedIndices,
        undefined,
        undefined,
        {
          description: `Swapping ${arr[index]} and ${arr[index - 1]}`,
          type: 'swap',
        }
      );
      index--;
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}

export function* cocktailShakerSort(arr: number[]): SortGenerator {
  let swapped = true;
  let start = 0;
  let end = arr.length;
  let sortedIndices: number[] = [];

  while (swapped) {
    swapped = false;
    // Forward pass
    for (let i = start; i < end - 1; ++i) {
      yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
        description: `Forward pass: Comparing ${arr[i]} and ${arr[i + 1]}`,
        type: 'compare',
      });
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
          description: `Forward pass: Swapping ${arr[i]} and ${arr[i + 1]}`,
          type: 'swap',
        });
      }
    }
    sortedIndices.push(end - 1);
    if (!swapped) break;
    swapped = false;
    end--;
    // Backward pass
    for (let i = end - 1; i >= start; i--) {
      yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
        description: `Backward pass: Comparing ${arr[i]} and ${arr[i + 1]}`,
        type: 'compare',
      });
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
          description: `Backward pass: Swapping ${arr[i]} and ${arr[i + 1]}`,
          type: 'swap',
        });
      }
    }
    sortedIndices.push(start);
    start++;
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
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
      const sortedIndices = getSortedSuffixIndices(arr);
      yield yieldState(arr, [i, i + gap], sortedIndices, undefined, undefined, {
        description: `Gap ${gap}: Comparing ${arr[i]} and ${arr[i + gap]}`,
        type: 'compare',
      });

      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        sorted = false;
        yield yieldState(
          arr,
          [i, i + gap],
          sortedIndices,
          undefined,
          undefined,
          {
            description: `Gap ${gap}: Swapping ${arr[i]} and ${arr[i + gap]}`,
            type: 'swap',
          }
        );
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}

export function* oddEvenSort(arr: number[]): SortGenerator {
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < arr.length - 1; i += 2) {
      const sortedIndices = getSortedSuffixIndices(arr);
      yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
        description: `Odd Phase: Comparing ${arr[i]} and ${arr[i + 1]}`,
        type: 'compare',
      });
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
          description: `Odd Phase: Swapping ${arr[i]} and ${arr[i + 1]}`,
          type: 'swap',
        });
      }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      const sortedIndices = getSortedSuffixIndices(arr);
      yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
        description: `Even Phase: Comparing ${arr[i]} and ${arr[i + 1]}`,
        type: 'compare',
      });
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
        yield yieldState(arr, [i, i + 1], sortedIndices, undefined, undefined, {
          description: `Even Phase: Swapping ${arr[i]} and ${arr[i + 1]}`,
          type: 'swap',
        });
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}

// --- Efficient Sorts ---

export function* mergeSort(arr: number[]): SortGenerator {
  const sortedIndices: number[] = [];
  yield* mergeSortRecursive(arr, 0, arr.length - 1, sortedIndices);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}
function* mergeSortRecursive(
  arr: number[],
  l: number,
  r: number,
  sortedIndices: number[]
): SortGenerator {
  if (l >= r) return;
  const m = l + Math.floor((r - l) / 2);
  yield* mergeSortRecursive(arr, l, m, sortedIndices);
  yield* mergeSortRecursive(arr, m + 1, r, sortedIndices);
  yield* merge(arr, l, m, r, sortedIndices);
}
function* merge(
  arr: number[],
  l: number,
  m: number,
  r: number,
  sortedIndices: number[] = []
): SortGenerator {
  const n1 = m - l + 1;
  const n2 = r - m;
  const L = arr.slice(l, m + 1);
  const R = arr.slice(m + 1, r + 1);
  let i = 0,
    j = 0,
    k = l;

  // Re-sorting range [l...r]
  const range = new Set(Array.from({ length: r - l + 1 }, (_, idx) => l + idx));
  const baseSorted = sortedIndices.filter((idx) => !range.has(idx));

  // Track indices that become sorted during this merge
  const activeMergeSorted: number[] = [];

  while (i < n1 && j < n2) {
    yield yieldState(
      arr,
      [k],
      [...baseSorted, ...activeMergeSorted],
      k,
      undefined,
      {
        description: `Comparing ${L[i]} and ${R[j]}`,
        type: 'compare',
      }
    );
    if (L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    // Element at k is now sorted relative to this merge
    activeMergeSorted.push(k);
    yield yieldState(
      arr,
      [k],
      [...baseSorted, ...activeMergeSorted],
      k,
      undefined,
      { description: `Placed ${arr[k]} at position ${k}`, type: 'move' }
    );
    k++;
  }
  while (i < n1) {
    yield yieldState(
      arr,
      [k],
      [...baseSorted, ...activeMergeSorted],
      k,
      undefined,
      { description: `Copying ${L[i]} to position ${k}`, type: 'move' }
    );
    arr[k] = L[i];
    i++;
    activeMergeSorted.push(k);
    // Yield after assignment to show the placement
    yield yieldState(
      arr,
      [k],
      [...baseSorted, ...activeMergeSorted],
      k,
      undefined,
      { description: `Placed ${arr[k]} at position ${k}`, type: 'move' }
    );
    k++;
  }
  while (j < n2) {
    yield yieldState(
      arr,
      [k],
      [...baseSorted, ...activeMergeSorted],
      k,
      undefined,
      { description: `Copying ${R[j]} to position ${k}`, type: 'move' }
    );
    arr[k] = R[j];
    j++;
    activeMergeSorted.push(k);
    yield yieldState(
      arr,
      [k],
      [...baseSorted, ...activeMergeSorted],
      k,
      undefined,
      { description: `Placed ${arr[k]} at position ${k}`, type: 'move' }
    );
    k++;
  }

  // Update global sortedIndices reference
  for (let idx = l; idx <= r; idx++) {
    if (!sortedIndices.includes(idx)) sortedIndices.push(idx);
  }
}

export function* quickSort(arr: number[]): SortGenerator {
  const sortedIndices: number[] = [];
  yield* quickSortRecursive(arr, 0, arr.length - 1, sortedIndices);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
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
  yield yieldState(arr, [high], sortedIndices, high, undefined, {
    description: `Selected pivot: ${pivot}`,
    type: 'info',
  });
  for (let j = low; j < high; j++) {
    yield yieldState(arr, [j, high], sortedIndices, high, undefined, {
      description: `Comparing ${arr[j]} and pivot ${pivot}`,
      type: 'compare',
    });
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      yield yieldState(arr, [i, j], sortedIndices, high, undefined, {
        description: `Swapping ${arr[i]} and ${arr[j]} (smaller than pivot)`,
        type: 'swap',
      });
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  yield yieldState(arr, [i + 1, high], sortedIndices, i + 1, undefined, {
    description: `Placed pivot ${pivot} at position ${i + 1}`,
    type: 'move',
  });
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
    yield yieldState(arr, [0, i], sortedIndices, undefined, undefined, {
      description: `Moved max ${arr[i]} to position ${i}`,
      type: 'move',
    });
    yield* heapify(arr, i, 0, sortedIndices);
  }
  sortedIndices.push(0);
  yield yieldState(arr, [], sortedIndices, undefined, undefined, {
    description: 'Sorting completed',
    type: 'success',
  });
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
    yield yieldState(arr, [i, largest], sortedIndices, undefined, undefined, {
      description: `Heapifying: Swapping parent ${arr[i]} and child ${arr[largest]}`,
      type: 'compare', // It's comparison + decision to swap really, but swap happens next
    });
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    yield yieldState(arr, [i, largest], sortedIndices, undefined, undefined, {
      description: `Swapped. Continuing heapify`,
      type: 'swap',
    });
    yield* heapify(arr, n, largest, sortedIndices);
  }
}

export function* introSort(arr: number[]): SortGenerator {
  const maxDepth = Math.floor(Math.log2(arr.length)) * 2;
  const sortedIndices: number[] = [];
  yield* introSortRecursive(arr, 0, arr.length - 1, maxDepth, sortedIndices);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}
function* introSortRecursive(
  arr: number[],
  low: number,
  high: number,
  depth: number,
  sortedIndices: number[]
): SortGenerator {
  if (high - low < 16) {
    yield* insertionSortSub(arr, low, high, sortedIndices);
    // Mark range as sorted
    for (let i = low; i <= high; i++) {
      if (!sortedIndices.includes(i)) sortedIndices.push(i);
    }
    yield yieldState(arr, [], sortedIndices, undefined, undefined, {
      description: `Insertion Sort completed for range [${low}, ${high}]`,
      type: 'info',
    });
  } else if (depth === 0) {
    yield* heapSortSub(arr, low, high, sortedIndices);
    // Mark range as sorted
    for (let i = low; i <= high; i++) {
      if (!sortedIndices.includes(i)) sortedIndices.push(i);
    }
    yield yieldState(arr, [], sortedIndices, undefined, undefined, {
      description: `Heap Sort completed for range [${low}, ${high}]`,
      type: 'info',
    });
  } else {
    const pivot = yield* partition(arr, low, high, sortedIndices);
    if (!sortedIndices.includes(pivot)) sortedIndices.push(pivot);
    yield yieldState(arr, [], sortedIndices, undefined, undefined, {
      description: `Partitioned at index ${pivot}`,
      type: 'info',
    });

    yield* introSortRecursive(arr, low, pivot - 1, depth - 1, sortedIndices);
    yield* introSortRecursive(arr, pivot + 1, high, depth - 1, sortedIndices);
  }
}
function* insertionSortSub(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[] = []
): SortGenerator {
  for (let i = low + 1; i <= high; i++) {
    let key = arr[i];
    let j = i - 1;

    // Calculate locally sorted indices: low to i
    const localSorted = Array.from({ length: i - low }, (_, k) => k + low);
    const currentSorted = [...sortedIndices, ...localSorted];

    while (j >= low && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      yield yieldState(arr, [j + 1, i], currentSorted, undefined, undefined, {
        description: `Moving ${arr[j]} to position ${j + 1}`,
        type: 'move',
      });
    }
    arr[j + 1] = key;
    yield yieldState(
      arr,
      [j + 1],
      [...currentSorted, i],
      undefined,
      undefined,
      {
        description: `Inserted ${key} at position ${j + 1}`,
        type: 'move',
      }
    );
  }
}
function* heapSortSub(
  arr: number[],
  low: number,
  high: number,
  sortedIndices: number[] = []
): SortGenerator {
  const n = high - low + 1;
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapifySub(arr, n, i, low, sortedIndices);
  }

  const localSortedSuffix: number[] = [];

  // Extract
  for (let i = n - 1; i > 0; i--) {
    [arr[low], arr[low + i]] = [arr[low + i], arr[low]];
    localSortedSuffix.push(low + i);

    // Merge global sorted indices with locally sorted suffix
    const currentSorted = [...sortedIndices, ...localSortedSuffix];

    yield yieldState(arr, [low, low + i], currentSorted, undefined, undefined, {
      description: `Moved max element to end of heap section`,
      type: 'move',
    });
    yield* heapifySub(arr, i, 0, low, currentSorted);
  }
  localSortedSuffix.push(low);
  yield yieldState(
    arr,
    [],
    [...sortedIndices, ...localSortedSuffix],
    undefined,
    undefined,
    {
      description: `Heap Sort phase finished`,
      type: 'info',
    }
  );
}
function* heapifySub(
  arr: number[],
  n: number,
  i: number,
  offset: number,
  sortedIndices: number[] = []
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
    yield yieldState(
      arr,
      [offset + i, offset + largest],
      sortedIndices,
      undefined,
      undefined,
      {
        description: `Heapifying: Swapping parent with larger child`,
        type: 'swap',
      }
    );
    yield* heapifySub(arr, n, largest, offset, sortedIndices);
  }
}

export function* timSort(arr: number[]): SortGenerator {
  const RUN = 32;
  const n = arr.length;
  const sortedIndices: number[] = [];

  for (let i = 0; i < n; i += RUN) {
    yield* insertionSortSub(
      arr,
      i,
      Math.min(i + RUN - 1, n - 1),
      sortedIndices
    );
    // Mark run as sorted
    const runEnd = Math.min(i + RUN - 1, n - 1);
    for (let k = i; k <= runEnd; k++) {
      if (!sortedIndices.includes(k)) sortedIndices.push(k);
    }
  }
  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      let mid = left + size - 1;
      let right = Math.min(left + 2 * size - 1, n - 1);
      if (mid < right) {
        yield* merge(arr, left, mid, right, sortedIndices);
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}

export function* dualPivotQuickSort(arr: number[]): SortGenerator {
  const sortedIndices: number[] = [];
  yield* dualPivotQuickSortRecursive(arr, 0, arr.length - 1, sortedIndices);
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
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
      yield yieldState(arr, [low, high], sortedIndices, undefined, undefined, {
        description: `Ensuring left pivot ${arr[low]} < right pivot ${arr[high]}`,
        type: 'swap',
      });
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
    yield yieldState(arr, [], sortedIndices, undefined, undefined, {
      description: `Element ${arr[low]} is sorted`,
      type: 'info',
    });
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
  yield yieldState(arr, [low, high], sortedIndices, low, undefined, {
    description: `Selected pivots: ${lp} and ${rp}`,
    type: 'info',
  });

  while (k <= j) {
    yield yieldState(arr, [k, i, j], sortedIndices, low, undefined, {
      description: `Comparing ${arr[k]} with pivots ${lp} and ${rp}`,
      type: 'compare',
    });
    if (arr[k] < lp) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      yield yieldState(arr, [k, i], sortedIndices, low, undefined, {
        description: `Moving ${arr[i]} to left partition`,
        type: 'swap',
      });
      i++;
    } else if (arr[k] >= rp) {
      while (arr[j] > rp && k < j) j--;
      [arr[k], arr[j]] = [arr[j], arr[k]];
      yield yieldState(arr, [k, j], sortedIndices, low, undefined, {
        description: `Moving ${arr[k]} to right partition`,
        type: 'swap',
      });
      j--;
      if (arr[k] < lp) {
        [arr[k], arr[i]] = [arr[i], arr[k]];
        yield yieldState(arr, [k, i], sortedIndices, low, undefined, {
          description: `Moving ${arr[i]} to left partition`,
          type: 'swap',
        });
        i++;
      }
    }
    k++;
  }
  i--;
  j++;
  [arr[low], arr[i]] = [arr[i], arr[low]];
  [arr[high], arr[j]] = [arr[j], arr[high]];
  yield yieldState(arr, [i, j], sortedIndices, i, undefined, {
    description: `Placed pivots ${lp} and ${rp} at final positions`,
    type: 'swap',
  });
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
    yield yieldState(arr, [i], [], undefined, count, {
      min,
      max,
      description: `Counting occurrences of ${arr[i]}`,
      type: 'info',
    });
  }

  for (let i = 1; i < count.length; i++) {
    count[i] += count[i - 1];
  }
  yield yieldState(arr, [], [], undefined, count, {
    min,
    max,
    description: 'Accumulating counts (calculating positions)',
    type: 'info',
  });

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i] - min] - 1] = arr[i];
    count[arr[i] - min]--;
    yield yieldState(arr, [i], [], undefined, count, {
      min,
      max,
      description: `Placed ${arr[i]} at position ${count[arr[i] - min]}`,
      type: 'move',
    });
  }

  const sortedIndices: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    arr[i] = output[i];
    sortedIndices.push(i);
    yield yieldState(arr, [i], sortedIndices, i, count, {
      min,
      max,
      description: 'Copying sorted array',
      type: 'move',
    });
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    count, // Preserve count array to show table
    { description: 'Sorting completed', type: 'success', min, max }
  );
}

export function* bucketSort(arr: number[]): SortGenerator {
  if (arr.length === 0) return;
  const bucketCount = 10;
  const max = Math.max(...arr, 100);

  // 1. Scatter
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);
  for (let i = 0; i < arr.length; i++) {
    const bucketIdx = Math.floor((arr[i] / (max + 1)) * bucketCount);
    buckets[bucketIdx].push(arr[i]);
    yield yieldState(arr, [i], [], undefined, undefined, {
      description: `Scattering: Placed ${arr[i]} in bucket ${bucketIdx}`,
      type: 'scatter',
    });
  }

  // 2. Gather
  let idx = 0;
  const bucketRanges: { start: number; end: number }[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const start = idx;
    for (const val of buckets[i]) {
      arr[idx++] = val;
      // Highlight the write operation
      yield yieldState(arr, [idx - 1], [], undefined, undefined, {
        description: `Gathering: Places ${val} from bucket ${i}`,
        type: 'gather',
      });
    }
    bucketRanges.push({ start, end: idx - 1 });
  }

  // 3. Sort Buckets
  for (let i = 0; i < bucketCount; i++) {
    const { start, end } = bucketRanges[i];
    if (end >= start) {
      // Non-empty bucket
      // Calculate global sorted indices up to this start point
      const globallySorted = Array.from({ length: start }, (_, k) => k);
      yield yieldState(arr, [], globallySorted, undefined, undefined, {
        description: `Sorting bucket ${i} (Insertion Sort)`,
        type: 'info',
      });

      // If bucket has more than 1 item, sort it
      if (end > start) {
        yield* insertionSortSub(arr, start, end, globallySorted);
      } else {
        yield yieldState(
          arr,
          [start],
          [...globallySorted, start],
          undefined,
          undefined,
          {
            description: `Bucket ${i} has single item, already sorted`,
            type: 'info',
          }
        );
      }
    }
  }

  // Final sorted state
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}

export function* radixSort(arr: number[]): SortGenerator {
  const max = Math.max(...arr);

  // Iterate through digits
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const buckets: number[][] = Array.from({ length: 10 }, () => []);

    // Check if this is the last pass
    const isLastPass = Math.floor(max / (exp * 10)) === 0;

    // 1. Scatter
    for (let i = 0; i < arr.length; i++) {
      const idx = Math.floor(arr[i] / exp) % 10;
      buckets[idx].push(arr[i]);
      yield yieldState(arr, [i], [], undefined, undefined, {
        description: `Pass (exp=${exp}): Scattering ${arr[i]} to bucket ${idx}`,
        type: 'scatter',
      });
    }

    // 2. Gather
    let idx = 0;
    const sortedIndices: number[] = [];

    for (let i = 0; i < 10; i++) {
      for (const val of buckets[i]) {
        arr[idx++] = val;

        if (isLastPass) {
          sortedIndices.push(idx - 1);
        }

        // Highlight write position
        yield yieldState(
          arr,
          [idx - 1],
          [...sortedIndices],
          undefined,
          undefined,
          {
            description: `Pass (exp=${exp}): Gathering ${val} from bucket ${i}`,
            type: 'gather',
          }
        );
      }
    }
  }

  // Final sorted state
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
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
      yield yieldState(arr, [i, j], [], undefined, undefined, {
        description: `Shuffling - Attempt ${attempts + 1}`,
        type: 'info',
      });
    }
    attempts++;
  }
  yield yieldState(
    arr,
    [],
    isSorted(arr) ? Array.from({ length: arr.length }, (_, i) => i) : [],
    undefined,
    undefined,
    {
      description: isSorted(arr)
        ? 'Sorting completed!'
        : 'Gave up after 500 attempts',
      type: isSorted(arr) ? 'success' : 'info',
    }
  );
}

export function* sleepSort(arr: number[]): SortGenerator {
  const max = Math.max(...arr);
  const sortedIndices: number[] = [];

  for (let t = 0; t <= max; t++) {
    for (let i = sortedIndices.length; i < arr.length; i++) {
      if (arr[i] === t) {
        // Find insert position
        const insertIndex = sortedIndices.length;
        if (i !== insertIndex) {
          [arr[insertIndex], arr[i]] = [arr[i], arr[insertIndex]];
          yield yieldState(
            arr,
            [insertIndex, i],
            sortedIndices,
            undefined,
            undefined,
            {
              description: `Wake up ${t}! Placed at position ${insertIndex}`,
              type: 'move',
            }
          );
        }

        sortedIndices.push(insertIndex);
      }
    }
  }
  yield yieldState(
    arr,
    [],
    Array.from({ length: arr.length }, (_, i) => i),
    undefined,
    undefined,
    { description: 'Sorting completed', type: 'success' }
  );
}
