import { ToastInstance, ToastConfig } from './types';
export declare class ToastQueue {
    private queue;
    private visible;
    private config;
    constructor(config: ToastConfig);
    enqueue(toast: ToastInstance): void;
    dequeue(id: string): boolean;
    private processQueue;
    private showToast;
    private hideToast;
    private deduplicate;
    updateConfig(config: Partial<ToastConfig>): void;
    getQueued(): ToastInstance[];
    getVisible(): ToastInstance[];
    getAll(): ToastInstance[];
    clear(): void;
    forceShow(toast: ToastInstance): void;
}
//# sourceMappingURL=ToastQueue.d.ts.map