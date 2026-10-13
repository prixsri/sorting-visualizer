import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getAlgorithm } from '../algorithms/registry';
import { STEP_TYPES, Step, SortingAlgorithm, Stats } from '../algorithms/types';
import { PRESETS, generateArrayByPreset, Preset } from '../utils/arrayGenerators';

export interface UseSortingVisualizerOptions {
  defaultAlgorithm?: string;
  defaultSize?: number;
  defaultPreset?: Preset | string;
  defaultSpeed?: number;
}

export interface PrecomputedMetadata {
  stats: Stats[];
  sortedSets: Set<number>[];
  pivots: (number | null)[];
  ranges: (number[] | null)[];
}

export interface UseSortingVisualizerReturn {
  // Configuration & Options
  selectedAlgorithmId: string;
  algorithm: SortingAlgorithm;
  arraySize: number;
  preset: string;
  speedMultiplier: number;
  // Playback state
  isPlaying: boolean;
  isSorted: boolean;
  currentStepIndex: number;
  totalSteps: number;
  celebrationIndex: number;
  // Visualizer data
  currentArray: number[];
  currentStep: Step | null;
  maxValue: number;
  stats: Stats;
  sortedIndices: Set<number>;
  activePivot: number | null;
  activeRange: number[] | null;
  // Action handlers
  setAlgorithm: (algoId: string) => void;
  setArraySize: (newSize: number) => void;
  setPreset: (newPreset: string) => void;
  setSpeedMultiplier: (speed: number) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  seekToStep: (targetIndex: number) => void;
  reset: () => void;
  shuffle: (newPreset?: string, newSize?: number) => void;
}

