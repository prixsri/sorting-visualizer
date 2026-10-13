import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createSwapStep,
  createPivotStep,
  createClearPivotStep,
  createRangeStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure QuickSortLomuto(A, low, high):',
  '  if low < high then',
  '    p = LomutoPartition(A, low, high)',
  '    QuickSortLomuto(A, low, p - 1)',
  '    QuickSortLomuto(A, p + 1, high)',
  'procedure LomutoPartition(A, low, high):',
  '  pivot = A[high]',
  '  i = low - 1',
  '  for j = low to high - 1 do',
  '    if A[j] <= pivot then',
  '      i = i + 1; swap(A[i], A[j])',
  '  swap(A[i + 1], A[high])',
  '  mark A[i + 1] as sorted; return i + 1',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Quick Sort (Lomuto Partition).
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 13, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  const sortedSet = new Set<number>();

  function partition(low: number, high: number): number {
    const pivotValue = arr[high];
    steps.push(
      createRangeStep(
        [low, high],
        arr,
        2,
        `Active partitioning range: [${low}...${high}].`
      )
    );
    steps.push(
      createPivotStep(
        high,
        pivotValue,
        arr,
        7,
        `Selected A[${high}] (${pivotValue}) as the pivot.`
      )
    );

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push(
        createCompareStep(
          [j, high],
          arr,
          10,
          `Comparing A[${j}] (${arr[j]}) with pivot (${pivotValue}).`
        )
      );

      if (arr[j] <= pivotValue) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          steps.push(
            createSwapStep(
              [i, j],
              arr,
              11,
              `A[${j}] (${arr[i]}) <= pivot, swapped into smaller-elements partition at index ${i}.`
            )
          );
        }
      }
    }

    // Place pivot at its final position
    const pivotFinalIndex = i + 1;
    const temp = arr[pivotFinalIndex];
    arr[pivotFinalIndex] = arr[high];
    arr[high] = temp;

    steps.push(
      createSwapStep(
        [pivotFinalIndex, high],
        arr,
        12,
        `Placed pivot (${pivotValue}) into its partitioned position at index ${pivotFinalIndex}.`
      )
    );

    steps.push(
      createClearPivotStep(
        high,
        arr,
        12,
        `Pivot at index ${high} moved to index ${pivotFinalIndex}.`
      )
    );

    sortedSet.add(pivotFinalIndex);
    steps.push(
      createSortedStep(
        [pivotFinalIndex],
        arr,
        13,
        `Pivot at index ${pivotFinalIndex} (${arr[pivotFinalIndex]}) is in its final sorted position.`
      )
    );

    return pivotFinalIndex;
  }

  function quickSort(low: number, high: number): void {
    if (low < high) {
      const p = partition(low, high);
      quickSort(low, p - 1);
      quickSort(p + 1, high);
    } else if (low === high) {
      sortedSet.add(low);
      steps.push(
        createSortedStep(
          [low],
          arr,
          1,
          `Subarray of size 1 at index ${low} (${arr[low]}) is sorted.`
        )
      );
    }
  }

  quickSort(0, n - 1);
  emitFinalSorted(steps, arr, 13, sortedSet);
  return steps;
}

export const quickSortLomuto: SortingAlgorithm = {
  id: 'quick-sort-lomuto',
  name: 'Quick Sort (Lomuto)',
  category: CATEGORIES.DIVIDE_AND_CONQUER,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(log n)',
  stable: false,
  inPlace: true,
  description: `Quick Sort using Lomuto's partitioning scheme is the most frequently taught formulation of Quick Sort, popularized in the classic CLRS textbook. It organizes the array around a chosen pivot value by maintaining a single forward-scanning index and a trailing boundary index.

In this scheme, the pivot is typically chosen as the rightmost element of the current subarray. A pointer $j$ scans from left to right: whenever an element smaller than or equal to the pivot is detected, a boundary pointer $i$ advances and the current element is swapped to index $i$. Once the scan finishes, the pivot element at the end is swapped into index $i + 1$, positioning it in its permanent, final sorted position while strictly dividing all smaller elements to the left and larger elements to the right.

Lomuto partition is admired for its conceptual cleanliness, simplicity, and ease of correct implementation. However, compared to Hoare's two-pointer method, Lomuto executes approximately three times as many swaps on average and degrades severely to $O(n^2)$ worst-case time complexity when applied to arrays containing many identical elements.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default quickSortLomuto;
