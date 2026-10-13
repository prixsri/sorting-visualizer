import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createOverwriteStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure CycleSort(A):',
  '  n = length(A)',
  '  for cycleStart = 0 to n - 2 do',
  '    item = A[cycleStart]; pos = cycleStart',
  '    for i = cycleStart + 1 to n - 1 do',
  '      if A[i] < item then pos = pos + 1',
  '    if pos == cycleStart then continue',
  '    while item == A[pos] do pos = pos + 1',
  '    swap item with A[pos]',
  '    while pos != cycleStart do',
  '      pos = cycleStart',
  '      for i = cycleStart + 1 to n - 1 do',
  '        if A[i] < item then pos = pos + 1',
  '      while item == A[pos] do pos = pos + 1',
  '      swap item with A[pos]',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Cycle Sort.
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

  const sortedSet = new Set<number>();

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = arr[cycleStart];
    let pos = cycleStart;

    // Find where item belongs by counting strictly smaller elements
    for (let i = cycleStart + 1; i < n; i++) {
      steps.push(
        createCompareStep(
          [i, cycleStart],
          arr,
          6,
          `Cycle start ${cycleStart}: comparing A[${i}] (${arr[i]}) with current item (${item}).`
        )
      );
      if (arr[i] < item) {
        pos++;
      }
    }

    // If item is already in correct place, continue
    if (pos === cycleStart) {
      sortedSet.add(cycleStart);
      steps.push(
        createSortedStep(
          [cycleStart],
          arr,
          7,
          `Item at index ${cycleStart} (${arr[cycleStart]}) is already in its correct sorted position.`
        )
      );
      continue;
    }

    // Skip duplicates
    while (item === arr[pos]) {
      pos++;
    }

    // Put item in its correct position
    if (pos !== cycleStart) {
      const displaced = arr[pos];
      arr[pos] = item;
      item = displaced;

      steps.push(
        createOverwriteStep(
          pos,
          arr[pos],
          arr,
          9,
          `Placed item (${arr[pos]}) into correct position A[${pos}], displacing value ${item}.`
        )
      );
      sortedSet.add(pos);
      steps.push(
        createSortedStep(
          [pos],
          arr,
          9,
          `Index ${pos} (${arr[pos]}) is now set in its final cycle position.`
        )
      );
    }

    // Rotate rest of the cycle
    while (pos !== cycleStart) {
      pos = cycleStart;

      for (let i = cycleStart + 1; i < n; i++) {
        steps.push(
          createCompareStep(
            [i, cycleStart],
            arr,
            13,
            `Tracing cycle: comparing A[${i}] (${arr[i]}) with displaced item (${item}).`
          )
        );
        if (arr[i] < item) {
          pos++;
        }
      }

      while (item === arr[pos]) {
        pos++;
      }

      if (item !== arr[pos]) {
        const displaced = arr[pos];
        arr[pos] = item;
        item = displaced;

        steps.push(
          createOverwriteStep(
            pos,
            arr[pos],
            arr,
            15,
            `Placed displaced item into A[${pos}] (${arr[pos]}), taking next displaced value ${item}.`
          )
        );
        sortedSet.add(pos);
        steps.push(
          createSortedStep(
            [pos],
            arr,
            15,
            `Index ${pos} (${arr[pos]}) is confirmed in its final cycle position.`
          )
        );
      }
    }
  }

  emitFinalSorted(steps, arr, 16, sortedSet);
  return steps;
}

export const cycleSort: SortingAlgorithm = {
  id: 'cycle-sort',
  name: 'Cycle Sort',
  category: CATEGORIES.SELECTION,
  timeComplexity: {
    best: 'O(n²)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: false,
  inPlace: true,
  description: `Cycle Sort is an in-place, comparison-based sorting algorithm of exceptional theoretical distinction: it is mathematically optimal with respect to the total number of memory writes to the array. Every element is written to the array either zero times (if already correctly situated) or exactly once to its final position.

The algorithm is anchored in the mathematical principle that every permutation of a finite set can be factored into disjoint cyclic permutations. For each cycle, the algorithm takes an item and counts how many elements in the entire array are strictly smaller than it; this count reveals the exact final index where the element belongs. It places the item into that target position, displaces the resident element, and repeats the placement for the displaced value until the cycle loops back and completes at the starting slot.

Because write operations are bounded at an absolute maximum of $n - 1$ writes across the entire array, Cycle Sort is uniquely suited for memory hardware architectures with punishing write penalties or finite write endurance lifespans, such as flash memory, SSD blocks, and EEPROMs. However, due to its $O(n^2)$ comparison overhead and lack of stability, it is reserved specifically for write-sensitive systems rather than general-purpose CPU computing.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default cycleSort;
