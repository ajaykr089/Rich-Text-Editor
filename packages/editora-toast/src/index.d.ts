import { ToastOptions, ToastInstance, ToastConfig, ToastPlugin, ToastPromiseOptions, ToastTheme, ToastPosition } from './core/types';
export type ToastLevel = 'info' | 'success' | 'error' | 'warning' | 'loading';
export interface ToastOptionsLegacy extends ToastOptions {
    message: string;
}
export declare const toast: {
    info: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) => ToastInstance | {
        dismiss: () => void;
    };
    success: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) => ToastInstance | {
        dismiss: () => void;
    };
    error: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) => ToastInstance | {
        dismiss: () => void;
    };
    warning: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) => ToastInstance | {
        dismiss: () => void;
    };
    loading: (msg: string, optionsOrDuration?: Partial<ToastOptions> | number, theme?: ToastTheme, position?: ToastPosition) => ToastInstance | {
        dismiss: () => void;
    };
};
export default toast;
export { ToastManager } from './core/ToastManager';
export type { ToastLevel as ToastLevelAdvanced, ToastPosition, ToastTheme, ToastAction, ToastProgress, ToastContent, ToastOptions as ToastOptionsAdvanced, ToastInstance, ToastConfig, ToastPlugin, ToastPromiseOptions, SpringConfig, AnimationType, AnimationConfig, SpringAnimation, BounceAnimation, SlideAnimation, ZoomAnimation, FlipAnimation, FadeAnimation, ElasticAnimation, RotateAnimation, CustomAnimation } from './core/types';
export declare const toastAdvanced: {
    show: (options: ToastOptions) => ToastInstance;
    update: (id: string, options: Partial<ToastOptions>) => boolean;
    dismiss: (id: string) => boolean;
    clear: () => void;
    info: (message: string, options?: Partial<ToastOptions>) => ToastInstance;
    success: (message: string, options?: Partial<ToastOptions>) => ToastInstance;
    error: (message: string, options?: Partial<ToastOptions>) => ToastInstance;
    warning: (message: string, options?: Partial<ToastOptions>) => ToastInstance;
    loading: (message: string, options?: Partial<ToastOptions>) => ToastInstance;
    promise: <T>(promise: Promise<T>, options: ToastPromiseOptions<T>) => Promise<T>;
    group: (id: string, options: ToastOptions) => ToastInstance;
    configure: (config: Partial<ToastConfig>) => void;
    use: (plugin: ToastPlugin) => void;
    getToasts: () => ToastInstance[];
    getGroups: () => import("./core/types").ToastGroup[];
    getConfig: () => ToastConfig;
    onEditorEvent: (event: string, callback: (toast: ToastInstance, ...args: any[]) => void) => void;
    triggerEditorEvent: (event: string, toast: ToastInstance, ...args: any[]) => void;
    destroy: () => void;
};
export { toastAdvanced as toastPro };
//# sourceMappingURL=index.d.ts.map