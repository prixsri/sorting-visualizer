import React from 'react';
import { SortingAlgorithm } from '../algorithms/types';

/**
 * Formats mathematical expressions ($...$) into clean inline math badges
 */
function renderFormattedText(text: string, key: React.Key) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <p key={key} className="mechanics-paragraph">
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const content = part.slice(1, -1);
          return (
            <code key={i} className="math-token">
              {content}
            </code>
          );
        }
        return part;
      })}
    </p>
  );
}

export interface AlgorithmInfoProps {
  algorithm: SortingAlgorithm | null;
}

export function AlgorithmInfo({ algorithm }: AlgorithmInfoProps) {
  if (!algorithm) return null;

  const {
    name,
    category,
    timeComplexity,
    spaceComplexity,
    stable,
    inPlace,
    description,
  } = algorithm;

  const paragraphs = description ? description.split(/\n\s*\n/) : [];

  return (
    <article className="dossier-card" aria-label="Algorithm Specifications & Mechanics">
      {/* Dossier Header */}
      <div className="dossier-header">
        <div className="dossier-title-group">
          <div className="dossier-heading-row">
            <h2 className="dossier-title">{name}</h2>
            <span className="dossier-category-tag">{category}</span>
          </div>
          <span className="dossier-subheading">Algorithmic Complexity & Architecture</span>
        </div>

        {/* Complexity Grid Matrix */}
        <div className="complexity-matrix" aria-label="Complexity Characteristics">
          <div className="matrix-cell">
            <span className="matrix-label">Best Time</span>
            <span className="matrix-val mono-val val-green">
              {timeComplexity?.best || 'N/A'}
            </span>
          </div>

          <div className="matrix-cell">
            <span className="matrix-label">Average Time</span>
            <span className="matrix-val mono-val val-cyan">
              {timeComplexity?.average || 'N/A'}
            </span>
          </div>

          <div className="matrix-cell">
            <span className="matrix-label">Worst Time</span>
            <span className="matrix-val mono-val val-rose">
              {timeComplexity?.worst || 'N/A'}
            </span>
          </div>

          <div className="matrix-cell">
            <span className="matrix-label">Space</span>
            <span className="matrix-val mono-val val-purple">
              {spaceComplexity || 'N/A'}
            </span>
          </div>

          <div className="matrix-cell">
            <span className="matrix-label">Stability</span>
            <span className={`matrix-val status-badge ${stable ? 'badge-positive' : 'badge-neutral'}`}>
              {stable ? 'Stable' : 'Unstable'}
            </span>
          </div>

          <div className="matrix-cell">
            <span className="matrix-label">Memory</span>
            <span className={`matrix-val status-badge ${inPlace ? 'badge-positive' : 'badge-neutral'}`}>
              {inPlace ? 'In-Place' : 'Out-of-Place'}
            </span>
          </div>
        </div>
      </div>

      {/* Mechanics & Invariants Narrative */}
      <div className="dossier-body">
        <h3 className="mechanics-heading">Operational Mechanics & Invariants</h3>
        <div className="mechanics-content">
          {paragraphs.map((para, idx) => renderFormattedText(para, idx))}
        </div>
      </div>
    </article>
  );
}

export default AlgorithmInfo;
