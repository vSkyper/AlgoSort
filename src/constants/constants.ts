import { AlgorithmInfo } from 'interfaces/types';
import * as Sorts from 'utils/sortingAlgorithms';

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    description:
      'Repeatedly swaps adjacent elements if they are in the wrong order.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/bubble-sort/',
    algorithm: Sorts.bubbleSort,
    code: `function bubbleSort(arr) {
  const n = arr.length;
  let swapped = true;
  for (let i = 0; i < n; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}`,
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    description:
      'Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/selection-sort/',
    algorithm: Sorts.selectionSort,
    code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
}`,
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    description: 'Builds the final sorted array one item at a time.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/insertion-sort/',
    algorithm: Sorts.insertionSort,
    code: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
}`,
  },
  {
    id: 'gnome',
    name: 'Gnome Sort',
    description:
      'Based on the technique used by a standard garden gnome sorting his flower pots.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/gnome-sort-a-stupid-one/',
    algorithm: Sorts.gnomeSort,
    code: `function gnomeSort(arr) {
  let index = 0;
  while (index < arr.length) {
    if (index === 0) index++;
    if (arr[index] >= arr[index - 1]) index++;
    else {
      [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
      index--;
    }
  }
}`,
  },
  {
    id: 'cocktail',
    name: 'Cocktail Shaker Sort',
    description: 'A variation of Bubble Sort that sorts in both directions.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/cocktail-sort/',
    algorithm: Sorts.cocktailShakerSort,
    code: `function cocktailShakerSort(arr) {
  let swapped = true;
  let start = 0, end = arr.length;
  while (swapped) {
    swapped = false;
    for (let i = start; i < end - 1; ++i) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    if (!swapped) break;
    swapped = false;
    end--;
    for (let i = end - 1; i >= start; i--) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    start++;
  }
}`,
  },
  {
    id: 'comb',
    name: 'Comb Sort',
    description:
      'Improves on Bubble Sort by using a larger gap that shrinks by a factor of 1.3.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/comb-sort/',
    algorithm: Sorts.combSort,
    code: `function combSort(arr) {
  let gap = arr.length;
  let sorted = false;
  while (!sorted) {
    gap = Math.floor(gap / 1.3);
    if (gap <= 1) { gap = 1; sorted = true; }
    for (let i = 0; i + gap < arr.length; i++) {
      if (arr[i] > arr[i + gap]) {
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
        sorted = false;
      }
    }
  }
}`,
  },
  {
    id: 'oddeven',
    name: 'Odd-Even Sort',
    description: 'A parallel variant of Bubble Sort using odd and even phases.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/odd-even-sort-brick-sort/',
    algorithm: Sorts.oddEvenSort,
    code: `function oddEvenSort(arr) {
  let sorted = false;
  while (!sorted) {
    sorted = true;
    for (let i = 1; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
      }
    }
    for (let i = 0; i < arr.length - 1; i += 2) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        sorted = false;
      }
    }
  }
}`,
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    description:
      'Divide and conquer algorithm that splits array in halves, sorts them and merges them.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    reference: 'https://www.geeksforgeeks.org/merge-sort/',
    algorithm: Sorts.mergeSort,
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
function merge(left, right) {
  let res = [], i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) res.push(left[i++]);
    else res.push(right[j++]);
  }
  return [...res, ...left.slice(i), ...right.slice(j)];
}`,
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    description:
      'Picks an element as pivot and partitions the given array around the picked pivot.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    reference: 'https://www.geeksforgeeks.org/quick-sort/',
    algorithm: Sorts.quickSort,
    code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    let pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}

function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    description:
      'Converts array into a heap data structure (max-heap), then extracts the max element.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/heap-sort/',
    algorithm: Sorts.heapSort,
    code: `function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(arr, n, i);
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
}`,
  },
  {
    id: 'intro',
    name: 'Intro Sort',
    description:
      'Hybrid sorting algorithm that starts with Quick Sort and switches to Heap Sort if depth exceeds a limit.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    reference: 'https://www.geeksforgeeks.org/introsort-or-introspective-sort/',
    algorithm: Sorts.introSort,
    code: `function introSort(arr) {
  const maxDepth = Math.floor(Math.log2(arr.length)) * 2;
  introSortRec(arr, 0, arr.length - 1, maxDepth);
}
function introSortRec(arr, low, high, depth) {
  if (high - low < 16) {
    insertionSort(arr, low, high);
  } else if (depth === 0) {
    heapSort(arr, low, high);
  } else {
    const pivot = partition(arr, low, high);
    introSortRec(arr, low, pivot - 1, depth - 1);
    introSortRec(arr, pivot + 1, high, depth - 1);
  }
}`,
  },
  {
    id: 'tim',
    name: 'Tim Sort',
    description: 'Hybrid algorithm derived from merge sort and insertion sort.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    reference: 'https://www.geeksforgeeks.org/timsort/',
    algorithm: Sorts.timSort,
    code: `function timSort(arr) {
  const RUN = 32;
  for (let i = 0; i < arr.length; i += RUN)
    insertionSort(arr, i, Math.min(i + 31, arr.length - 1));
  for (let size = RUN; size < arr.length; size = 2 * size)
    for (let left = 0; left < arr.length; left += 2 * size)
      merge(arr, left, left + size - 1, Math.min(left + 2 * size - 1, arr.length - 1));
}`,
  },
  {
    id: 'dualpivot',
    name: 'Dual-Pivot Quick Sort',
    description: 'Uses two pivots to partition the array into three parts.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    reference: 'https://www.geeksforgeeks.org/dual-pivot-quicksort/',
    algorithm: Sorts.dualPivotQuickSort,
    code: `function dualPivotQuickSort(arr, low, high) {
  if (low < high) {
    let [lp, rp] = partition(arr, low, high);
    dualPivotQuickSort(arr, low, lp - 1);
    dualPivotQuickSort(arr, lp + 1, rp - 1);
    dualPivotQuickSort(arr, rp + 1, high);
  }
}`,
  },
  {
    id: 'counting',
    name: 'Counting Sort',
    description: 'Integer sorting algorithm that counts the distinct elements.',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(k)',
    reference: 'https://www.geeksforgeeks.org/counting-sort/',
    algorithm: Sorts.countingSort,
    code: `function countingSort(arr) {
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  for (let x of arr) count[x]++;
  let idx = 0;
  for (let i = 0; i <= max; i++) {
    while (count[i]-- > 0) arr[idx++] = i;
  }
}`,
  },
  {
    id: 'bucket',
    name: 'Bucket Sort',
    description:
      'Distributes elements into buckets, sorts buckets, then gathers them.',
    timeComplexity: 'O(n + k)',
    spaceComplexity: 'O(n)',
    reference: 'https://www.geeksforgeeks.org/bucket-sort-2/',
    algorithm: Sorts.bucketSort,
    code: `function bucketSort(arr) {
  const max = Math.max(...arr, 100);
  const buckets = Array.from({length: 10}, () => []);
  for (let x of arr) {
    const idx = Math.floor((x / (max + 1)) * 10);
    buckets[idx].push(x);
  }
  for (let b of buckets) b.sort((a,b) => a-b);
  return buckets.flat();
}`,
  },
  {
    id: 'radix',
    name: 'Radix Sort',
    description: 'Sorts integers by processing individual digits.',
    timeComplexity: 'O(nk)',
    spaceComplexity: 'O(n + k)',
    reference: 'https://www.geeksforgeeks.org/radix-sort/',
    algorithm: Sorts.radixSort,
    code: `function radixSort(arr) {
  const max = Math.max(...arr);
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
}

