import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createOverwriteStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure CountingSort(A):',
  '  min = findMin(A); max = findMax(A); k = max - min + 1',
  '  count = array of zeros of size k',
  '  for each x in A do count[x - min]++',
  '  for i = 1 to k - 1 do count[i] += count[i - 1]',
  '  for i = length(A) - 1 down to 0 do',
  '    output[count[A[i] - min] - 1] = A[i]',
  '    count[A[i] - min]--',
  '  for i = 0 to length(A) - 1 do',
  '    A[i] = output[i]',
  '    mark A[i] as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Counting Sort.
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

  // Find min and max
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    steps.push(
      createCompareStep(
        [i, 0],
        arr,
        2,
        `Scanning element A[${i}] (${arr[i]}) to compute min and max values.`
      )
    );
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }

  const k = max - min + 1;
  const count = new Array(k).fill(0);

  // Count frequencies
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
    steps.push(
      createCompareStep(
        [i, i],
        arr,
        4,
        `Tallied value ${arr[i]} in frequency histogram count bucket [${arr[i] - min}]. Total so far: ${count[arr[i] - min]}.`
      )
    );
  }

  // Prefix sums for cumulative positions
  for (let i = 1; i < k; i++) {
    count[i] += count[i - 1];
  }

  // Build sorted output buffer (traversing backwards to maintain stability)
  const output = new Array<number>(n);
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const targetIdx = count[val - min] - 1;
    output[targetIdx] = val;
    count[val - min]--;

    steps.push(
      createCompareStep(
        [i, targetIdx],
        arr,
        7,
        `Prefix sum lookup: element A[${i}] (${val}) will be positioned at index ${targetIdx} in output.`
      )
    );
  }

  // Copy back to array with overwrite animations
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
    steps.push(
      createOverwriteStep(
        i,
        output[i],
        arr,
        10,
        `Writing sorted value ${output[i]} into index ${i}.`
      )
    );
    steps.push(
      createSortedStep(
        [i],
        arr,
        11,
        `Index ${i} (${arr[i]}) is in its final sorted position.`
      )
    );
  }

  emitFinalSorted(steps, arr, 11);
  return steps;
}

export const countingSort: SortingAlgorithm = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: CATEGORIES.DISTRIBUTION,
  timeComplexity: {
    best: 'O(n + k)',
    average: 'O(n + k)',
    worst: 'O(n + k)',
  },
  spaceComplexity: 'O(n + k)',
  stable: true,
  inPlace: false,
  description: `Counting Sort is a non-comparison integer sorting algorithm that bypasses the famous $\\Omega(n \\log n)$ information-theoretic lower bound governing comparison-based sorts. Instead of pairwise comparisons, it leverages direct array indexing based on discrete integer keys.

The algorithm begins by determining the minimum and maximum values to construct a frequency table of range $k = \\max - \\min + 1$. After tallying how many times each distinct value occurs, it computes prefix sums (cumulative counts) to calculate the exact starting offset for each distinct value in the sorted output array. Finally, it iterates through the original collection from right to left, placing each item into its computed output slot and decrementing the frequency counter.

Because items with equal values are placed into the output array in the reverse order of their traversal, Counting Sort is rigorously stable. When the range $k$ of integer keys is linearly proportional to the size of the array ($k = O(n)$), Counting Sort runs in pristine $O(n)$ linear time. Its primary limitation is memory consumption: if $k$ is exponentially large compared to $n$, the frequency table becomes impractical. It serves as the foundational building block for Radix Sort.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default countingSort;
