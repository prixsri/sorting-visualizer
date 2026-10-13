import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createSwapStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure CocktailShakerSort(A):',
  '  start = 0; end = length(A) - 1; swapped = true',
  '  while swapped do',
  '    swapped = false',
  '    for i = start to end - 1 do',
  '      if A[i] > A[i + 1] then',
  '        swap(A[i], A[i + 1]); swapped = true',
  '    mark A[end] as sorted; end = end - 1',
  '    if not swapped then break',
  '    swapped = false',
  '    for i = end - 1 down to start do',
  '      if A[i] > A[i + 1] then',
  '        swap(A[i], A[i + 1]); swapped = true',
  '    mark A[start] as sorted; start = start + 1',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Cocktail Shaker Sort.
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 15, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  const sortedSet = new Set<number>();
  let start = 0;
  let end = n - 1;
  let swapped = true;

  while (swapped && start < end) {
    swapped = false;

    // Forward pass: bubble largest to the end
    for (let i = start; i < end; i++) {
      steps.push(
        createCompareStep(
          [i, i + 1],
          arr,
          5,
          `Forward sweep: comparing A[${i}] (${arr[i]}) and A[${i + 1}] (${arr[i + 1]}).`
        )
      );

      if (arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;

        steps.push(
          createSwapStep(
            [i, i + 1],
            arr,
            7,
            `A[${i}] (${temp}) > A[${i + 1}] (${arr[i]}), swapped forward.`
          )
        );
      }
    }

    sortedSet.add(end);
    steps.push(
      createSortedStep(
        [end],
        arr,
        8,
        `Forward pass finished: A[${end}] (${arr[end]}) is in its final position.`
      )
    );
    end--;

    if (!swapped) break;

    swapped = false;

    // Backward pass: sink smallest to the start
    for (let i = end - 1; i >= start; i--) {
      steps.push(
        createCompareStep(
          [i, i + 1],
          arr,
          11,
          `Backward sweep: comparing A[${i}] (${arr[i]}) and A[${i + 1}] (${arr[i + 1]}).`
        )
      );

      if (arr[i] > arr[i + 1]) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;

        steps.push(
          createSwapStep(
            [i, i + 1],
            arr,
            13,
            `A[${i}] (${temp}) > A[${i + 1}] (${arr[i]}), swapped backward.`
          )
        );
      }
    }

    sortedSet.add(start);
    steps.push(
      createSortedStep(
        [start],
        arr,
        14,
        `Backward pass finished: A[${start}] (${arr[start]}) is in its final position.`
      )
    );
    start++;
  }

  emitFinalSorted(steps, arr, 15, sortedSet);
  return steps;
}

export const cocktailShakerSort: SortingAlgorithm = {
  id: 'cocktail-shaker-sort',
  name: 'Cocktail Shaker Sort',
  category: CATEGORIES.EXCHANGE,
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description: `Cocktail Shaker Sort (also recognized as Bidirectional Bubble Sort, Ripple Sort, or Shuttle Sort) is a variation of Bubble Sort that traverses the dataset alternately in both directions. The algorithm mimics shaking a cocktail shaker by oscillating back and forward across unsorted array boundaries.

In standard Bubble Sort, elements only travel from left to right. This creates an asymmetric vulnerability known as the "turtle problem": small elements located near the high-index end of an array can only advance leftward by a meager single index per complete iteration. Cocktail Shaker Sort effectively eliminates this inefficiency. In the forward phase, large elements bubble rapidly rightward to the tail; in the reverse phase, small elements are carried back to the front at matching speed.

By trimming the active search boundaries from both the left (\`start\`) and right (\`end\`) on every complete oscillation, Cocktail Shaker Sort achieves a noticeable empirical speedup over vanilla Bubble Sort. It remains stable, operates strictly in-place with $O(1)$ auxiliary space, and terminates in linear $O(n)$ time when provided an ordered sequence.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default cocktailShakerSort;
