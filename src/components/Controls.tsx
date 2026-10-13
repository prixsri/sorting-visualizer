import React, { useMemo } from 'react';
import { getAllAlgorithms, getCategories } from '../algorithms/registry';
import { PRESET_LABELS } from '../utils/arrayGenerators';

export interface ControlsProps {
  selectedAlgorithmId: string;
  onSelectAlgorithm: (id: string) => void;
  arraySize: number;
  onChangeArraySize: (size: number) => void;
  preset: string;
  onChangePreset: (preset: string) => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onShuffle: () => void;
  isSorted: boolean;
  currentStepIndex: number;
  totalSteps: number;
}

export function Controls({
  selectedAlgorithmId,
  onSelectAlgorithm,
  arraySize,
  onChangeArraySize,
  preset,
  onChangePreset,
  speedMultiplier,
  onChangeSpeed,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onShuffle,
  isSorted,
  currentStepIndex,
  totalSteps,
}: ControlsProps) {
  const algorithmsByCategory = useMemo(() => {
    const algos = getAllAlgorithms();
    const categories = getCategories();
    return categories.map((cat) => ({
      category: cat,
      algorithms: algos.filter((a) => a.category === cat),
    }));
  }, []);

  const delayMs = Math.round(400 / speedMultiplier);

  return (
    <section className="command-console" aria-label="Workbench Control Console">
      {/* Upper Deck: Parameters & Dynamics */}
      <div className="console-grid">
        {/* Module 1: Algorithm Select */}
        <div className="console-module module-algorithm">
          <label htmlFor="algorithm-select" className="module-label">
            Algorithm
          </label>
          <div className="select-container">
            <select
              id="algorithm-select"
              className="console-select"
              value={selectedAlgorithmId}
              onChange={(e) => onSelectAlgorithm(e.target.value)}
              disabled={isPlaying}
              aria-label="Select sorting algorithm"
            >
              {algorithmsByCategory.map((group) => (
                <optgroup key={group.category} label={group.category}>
                  {group.algorithms.map((algo) => (
                    <option key={algo.id} value={algo.id}>
                      {algo.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="select-caret" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.2 6.2a.75.75 0 0 1 1.06 0L8 8.94l2.74-2.74a.75.75 0 1 1 1.06 1.06l-3.27 3.27a.75.75 0 0 1-1.06 0L4.2 7.26a.75.75 0 0 1 0-1.06z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Module 2: Array Distribution */}
        <div className="console-module module-preset">
          <label htmlFor="preset-select" className="module-label">
            Distribution
          </label>
          <div className="select-container">
            <select
              id="preset-select"
              className="console-select"
              value={preset}
              onChange={(e) => onChangePreset(e.target.value)}
              disabled={isPlaying}
              aria-label="Select array distribution preset"
            >
              {Object.entries(PRESET_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <span className="select-caret" aria-hidden="true">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.2 6.2a.75.75 0 0 1 1.06 0L8 8.94l2.74-2.74a.75.75 0 1 1 1.06 1.06l-3.27 3.27a.75.75 0 0 1-1.06 0L4.2 7.26a.75.75 0 0 1 0-1.06z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Module 3: Array Size Slider */}
        <div className="console-module module-slider">
          <div className="module-header-row">
            <label htmlFor="size-slider" className="module-label">
              Array Size
            </label>
            <span className="module-metric-pill" aria-live="polite">
              {arraySize} <span className="metric-unit">bars</span>
            </span>
          </div>
          <div className="slider-wrapper">
            <input
              id="size-slider"
              type="range"
              className="range-input"
              min="8"
              max="100"
              step="1"
              value={arraySize}
              style={
                {
                  '--control-value': arraySize,
                  '--attr-min': 8,
                  '--attr-max': 100,
                } as React.CSSProperties
              }
              onChange={(e) => onChangeArraySize(Number(e.target.value))}
              disabled={isPlaying}
              aria-label="Array size"
            />
          </div>
        </div>

        {/* Module 4: Animation Speed Slider */}
        <div className="console-module module-slider">
          <div className="module-header-row">
            <label htmlFor="speed-slider" className="module-label">
              Speed
            </label>
            <span className="module-metric-pill" aria-live="polite">
              {speedMultiplier}x <span className="metric-unit">({delayMs}ms)</span>
            </span>
          </div>
          <div className="slider-wrapper">
            <input
              id="speed-slider"
              type="range"
              className="range-input range-speed"
              min="1"
              max="50"
              step="1"
              value={speedMultiplier}
              style={
                {
                  '--control-value': speedMultiplier,
                  '--attr-min': 1,
                  '--attr-max': 50,
                } as React.CSSProperties
              }
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              aria-label="Animation speed"
            />
          </div>
        </div>
      </div>

      {/* Lower Deck: Transport & Execution Controls */}
      <div className="console-transport-bar">
        {/* Left Side: Array Generation Utilities */}
        <div className="transport-group">
          <button
            type="button"
            className="console-btn btn-secondary"
            onClick={() => onShuffle()}
            disabled={isPlaying}
            title="Generate a fresh array based on active distribution"
            aria-label="Generate fresh array"
          >
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="16 3 21 3 21 8" />
              <line x1="4" y1="20" x2="21" y2="3" />
              <polyline points="21 16 21 21 16 21" />
              <line x1="15" y1="15" x2="21" y2="21" />
              <line x1="4" y1="4" x2="9" y2="9" />
            </svg>
            <span>Shuffle</span>
          </button>

          <button
            type="button"
            className="console-btn btn-secondary"
            onClick={onReset}
            disabled={isPlaying || currentStepIndex === -1}
            title="Reset array to beginning (R)"
            aria-label="Reset array"
          >
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            <span>Reset</span>
          </button>
        </div>

        {/* Right Side: Playback Rig */}
        <div className="transport-group playback-rig">
          <button
            type="button"
            className="console-btn btn-icon-square"
            onClick={onStepBackward}
            disabled={isPlaying || currentStepIndex <= -1}
            title="Step backward one micro-step (←)"
            aria-label="Step backward"
          >
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="19 20 9 12 19 4 19 20" />
              <line x1="5" y1="19" x2="5" y2="5" />
            </svg>
          </button>

          {/* Hero Execution Trigger Button */}
          <button
            type="button"
            className={`console-btn hero-play-btn ${isPlaying ? 'state-playing' : ''}`}
            onClick={onTogglePlay}
            disabled={totalSteps === 0}
            title={isPlaying ? 'Pause animation (Space)' : 'Start sorting animation (Space)'}
            aria-label={isPlaying ? 'Pause execution' : isSorted ? 'Replay execution' : 'Start execution'}
          >
            {isPlaying ? (
              <>
                <svg
                  className="btn-icon play-icon-morph"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="6" y="5" width="4" height="14" rx="1.5" />
                  <rect x="14" y="5" width="4" height="14" rx="1.5" />
                </svg>
                <span>Pause</span>
              </>
            ) : (
              <>
                <svg
                  className="btn-icon play-icon-morph"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
                <span>{isSorted ? 'Replay' : 'Execute'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="console-btn btn-icon-square"
            onClick={onStepForward}
            disabled={isPlaying || currentStepIndex >= totalSteps - 1}
            title="Step forward one micro-step (→)"
            aria-label="Step forward"
          >
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="5 4 15 12 5 20 5 4" />
              <line x1="19" y1="5" x2="19" y2="19" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Controls;
