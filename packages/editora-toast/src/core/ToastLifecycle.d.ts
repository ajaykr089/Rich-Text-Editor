import { ToastInstance, ToastPlugin } from './types';
type HookCallback = (toast: ToastInstance, ...args: any[]) => void | Promise<void>;
export declare class ToastLifecycle {
    private plugins;
    private hooks;
    use(plugin: ToastPlugin): void;
    remove(pluginName: string): boolean;
    getPlugins(): ToastPlugin[];
    on(event: keyof typeof this.hooks, callback: HookCallback): void;
    off(event: keyof typeof this.hooks, callback: HookCallback): void;
    trigger(event: keyof typeof this.hooks, toast: ToastInstance, ...args: any[]): Promise<void>;
    beforeShow(toast: ToastInstance): Promise<void>;
    afterShow(toast: ToastInstance): Promise<void>;
    beforeHide(toast: ToastInstance): Promise<void>;
    afterHide(toast: ToastInstance): Promise<void>;
    beforeUpdate(toast: ToastInstance, updates: any): Promise<void>;
    afterUpdate(toast: ToastInstance, updates: any): Promise<void>;
    onEditorEvent(event: string, callback: HookCallback): void;
    triggerEditorEvent(event: string, toast: ToastInstance, ...args: any[]): void;
    handlePromise<T>(promise: Promise<T>, onLoading: () => void, onSuccess: (data: T) => void, onError: (error: any) => void): Promise<T>;
    batchShow(toasts: ToastInstance[]): Promise<void>;
    batchHide(toasts: ToastInstance[]): Promise<void>;
    destroy(): void;
}
export {};
//# sourceMappingURL=ToastLifecycle.d.ts.map