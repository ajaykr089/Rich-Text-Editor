import { SpringConfig, AnimationConfig, ToastInstance, ToastOptions } from './types';
export declare class SpringAnimation {
    private config;
    constructor(config?: SpringConfig);
    animate(element: HTMLElement, properties: Record<string, {
        from: number;
        to: number;
        unit?: string;
    }>, onUpdate: (values: Record<string, string>) => void, onComplete?: () => void, config?: Partial<SpringConfig>): () => void;
}
export declare class AnimationManager {
    private springAnimation;
    constructor();
    showToast(element: HTMLElement, toast: ToastInstance, animation: AnimationConfig): Promise<void>;
    hideToast(element: HTMLElement, toast: ToastInstance, animation: AnimationConfig): Promise<void>;
    updateToast(element: HTMLElement, toast: ToastInstance, updates: Partial<ToastOptions>, animation: AnimationConfig): Promise<void>;
    private animateCssShow;
    private animateCssHide;
    private animateSpringShow;
    private animateSpringHide;
    private animateBounceShow;
    private animateBounceHide;
    private animateSlideShow;
    private animateSlideHide;
    private animateZoomShow;
    private animateZoomHide;
    private animateFlipShow;
    private animateFlipHide;
    private animateFadeShow;
    private animateFadeHide;
    private animateElasticShow;
    private animateElasticHide;
    private animateRotateShow;
    private animateRotateHide;
}
export declare const animationManager: AnimationManager;
//# sourceMappingURL=AnimationUtils.d.ts.map