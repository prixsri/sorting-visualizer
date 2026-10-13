export interface NavbarProps {
  algorithmName: string;
  category: string;
  isPlaying: boolean;
  isSorted: boolean;
  currentStepIndex: number;
  onOpenShortcuts: () => void;
}

export function Navbar({
  algorithmName,
  category,
  isPlaying,
  isSorted,
  currentStepIndex,
  onOpenShortcuts,
}: NavbarProps) {
  let statusText = 'Ready';
  let statusClass = 'status-idle';

  if (isPlaying) {
    statusText = 'Executing';
    statusClass = 'status-active';
  } else if (isSorted) {
    statusText = 'Sorted';
    statusClass = 'status-sorted';
  } else if (currentStepIndex > -1) {
    statusText = 'Paused';
    statusClass = 'status-paused';
  }

  return (
    <header className="app-navbar" role="banner">
      <div className="navbar-container">
        {/* Left: Brand Identity */}
        <div className="navbar-brand">
          <div className="brand-glyph" aria-hidden="true">
            <span className="glyph-bar bar-1"></span>
            <span className="glyph-bar bar-2"></span>
            <span className="glyph-bar bar-3"></span>
            <span className="glyph-bar bar-4"></span>
          </div>
          <div className="brand-titles">
            <div className="brand-heading-row">
              <span className="brand-name">Sorting Visualizer</span>
            </div>
            <span className="brand-subtitle">Interactive Sorting Algorithms</span>
          </div>
        </div>

        {/* Center: Current Algorithm Chip */}
        <div className="navbar-algorithm-chip" aria-label={`Current algorithm: ${algorithmName} in ${category}`}>
          <span className="algo-category-label">{category}</span>
          <span className="algo-divider" aria-hidden="true">/</span>
          <span className="algo-name-label">{algorithmName}</span>
        </div>

        {/* Right: Telemetry Status & Controls */}
        <div className="navbar-actions">
          <div className={`status-indicator-badge ${statusClass}`} role="status" aria-live="polite">
            <span className="status-ping" aria-hidden="true"></span>
            <span className="status-label">{statusText}</span>
          </div>

          <button
            type="button"
            className="navbar-shortcut-btn"
            onClick={onOpenShortcuts}
            title="View keyboard shortcuts"
            aria-label="View keyboard shortcuts"
          >
            <svg
              className="shortcut-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M6 16h12" />
            </svg>
            <span className="shortcut-text">Shortcuts</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
