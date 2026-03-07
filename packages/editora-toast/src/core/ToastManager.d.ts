import { ToastInstance, ToastOptions, ToastConfig, ToastManager as IToastManager, ToastPromiseOptions, ToastPlugin } from './types';
export declare class ToastManager implements IToastManager {
    private store;
    private queue;
    private renderer;
    private lifecycle;
    private config;
    private idCounter;
    private pausedToasts;
    private windowFocusHandler?;
    private windowBlurHandler?;
    private visibilityChangeHandler?;
    constructor(config?: Partial<ToastConfig>);
    show(options: ToastOptions): ToastInstance;
    update(id: string, options: Partial<ToastOptions>): boolean;
    dismiss(id: string): boolean;
    clear(): void;
    promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T>;
    group(groupId: string, options: ToastOptions): ToastInstance;
    use(plugin: ToastPlugin): void;
    configure(config: Partial<ToastConfig>): void;
    getConfig(): ToastConfig;
    getToasts(): ToastInstance[];
    getGroups(): import("./types").ToastGroup[];
    info(message: string, duration?: number): ToastInstance;
    success(message: string, duration?: number): ToastInstance;
    error(message: string, duration?: number): ToastInstance;
    warning(message: string, duration?: number): ToastInstance;
    loading(message: string, duration?: number): ToastInstance;
    private normalizeOptions;
    onEditorEvent(event: string, callback: (toast: ToastInstance, ...args: any[]) => void): void;
    triggerEditorEvent(event: string, toast: ToastInstance, ...args: any[]): void;
    private setupWindowFocusHandling;
    private teardownWindowFocusHandling;
    private pauseAllToasts;
    private resumeAllToasts;
    destroy(): void;
}
//# sourceMappingURL=ToastManager.d.ts.map