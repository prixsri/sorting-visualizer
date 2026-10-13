import { CATEGORIES, Step, SortingAlgorithm } from './types';
import {
  formatPseudocode,
  createCompareStep,
  createOverwriteStep,
  createSortedStep,
  emitFinalSorted,
} from './helpers';

const pseudocodeLines = [
  'procedure InsertionSort(A):',
  '  n = length(A)',
  '  mark A[0] as sorted',
  '  for i = 1 to n - 1 do',
  '    key = A[i]',
  '    j = i - 1',
  '    while j >= 0 and A[j] > key do',
  '      A[j + 1] = A[j]',
  '      j = j - 1',
  '    A[j + 1] = key',
  '    mark A[0...i] as sorted',
  '  mark all elements as sorted',
];

const pseudocode = formatPseudocode(pseudocodeLines);

/**
 * Generates animation steps for Insertion Sort.
 */
export function generateSteps(initialArray: number[]): Step[] {
  const steps: Step[] = [];
  if (!initialArray || initialArray.length === 0) return steps;

  const arr = [...initialArray];
  const n = arr.length;

  if (n === 1) {
    steps.push(
      createSortedStep([0], arr, 3, 'Array has only 1 element, already sorted.')
    );
    return steps;
  }

  // Element 0 is trivially sorted initially
  steps.push(
    createSortedStep([0], arr, 3, `Initial element A[0] (${arr[0]}) forms a sorted prefix of length 1.`)
  );

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push(
      createCompareStep(
        [i, j],
        arr,
        5,
        `Picked key = ${key} at index ${i} to insert into sorted prefix A[0...${i - 1}].`
      )
    );

    while (j >= 0) {
      steps.push(
        createCompareStep(
          [j, j + 1],
          arr,
          7,
          `Comparing A[${j}] (${arr[j]}) with key (${key}).`
        )
      );

      if (arr[j] > key) {
        arr[j + 1] = arr[j];
        steps.push(
          createOverwriteStep(
            j + 1,
            arr[j],
            arr,
            8,
            `A[${j}] (${arr[j]}) > ${key}, shifting A[${j}] rightward to index ${j + 1}.`
          )
        );
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    steps.push(
      createOverwriteStep(
        j + 1,
        key,
        arr,
        10,
        `Inserted key (${key}) into its correct sorted location at index ${j + 1}.`
      )
    );

    steps.push(
      createSortedStep(
        Array.from({ length: i + 1 }, (_, idx) => idx),
        arr,
        11,
        `Prefix A[0...${i}] is now completely sorted.`
      )
    );
  }

  emitFinalSorted(steps, arr, 12);
  return steps;
}

export const insertionSort: SortingAlgorithm = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: CATEGORIES.INSERTION,
  timeComplexity: {
    best: 'O(n)',
    average: 'O(n²)',
    worst: 'O(n²)',
  },
  spaceComplexity: 'O(1)',
  stable: true,
  inPlace: true,
  description: `Insertion Sort mimics the natural, intuitive strategy humans use when organizing playing cards in their hands. Beginning with the second element, the algorithm extracts each item as a "key" and inserts it into its proper position within the preceding already-sorted subarray.

For each key element, the algorithm walks backward through the sorted prefix. Any element larger than the key is shifted one slot to the right, opening an empty slot for the key. Once an element smaller than or equal to the key is encountered (or the beginning of the array is reached), the key is dropped into place. Because equal elements are never shifted past one another, the algorithm is inherently stable.

Insertion Sort shines exceptionally on small collections and nearly-sorted datasets. Its runtime is adaptive: $O(n + d)$ where $d$ is the number of inversions, running in blistering $O(n)$ time when input is already sorted. Because of low constant overhead and cache efficiency, modern standard libraries—such as Python and Java (Timsort) as well as C++ (Introsort)—use Insertion Sort for small partitions ($n \\le 32$).`,
  pseudocode,
  pseudocodeLines,
  generateSteps,
};

// Legacy compatibility helper
export const getInsertionSortAnimations = (array: number[]): [number, number, string][] => {
  const steps = generateSteps(array);
  return steps.map((s) => [s.indices[0] ?? 0, s.arraySnapshot[s.indices[0] ?? 0] ?? 0, 'teal']);
};

export default insertionSort;
