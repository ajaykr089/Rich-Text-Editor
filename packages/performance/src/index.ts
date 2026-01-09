// Performance optimization utilities for Rich Text Editor

// Transaction batching and debouncing
export { TransactionBatcher, createTransactionBatcher } from './TransactionBatcher';
export { Debouncer, createDebouncer } from './Debouncer';

// Memory management
export { MemoryManager, createMemoryManager } from './MemoryManager';

// Performance monitoring
export { PerformanceMonitor, createPerformanceMonitor } from './PerformanceMonitor';

// Virtual scrolling framework
export { VirtualScroller, createVirtualScroller } from './VirtualScroller';

// Lazy loading utilities
export { LazyLoader, createLazyLoader } from './LazyLoader';

// Optimization helpers
export { optimizeEditorState, optimizeDocument } from './optimization';

// Performance hooks for React
export { useDebouncedCallback, useThrottledCallback } from './hooks';