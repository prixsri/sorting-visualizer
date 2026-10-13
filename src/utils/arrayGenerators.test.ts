import { describe, it, expect } from 'bun:test';
import {
  PRESETS,
  generateRandomArray,
  generateReversedArray,
  generateNearlySortedArray,
  generateFewUniqueArray,
  generateArrayByPreset,
} from './arrayGenerators';

describe('Array Generators Utility', () => {
  it('generates random array of the requested size', () => {
    const arr = generateRandomArray(25, 10, 200);
    expect(arr.length).toBe(25);
    arr.forEach((val) => {
      expect(val).toBeGreaterThanOrEqual(10);
      expect(val).toBeLessThanOrEqual(200);
    });
  });

  it('generates reversed array in descending order', () => {
    const arr = generateReversedArray(20, 10, 100);
    expect(arr.length).toBe(20);
    for (let i = 0; i < arr.length - 1; i++) {
      expect(arr[i]).toBeGreaterThanOrEqual(arr[i + 1]);
    }
  });

  it('generates nearly sorted array', () => {
    const arr = generateNearlySortedArray(30, 10, 100);
    expect(arr.length).toBe(30);
    // Almost all elements should be ordered
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) inversions++;
    }
    expect(inversions).toBeLessThan(10);
  });

  it('generates few unique array with limited unique values', () => {
    const arr = generateFewUniqueArray(40, 10, 100);
    expect(arr.length).toBe(40);
    const uniqueValues = new Set(arr);
    expect(uniqueValues.size).toBeLessThanOrEqual(5);
  });

  it('dispatches properly through generateArrayByPreset', () => {
    expect(generateArrayByPreset(PRESETS.RANDOM, 15).length).toBe(15);
    expect(generateArrayByPreset(PRESETS.REVERSED, 12).length).toBe(12);
    expect(generateArrayByPreset(PRESETS.NEARLY_SORTED, 18).length).toBe(18);
    expect(generateArrayByPreset(PRESETS.FEW_UNIQUE, 22).length).toBe(22);
  });

  it('returns an empty array when a zero-size array is requested', () => {
    expect(generateRandomArray(0)).toEqual([]);
    expect(generateReversedArray(0)).toEqual([]);
    expect(generateNearlySortedArray(0)).toEqual([]);
    expect(generateFewUniqueArray(0)).toEqual([]);

    for (const preset of Object.values(PRESETS)) {
      expect(generateArrayByPreset(preset, 0)).toEqual([]);
    }
  });
});
