import { describe, test, expect } from 'bun:test';
import {
  getAlgorithm,
  getAllAlgorithms,
  getCategories,
  STEP_TYPES,
} from './index';

describe('Algorithm Registry and Helpers', () => {
  test('registers all 14 algorithms', () => {
    const all = getAllAlgorithms();
    expect(all.length).toBe(14);
  });

  test('contains valid categories', () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThanOrEqual(4);
    expect(categories).toContain('Divide & Conquer');
    expect(categories).toContain('Exchange');
    expect(categories).toContain('Selection');
    expect(categories).toContain('Insertion');
    expect(categories).toContain('Distribution');
  });

  const expectedIds = [
    'bubble-sort',
    'selection-sort',
    'insertion-sort',
    'merge-sort',
    'quick-sort-lomuto',
    'quick-sort-hoare',
    'heap-sort',
    'shell-sort',
    'cocktail-shaker-sort',
    'comb-sort',
    'gnome-sort',
    'counting-sort',
    'radix-sort-lsd',
    'cycle-sort',
  ];

  for (const id of expectedIds) {
    test(`algorithm "${id}" exists with full metadata and valid pseudocode`, () => {
      const algo = getAlgorithm(id);
      expect(algo).not.toBeNull();
      expect(algo!.id).toBe(id);
      expect(typeof algo!.name).toBe('string');
      expect(typeof algo!.category).toBe('string');
      expect(typeof algo!.description).toBe('string');
      expect(typeof algo!.pseudocode).toBe('string');
      expect(Array.isArray(algo!.pseudocodeLines)).toBe(true);
      expect(algo!.pseudocodeLines.length).toBeGreaterThan(0);
      expect(algo!.timeComplexity).toBeDefined();
      expect(algo!.timeComplexity.best).toBeDefined();
      expect(algo!.timeComplexity.average).toBeDefined();
      expect(algo!.timeComplexity.worst).toBeDefined();
      expect(typeof algo!.spaceComplexity).toBe('string');
      expect(typeof algo!.stable).toBe('boolean');
      expect(typeof algo!.inPlace).toBe('boolean');
      expect(typeof algo!.generateSteps).toBe('function');
    });
  }
});

describe('Algorithm Execution & Step Generation', () => {
  const allAlgos = getAllAlgorithms();
  const validTypes = new Set<string>(Object.values(STEP_TYPES));

  const testSuites = [
    { name: 'random numbers', input: [45, 12, 89, 34, 70, 23, 9, 61, 55, 3] },
    { name: 'already sorted', input: [1, 2, 3, 4, 5, 6, 7, 8] },
    { name: 'reverse sorted', input: [8, 7, 6, 5, 4, 3, 2, 1] },
    { name: 'duplicates', input: [5, 2, 8, 2, 5, 1, 9, 8, 3, 2, 5] },
    { name: 'all equal', input: [6, 6, 6, 6, 6] },
    { name: 'single item', input: [99] },
    { name: 'empty list', input: [] },
  ];

  for (const algo of allAlgos) {
    describe(`${algo.name} (${algo.id})`, () => {
      for (const suite of testSuites) {
        test(`correctly sorts ${suite.name}`, () => {
          const inputCopy = [...suite.input];
          const expected = [...suite.input].sort((a, b) => a - b);

          const steps = algo.generateSteps(suite.input);

          // Immutability
          expect(suite.input).toEqual(inputCopy);

          if (suite.input.length === 0) {
            expect(steps.length).toBe(0);
            return;
          }

          expect(steps.length).toBeGreaterThan(0);

          // Schema validation
          const markedSorted = new Set<number>();
          for (const step of steps) {
            expect(validTypes.has(step.type)).toBe(true);
            expect(Array.isArray(step.indices)).toBe(true);
            expect(Array.isArray(step.arraySnapshot)).toBe(true);
            expect(step.line).toBeGreaterThanOrEqual(1);
            expect(step.line).toBeLessThanOrEqual(algo.pseudocodeLines.length);
            expect(typeof step.explanation).toBe('string');
            expect(step.explanation.length).toBeGreaterThan(0);

            if (step.type === STEP_TYPES.SORTED) {
              for (const idx of step.indices) {
                markedSorted.add(idx);
              }
            }
          }

          // Final snapshot must match expected sorted array
          const finalSnapshot = steps[steps.length - 1].arraySnapshot;
          expect(finalSnapshot).toEqual(expected);

          // Every index must be confirmed sorted
          for (let i = 0; i < suite.input.length; i++) {
            expect(markedSorted.has(i)).toBe(true);
          }
        });
      }
    });
  }
});