export function useSortingVisualizer(
  initialOptions: UseSortingVisualizerOptions = {}
): UseSortingVisualizerReturn {
  const {
    defaultAlgorithm = 'bubble-sort',
    defaultSize = 35,
    defaultPreset = PRESETS.RANDOM,
    defaultSpeed = 10,
  } = initialOptions;

  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string>(defaultAlgorithm);
  const [arraySize, setArraySize] = useState<number>(defaultSize);
  const [preset, setPreset] = useState<string>(defaultPreset);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(defaultSpeed);
  const [initialArray, setInitialArray] = useState<number[]>(() =>
    generateArrayByPreset(defaultPreset, defaultSize)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [celebrationIndex, setCelebrationIndex] = useState<number>(-1);

  // References for RAF playback and batching
  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const accumulatorRef = useRef<number>(0);
  const celebrationRafRef = useRef<number | null>(null);

  // Retrieve algorithm metadata and generate steps
  const algorithm = useMemo<SortingAlgorithm>(() => {
    return getAlgorithm(selectedAlgorithmId) || getAlgorithm('bubble-sort')!;
  }, [selectedAlgorithmId]);

  const steps = useMemo<Step[]>(() => {
    if (!algorithm || !initialArray || initialArray.length === 0) return [];
    return algorithm.generateSteps(initialArray);
  }, [algorithm, initialArray]);

  // Precompute cumulative statistics and sorted sets for O(1) random access
  const precomputedMetadata = useMemo<PrecomputedMetadata>(() => {
    let comparisons = 0;
    let swapsWrites = 0;
    const runningSorted = new Set<number>();
    const statsList: Stats[] = [];
    const sortedSetsList: Set<number>[] = [];
    let currentPivot: number | null = null;
    const pivotsList: (number | null)[] = [];
    let currentRange: number[] | null = null;
    const rangesList: (number[] | null)[] = [];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (step.type === STEP_TYPES.COMPARE) {
        comparisons++;
      } else if (
        step.type === STEP_TYPES.SWAP ||
        step.type === STEP_TYPES.OVERWRITE
      ) {
        swapsWrites++;
      } else if (step.type === STEP_TYPES.SORTED) {
        step.indices.forEach((idx) => runningSorted.add(idx));
      } else if (step.type === STEP_TYPES.PIVOT) {
        currentPivot = step.indices[0];
      } else if (step.type === STEP_TYPES.CLEAR_PIVOT) {
        currentPivot = null;
      } else if (step.type === STEP_TYPES.RANGE) {
        currentRange = step.indices;
      }

      // If pivot was sorted, clear active pivot tracker
      if (currentPivot !== null && runningSorted.has(currentPivot)) {
        currentPivot = null;
      }

      statsList.push({ comparisons, swapsWrites });
      sortedSetsList.push(new Set(runningSorted));
      pivotsList.push(currentPivot);
      rangesList.push(currentRange);
    }

    return {
      stats: statsList,
      sortedSets: sortedSetsList,
      pivots: pivotsList,
      ranges: rangesList,
    };
  }, [steps]);

  // Trigger celebratory sweep
  const triggerCelebration = useCallback(() => {
    if (celebrationRafRef.current) {
      cancelAnimationFrame(celebrationRafRef.current);
    }
    const totalBars = arraySize;
    const startTime = performance.now();
    const duration = 500; // ms

    const animateSweep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const currentIdx = Math.floor(progress * totalBars);
      setCelebrationIndex(currentIdx);

      if (progress < 1) {
        celebrationRafRef.current = requestAnimationFrame(animateSweep);
      } else {
        // Keep finished state highlighted
        setCelebrationIndex(totalBars);
      }
    };

    celebrationRafRef.current = requestAnimationFrame(animateSweep);
  }, [arraySize]);

  // Clean up celebration animation
  const clearCelebration = useCallback(() => {
    if (celebrationRafRef.current) {
      cancelAnimationFrame(celebrationRafRef.current);
      celebrationRafRef.current = null;
    }
    setCelebrationIndex(-1);
  }, []);

  // Playback control functions
  const play = useCallback(() => {
    if (steps.length === 0) return;
    clearCelebration();
    // If at the end, wrap around to start
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(-1);
    }
    setIsPlaying(true);
  }, [steps.length, currentStepIndex, clearCelebration]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const stepForward = useCallback(() => {
    pause();
    clearCelebration();
    setCurrentStepIndex((prev) => {
      const next = prev + 1;
      if (next >= steps.length - 1) {
        if (next === steps.length - 1) {
          triggerCelebration();
        }
        return steps.length - 1;
      }
      return next;
    });
  }, [pause, steps.length, triggerCelebration, clearCelebration]);

  const stepBackward = useCallback(() => {
    pause();
    clearCelebration();
    setCurrentStepIndex((prev) => Math.max(-1, prev - 1));
  }, [pause, clearCelebration]);

  const reset = useCallback(() => {
    pause();
    clearCelebration();
    setCurrentStepIndex(-1);
  }, [pause, clearCelebration]);

  const seekToStep = useCallback(
    (targetIndex: number) => {
      pause();
      clearCelebration();
      const clamped = Math.max(-1, Math.min(steps.length - 1, targetIndex));
      setCurrentStepIndex(clamped);
      if (clamped === steps.length - 1 && steps.length > 0) {
        triggerCelebration();
      }
    },
    [pause, clearCelebration, steps.length, triggerCelebration]
  );

  const shuffle = useCallback(
    (newPreset: string = preset, newSize: number = arraySize) => {
      pause();
      clearCelebration();
      const freshArray = generateArrayByPreset(newPreset, newSize);
      setInitialArray(freshArray);
      setCurrentStepIndex(-1);
    },
    [pause, preset, arraySize, clearCelebration]
  );

  const changeAlgorithm = useCallback(
    (algoId: string) => {
      pause();
      clearCelebration();
      setSelectedAlgorithmId(algoId);
      setCurrentStepIndex(-1);
    },
    [pause, clearCelebration]
  );

  const changeArraySize = useCallback(
    (newSize: number) => {
      const clampedSize = Math.max(8, Math.min(100, Number(newSize)));
      setArraySize(clampedSize);
      shuffle(preset, clampedSize);
    },
    [preset, shuffle]
  );

  const changePreset = useCallback(
    (newPreset: string) => {
      setPreset(newPreset);
      shuffle(newPreset, arraySize);
    },
    [arraySize, shuffle]
  );

  // Playback loop via requestAnimationFrame with step batching at high speeds
  useEffect(() => {
    if (!isPlaying) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      lastTimeRef.current = null;
      accumulatorRef.current = 0;
      return;
    }

    // Step interval: 400ms at 1x down to ~8ms at 50x
    const stepInterval = Math.max(5, Math.round(400 / speedMultiplier));

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      accumulatorRef.current += delta;

      if (accumulatorRef.current >= stepInterval) {
        const stepsToAdvance = Math.min(
          Math.floor(accumulatorRef.current / stepInterval),
          25 // Capped to avoid runaway jumps on lag spikes
        );
        accumulatorRef.current %= stepInterval;

        setCurrentStepIndex((prev) => {
          const nextIndex = prev + stepsToAdvance;
          if (nextIndex >= steps.length - 1) {
            setIsPlaying(false);
            triggerCelebration();
            return steps.length - 1;
          }
          return nextIndex;
        });
      }

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isPlaying, speedMultiplier, steps.length, triggerCelebration]);

  // Derived current visualization state
  const isSorted =
    currentStepIndex === steps.length - 1 && steps.length > 0;

  const currentStep =
    currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null;

  const currentArray = currentStep
    ? currentStep.arraySnapshot
    : initialArray;

  const stats =
    currentStepIndex >= 0 && precomputedMetadata.stats[currentStepIndex]
      ? precomputedMetadata.stats[currentStepIndex]
      : { comparisons: 0, swapsWrites: 0 };

  const sortedIndices =
    currentStepIndex >= 0 && precomputedMetadata.sortedSets[currentStepIndex]
      ? precomputedMetadata.sortedSets[currentStepIndex]
      : new Set<number>();

  const activePivot =
    currentStepIndex >= 0
      ? precomputedMetadata.pivots[currentStepIndex]
      : null;

  const activeRange =
    currentStepIndex >= 0
      ? precomputedMetadata.ranges[currentStepIndex]
      : null;

  // Maximum value for proportional bar height calculations
  const maxValue = useMemo(() => {
    return Math.max(...initialArray, 1);
  }, [initialArray]);

  return {
    // Configuration & Options
    selectedAlgorithmId,
    algorithm,
    arraySize,
    preset,
    speedMultiplier,
    // Playback state
    isPlaying,
    isSorted,
    currentStepIndex,
    totalSteps: steps.length,
    celebrationIndex,
    // Visualizer data
    currentArray,
    currentStep,
    maxValue,
    stats,
    sortedIndices,
    activePivot,
    activeRange,
    // Action handlers
    setAlgorithm: changeAlgorithm,
    setArraySize: changeArraySize,
    setPreset: changePreset,
    setSpeedMultiplier,
    play,
    pause,
    togglePlay,
    stepForward,
    stepBackward,
    seekToStep,
    reset,
    shuffle,
  };
}

export default useSortingVisualizer;
