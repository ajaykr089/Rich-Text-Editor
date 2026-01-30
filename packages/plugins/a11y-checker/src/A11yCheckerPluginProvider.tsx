import React, { useState, useEffect, useRef } from 'react';
import {
  runA11yAudit,
  A11yIssue,
  highlightIssue,
  suppressRule,
  unsuppressRule,
  getA11yScore
} from './A11yCheckerPlugin';

/**
 * Accessibility Checker Panel
 */
const A11yCheckerPanel: React.FC<{
  isVisible: boolean;
  onClose?: () => void;
}> = ({ isVisible, onClose }) => {
  const [issues, setIssues] = useState<A11yIssue[]>([]);
  const [score, setScore] = useState(100);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'error' | 'warning'>('all');
  const [overlay, setOverlay] = useState(false);

  // Debounced audit
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!isVisible) return;
    const updateAudit = () => {
      const newIssues = runA11yAudit();
      setIssues(newIssues);
      setScore(getA11yScore());
      if (overlay) {
        // Highlight all issues
        newIssues.forEach(issue => highlightIssue(issue, true));
      } else {
        newIssues.forEach(issue => highlightIssue(issue, false));
      }
    };
    updateAudit();
    const handleInput = () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(updateAudit, 400);
    };
    // Listen for input events in the contenteditable area
    const editor = document.querySelector('[contenteditable="true"]');
    if (editor) editor.addEventListener('input', handleInput);
    return () => {
      if (editor) editor.removeEventListener('input', handleInput);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      // Remove all overlays
      issues.forEach(issue => highlightIssue(issue, false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, overlay]);

  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.severity === filter);

  const toggleExpanded = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
      if (issues.find(i => i.id === issueId)) {
        highlightIssue(issues.find(i => i.id === issueId)!, false);
      }
    } else {
      newExpanded.add(issueId);
      if (issues.find(i => i.id === issueId)) {
        highlightIssue(issues.find(i => i.id === issueId)!, true);
      }
    }
    setExpandedIssues(newExpanded);
  };

  const handleJumpTo = (issue: A11yIssue) => {
    if (issue.element) {
      issue.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlightIssue(issue, true);
    }
  };

  const handleSuppress = (rule: string) => {
    suppressRule(rule);
    setIssues(runA11yAudit());
  };

  const handleUnsuppress = (rule: string) => {
    unsuppressRule(rule);
    setIssues(runA11yAudit());
  };

  if (!isVisible) return null;

  return (
    <div className="rte-a11y-panel">
      <div className="a11y-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Accessibility Audit</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`score ${score >= 80 ? 'good' : score >= 60 ? 'warning' : 'error'}`}>{score.toFixed(0)}</div>
          <button
            className="rte-a11y-close"
            onClick={onClose}
            aria-label="Close accessibility panel"
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', marginLeft: 8 }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Advanced UI: Filtering and Overlay */}
      <div style={{ display: 'flex', gap: 8, padding: '8px 16px', alignItems: 'center' }}>
        <label style={{ fontSize: 12 }}>Filter:</label>
        <select value={filter} onChange={e => setFilter(e.target.value as any)} style={{ fontSize: 12 }}>
          <option value="all">All</option>
          <option value="error">Errors</option>
          <option value="warning">Warnings</option>
        </select>
        <label style={{ fontSize: 12, marginLeft: 16 }}>Overlay:</label>
        <input type="checkbox" checked={overlay} onChange={e => setOverlay(e.target.checked)} />
        <span style={{ fontSize: 12 }}>Highlight all issues</span>
      </div>

      {/* Summary Stats */}
      <div className="a11y-stats">
        <div className="stat error-stat">
          <span className="label">Errors</span>
          <span className="count">{errorCount}</span>
        </div>
        <div className="stat warning-stat">
          <span className="label">Warnings</span>
          <span className="count">{warningCount}</span>
        </div>
      </div>

      {/* Issues List */}
      <div className="a11y-issues">
        {filteredIssues.length === 0 ? (
          <div className="a11y-empty">✓ No accessibility issues found</div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`issue-item ${issue.severity}`}
            >
              <div
                className="issue-header"
                onClick={() => toggleExpanded(issue.id)}
              >
                <span className={`severity-badge ${issue.severity}`}>
                  {issue.severity === 'error' ? '✕' : '⚠'}
                </span>
                <span className="issue-title">{issue.message}</span>
                <button
                  className="expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpanded(issue.id);
                  }}
                >
                  {expandedIssues.has(issue.id) ? '▼' : '▶'}
                </button>
              </div>

              {expandedIssues.has(issue.id) && (
                <div className="issue-details">
                  <div className="issue-rule">
                    <strong>Rule:</strong> {issue.rule}
                  </div>

                  {issue.suggestion && (
                    <div className="issue-suggestion">
                      <strong>Suggestion:</strong> {issue.suggestion}
                    </div>
                  )}

                  <div className="issue-path">
                    <strong>Location:</strong> {issue.nodePath}
                  </div>

                  <div className="issue-actions">
                    <button
                      className="action-btn jump"
                      onClick={() => handleJumpTo(issue)}
                    >
                      Jump to Element
                    </button>
                    {issue.fixable && (
                      <button
                        className="action-btn fix"
                        onClick={async () => {
                          // Special prompt for alt text
                          // --- Undoable auto-fix integration ---
                          // Use execEditorCommand for command execution, fallback to direct
                          const execCmd = (window as any).execEditorCommand
                            ? (window as any).execEditorCommand
                            : (window as any).registerEditorCommand;
                          let userValue: string | null = null;
                          if (issue.rule === 'image-alt-text') {
                            userValue = window.prompt('Enter alt text for image:', '');
                            if (userValue !== null && issue.element && execCmd) {
                              execCmd('setAttribute', issue.element, 'alt', userValue);
                            } else if (userValue !== null && issue.element) {
                              issue.element.setAttribute('alt', userValue); // fallback
                            }
                          } else if (issue.rule === 'form-label') {
                            userValue = window.prompt('Enter aria-label for input:', 'Input');
                            if (userValue !== null && issue.element && execCmd) {
                              execCmd('setAttribute', issue.element, 'aria-label', userValue);
                            } else if (userValue !== null && issue.element) {
                              issue.element.setAttribute('aria-label', userValue); // fallback
                            }
                          } else if (issue.rule === 'link-text') {
                            userValue = window.prompt('Enter link text:', 'Link');
                            if (userValue !== null && issue.element && execCmd) {
                              execCmd('setText', issue.element, userValue);
                            } else if (userValue !== null && issue.element) {
                              issue.element.textContent = userValue;
                            }
                          } else {
                            const { autoFixA11yIssue } = await import('./A11yCheckerPlugin');
                            if (execCmd && issue.element) {
                              execCmd('autoFixA11y', issue);
                            } else {
                              autoFixA11yIssue(issue); // fallback
                            }
                          }
                          setIssues(runA11yAudit());
                        }}
                      >
                        {issue.fixLabel || 'Auto-fix'}
                      </button>
                    )}
                    <button
                      className="action-btn suppress"
                      onClick={() => handleSuppress(issue.rule)}
                    >
                      Suppress Rule
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/**
 * Accessibility Checker Plugin Provider
 */
interface A11yCheckerPluginProviderProps {
  children?: React.ReactNode;
}

export const A11yCheckerPluginProvider: React.FC<A11yCheckerPluginProviderProps> = ({ children }) => {
  const [isA11yCheckerVisible, setIsA11yCheckerVisible] = useState(false);

  useEffect(() => {
    // Register toggle command
    (window as any).registerEditorCommand?.('toggleA11yChecker', () => {
      setIsA11yCheckerVisible(!isA11yCheckerVisible);
    });
  }, [isA11yCheckerVisible]);

  // Handler for close button
  const handleClosePanel = () => {
    setIsA11yCheckerVisible(false);
  };

  return (
    <>
      {children}
      <A11yCheckerPanel isVisible={isA11yCheckerVisible} onClose={handleClosePanel} />
      <style>{`
        .rte-a11y-close:hover {
          color: #d32f2f;
        }
        .rte-a11y-panel {
          position: absolute;
          right: 0;
          top: 0;
          width: 350px;
          max-height: 400px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
          overflow-y: auto;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .a11y-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          background-color: #fafafa;
        }

        .a11y-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .score {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          color: white;
        }

        .score.good {
          background-color: #4caf50;
        }

        .score.warning {
          background-color: #ff9800;
        }

        .score.error {
          background-color: #f44336;
        }

        .a11y-stats {
          display: flex;
          padding: 12px 16px;
          gap: 12px;
          border-bottom: 1px solid #eee;
        }

        .a11y-stats .stat {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px;
          background-color: #f5f5f5;
          border-radius: 4px;
          text-align: center;
        }

        .a11y-stats .label {
          font-size: 11px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .a11y-stats .count {
          font-size: 18px;
          font-weight: 600;
        }

        .error-stat .count {
          color: #f44336;
        }

        .warning-stat .count {
          color: #ff9800;
        }

        .a11y-issues {
          padding: 12px;
        }

        .a11y-empty {
          padding: 16px;
          text-align: center;
          color: #4caf50;
          font-size: 13px;
          font-weight: 500;
        }

        .issue-item {
          margin-bottom: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .issue-item.error {
          border-left: 4px solid #f44336;
        }

        .issue-item.warning {
          border-left: 4px solid #ff9800;
        }

        .issue-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background-color: #fafafa;
          cursor: pointer;
          user-select: none;
        }

        .issue-header:hover {
          background-color: #f5f5f5;
        }

        .severity-badge {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: 600;
        }

        .severity-badge.error {
          background-color: #f44336;
        }

        .severity-badge.warning {
          background-color: #ff9800;
        }

        .issue-title {
          flex: 1;
          font-size: 13px;
          font-weight: 500;
          color: #333;
        }

        .expand-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          color: #666;
          padding: 0 4px;
        }

        .issue-details {
          padding: 12px;
          background-color: white;
          border-top: 1px solid #eee;
          font-size: 12px;
          line-height: 1.5;
        }

        .issue-rule,
        .issue-suggestion,
        .issue-path {
          margin-bottom: 8px;
        }

        .issue-suggestion {
          color: #1976d2;
          background-color: #e3f2fd;
          padding: 8px;
          border-radius: 3px;
        }

        .issue-path {
          color: #666;
          font-family: monospace;
        }

        .issue-actions {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .action-btn {
          flex: 1;
          padding: 6px;
          font-size: 11px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 3px;
          cursor: pointer;
        }

        .action-btn:hover {
          background-color: #eeeeee;
        }

        .action-btn.jump {
          background-color: #e3f2fd;
          border-color: #1976d2;
          color: #1976d2;
        }

        .action-btn.jump:hover {
          background-color: #bbdefb;
        }

        .a11y-highlighted {
          outline: 2px solid #ff9800;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default A11yCheckerPanel;
