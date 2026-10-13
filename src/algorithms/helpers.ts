import { STEP_TYPES, Step } from './types';

/**
 * Converts an array of pseudocode lines into a numbered pseudocode string (1-indexed).
 */
export function formatPseudocode(lines: string[]): string {
  return lines.map((line, idx) => `${idx + 1}: ${line}`).join('\n');
}

/**
 * Creates a compare step.
 */
export function createCompareStep(
  indices: [number, number] | number[],
  arr: number[],
  line: number,
  explanation: string
): Step {
  return {
    type: STEP_TYPES.COMPARE,
    indices: [...indices],
    arraySnapshot: [...arr],
    line,
    explanation,
  };
}

/**
 * Creates a swap step.
 */
export function createSwapStep(
  indices: [number, number] | number[],
  arr: number[],
  line: number,
  explanation: string
): Step {
  return {
    type: STEP_TYPES.SWAP,
    indices: [...indices],
    arraySnapshot: [...arr],
    line,
    explanation,
  };
}

/**
 * Creates an overwrite step (e.g. for Merge Sort, Counting Sort, Radix Sort, Insertion Sort).
 */
export function createOverwriteStep(
  index: number,
  value: number,
  arr: number[],
  line: number,
  explanation: string
): Step {
  return {
    type: STEP_TYPES.OVERWRITE,
    indices: [index],
    value,
    arraySnapshot: [...arr],
    line,
    explanation,
  };
}

/**
 * Creates a pivot selection step (e.g. for Quick Sort).
 */
export function createPivotStep(
  index: number,
  value: number,
  arr: number[],
  line: number,
  explanation: string
): Step {
  return {
    type: STEP_TYPES.PIVOT,
    indices: [index],
    value,
    arraySnapshot: [...arr],
    line,
    explanation,
  };
}

/**
 * Creates a clear-pivot step.
 */
export function createClearPivotStep(
  index: number,
  arr: number[],
  line: number,
  explanation: string
): Step {
  return {
    type: STEP_TYPES.CLEAR_PIVOT,
    indices: [index],
    arraySnapshot: [...arr],
    line,
    explanation,
  };
}

/**
 * Creates a range/window highlight step.
 */
export function createRangeStep(
  indices: [number, number] | number[],
  arr: number[],
  line: number,
  explanation: string
): Step {
  return {
    type: STEP_TYPES.RANGE,
    indices: [...indices],
    arraySnapshot: [...arr],
    line,
    explanation,
  };
}

/**
 * Creates a sorted mark step for one or more indices.
 */
export function createSortedStep(
  indices: number[],
  arr: number[],
  line: number,
  explanation: string
): Step {
  return {
    type: STEP_TYPES.SORTED,
    indices: [...indices],
    arraySnapshot: [...arr],
    line,
    explanation,
  };
}

/**
 * Emits final sorted steps for all indices to confirm completion.
 */
export function emitFinalSorted(
  steps: Step[],
  arr: number[],
  line = 1,
  alreadySorted: Set<number> = new Set()
): void {
  for (let i = 0; i < arr.length; i++) {
    if (!alreadySorted.has(i)) {
      steps.push(
        createSortedStep(
          [i],
          arr,
          line,
          `Index ${i} (value ${arr[i]}) is in its final sorted position.`
        )
      );
      alreadySorted.add(i);
    }
  }
}
