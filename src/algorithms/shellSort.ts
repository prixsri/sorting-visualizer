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
  'procedure ShellSort(A):',
  '  n = length(A)',
  '  gap = floor(n / 2)',
  '  while gap > 0 do',
  '    for i = gap to n - 1 do',
  '      temp = A[i]; j = i',
  '      while j >= gap and A[j - gap] > temp do',
  '        A[j] = A[j - gap]',
  '        j = j - gap',
  '      A[j] = temp',
  '    gap = floor(gap / 2)',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Shell Sort.
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 12, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  let gap = Math.floor(n / 2);

  while (gap > 0) {
    steps.push(
      createRangeStep(
        [0, n - 1],
        arr,
        4,
        `Beginning pass with gap = ${gap}. Elements separated by ${gap} will be compared and sorted.`
      )
    );

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      steps.push(
        createCompareStep(
          [i, j - gap],
          arr,
          6,
          `Evaluating element A[${i}] (${temp}) with gap ${gap} predecessor A[${j - gap}] (${arr[j - gap]}).`
        )
      );

      while (j >= gap && arr[j - gap] > temp) {
        steps.push(
          createCompareStep(
            [j - gap, j],
            arr,
            7,
            `A[${j - gap}] (${arr[j - gap]}) > ${temp}: shifting A[${j - gap}] forward by gap ${gap} to index ${j}.`
          )
        );

        arr[j] = arr[j - gap];
        steps.push(
          createOverwriteStep(
            j,
            arr[j],
            arr,
            8,
            `Shifted A[${j - gap}] into index ${j}.`
          )
        );

        j -= gap;
      }

      arr[j] = temp;
      steps.push(
        createOverwriteStep(
          j,
          temp,
          arr,
          10,
          `Placed value ${temp} at index ${j}.`
        )
      );
    }

    gap = Math.floor(gap / 2);
  }

  emitFinalSorted(steps, arr, 12);
  return steps;
}

export const shellSort: SortingAlgorithm = {
  id: 'shell-sort',
  name: 'Shell Sort',
  category: CATEGORIES.INSERTION,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n^(4/3))',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: `Shell Sort, conceived by Donald Shell in 1959, holds historic significance as the very first sorting algorithm to demonstrably surpass the quadratic $O(n^2)$ time barrier. It extends traditional Insertion Sort by permitting wide-stride comparisons and exchanges over diminishing intervals known as "gaps".

In standard Insertion Sort, an element can only travel one position at a time toward its destination, incurring massive penalties when small elements reside near the tail of the array. Shell Sort combats this by $h$-sorting the array for descending values of gap $h$. Long-distance exchanges swiftly transport displaced elements across the entire array. Because a $k$-sorted array remains $k$-sorted after being subsequent $h$-sorted, by the time the gap narrows to 1, the array is already nearly ordered, allowing the final insertion pass to execute in virtually linear time.

Operating strictly in-place with zero recursion and minimal memory footprints, Shell Sort remains a staple in resource-constrained embedded systems and kernel codebases where hardware stack frames are bounded. However, because wide-stride swaps bypass intervening elements, Shell Sort does not maintain the relative ordering of equal items and is inherently unstable.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default shellSort;
