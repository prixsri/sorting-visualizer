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
  'procedure QuickSortHoare(A, low, high):',
  '  if low < high then',
  '    p = HoarePartition(A, low, high)',
  '    QuickSortHoare(A, low, p)',
  '    QuickSortHoare(A, p + 1, high)',
  'procedure HoarePartition(A, low, high):',
  '  pivot = A[floor((low + high) / 2)]',
  '  i = low - 1; j = high + 1',
  '  loop forever:',
  '    repeat i = i + 1 until A[i] >= pivot',
  '    repeat j = j - 1 until A[j] <= pivot',
  '    if i >= j then return j',
  '    swap(A[i], A[j])',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Quick Sort (Hoare Partition).
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 1, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  function partition(low: number, high: number): number {
    const mid = Math.floor((low + high) / 2);
    const pivotVal = arr[mid];

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
        mid,
        pivotVal,
        arr,
        7,
        `Selected middle element A[${mid}] (${pivotVal}) as the pivot.`
      )
    );

    let i = low - 1;
    let j = high + 1;

    while (true) {
      do {
        i++;
        steps.push(
          createCompareStep(
            [i, mid],
            arr,
            10,
            `Advancing left pointer i: comparing A[${i}] (${arr[i]}) with pivot (${pivotVal}).`
          )
        );
      } while (arr[i] < pivotVal);

      do {
        j--;
        steps.push(
          createCompareStep(
            [j, mid],
            arr,
            11,
            `Advancing right pointer j: comparing A[${j}] (${arr[j]}) with pivot (${pivotVal}).`
          )
        );
      } while (arr[j] > pivotVal);

      if (i >= j) {
        steps.push(
          createClearPivotStep(
            mid,
            arr,
            12,
            `Pointers crossed at i=${i}, j=${j}. Partitioning boundary returned at index ${j}.`
          )
        );
        return j;
      }

      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;

      steps.push(
        createSwapStep(
          [i, j],
          arr,
          13,
          `Inversion found: swapped A[${i}] (${arr[i]}) and A[${j}] (${arr[j]}).`
        )
      );
    }
  }

  function quickSort(low: number, high: number): void {
    if (low < high) {
      const p = partition(low, high);
      quickSort(low, p);
      quickSort(p + 1, high);
    }
  }

  quickSort(0, n - 1);
  emitFinalSorted(steps, arr, 1);
  return steps;
}

export const quickSortHoare: SortingAlgorithm = {
  id: 'quick-sort-hoare',
  name: 'Quick Sort (Hoare)',
  category: CATEGORIES.DIVIDE_AND_CONQUER,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(log n)',
  stable: false,
  inPlace: true,
  description: `Quick Sort with Hoare Partition is the original, highly efficient formulation developed by Sir Tony Hoare in 1959. Unlike Lomuto's unilateral scan, Hoare's partition uses two bidirectional pointers that start at opposite ends of the subarray and march toward each other until they converge.

The algorithm chooses a pivot value (often the median or middle index to safeguard against sorted inputs). The left pointer advances until it finds a value greater than or equal to the pivot, while the right pointer recedes until finding an element less than or equal to the pivot. When both pointers halt, if they have not yet crossed, their respective elements are swapped. Once they cross, the partition index $j$ is returned, splitting the array into two segments: elements $\\le \\text{pivot}$ and elements $\\ge \\text{pivot}$.

Hoare's method performs approximately three times fewer swaps on average than Lomuto's scheme. Furthermore, because duplicate elements stop both pointers and trigger swaps, Hoare naturally partitions identical elements evenly across the boundary, preventing the devastating $O(n^2)$ degradation that Lomuto suffers on duplicate-heavy inputs. Note that the pivot itself is not necessarily locked in its final index after a single Hoare partition pass.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default quickSortHoare;
