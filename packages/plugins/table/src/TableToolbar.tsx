import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import './table.css';

interface TableToolbarProps {
  isVisible: boolean;
  position: { top: number; left: number };
  onAddRowAbove: () => void;
  onAddRowBelow: () => void;
  onAddColumnLeft: () => void;
  onAddColumnRight: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onToggleHeaderRow: () => void;
  onToggleHeaderColumn: () => void;
  onDeleteTable: () => void;
  canDeleteRow: boolean;
  canDeleteColumn: boolean;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  isVisible,
  position,
  onAddRowAbove,
  onAddRowBelow,
  onAddColumnLeft,
  onAddColumnRight,
  onDeleteRow,
  onDeleteColumn,
  onToggleHeaderRow,
  onToggleHeaderColumn,
  onDeleteTable,
  canDeleteRow,
  canDeleteColumn,
}) => {
  if (!isVisible) return null;

  return (
    <div
      className="table-toolbar"
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        padding: '8px',
        display: 'flex',
        gap: '4px',
        flexWrap: 'wrap',
        minWidth: '200px',
      }}
    >
      {/* Row Operations */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onAddRowAbove}
          title="Add row above"
          type="button"
        >
          ↥ Row
        </button>
        <button
          className="toolbar-btn"
          onClick={onAddRowBelow}
          title="Add row below"
          type="button"
        >
          ↧ Row
        </button>
        <button
          className="toolbar-btn"
          onClick={onDeleteRow}
          disabled={!canDeleteRow}
          title="Delete row"
          type="button"
        >
          ✕ Row
        </button>
      </div>

      {/* Column Operations */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onAddColumnLeft}
          title="Add column left"
          type="button"
        >
          ← Col
        </button>
        <button
          className="toolbar-btn"
          onClick={onAddColumnRight}
          title="Add column right"
          type="button"
        >
          → Col
        </button>
        <button
          className="toolbar-btn"
          onClick={onDeleteColumn}
          disabled={!canDeleteColumn}
          title="Delete column"
          type="button"
        >
          ✕ Col
        </button>
      </div>

      {/* Header Operations */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          onClick={onToggleHeaderRow}
          title="Toggle header row"
          type="button"
        >
          ☰ Header
        </button>
        <button
          className="toolbar-btn"
          onClick={onToggleHeaderColumn}
          title="Toggle header column"
          type="button"
        >
          ☰ H Col
        </button>
      </div>

      {/* Table Operations */}
      <div className="toolbar-group">
        <button
          className="toolbar-btn delete-btn"
          onClick={onDeleteTable}
          title="Delete table"
          type="button"
        >
          🗑️ Table
        </button>
      </div>
    </div>
  );
};

/**
 * Table Resizer Component for column/row resizing
 */
interface TableResizerProps {
  table: HTMLElement;
  onResize: (columnIndex: number, width: number) => void;
}

export const TableResizer: React.FC<TableResizerProps> = ({ table, onResize }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeColumn, setResizeColumn] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || resizeColumn === null) return;

      const deltaX = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + deltaX); // Minimum width of 50px

      onResize(resizeColumn, newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeColumn(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeColumn, startX, startWidth, onResize]);

  const handleMouseDown = (e: React.MouseEvent, columnIndex: number) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeColumn(columnIndex);
    setStartX(e.clientX);

    // Get current column width
    const cells = table.querySelectorAll('tr:first-child td, tr:first-child th');
    if (cells[columnIndex]) {
      setStartWidth((cells[columnIndex] as HTMLElement).offsetWidth);
    }

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  // Add resize handles to table
  useEffect(() => {
    if (!table) return;

    const cells = table.querySelectorAll('tr:first-child td, tr:first-child th');

    cells.forEach((cell, index) => {
      const existingHandle = cell.querySelector('.resize-handle');
      if (existingHandle) return;

      const handle = document.createElement('div');
      handle.className = 'resize-handle';
      handle.style.cssText = `
        position: absolute;
        right: -2px;
        top: 0;
        bottom: 0;
        width: 4px;
        background: transparent;
        cursor: col-resize;
        z-index: 10;
      `;

      handle.addEventListener('mousedown', (e) => handleMouseDown(e as any, index));

      (cell as HTMLElement).style.position = 'relative';
      cell.appendChild(handle);
    });

    return () => {
      // Cleanup handles
      const handles = table.querySelectorAll('.resize-handle');
      handles.forEach(handle => handle.remove());
    };
  }, [table]);

  return null; // This component doesn't render anything visible
};
