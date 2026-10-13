import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createOverwriteStep,
  createRangeStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure MergeSort(A, left, right):',
  '  if left >= right then return',
  '  mid = floor((left + right) / 2)',
  '  MergeSort(A, left, mid)',
  '  MergeSort(A, mid + 1, right)',
  '  Merge(A, left, mid, right)',
  'procedure Merge(A, left, mid, right):',
  '  temp = copy(A[left...right])',
  '  while i <= mid and j <= right do',
  '    if leftVal <= rightVal then',
  '      A[k++] = leftVal; i++',
  '    else',
  '      A[k++] = rightVal; j++',
  '  copy remaining items into A',
  '  mark A[left...right] as merged',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Merge Sort.
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 2, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  function merge(left: number, mid: number, right: number) {
    steps.push(
      createRangeStep(
        [left, right],
        arr,
        6,
        `Merging subarrays A[${left}...${mid}] and A[${mid + 1}...${right}].`
      )
    );

    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      const leftIdx = left + i;
      const rightIdx = mid + 1 + j;

      steps.push(
        createCompareStep(
          [leftIdx, rightIdx],
          arr,
          10,
          `Comparing left element ${leftPart[i]} (idx ${leftIdx}) and right element ${rightPart[j]} (idx ${rightIdx}).`
        )
      );

      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        steps.push(
          createOverwriteStep(
            k,
            leftPart[i],
            arr,
            11,
            `Writing smaller element ${leftPart[i]} to index ${k}.`
          )
        );
        i++;
      } else {
        arr[k] = rightPart[j];
        steps.push(
          createOverwriteStep(
            k,
            rightPart[j],
            arr,
            13,
            `Writing smaller element ${rightPart[j]} to index ${k}.`
          )
        );
        j++;
      }
      k++;
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      steps.push(
        createOverwriteStep(
          k,
          leftPart[i],
          arr,
          14,
          `Writing remaining left element ${leftPart[i]} to index ${k}.`
        )
      );
      i++;
      k++;
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      steps.push(
        createOverwriteStep(
          k,
          rightPart[j],
          arr,
          14,
          `Writing remaining right element ${rightPart[j]} to index ${k}.`
        )
      );
      j++;
      k++;
    }

    // Mark current merged segment
    if (left === 0 && right === n - 1) {
      steps.push(
        createSortedStep(
          Array.from({ length: n }, (_, idx) => idx),
          arr,
          15,
          'Full array merge complete! All elements are in sorted order.'
        )
      );
    }
  }

  function sort(left: number, right: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);

    steps.push(
      createRangeStep(
        [left, right],
        arr,
        3,
        `Dividing range [${left}...${right}] at mid index ${mid}.`
      )
    );

    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
  }

  sort(0, n - 1);
  emitFinalSorted(steps, arr, 15);
  return steps;
}

export const mergeSort: SortingAlgorithm = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: CATEGORIES.DIVIDE_AND_CONQUER,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n log n)',
  },
  spaceComplexity: 'O(n)',
  stable: true,
  inPlace: false,
  description: `Merge Sort is an archetypal divide-and-conquer algorithm designed by John von Neumann in 1945. It solves sorting by recursively splitting an input array into two halves until each subproblem reaches the trivial base case of a single element (which is trivially sorted), followed by an iterative merging step that stitches sorted halves together.

The heart of the algorithm is the merge subroutine. Given two independently sorted halves, two pointers scan their front elements. At each step, the smaller of the two values is placed into the output array and its corresponding pointer advances. Because elements of equal value are always taken from the left partition before the right, Merge Sort preserves relative order and is completely stable.

Merge Sort provides a strictly deterministic $O(n \\log n)$ time complexity in all cases—best, average, and worst. This makes it an attractive choice when predictability and worst-case guarantees are critical. Its primary drawback for array-based in-memory collections is its $O(n)$ auxiliary memory requirement, though it is the optimal foundational paradigm for sorting linked lists and massive external datasets on disk.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

// Legacy compatibility helper
export const getMergeSortAnimations = (array: number[]): [number, number, string][] => {
  const steps = generateSteps(array);
  return steps.map((s) => [s.indices[0] ?? 0, s.arraySnapshot[s.indices[0] ?? 0] ?? 0, 'teal']);
};

export default mergeSort;
