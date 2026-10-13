import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createSwapStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure HeapSort(A):',
  '  n = length(A)',
  '  for i = floor(n / 2) - 1 down to 0 do',
  '    Heapify(A, n, i)',
  '  for i = n - 1 down to 1 do',
  '    swap(A[0], A[i])',
  '    mark A[i] as sorted',
  '    Heapify(A, i, 0)',
  '  mark A[0] as sorted',
  'procedure Heapify(A, size, root):',
  '  largest = root; left = 2*root + 1; right = 2*root + 2',
  '  if left < size and A[left] > A[largest] then largest = left',
  '  if right < size and A[right] > A[largest] then largest = right',
  '  if largest != root then',
  '    swap(A[root], A[largest])',
  '    Heapify(A, size, largest)',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Heap Sort.
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 9, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  const sortedSet = new Set<number>();

  function heapify(size: number, root: number): void {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      steps.push(
        createCompareStep(
          [left, largest],
          arr,
          12,
          `Comparing left child A[${left}] (${arr[left]}) with largest A[${largest}] (${arr[largest]}).`
        )
      );
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      steps.push(
        createCompareStep(
          [right, largest],
          arr,
          13,
          `Comparing right child A[${right}] (${arr[right]}) with largest A[${largest}] (${arr[largest]}).`
        )
      );
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== root) {
      const temp = arr[root];
      arr[root] = arr[largest];
      arr[largest] = temp;

      steps.push(
        createSwapStep(
          [root, largest],
          arr,
          15,
          `Heap invariant violated: swapped root A[${root}] (${temp}) with child A[${largest}] (${arr[root]}).`
        )
      );

      heapify(size, largest);
    }
  }

  // Phase 1: Build Max-Heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Phase 2: Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    steps.push(
      createSwapStep(
        [0, i],
        arr,
        6,
        `Extracted max element ${temp} from heap root A[0] to final sorted position A[${i}].`
      )
    );

    sortedSet.add(i);
    steps.push(
      createSortedStep(
        [i],
        arr,
        7,
        `Element at index ${i} (${arr[i]}) is in its final sorted position.`
      )
    );

    heapify(i, 0);
  }

  sortedSet.add(0);
  steps.push(
    createSortedStep([0], arr, 9, `Last remaining element at index 0 (${arr[0]}) is sorted.`)
  );

  emitFinalSorted(steps, arr, 9, sortedSet);
  return steps;
}

export const heapSort: SortingAlgorithm = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: CATEGORIES.SELECTION,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: `Heap Sort is an ingenious comparison sort that brings together the $O(n \\log n)$ time efficiency of Merge Sort and the $O(1)$ auxiliary memory economy of Selection Sort. It structures the input array as an implicit complete binary tree satisfying the Max-Heap invariant: each parent node is greater than or equal to its children.

The algorithm proceeds in two distinct phases. In the first phase, it builds a max-heap in-place in linear $O(n)$ time by heapifying all internal nodes from bottom to top. In the second phase, it repeatedly extracts the maximum element—which always resides at root index 0—by swapping it with the last unsorted leaf element. The heap size is then decremented by one, and a top-down sieve-down (heapify) restores the max-heap invariant in $O(\\log n)$ time.

Because Heap Sort guarantees an absolute worst-case upper bound of $O(n \\log n)$ without allocating extra arrays, it is extraordinarily reliable. It forms the essential failsafe in Introsort (used in standard C++ implementations): when Quick Sort encounters pathological partitions and exceeds $2 \\log n$ recursion depth, Introsort seamlessly transitions to Heap Sort to guarantee completion in optimal time.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default heapSort;
