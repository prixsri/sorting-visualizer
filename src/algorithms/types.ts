/**
 * Sorting Visualizer Algorithm Types & Constants
 */

export const CATEGORIES = {
  DIVIDE_AND_CONQUER: 'Divide & Conquer',
  EXCHANGE: 'Exchange',
  SELECTION: 'Selection',
  INSERTION: 'Insertion',
  DISTRIBUTION: 'Distribution',
} as const;

export type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const STEP_TYPES = {
  COMPARE: 'compare',
  SWAP: 'swap',
  OVERWRITE: 'overwrite',
  PIVOT: 'pivot',
  CLEAR_PIVOT: 'clear-pivot',
  RANGE: 'range',
  SORTED: 'sorted',
} as const;

export type StepType = (typeof STEP_TYPES)[keyof typeof STEP_TYPES];

export interface Step {
  type: StepType;
  indices: number[];
  arraySnapshot: number[];
  line: number;
  explanation: string;
  value?: number;
}

export interface TimeComplexity {
  best: string;
  average: string;
  worst: string;
}

export interface SortingAlgorithm {
  id: string;
  name: string;
  category: string;
  timeComplexity: TimeComplexity;
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  description: string;
  pseudocode: string;
  pseudocodeLines: string[];
  generateSteps: (initialArray: number[]) => Step[];
}

export interface Stats {
  comparisons: number;
  swapsWrites: number;
}
