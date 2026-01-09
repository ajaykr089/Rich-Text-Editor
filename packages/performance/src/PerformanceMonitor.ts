/**
 * Performance metrics for monitoring.
 */
export interface PerformanceMetrics {
  /** DOM manipulation time */
  domTime: number;
  /** Rendering time */
  renderTime: number;
  /** Transaction processing time */
  transactionTime: number;
  /** Memory usage */
  memoryUsage: number;
  /** Timestamp */
  timestamp: number;
}

/**
 * Configuration for performance monitoring.
 */
export interface PerformanceConfig {
  /** Whether to enable monitoring */
  enabled?: boolean;
  /** Sampling interval in milliseconds */
  sampleInterval?: number;
  /** Maximum number of samples to keep */
  maxSamples?: number;
  /** Whether to log performance warnings */
  logWarnings?: boolean;
}

/**
 * Performance monitor for tracking editor performance metrics.
 */
export class PerformanceMonitor {
  private config: Required<PerformanceConfig>;
  private metrics: PerformanceMetrics[] = [];
  private isMonitoring = false;
  private sampleInterval: number | null = null;

  // Current operation tracking
  private currentOperation: {
    type: string;
    startTime: number;
    memoryStart: number;
  } | null = null;

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enabled: true,
      sampleInterval: 5000, // 5 seconds
      maxSamples: 100,
      logWarnings: true,
      ...config
    };

    if (this.config.enabled) {
      this.startMonitoring();
    }
  }

  /**
   * Start monitoring performance.
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.sampleInterval = window.setInterval(() => {
      this.collectMetrics();
    }, this.config.sampleInterval);
  }

  /**
   * Stop monitoring performance.
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.sampleInterval) {
      clearInterval(this.sampleInterval);
      this.sampleInterval = null;
    }
  }

  /**
   * Start tracking an operation.
   */
  startOperation(type: string): void {
    if (!this.config.enabled) return;

    const memoryInfo = (performance as any).memory;
    this.currentOperation = {
      type,
      startTime: performance.now(),
      memoryStart: memoryInfo ? memoryInfo.usedJSHeapSize : 0
    };
  }

  /**
   * End tracking an operation and record metrics.
   */
  endOperation(): PerformanceMetrics | null {
    if (!this.config.enabled || !this.currentOperation) return null;

    const endTime = performance.now();
    const memoryInfo = (performance as any).memory;
    const endMemory = memoryInfo ? memoryInfo.usedJSHeapSize : 0;

    const metrics: PerformanceMetrics = {
      domTime: 0, // Would be calculated based on operation type
      renderTime: endTime - this.currentOperation.startTime,
      transactionTime: endTime - this.currentOperation.startTime,
      memoryUsage: Math.round((endMemory - this.currentOperation.memoryStart) / 1024 / 1024),
      timestamp: Date.now()
    };

    // Add operation-specific metrics
    switch (this.currentOperation.type) {
      case 'transaction':
        metrics.transactionTime = endTime - this.currentOperation.startTime;
        break;
      case 'render':
        metrics.renderTime = endTime - this.currentOperation.startTime;
        break;
      case 'dom':
        metrics.domTime = endTime - this.currentOperation.startTime;
        break;
    }

    this.addMetrics(metrics);
    this.currentOperation = null;

    // Log warnings for slow operations
    if (this.config.logWarnings) {
      this.checkPerformanceWarnings(metrics);
    }

    return metrics;
  }

  /**
   * Get current performance metrics.
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Get average metrics over a time period.
   */
  getAverageMetrics(durationMs: number = 60000): Partial<PerformanceMetrics> {
    const cutoff = Date.now() - durationMs;
    const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);

    if (recentMetrics.length === 0) return {};

    const averages = recentMetrics.reduce(
      (acc, metric) => ({
        domTime: acc.domTime + metric.domTime,
        renderTime: acc.renderTime + metric.renderTime,
        transactionTime: acc.transactionTime + metric.transactionTime,
        memoryUsage: acc.memoryUsage + metric.memoryUsage
      }),
      { domTime: 0, renderTime: 0, transactionTime: 0, memoryUsage: 0 }
    );

    return {
      domTime: Math.round(averages.domTime / recentMetrics.length),
      renderTime: Math.round(averages.renderTime / recentMetrics.length),
      transactionTime: Math.round(averages.transactionTime / recentMetrics.length),
      memoryUsage: Math.round(averages.memoryUsage / recentMetrics.length)
    };
  }

  /**
   * Clear all metrics.
   */
  clearMetrics(): void {
    this.metrics = [];
  }

  /**
   * Collect current performance metrics.
   */
  private collectMetrics(): void {
    const memoryInfo = (performance as any).memory;
    if (!memoryInfo) return;

    const metrics: PerformanceMetrics = {
      domTime: 0,
      renderTime: 0,
      transactionTime: 0,
      memoryUsage: Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024),
      timestamp: Date.now()
    };

    this.addMetrics(metrics);
  }

  /**
   * Add metrics to the collection.
   */
  private addMetrics(metrics: PerformanceMetrics): void {
    this.metrics.push(metrics);

    // Keep only the most recent samples
    if (this.metrics.length > this.config.maxSamples) {
      this.metrics = this.metrics.slice(-this.config.maxSamples);
    }
  }

  /**
   * Check for performance warnings.
   */
  private checkPerformanceWarnings(metrics: PerformanceMetrics): void {
    const warnings = [];

    if (metrics.renderTime > 16) { // More than one frame at 60fps
      warnings.push(`Slow render: ${metrics.renderTime}ms`);
    }

    if (metrics.transactionTime > 100) {
      warnings.push(`Slow transaction: ${metrics.transactionTime}ms`);
    }

    if (metrics.memoryUsage > 50) { // High memory usage
      warnings.push(`High memory usage: ${metrics.memoryUsage}MB`);
    }

    if (warnings.length > 0) {
      console.warn('Performance warning:', warnings.join(', '));
    }
  }

  /**
   * Destroy the monitor and clean up resources.
   */
  destroy(): void {
    this.stopMonitoring();
    this.clearMetrics();
  }
}

/**
 * Create a performance monitor instance.
 */
export function createPerformanceMonitor(config?: PerformanceConfig): PerformanceMonitor {
  return new PerformanceMonitor(config);
}

/**
 * Global performance monitor instance.
 */
let globalPerformanceMonitor: PerformanceMonitor | null = null;

/**
 * Get the global performance monitor instance.
 */
export function getGlobalPerformanceMonitor(): PerformanceMonitor {
  if (!globalPerformanceMonitor) {
    globalPerformanceMonitor = new PerformanceMonitor();
  }
  return globalPerformanceMonitor;
}