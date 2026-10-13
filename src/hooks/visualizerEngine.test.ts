import { describe, it, expect } from 'bun:test';
import { getAllAlgorithms, getAlgorithm } from '../algorithms/registry';
import { STEP_TYPES } from '../algorithms/types';

describe('Visualizer Engine & State Processing', () => {
  it('correctly processes steps and precomputes statistics for all algorithms', () => {
    const algos = getAllAlgorithms();
    const testArray = [45, 12, 89, 34, 70, 2, 55, 19];

    for (const algo of algos) {
      const steps = algo.generateSteps(testArray);
      expect(steps.length).toBeGreaterThan(0);

      // Verify each step has expected structure
      for (const step of steps) {
        expect(step.arraySnapshot).toBeDefined();
        expect(step.arraySnapshot.length).toBe(testArray.length);
        expect(step.line).toBeGreaterThanOrEqual(1);
        expect(step.explanation).toBeDefined();
        expect(typeof step.explanation).toBe('string');
      }

      // Check final snapshot is strictly sorted
      const finalSnapshot = steps[steps.length - 1].arraySnapshot;
      const sortedCheck = [...finalSnapshot].sort((a, b) => a - b);
      expect(finalSnapshot).toEqual(sortedCheck);
    }
  });

  it('correctly tracks sorted indices and cumulative counters', () => {
    const algo = getAlgorithm('bubble-sort');
    expect(algo).not.toBeNull();
    const testArray = [20, 10, 40, 30];
    const steps = algo!.generateSteps(testArray);

    let comparisons = 0;
    let swaps = 0;
    const sorted = new Set<number>();

    for (const step of steps) {
      if (step.type === STEP_TYPES.COMPARE) comparisons++;
      if (step.type === STEP_TYPES.SWAP || step.type === STEP_TYPES.OVERWRITE) swaps++;
      if (step.type === STEP_TYPES.SORTED) {
        step.indices.forEach((idx) => sorted.add(idx));
      }
    }

    expect(comparisons).toBeGreaterThan(0);
    expect(swaps).toBeGreaterThan(0);
    // At the end, all 4 elements are marked sorted
    expect(sorted.size).toBe(4);
  });
});
