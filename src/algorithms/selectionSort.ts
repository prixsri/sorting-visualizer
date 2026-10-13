import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createSwapStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure SelectionSort(A):',
  '  n = length(A)',
  '  for i = 0 to n - 1 do',
  '    minIndex = i',
  '    for j = i + 1 to n - 1 do',
  '      if A[j] < A[minIndex] then',
  '        minIndex = j',
  '    if minIndex != i then',
  '      swap(A[i], A[minIndex])',
  '    mark A[i] as sorted',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Selection Sort.
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 11, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  const sortedSet = new Set<number>();

  for (let i = 0; i < n; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      steps.push(
        createCompareStep(
          [j, minIndex],
          arr,
          6,
          `Comparing A[${j}] (${arr[j]}) with current minimum A[${minIndex}] (${arr[minIndex]}).`
        )
      );

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push(
          createCompareStep(
            [minIndex, i],
            arr,
            7,
            `Found new minimum value ${arr[minIndex]} at index ${minIndex}.`
          )
        );
      }
    }

    if (minIndex !== i) {
      const temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;

      steps.push(
        createSwapStep(
          [i, minIndex],
          arr,
          9,
          `Swapping index ${i} (${temp}) with minimum index ${minIndex} (${arr[i]}).`
        )
      );
    }

    sortedSet.add(i);
    steps.push(
      createSortedStep(
        [i],
        arr,
        10,
        `Index ${i} (${arr[i]}) is now confirmed in its final sorted position.`
      )
    );
  }

  emitFinalSorted(steps, arr, 11, sortedSet);
  return steps;
}

export const selectionSort: SortingAlgorithm = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: CATEGORIES.SELECTION,
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: `Selection Sort is an in-place comparison sort known for its conceptual simplicity. The central intuition is dividing the array into two distinct partitions: a sorted subarray built incrementally from left to right, and an unsorted subarray occupying the remainder.

At each iteration, the algorithm scans the entire unsorted region to locate the minimum element. Once identified, this minimum is swapped with the leftmost unsorted element, expanding the sorted partition by one. This process repeats until the entire collection is ordered. Because the unsorted portion must always be searched exhaustively, Selection Sort performs exactly $n(n - 1) / 2$ comparisons across all scenarios—even if the array is already sorted.

The distinct algorithmic advantage of Selection Sort is that it makes at most $O(n)$ swaps (specifically, at most $n - 1$ memory writes). This property makes it uniquely suitable in memory-constrained environments where write operations are significantly more costly than read operations, such as flash memory or EEPROMs. However, standard array Selection Sort is unstable because distant swaps can reorder identical elements.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

// Legacy compatibility helper
export const getSelectionSortAnimations = (array: number[]): [number, number, string][] => {
  const steps = generateSteps(array);
  return steps.map((s) => [s.indices[0] ?? 0, s.arraySnapshot[s.indices[0] ?? 0] ?? 0, 'teal']);
};

export default selectionSort;
