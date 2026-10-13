import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Controls from './components/Controls';
import VisualizerStage from './components/VisualizerStage';
import AlgorithmInfo from './components/AlgorithmInfo';
import PseudocodeViewer from './components/PseudocodeViewer';
import { useSortingVisualizer } from './hooks/useSortingVisualizer';
import './styles/variables.css';
import './styles/visualizer.css';

export function App() {
  const {
    selectedAlgorithmId,
    algorithm,
    arraySize,
    preset,
    speedMultiplier,
    isPlaying,
    isSorted,
    currentStepIndex,
    totalSteps,
    celebrationIndex,
    currentArray,
    currentStep,
    maxValue,
    stats,
    sortedIndices,
    activePivot,
    activeRange,
    setAlgorithm,
    setArraySize,
    setPreset,
    setSpeedMultiplier,
    togglePlay,
    stepForward,
    stepBackward,
    seekToStep,
    reset,
    shuffle,
  } = useSortingVisualizer();

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const toggleShortcuts = useCallback(() => {
    setIsShortcutsOpen((prev) => !prev);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or select
      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        reset();
      } else if (e.key === '?') {
        e.preventDefault();
        toggleShortcuts();
      } else if (e.key === 'Escape' && isShortcutsOpen) {
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, stepForward, stepBackward, reset, toggleShortcuts, isShortcutsOpen]);

  return (
    <div className="chroma-app">
      {/* Studio Navigation Bar */}
      <Navbar
        algorithmName={algorithm?.name || 'Algorithm'}
        category={algorithm?.category || 'Sorting'}
        isPlaying={isPlaying}
        isSorted={isSorted}
        currentStepIndex={currentStepIndex}
        onOpenShortcuts={toggleShortcuts}
      />

      {/* Main Workbench Layout */}
      <main className="workbench-viewport">
        {/* Command Control Console */}
        <Controls
          selectedAlgorithmId={selectedAlgorithmId}
          onSelectAlgorithm={setAlgorithm}
          arraySize={arraySize}
          onChangeArraySize={setArraySize}
          preset={preset}
          onChangePreset={setPreset}
          speedMultiplier={speedMultiplier}
          onChangeSpeed={setSpeedMultiplier}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onReset={reset}
          onShuffle={shuffle}
          isSorted={isSorted}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />

        {/* Visualizer Stage Arena */}
        <VisualizerStage
          array={currentArray}
          maxValue={maxValue}
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
          stats={stats}
          sortedIndices={sortedIndices}
          activePivot={activePivot}
          activeRange={activeRange}
          celebrationIndex={celebrationIndex}
          isSorted={isSorted}
          onSeekStep={seekToStep}
        />

        {/* Dual Inspection Deck: Technical Dossier & Pseudocode Trace */}
        <section className="workbench-inspection-deck" aria-label="Algorithm Specifications & Pseudocode">
          <AlgorithmInfo algorithm={algorithm} />
          <PseudocodeViewer
            pseudocodeLines={algorithm?.pseudocodeLines || []}
            activeLine={currentStep?.line || null}
          />
        </section>
      </main>

      {/* Workbench Footer */}
      <footer className="workbench-footer">
        <div className="footer-container">
          <span className="footer-brand">
            Sorting Visualizer · Interactive Sorting Algorithm Workbench
          </span>
          <div className="footer-keys-hint">
            <span className="key-cap">Space</span> Toggle
            <span className="key-cap">→</span> Next
            <span className="key-cap">←</span> Back
            <span className="key-cap">R</span> Reset
            <span className="key-cap">?</span> Shortcuts
          </div>
        </div>
      </footer>

      {/* Keyboard Shortcuts Dialog Modal */}
      {isShortcutsOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsShortcutsOpen(false)}
          role="presentation"
        >
          <div
            className="shortcuts-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shortcuts-dialog-title"
          >
            <div className="modal-header">
              <h3 id="shortcuts-dialog-title" className="modal-title">
                Keyboard Shortcuts
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsShortcutsOpen(false)}
                aria-label="Close shortcuts modal"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="shortcut-row">
                <span className="shortcut-action">Play / Pause Execution</span>
                <span className="key-cap">Space</span>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-action">Step Forward 1 Micro-Step</span>
                <span className="key-cap">→</span>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-action">Step Backward 1 Micro-Step</span>
                <span className="key-cap">←</span>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-action">Reset to Initial Array</span>
                <span className="key-cap">R</span>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-action">Toggle Shortcuts Dialog</span>
                <span className="key-cap">?</span>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-action">Close Dialog</span>
                <span className="key-cap">Esc</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
