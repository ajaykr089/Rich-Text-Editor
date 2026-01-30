import React, { useState, useEffect, useRef } from 'react';
import { toast } from '@editora/toast';
import {
  Comment,
  getAllComments,
  addCommentCommand,
  resolveComment,
  reopenComment,
  deleteComment,
  replyToComment,
  updateCommentText,
  highlightComment
} from './CommentsPlugin';

/**
 * Comments Side Panel Component
 * 
 * Displays all comments with:
 * - Threaded replies
 * - Resolve/reopen buttons
 * - Highlight on hover
 * - Delete functionality
 * - Add reply interface
 */

interface CommentsSidePanelProps {
  isVisible: boolean;
  onAddComment: (author: string, text: string) => void;
  commentAuthor: string;
}

const CommentsSidePanel: React.FC<CommentsSidePanelProps> = ({ isVisible, onAddComment, commentAuthor }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [hoveredComment, setHoveredComment] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const refreshComments = () => {
      setComments(getAllComments());
    };

    refreshComments();
    const interval = setInterval(refreshComments, 500);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = (commentId: string) => {
    resolveComment(commentId, 'Current User');
    setComments([...getAllComments()]);
  };

  const handleReopen = (commentId: string) => {
    reopenComment(commentId);
    setComments([...getAllComments()]);
  };

  const handleDelete = (commentId: string) => {
    deleteComment(commentId);
    setComments([...getAllComments()]);
  };

  const handleReply = (commentId: string) => {
    if (replyText[commentId]?.trim()) {
      replyToComment(commentId, 'Current User', replyText[commentId]);
      setReplyText({ ...replyText, [commentId]: '' });
      setComments([...getAllComments()]);
    }
  };

  const handleHighlight = (commentId: string, highlight: boolean) => {
    highlightComment(commentId, highlight);
    setHoveredComment(highlight ? commentId : null);
  };

  const toggleExpanded = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="rte-comments-panel">
      <div className="comments-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Comments ({comments.length})</h3>
        <button
          className="rte-comments-close"
          onClick={() => {
            const evt = new CustomEvent('rte-close-comments-panel');
            window.dispatchEvent(evt);
          }}
          aria-label="Close comments panel"
          style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888', marginLeft: 8 }}
        >
          ✕
        </button>
      </div>

      {/* Add Comment Input (always enabled) */}
      <div className="comment-add-box" style={{ padding: 12, borderBottom: '1px solid #eee', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <textarea
          ref={inputRef}
          placeholder="Add a new comment..."
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          rows={2}
          style={{ fontSize: 13, padding: 8, borderRadius: 3, border: '1px solid #ddd', resize: 'vertical', fontFamily: 'inherit' }}
        />
        <button
          className="rte-button-small"
          style={{ alignSelf: 'flex-end', opacity: !newComment.trim() ? 0.5 : 1, pointerEvents: !newComment.trim() ? 'none' : 'auto' }}
          onClick={() => {
            if (!newComment.trim()) {
              toast.error('Comment cannot be empty');
              if (inputRef.current) inputRef.current.focus();
              return;
            }
            onAddComment(commentAuthor, newComment.trim());
            setNewComment('');
          }}
          disabled={!newComment.trim()}
        >
          Add Comment
        </button>
      </div>

      {comments.length === 0 ? (
        <div className="comments-empty">No comments yet</div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`comment-item ${comment.resolved ? 'resolved' : ''}`}
              onMouseEnter={() => handleHighlight(comment.id, true)}
              onMouseLeave={() => handleHighlight(comment.id, false)}
            >
              {/* Comment Header */}
              <div className="comment-header">
                <div className="comment-meta">
                  <strong>{comment.author}</strong>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  className="comment-expand"
                  onClick={() => toggleExpanded(comment.id)}
                  aria-label="Toggle comment"
                >
                  {expandedComments.has(comment.id) ? '▼' : '▶'}
                </button>
              </div>

              {/* Comment Text */}
              <div className="comment-text">{comment.text}</div>

              {/* Selected Text */}
              <div className="comment-selection">"{comment.selectedText}"</div>

              {/* Expanded Content */}
              {expandedComments.has(comment.id) && (
                <div className="comment-expanded">
                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="comment-reply">
                          <div className="reply-header">
                            <strong>{reply.author}</strong>
                            <span className="reply-date">
                              {new Date(reply.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="reply-text">{reply.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Reply */}
                  {!comment.resolved && (
                    <div className="comment-reply-input">
                      <textarea
                        placeholder="Add a reply..."
                        value={replyText[comment.id] || ''}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [comment.id]: e.target.value })
                        }
                        rows={2}
                      />
                      <button
                        onClick={() => handleReply(comment.id)}
                        className="rte-button-small"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="comment-actions">
                    {!comment.resolved ? (
                      <button
                        onClick={() => handleResolve(comment.id)}
                        className="action-button resolve"
                      >
                        ✓ Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReopen(comment.id)}
                        className="action-button reopen"
                      >
                        ↻ Reopen
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="action-button delete"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Comments Plugin Provider
 */
interface CommentsPluginProviderProps {
  children?: React.ReactNode;
}

export const CommentsPluginProvider: React.FC<CommentsPluginProviderProps> = ({ children }) => {
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('Anonymous');
  const selectionRef = useRef<Range | null>(null);

  // Add comment handler for panel
  const handleAddComment = (author: string, text: string) => {
    // Restore the last saved selection (if any) before adding comment
    if (selectionRef.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(selectionRef.current);
      const result = addCommentCommand(author, text);
      // After adding, clear selection (both ref and editor)
      selectionRef.current = null;
      sel?.removeAllRanges();
      if (!result) {
        toast.error('Could not add comment to selection.');
      }
    } else {
      // No selection: add as general comment
      const result = addCommentCommand(author, text, true);
      if (!result) {
        toast.error('Could not add general comment.');
      }
    }
  };

  useEffect(() => {
    // Register add comment command (for toolbar button)
    (window as any).registerEditorCommand?.('addComment', () => {
      // Save current selection when opening panel
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        selectionRef.current = sel.getRangeAt(0).cloneRange();
      } else {
        selectionRef.current = null;
      }
      toast.info('Use the comments panel to add a comment.');
      setIsCommentsVisible(true);
    });

    // Register toggle comments command
    (window as any).registerEditorCommand?.('toggleComments', () => {
      setIsCommentsVisible(!isCommentsVisible);
    });

    // Listen for close button event from panel
    const closeListener = () => setIsCommentsVisible(false);
    window.addEventListener('rte-close-comments-panel', closeListener);
    return () => {
      window.removeEventListener('rte-close-comments-panel', closeListener);
    };
  }, [isCommentsVisible, commentAuthor]);

  // While panel is open, always save the latest selection on selectionchange
  useEffect(() => {
    if (!isCommentsVisible) return;

    const updateSelection = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
        selectionRef.current = sel.getRangeAt(0).cloneRange();
      }
    };
    document.addEventListener('selectionchange', updateSelection);
    return () => {
      document.removeEventListener('selectionchange', updateSelection);
    };
  }, [isCommentsVisible]);

  return (
    <>
      {children}
      <CommentsSidePanel isVisible={isCommentsVisible} onAddComment={handleAddComment} commentAuthor={commentAuthor} />
      <style>{`
        .rte-comments-close:hover {
          color: #d32f2f;
        }
        .rte-comments-panel {
          position: absolute;
          right: 0;
          top: 0;
          width: 350px;
          height: 100%;
          background: white;
          border-left: 1px solid #ddd;
          box-shadow: -2px 0 4px rgba(0,0,0,0.1);
          overflow-y: auto;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          flex-direction: column;
        }

        .comments-header {
          padding: 16px;
          border-bottom: 1px solid #eee;
          background-color: #fafafa;
        }

        .comments-header h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .comments-empty {
          padding: 16px;
          text-align: center;
          color: #999;
          font-size: 13px;
        }

        .comments-list {
          padding: 12px;
        }

        .comment-item {
          padding: 12px;
          margin-bottom: 12px;
          border: 1px solid #eee;
          border-radius: 4px;
          background-color: white;
          transition: all 0.2s;
        }

        .comment-item:hover {
          border-color: #ddd;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .comment-item.resolved {
          opacity: 0.6;
          background-color: #f5f5f5;
        }

        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .comment-meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .comment-meta strong {
          font-size: 13px;
          color: #333;
        }

        .comment-date {
          font-size: 11px;
          color: #999;
        }

        .comment-expand {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          font-size: 12px;
          padding: 0;
        }

        .comment-text {
          font-size: 13px;
          line-height: 1.4;
          color: #333;
          margin-bottom: 8px;
        }

        .comment-selection {
          font-size: 12px;
          color: #666;
          font-style: italic;
          background-color: #f9f9f9;
          padding: 6px;
          border-radius: 3px;
          margin-bottom: 8px;
        }

        .comment-expanded {
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid #eee;
        }

        .comment-replies {
          margin-bottom: 12px;
        }

        .comment-reply {
          padding: 8px;
          background-color: #fafafa;
          border-radius: 3px;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .reply-header {
          display: flex;
          gap: 8px;
          margin-bottom: 4px;
        }

        .reply-header strong {
          font-size: 12px;
          color: #333;
        }

        .reply-date {
          font-size: 11px;
          color: #999;
        }

        .reply-text {
          font-size: 12px;
          color: #666;
          line-height: 1.3;
        }

        .comment-reply-input {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }

        .comment-reply-input textarea {
          font-size: 12px;
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-family: inherit;
          resize: vertical;
        }

        .rte-button-small {
          font-size: 12px;
          padding: 4px 8px;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }

        .rte-button-small:hover {
          background-color: #1565c0;
        }

        .comment-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }

        .action-button {
          font-size: 12px;
          padding: 4px 8px;
          background-color: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button:hover {
          background-color: #eeeeee;
        }

        .action-button.resolve {
          color: #2e7d32;
        }

        .action-button.delete {
          color: #c62828;
        }

        .rte-comment-anchor {
          position: relative;
        }

        .rte-comment-anchor.highlighted {
          background-color: #ffeb3b !important;
          border-radius: 3px;
        }
      `}</style>
    </>
  );
};

export default CommentsSidePanel;
