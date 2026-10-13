import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createSwapStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure BubbleSort(A):',
  '  n = length(A)',
  '  for i = 0 to n - 1 do',
  '    swapped = false',
  '    for j = 0 to n - i - 2 do',
  '      if A[j] > A[j + 1] then',
  '        swap(A[j], A[j + 1])',
  '        swapped = true',
  '    mark A[n - 1 - i] as sorted',
  '    if not swapped then break',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Bubble Sort.
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
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      steps.push(
        createCompareStep(
          [j, j + 1],
          arr,
          6,
          `Comparing A[${j}] (${arr[j]}) and A[${j + 1}] (${arr[j + 1]}).`
        )
      );

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        steps.push(
          createSwapStep(
            [j, j + 1],
            arr,
            7,
            `A[${j}] (${temp}) > A[${j + 1}] (${arr[j]}), swapping them.`
          )
        );
      }
    }

    const sortedIndex = n - 1 - i;
    sortedSet.add(sortedIndex);
    steps.push(
      createSortedStep(
        [sortedIndex],
        arr,
        9,
        `Element at index ${sortedIndex} (${arr[sortedIndex]}) bubbled to its final position.`
      )
    );

    if (!swapped) {
      steps.push(
        createSortedStep(
          Array.from({ length: sortedIndex }, (_, idx) => idx),
          arr,
          10,
          'No swaps occurred in this pass. The array is fully sorted early!'
        )
      );
      break;
    }
  }

  emitFinalSorted(steps, arr, 11, sortedSet);
  return steps;
}

export const bubbleSort: SortingAlgorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: CATEGORIES.EXCHANGE,
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description: `Bubble Sort is one of the simplest comparison-based sorting algorithms. The intuitive name derives from the way larger elements gradually "bubble up" to the top (or end) of the array through consecutive adjacent comparisons and swaps, mirroring air bubbles rising in water.

During each complete pass through the array, adjacent pairs of elements are compared sequentially. If the element on the left is strictly greater than the element on the right, their positions are swapped. After completing the first pass, the maximum element is guaranteed to occupy the final index. In general, after $i$ passes, the last $i$ elements are in their correct sorted locations. With an early termination flag checking whether any swap took place during a pass, the algorithm achieves an optimal $O(n)$ time on already-sorted inputs.

Although Bubble Sort is celebrated for pedagogical clarity and minimal memory footprint ($O(1)$ auxiliary space), its quadratic average and worst-case time complexity ($O(n^2)$) make it impractical for large datasets. It remains a classic teaching tool to illustrate sorting invariants, stability, and worst-case algorithmic analysis.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

// Legacy compatibility helper
export const getBubbleSortAnimations = (array: number[]): [number, number, string][] => {
  const steps = generateSteps(array);
  return steps.map((s) => [s.indices[0] ?? 0, s.arraySnapshot[s.indices[0] ?? 0] ?? 0, 'teal']);
};

export default bubbleSort;
