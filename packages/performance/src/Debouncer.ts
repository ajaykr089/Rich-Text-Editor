/**
 * Configuration for debouncing.
 */
export interface DebounceConfig {
  /** Delay in milliseconds */
  delay?: number;
  /** Whether to call on leading edge */
  leading?: boolean;
  /** Maximum time between calls */
  maxWait?: number;
}

/**
 * Simple debouncer for delaying function execution.
 * Useful for optimizing UI updates and API calls.
 */
export class Debouncer {
  private timeoutId: number | null = null;
  private delay: number;

  constructor(delay: number = 250) {
    this.delay = delay;
  }

  /**
   * Execute the debounced function.
   */
  execute<T extends any[]>(func: (...args: T) => any, ...args: T): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      func(...args);
    }, this.delay);
  }

  /**
   * Cancel pending execution.
   */
  cancel(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

/**
 * Create a debounced function.
 */
export function createDebouncer(delay?: number): Debouncer {
  return new Debouncer(delay);
}

/**
 * Simple debounce utility for one-off use.
 */
export function debounce<T extends any[]>(
  func: (...args: T) => any,
  delay: number = 250
): (...args: T) => void {
  let timeoutId: any = null;

  return (...args: T) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
