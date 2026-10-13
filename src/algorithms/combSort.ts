import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createSwapStep,
  createRangeStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure CombSort(A):',
  '  n = length(A); gap = n; shrink = 1.3; sorted = false',
  '  while not sorted do',
  '    gap = floor(gap / shrink)',
  '    if gap <= 1 then gap = 1; sorted = true',
  '    for i = 0 to n - gap - 1 do',
  '      if A[i] > A[i + gap] then',
  '        swap(A[i], A[i + gap]); sorted = false',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Comb Sort.
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    emitFinalSorted(steps, arr, 9);
    return steps;
  }

  const shrink = 1.3;
  let gap = n;
  let sorted = false;

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true; // tentative: will remain true if no swaps occur during gap=1 pass
    }

    steps.push(
      createRangeStep(
        [0, n - 1],
        arr,
        4,
        `Comb pass with gap = ${gap}. Comparing elements separated by distance ${gap}.`
      )
    );

    for (let i = 0; i + gap < n; i++) {
      steps.push(
        createCompareStep(
          [i, i + gap],
          arr,
          6,
          `Comparing A[${i}] (${arr[i]}) with A[${i + gap}] (${arr[i + gap]}) across gap ${gap}.`
        )
      );

      if (arr[i] > arr[i + gap]) {
        const temp = arr[i];
        arr[i] = arr[i + gap];
        arr[i + gap] = temp;
        sorted = false;

        steps.push(
          createSwapStep(
            [i, i + gap],
            arr,
            8,
            `Inversion across gap ${gap}: swapped A[${i}] (${temp}) with A[${i + gap}] (${arr[i]}).`
          )
        );
      }
    }
  }

  emitFinalSorted(steps, arr, 9);
  return steps;
}

export const combSort: SortingAlgorithm = {
  id: 'comb-sort',
  name: 'Comb Sort',
  category: CATEGORIES.EXCHANGE,
  timeComplexity: {
    best: 'O(n log n)',
    average: 'O(n log n)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: `Comb Sort, designed by Włodzimierz Dobosiewicz in 1980 and popularized by Stephen Lacey and Richard Box in Byte Magazine (1991), is a high-performance evolution of Bubble Sort. It eliminates Bubble Sort's fundamental Achilles' heel—the sluggish propagation of "turtle" values near the end—by replacing unit-distance comparisons with wide, diminishing intervals.

The algorithm begins with a gap equal to the array length, subsequently dividing it by an empirically derived shrink factor of 1.3 on each iteration. Pairs of elements separated by the current gap are compared and swapped if inverted. As the gap progressively shrinks down to 1, widely dispersed out-of-order elements are brought into coarse proximity. Once the gap reaches 1, the algorithm finishes with standard Bubble Sort passes until no swaps remain.

Lacey and Box discovered that a shrink factor of 1.3 is mathematically optimal: it thins out inversions at the highest rate without leaving stubborn parity clusters. While Comb Sort sacrifices stability due to long-distance swaps, its execution speed rivals Quick Sort and Heap Sort on random arrays of moderate size while retaining an ultra-compact memory footprint and zero recursion.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default combSort;
