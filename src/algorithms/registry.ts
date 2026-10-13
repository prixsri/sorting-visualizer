import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { mergeSort } from './mergeSort';
import { quickSortLomuto } from './quickSortLomuto';
import { quickSortHoare } from './quickSortHoare';
import { heapSort } from './heapSort';
import { shellSort } from './shellSort';
import { cocktailShakerSort } from './cocktailShakerSort';
import { combSort } from './combSort';
import { gnomeSort } from './gnomeSort';
import { countingSort } from './countingSort';
import { radixSortLsd } from './radixSortLsd';
import { cycleSort } from './cycleSort';
import { SortingAlgorithm } from './types';

export {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSortLomuto,
  quickSortHoare,
  heapSort,
  shellSort,
  cocktailShakerSort,
  combSort,
  gnomeSort,
  countingSort,
  radixSortLsd,
  cycleSort,
};

/**
 * Ordered list of all supported algorithms.
 */
const algorithmsList: SortingAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSortLomuto,
  quickSortHoare,
  heapSort,
  shellSort,
  cocktailShakerSort,
  combSort,
  gnomeSort,
  countingSort,
  radixSortLsd,
  cycleSort,
];

/**
 * Master registry mapping algorithm ID to its configuration, metadata, and step generator.
 */
export const algorithmsRegistry: Readonly<Record<string, SortingAlgorithm>> = Object.freeze(
  algorithmsList.reduce<Record<string, SortingAlgorithm>>((acc, algo) => {
    acc[algo.id] = algo;
    return acc;
  }, {})
);

/**
 * Returns an algorithm object by its unique ID.
 */
export function getAlgorithm(id: string): SortingAlgorithm | null {
  return algorithmsRegistry[id] || null;
}

/**
 * Returns an array of all registered algorithm objects.
 */
export function getAllAlgorithms(): SortingAlgorithm[] {
  return algorithmsList;
}

/**
 * Returns an array of unique algorithm categories in order of appearance.
 */
export function getCategories(): string[] {
  return Array.from(new Set(algorithmsList.map((algo) => algo.category)));
}

export default algorithmsRegistry;
