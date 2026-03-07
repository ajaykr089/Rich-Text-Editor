import { ToastInstance, ToastPosition, ToastConfig } from './types';
export declare class ToastRenderer {
    private containers;
    private config;
    private cssInjected;
    constructor(config: ToastConfig);
    ensureContainer(position: ToastPosition): HTMLElement;
    createToastElement(toast: ToastInstance): HTMLElement;
    showToast(toast: ToastInstance): Promise<void>;
    hideToast(toast: ToastInstance): Promise<void>;
    updateToast(toast: ToastInstance, updates: Partial<ToastInstance['options']>): Promise<void>;
    private pauseToast;
    private resumeToast;
    private addSwipeDismiss;
    private addDragDismiss;
    private announceToast;
    private sanitizeHTML;
    private injectCSS;
    destroy(): void;
}
//# sourceMappingURL=ToastRenderer.d.ts.map