import React, { useRef, useCallback } from 'react';
import { STEP_TYPES, Step, Stats } from '../algorithms/types';

export interface VisualizerStageProps {
  array: number[];
  maxValue: number;
  currentStep: Step | null;
  currentStepIndex: number;
  totalSteps: number;
  stats: Stats;
  sortedIndices: Set<number>;
  activePivot: number | null;
  activeRange: number[] | null;
  celebrationIndex: number;
  isSorted: boolean;
  onSeekStep?: (step: number) => void;
}

export function VisualizerStage({
  array,
  maxValue,
  currentStep,
  currentStepIndex,
  totalSteps,
  stats,
  sortedIndices,
  activePivot,
  activeRange,
  celebrationIndex,
  isSorted,
  onSeekStep,
}: VisualizerStageProps) {
  const scrubberRef = useRef<HTMLDivElement>(null);
  const showValues = array.length <= 32;
  const progressPercent =
    totalSteps > 0
      ? Math.round((Math.max(0, currentStepIndex + 1) / totalSteps) * 100)
      : 0;

  // Determine narration status & contextual badge
  let eventType = 'READY';
  let eventText = 'Array prepared for execution. Press Execute or Step Forward.';
  let eventTheme = 'theme-idle';

  if (isSorted) {
    eventType = 'COMPLETE';
    eventText = 'Array fully sorted. All elements verified in ascending order.';
    eventTheme = 'theme-sorted';
  } else if (currentStep) {
    eventText = currentStep.explanation;
    if (
      currentStep.type === STEP_TYPES.SWAP ||
      currentStep.type === STEP_TYPES.OVERWRITE
    ) {
      eventType = currentStep.type === STEP_TYPES.OVERWRITE ? 'WRITE' : 'SWAP';
      eventTheme = 'theme-swap';
    } else if (currentStep.type === STEP_TYPES.COMPARE) {
      eventType = 'COMPARE';
      eventTheme = 'theme-compare';
    } else if (currentStep.type === STEP_TYPES.PIVOT) {
      eventType = 'PIVOT';
      eventTheme = 'theme-pivot';
    } else if (currentStep.type === STEP_TYPES.SORTED) {
      eventType = 'SORTED';
      eventTheme = 'theme-sorted';
    } else if (currentStep.type === STEP_TYPES.RANGE) {
      eventType = 'PARTITION';
      eventTheme = 'theme-pivot';
    }
  }

  // Handle scrubber click or drag
  const handleScrubberInteraction = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!onSeekStep || totalSteps <= 0 || !scrubberRef.current) return;
      const rect = scrubberRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, clickX / rect.width));
      const targetStep = Math.round(ratio * (totalSteps - 1));
      onSeekStep(targetStep);
    },
    [onSeekStep, totalSteps]
  );

  return (
    <section className="visualizer-arena-card" aria-label="Array Visualization Stage">
      {/* Telemetry & Live Narrative Header */}
      <div className="arena-header">
        {/* Narrative Ticker */}
        <div className={`narrative-ticker ${eventTheme}`} role="status" aria-live="polite">
          <span className="narrative-tag">{eventType}</span>
          <p className="narrative-text">{eventText}</p>
        </div>

        {/* Live Hardware-style Metrics HUD */}
        <div className="telemetry-hud" aria-label="Real-time performance counters">
          <div className="hud-metric" title="Comparisons made">
            <span className="hud-label">Comparisons</span>
            <span className="hud-value metric-amber">{stats.comparisons.toLocaleString()}</span>
          </div>

          <div className="hud-separator" aria-hidden="true" />

          <div className="hud-metric" title="Swaps & memory writes">
            <span className="hud-label">Swaps & Writes</span>
            <span className="hud-value metric-rose">{stats.swapsWrites.toLocaleString()}</span>
          </div>

          <div className="hud-separator" aria-hidden="true" />

          <div className="hud-metric" title="Step count and total">
            <span className="hud-label">Micro-step</span>
            <span className="hud-value metric-cyan">
              {Math.max(0, currentStepIndex + 1)}{' '}
              <span className="hud-total">/ {totalSteps}</span>
            </span>
          </div>

          <div className="hud-separator" aria-hidden="true" />

          <div className="hud-metric" title="Algorithm completion percentage">
            <span className="hud-label">Progress</span>
            <span className="hud-value metric-green">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Bars Stage Arena */}
      <div className="arena-stage" role="img" aria-label="Sorting bars array visualizer">
        {/* Subtle baseline axis marker */}
        <div className="stage-baseline-grid" aria-hidden="true" />

        <div className="bars-layout">
          {array.map((value, idx) => {
            const heightPercent = Math.max(6, Math.round((value / maxValue) * 94));

            // State resolution
            let stateClass = 'bar-dormant';
            let statusTitle = 'idle';

            if (celebrationIndex >= 0 && idx <= celebrationIndex) {
              stateClass = 'bar-celebration';
              statusTitle = 'celebrating';
            } else if (currentStep) {
              if (
                (currentStep.type === STEP_TYPES.SWAP ||
                  currentStep.type === STEP_TYPES.OVERWRITE) &&
                currentStep.indices.includes(idx)
              ) {
                stateClass = 'bar-active-swap';
                statusTitle = 'mutating';
              } else if (
                currentStep.type === STEP_TYPES.COMPARE &&
                currentStep.indices.includes(idx)
              ) {
                stateClass = 'bar-active-compare';
                statusTitle = 'comparing';
              } else if (
                currentStep.type === STEP_TYPES.PIVOT &&
                currentStep.indices.includes(idx)
              ) {
                stateClass = 'bar-active-pivot';
                statusTitle = 'pivot';
              } else if (
                currentStep.type === STEP_TYPES.RANGE &&
                currentStep.indices.length === 2 &&
                idx >= currentStep.indices[0] &&
                idx <= currentStep.indices[1]
              ) {
                stateClass = 'bar-in-range';
                statusTitle = 'partition range';
              } else if (activePivot === idx) {
                stateClass = 'bar-active-pivot';
                statusTitle = 'pivot';
              } else if (sortedIndices && sortedIndices.has(idx)) {
                stateClass = 'bar-is-sorted';
                statusTitle = 'in-position';
              } else if (
                activeRange &&
                activeRange.length === 2 &&
                idx >= activeRange[0] &&
                idx <= activeRange[1]
              ) {
                stateClass = 'bar-in-range';
                statusTitle = 'partition range';
              }
            } else if (sortedIndices && sortedIndices.has(idx)) {
              stateClass = 'bar-is-sorted';
              statusTitle = 'in-position';
            }

            return (
              <div
                key={idx}
                className={`bar-item ${stateClass}`}
                style={{ height: `${heightPercent}%` }}
                title={`Index ${idx} = ${value} (${statusTitle})`}
              >
                <div className="bar-cap-bevel" aria-hidden="true" />
                {showValues && (
                  <span className="bar-val-badge" aria-hidden="true">
                    {value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Timeline Scrubber */}
      <div
        ref={scrubberRef}
        className={`timeline-scrubber-track ${onSeekStep && totalSteps > 0 ? 'is-interactive' : ''}`}
        onClick={handleScrubberInteraction}
        role="slider"
        aria-label="Algorithm execution scrubber"
        aria-valuenow={currentStepIndex + 1}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        tabIndex={0}
      >
        <div
          className="timeline-scrubber-fill"
          style={{ width: `${progressPercent}%` }}
        />
        {onSeekStep && totalSteps > 0 && (
          <div
            className="timeline-scrubber-handle"
            style={{ left: `${progressPercent}%` }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Arena Footer: Color Signal Legend */}
      <div className="arena-footer">
        <div className="legend-strip" aria-label="Visual State Legend">
          <div className="legend-entry">
            <span className="legend-indicator dot-dormant" />
            <span className="legend-title">Default</span>
          </div>
          <div className="legend-entry">
            <span className="legend-indicator dot-compare" />
            <span className="legend-title">Comparing</span>
          </div>
          <div className="legend-entry">
            <span className="legend-indicator dot-swap" />
            <span className="legend-title">Swapping / Writing</span>
          </div>
          <div className="legend-entry">
            <span className="legend-indicator dot-pivot" />
            <span className="legend-title">Pivot / Partition</span>
          </div>
          <div className="legend-entry">
            <span className="legend-indicator dot-sorted" />
            <span className="legend-title">Resolved</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VisualizerStage;
