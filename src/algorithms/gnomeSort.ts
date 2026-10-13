import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createSwapStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure GnomeSort(A):',
  '  n = length(A); pos = 0',
  '  while pos < n do',
  '    if pos == 0 or A[pos] >= A[pos - 1] then',
  '      pos = pos + 1',
  '    else',
  '      swap(A[pos], A[pos - 1])',
  '      pos = pos - 1',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Gnome Sort.
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

  let pos = 0;

  while (pos < n) {
    if (pos === 0) {
      pos++;
      continue;
    }

    steps.push(
      createCompareStep(
        [pos, pos - 1],
        arr,
        4,
        `Gnome inspecting pots at index ${pos - 1} (${arr[pos - 1]}) and index ${pos} (${arr[pos]}).`
      )
    );

    if (arr[pos] >= arr[pos - 1]) {
      pos++;
    } else {
      const temp = arr[pos];
      arr[pos] = arr[pos - 1];
      arr[pos - 1] = temp;

      steps.push(
        createSwapStep(
          [pos, pos - 1],
          arr,
          7,
          `Pots out of order: swapped A[${pos}] (${temp}) with A[${pos - 1}] (${arr[pos]}); gnome steps back.`
        )
      );

      pos--;
    }
  }

  emitFinalSorted(steps, arr, 9);
  return steps;
}

export const gnomeSort: SortingAlgorithm = {
  id: 'gnome-sort',
  name: 'Gnome Sort',
  category: CATEGORIES.EXCHANGE,
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description: `Gnome Sort (originally dubbed "Stupid Sort" by Hamid Sarbazi-Azad in 2000 and christened "Gnome Sort" by Dick Grune) is celebrated for its minimalist implementation and charming pedagogical analogy. Grune illustrated the algorithm using a Dutch garden gnome inspecting a flowerpot display.

The gnome looks at the pot in front of him and the pot behind him. If they are in ascending order, the gnome steps forward to the next pot. If they are inverted, the gnome swaps the two pots and takes one step backward to verify the previous order. If the gnome finds himself at the starting flowerpot, he simply steps forward. Through this simple local dance, elements gravitate into place without needing nested loops.

Gnome Sort is essentially Insertion Sort carried out entirely via adjacent element swaps rather than shifting. Because elements only advance or retreat one slot at a time and never skip equal values, the sort is strictly stable. While its $O(n^2)$ worst-case makes it unsuitable for large arrays, its adaptive $O(n)$ behavior on sorted inputs and astonishingly concise logic make it a favorite for conceptual instruction.`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

export default gnomeSort;
