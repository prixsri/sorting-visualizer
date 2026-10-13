import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createOverwriteStep,
  createRangeStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure RadixSortLSD(A):',
  '  maxVal = findMax(A)',
  '  exp = 1 // 1, 10, 100, ...',
  '  while floor(maxVal / exp) > 0 do',
  '    CountingSortByDigit(A, exp)',
  '    exp = exp * 10',
  'procedure CountingSortByDigit(A, exp):',
  '  count = array of 10 zeros',
  '  for i = 0 to n - 1 do count[floor(A[i] / exp) % 10]++',
  '  for i = 1 to 9 do count[i] += count[i - 1]',
  '  for i = n - 1 down to 0 do',
  '    digit = floor(A[i] / exp) % 10',
  '    output[count[digit] - 1] = A[i]',
  '    count[digit]--',
  '  for i = 0 to n - 1 do A[i] = output[i]',
  'mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Radix Sort (LSD).
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    emitFinalSorted(steps, arr, 16);
    return steps;
  }

  // Handle negatives if present via offset
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] < min) min = arr[i];
    if (arr[i] > max) max = arr[i];
  }

  const offset = min < 0 ? -min : 0;
  if (offset > 0) {
    for (let i = 0; i < n; i++) {
      arr[i] += offset;
    }
    max += offset;
  }

  function countSortDigit(exp: number): void {
    steps.push(
      createRangeStep(
        [0, n - 1],
        arr.map((v) => v - offset),
        4,
        `Sorting by digit place value exp = ${exp} (${exp === 1 ? 'Units' : exp === 10 ? 'Tens' : exp === 100 ? 'Hundreds' : `${exp}s`} place).`
      )
    );

    const count = new Array(10).fill(0);
    const output = new Array<number>(n);

    // Tally digit counts
    for (let i = 0; i < n; i++) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      steps.push(
        createCompareStep(
          [i, i],
          arr.map((v) => v - offset),
          9,
          `Element ${arr[i] - offset} has digit ${digit} at place ${exp}. Incrementing bucket [${digit}] to ${count[digit]}.`
        )
      );
    }

    // Prefix sums
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output buffer
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % 10;
      const targetIdx = count[digit] - 1;
      output[targetIdx] = arr[i];
      count[digit]--;
    }

    // Overwrite back into arr
    for (let i = 0; i < n; i++) {
      arr[i] = output[i];
      steps.push(
        createOverwriteStep(
          i,
          arr[i] - offset,
          arr.map((v) => v - offset),
          15,
          `Writing element ${arr[i] - offset} into index ${i} after pass for place ${exp}.`
        )
      );
    }
  }

  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    countSortDigit(exp);
    exp *= 10;
  }

  // Restore offset if used
  if (offset > 0) {
    for (let i = 0; i < n; i++) {
      arr[i] -= offset;
    }
  }

  emitFinalSorted(steps, arr, 16);
  return steps;
}

export const radixSortLsd: SortingAlgorithm = {
  id: 'radix-sort-lsd',
  name: 'Radix Sort (LSD)',
  category: CATEGORIES.DISTRIBUTION,
  timeComplexity: {
    best: 'O(d · (n + b))',
    average: 'O(d · (n + b))',
    worst: 'O(d · (n + b))',
  },
  spaceComplexity: 'O(n + b)',
  stable: true,
  inPlace: false,
  description: `Radix Sort (Least Significant Digit) is a venerable non-comparison sorting algorithm whose conceptual lineage dates back to Herman Hollerith's punch-card sorting machines used in the 1890 United States Census. Instead of comparing full numbers against each other, Radix Sort isolates and sorts individual digits successively.

In the LSD variant, sorting commences from the least significant digit (the units place $10^0$) and progresses right-to-left toward the most significant digit. In each pass, a stable sorting subroutine—typically Counting Sort across base $b = 10$ buckets—orders the records according to that single digit position. The stability of the subroutine is indispensable: it ensures that when two numbers possess identical digits in the current pass, their previously established relative order from lower-order passes is strictly maintained.

When the maximum number of digits $d$ is constant (such as 32-bit or 64-bit integers), Radix Sort achieves remarkable linear $O(n)$ time complexity. Because it sidesteps CPU comparison branch prediction penalties, LSD Radix Sort is widely implemented in GPU parallel primitives (such as NVIDIA CUDA Thrust) and high-throughput columnar database engines for lightning-fast numerical and string key indexing.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default radixSortLsd;
