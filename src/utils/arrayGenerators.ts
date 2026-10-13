/**
 * Array generation utilities for the Sorting Visualizer.
 * Supports various initial state distributions for benchmarking and educational comparison.
 */

export const PRESETS = Object.freeze({
  RANDOM: 'random',
  REVERSED: 'reversed',
  NEARLY_SORTED: 'nearly_sorted',
  FEW_UNIQUE: 'few_unique',
} as const);

export type Preset = (typeof PRESETS)[keyof typeof PRESETS];

export const PRESET_LABELS: Readonly<Record<Preset, string>> = Object.freeze({
  [PRESETS.RANDOM]: 'Random',
  [PRESETS.REVERSED]: 'Reversed',
  [PRESETS.NEARLY_SORTED]: 'Nearly Sorted',
  [PRESETS.FEW_UNIQUE]: 'Few Unique',
});

/**
 * Returns a random integer between min and max inclusive.
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an array of random integers.
 */
export function generateRandomArray(size: number, min = 15, max = 380): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(randomInt(min, max));
  }
  return arr;
}

/**
 * Generates a strictly descending (reversed) array.
 */
export function generateReversedArray(size: number, min = 15, max = 380): number[] {
  if (size <= 0) return [];
  if (size === 1) return [max];
  const step = (max - min) / (size - 1);
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.round(max - i * step));
  }
  return arr;
}

/**
 * Generates an almost sorted array with a small number of perturbed pairs.
 */
export function generateNearlySortedArray(size: number, min = 15, max = 380): number[] {
  if (size <= 0) return [];
  if (size === 1) return [min];
  const step = (max - min) / (size - 1);
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(Math.round(min + i * step));
  }

  // Swap approximately 5-8% of elements with nearby neighbors
  const numSwaps = Math.max(1, Math.min(6, Math.floor(size * 0.08)));
  for (let s = 0; s < numSwaps; s++) {
    const idx = randomInt(0, size - 2);
    const offset = randomInt(1, Math.min(3, size - 1 - idx));
    const targetIdx = idx + offset;
    const temp = arr[idx];
    arr[idx] = arr[targetIdx];
    arr[targetIdx] = temp;
  }

  return arr;
}

/**
 * Generates an array with only 4-5 distinct values.
 */
export function generateFewUniqueArray(size: number, min = 15, max = 380): number[] {
  const tiers = [
    Math.round(min + (max - min) * 0.15),
    Math.round(min + (max - min) * 0.38),
    Math.round(min + (max - min) * 0.65),
    Math.round(min + (max - min) * 0.90),
  ];

  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    const tierIdx = randomInt(0, tiers.length - 1);
    arr.push(tiers[tierIdx]);
  }
  return arr;
}

/**
 * Dispatches array generation based on the selected preset.
 */
export function generateArrayByPreset(preset: Preset | string, size: number, min = 15, max = 380): number[] {
  switch (preset) {
    case PRESETS.REVERSED:
      return generateReversedArray(size, min, max);
    case PRESETS.NEARLY_SORTED:
      return generateNearlySortedArray(size, min, max);
    case PRESETS.FEW_UNIQUE:
      return generateFewUniqueArray(size, min, max);
    case PRESETS.RANDOM:
    default:
      return generateRandomArray(size, min, max);
  }
}
