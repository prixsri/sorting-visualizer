import { useEffect, useRef } from 'react';

export interface PseudocodeViewerProps {
  pseudocodeLines?: string[];
  activeLine?: number | null;
}

export function PseudocodeViewer({ pseudocodeLines = [], activeLine }: PseudocodeViewerProps) {
  const activeLineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeLine = activeLineRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeLineRect = activeLine.getBoundingClientRect();
      const lineTop = container.scrollTop + activeLineRect.top - containerRect.top;
      const lineBottom = lineTop + activeLineRect.height;
      const visibleTop = container.scrollTop;
      const visibleBottom = visibleTop + container.clientHeight;

      if (lineTop < visibleTop) {
        container.scrollTo({ top: lineTop, behavior: 'smooth' });
      } else if (lineBottom > visibleBottom) {
        container.scrollTo({
          top: lineBottom - container.clientHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [activeLine]);

  return (
    <article className="pseudocode-workbench-card" aria-label="Algorithm Pseudocode Execution Trace">
      {/* Header Bar */}
      <div className="pseudocode-header">
        <div className="pseudocode-title-row">
          <div>
            <h2 className="pseudocode-title">Pseudocode Trace</h2>
            <span className="pseudocode-subheading">Synchronized Micro-Step Evaluation</span>
          </div>

          <div className="active-execution-pill" aria-live="polite">
            {activeLine ? (
              <>
                <span className="active-tracer-dot" aria-hidden="true" />
                <span className="tracer-text">Line {activeLine}</span>
              </>
            ) : (
              <span className="tracer-idle">Idle</span>
            )}
          </div>
        </div>
      </div>

      {/* Editor Body */}
      <div
        className="code-view-container"
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Pseudocode with line numbers"
      >
        <pre className="code-block">
          <code>
            {pseudocodeLines.map((line, idx) => {
              const lineNumber = idx + 1;
              const isActive = activeLine === lineNumber;

              return (
                <div
                  key={lineNumber}
                  ref={isActive ? activeLineRef : null}
                  className={`code-row ${isActive ? 'is-active-step' : ''}`}
                >
                  <span className="code-gutter" aria-hidden="true">
                    <span className="gutter-num">{lineNumber}</span>
                    <span className="gutter-pointer">{isActive ? '▶' : ''}</span>
                  </span>
                  <span className="code-line-text">{line || ' '}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </article>
  );
}

export default PseudocodeViewer;
