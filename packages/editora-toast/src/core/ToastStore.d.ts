import { ToastInstance, ToastGroup, ToastConfig, ToastPosition } from './types';
export declare class ToastStore {
    private toasts;
    private groups;
    private containers;
    private config;
    constructor(config: ToastConfig);
    addToast(toast: ToastInstance): void;
    removeToast(id: string): boolean;
    getToast(id: string): ToastInstance | undefined;
    getAllToasts(): ToastInstance[];
    getToastsByPosition(position: ToastPosition): ToastInstance[];
    updateToast(id: string, updates: Partial<ToastInstance>): boolean;
    private updateGroup;
    getGroup(id: string): ToastGroup | undefined;
    getAllGroups(): ToastGroup[];
    getContainer(position: ToastPosition): HTMLElement | undefined;
    setContainer(position: ToastPosition, container: HTMLElement): void;
    removeContainer(position: ToastPosition): boolean;
    getAllContainers(): Map<ToastPosition, HTMLElement>;
    getConfig(): ToastConfig;
    updateConfig(config: Partial<ToastConfig>): void;
    clear(): void;
    getStats(): {
        totalToasts: number;
        totalGroups: number;
        toastsByPosition: {
            [k: string]: number;
        };
    };
}
//# sourceMappingURL=ToastStore.d.ts.map