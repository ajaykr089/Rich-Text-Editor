export type ToastLevel = 'info' | 'success' | 'error' | 'warning' | 'loading' | 'progress' | 'promise' | 'custom';
export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';
export type ToastTheme = 'light' | 'dark' | 'system' | 'custom' | 'colored' | 'minimal' | 'glass' | 'neon' | 'retro' | 'ocean' | 'forest' | 'sunset' | 'midnight';
export type QueueStrategy = 'fifo' | 'lifo';
export interface SpringConfig {
    stiffness?: number;
    damping?: number;
    mass?: number;
    precision?: number;
}
export type AnimationType = 'css' | 'spring' | 'bounce' | 'slide' | 'zoom' | 'flip' | 'fade' | 'elastic' | 'rotate' | 'custom';
export interface SpringAnimation {
    type: 'spring';
    config?: SpringConfig;
    duration?: number;
}
export interface BounceAnimation {
    type: 'bounce';
    direction?: 'up' | 'down' | 'left' | 'right';
    intensity?: 'gentle' | 'normal' | 'strong';
    duration?: number;
}
export interface SlideAnimation {
    type: 'slide';
    direction?: 'up' | 'down' | 'left' | 'right';
    distance?: number;
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
    duration?: number;
}
export interface ZoomAnimation {
    type: 'zoom';
    scale?: number;
    origin?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';
    duration?: number;
}
export interface FlipAnimation {
    type: 'flip';
    axis?: 'x' | 'y';
    perspective?: number;
    direction?: 'forward' | 'backward';
    duration?: number;
}
export interface FadeAnimation {
    type: 'fade';
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    duration?: number;
}
export interface ElasticAnimation {
    type: 'elastic';
    direction?: 'up' | 'down' | 'left' | 'right';
    intensity?: 'gentle' | 'normal' | 'strong';
    duration?: number;
}
export interface RotateAnimation {
    type: 'rotate';
    degrees?: number;
    direction?: 'clockwise' | 'counterclockwise';
    origin?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    duration?: number;
}
export interface CustomAnimation {
    type: 'custom';
    show?: (element: HTMLElement, toast: ToastInstance) => Promise<void> | void;
    hide?: (element: HTMLElement, toast: ToastInstance) => Promise<void> | void;
    update?: (element: HTMLElement, toast: ToastInstance, updates: Partial<ToastOptions>) => Promise<void> | void;
}
export type AnimationConfig = SpringAnimation | BounceAnimation | SlideAnimation | ZoomAnimation | FlipAnimation | FadeAnimation | ElasticAnimation | RotateAnimation | CustomAnimation | {
    type: 'css';
};
export interface ToastAction {
    label: string;
    onClick: () => void;
    primary?: boolean;
}
export interface ToastProgress {
    value: number;
    showPercentage?: boolean;
}
export interface ToastContent {
    message: string;
    icon?: string;
    actions?: ToastAction[];
    progress?: ToastProgress;
    html?: boolean;
    render?: () => HTMLElement;
}
export interface ToastOptions extends Partial<ToastContent> {
    id?: string;
    level?: ToastLevel;
    duration?: number;
    position?: ToastPosition;
    priority?: number;
    group?: string;
    persistent?: boolean;
    closable?: boolean;
    pauseOnHover?: boolean;
    pauseOnFocus?: boolean;
    swipeDismiss?: boolean;
    swipeDirection?: 'any' | 'horizontal' | 'vertical' | 'left' | 'right' | 'up' | 'down';
    dragDismiss?: boolean;
    rtl?: boolean;
    theme?: ToastTheme;
    customClass?: string;
    animation?: AnimationConfig;
    onShow?: () => void;
    onHide?: () => void;
    onUpdate?: (options: Partial<ToastOptions>) => void;
}
export interface ToastInstance {
    id: string;
    options: ToastOptions;
    element?: HTMLElement;
    timeoutId?: number;
    createdAt: number;
    dismiss: () => void;
    update: (options: Partial<ToastOptions>) => void;
}
export interface ToastPromiseOptions<T = any> {
    loading: string | ToastOptions;
    success: string | ((data: T) => string) | ToastOptions;
    error: string | ((error: any) => string) | ToastOptions;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
}
export interface ToastGroup {
    id: string;
    toasts: ToastInstance[];
    collapsed?: boolean;
    progress?: number;
}
export interface ToastConfig {
    position: ToastPosition;
    duration: number;
    maxVisible: number;
    queueStrategy: QueueStrategy;
    theme: ToastTheme;
    pauseOnHover: boolean;
    pauseOnFocus: boolean;
    pauseOnWindowBlur: boolean;
    swipeDismiss: boolean;
    swipeDirection?: 'any' | 'horizontal' | 'vertical' | 'left' | 'right' | 'up' | 'down';
    dragDismiss: boolean;
    rtl: boolean;
    enableAccessibility: boolean;
    container?: HTMLElement;
    zIndex?: number;
    animation?: AnimationConfig;
}
export interface ToastPlugin {
    name: string;
    install: (manager: ToastManager) => void;
    uninstall?: (manager: ToastManager) => void;
}
export interface ToastManager {
    show(options: ToastOptions): ToastInstance;
    update(id: string, options: Partial<ToastOptions>): boolean;
    dismiss(id: string): boolean;
    clear(): void;
    configure(config: Partial<ToastConfig>): void;
    promise<T>(promise: Promise<T>, options: ToastPromiseOptions<T>): Promise<T>;
    group(id: string, options: ToastOptions): ToastInstance;
    use(plugin: ToastPlugin): void;
    getConfig(): ToastConfig;
    getToasts(): ToastInstance[];
    getGroups(): ToastGroup[];
}
//# sourceMappingURL=types.d.ts.map