function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n).fill(0);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    let idx = Math.floor(arr[i] / exp) % 10;
    count[idx]++;
  }

  for (let i = 1; i < 10; i++) count[i] += count[i - 1];

  for (let i = n - 1; i >= 0; i--) {
    let idx = Math.floor(arr[i] / exp) % 10;
    output[count[idx] - 1] = arr[i];
    count[idx]--;
  }

  for (let i = 0; i < n; i++) arr[i] = output[i];
}`,
  },
  {
    id: 'bogo',
    name: 'Bogo Sort',
    description:
      'Ineffective algorithm that shuffles elements until they are sorted.',
    timeComplexity: 'O((n + 1)!)',
    spaceComplexity: 'O(1)',
    reference: 'https://www.geeksforgeeks.org/bogosort-permutation-sort/',
    algorithm: Sorts.bogoSort,
    code: `function bogoSort(arr) {
  while (!isSorted(arr)) {
    shuffle(arr);
  }
}

function isSorted(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}`,
  },
  {
    id: 'sleep',
    name: 'Sleep Sort',
    description:
      'Creates a thread for each element and sleeps for value-proportional time.',
    timeComplexity: 'O(n + V)',
    spaceComplexity: 'O(n)',
    reference:
      'https://www.geeksforgeeks.org/sleep-sort-king-laziness-sorting-sleeping/',
    algorithm: Sorts.sleepSort,
    code: `function sleepSort(arr) {
  arr.forEach(n => 
    setTimeout(() => console.log(n), n)
  );
}`,
  },
];
