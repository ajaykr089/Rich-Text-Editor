import React, { useEffect, useRef } from 'react';

export type TableSortDirection = 'asc' | 'desc';

export type TableSortChangeDetail = {
  columnIndex: number;
  key: string;
  direction: TableSortDirection;
};

export type TableRowSelectDetail = {
  index: number;
  selected: boolean;
  indices: number[];
  rows: Record<string, string>[];
};

export type TableProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  sortable?: boolean;
  selectable?: boolean;
  multiSelect?: boolean;
  striped?: boolean;
  hover?: boolean;
  compact?: boolean;
  bordered?: boolean;
  stickyHeader?: boolean;
  loading?: boolean;
  headless?: boolean;
  emptyText?: string;
  onSortChange?: (detail: TableSortChangeDetail) => void;
  onRowSelect?: (detail: TableRowSelectDetail) => void;
};

export function Table(props: TableProps) {
  const {
    sortable,
    selectable,
    multiSelect,
    striped,
    hover,
    compact,
    bordered,
    stickyHeader,
    loading,
    headless,
    emptyText,
    onSortChange,
    onRowSelect,
    children,
    ...rest
  } = props;

  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onSortHandler = (event: Event) => {
      const detail = (event as CustomEvent<TableSortChangeDetail>).detail;
      if (detail) onSortChange?.(detail);
    };

    const onRowHandler = (event: Event) => {
      const detail = (event as CustomEvent<TableRowSelectDetail>).detail;
      if (detail) onRowSelect?.(detail);
    };

    el.addEventListener('sort-change', onSortHandler as EventListener);
    el.addEventListener('row-select', onRowHandler as EventListener);
    return () => {
      el.removeEventListener('sort-change', onSortHandler as EventListener);
      el.removeEventListener('row-select', onRowHandler as EventListener);
    };
  }, [onSortChange, onRowSelect]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (sortable) el.setAttribute('sortable', '');
    else el.removeAttribute('sortable');

    if (selectable) el.setAttribute('selectable', '');
    else el.removeAttribute('selectable');

    if (multiSelect) el.setAttribute('multi-select', '');
    else el.removeAttribute('multi-select');

    if (striped) el.setAttribute('striped', '');
    else el.removeAttribute('striped');

    if (hover) el.setAttribute('hover', '');
    else el.removeAttribute('hover');

    if (compact) el.setAttribute('compact', '');
    else el.removeAttribute('compact');

    if (bordered) el.setAttribute('bordered', '');
    else el.removeAttribute('bordered');

    if (stickyHeader) el.setAttribute('sticky-header', '');
    else el.removeAttribute('sticky-header');

    if (loading) el.setAttribute('loading', '');
    else el.removeAttribute('loading');

    if (headless) el.setAttribute('headless', '');
    else el.removeAttribute('headless');

    if (emptyText) el.setAttribute('empty-text', emptyText);
    else el.removeAttribute('empty-text');
  }, [sortable, selectable, multiSelect, striped, hover, compact, bordered, stickyHeader, loading, headless, emptyText]);

  return React.createElement('ui-table', { ref, ...rest }, children);
}

export default Table;
