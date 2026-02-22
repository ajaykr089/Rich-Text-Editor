import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import {
  AlertDialogAlertOptions,
  AlertDialogConfirmOptions,
  AlertDialogManager,
  AlertDialogPromptOptions,
  AlertResult,
  ConfirmResult,
  PromptResult,
  createAlertDialogManager
} from '@editora/ui-core';

export type AlertDialogApi = {
  alert: (options?: AlertDialogAlertOptions) => Promise<AlertResult>;
  confirm: (options?: AlertDialogConfirmOptions) => Promise<ConfirmResult>;
  prompt: (options?: AlertDialogPromptOptions) => Promise<PromptResult>;
};

const AlertDialogContext = createContext<AlertDialogApi | null>(null);

export type AlertDialogProviderProps = {
  children: React.ReactNode;
  hostId?: string;
};

export function AlertDialogProvider({ children, hostId = 'ui-alert-dialog-react-host' }: AlertDialogProviderProps) {
  const managerRef = useRef<AlertDialogManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = createAlertDialogManager();
  }

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let host = document.getElementById(hostId);
    if (!host) {
      host = document.createElement('div');
      host.id = hostId;
      host.setAttribute('data-ui-alert-dialog-react-host', 'true');
      document.body.appendChild(host);
    }

    managerRef.current?.setContainer(host);

    return () => {
      managerRef.current?.destroy('unmount');
      managerRef.current = null;
      if (host && host.parentElement) host.parentElement.removeChild(host);
    };
  }, [hostId]);

  const api = useMemo<AlertDialogApi>(
    () => ({
      alert: (options = {}) => managerRef.current?.alert(options) ?? Promise.resolve({ id: '', action: 'dismiss' }),
      confirm: (options = {}) => managerRef.current?.confirm(options) ?? Promise.resolve({ id: '', action: 'dismiss' }),
      prompt: (options = {}) =>
        managerRef.current?.prompt(options) ?? Promise.resolve({ id: '', action: 'dismiss', value: '' })
    }),
    []
  );

  return <AlertDialogContext.Provider value={api}>{children}</AlertDialogContext.Provider>;
}

export function useAlertDialog(): AlertDialogApi {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('useAlertDialog must be used within <AlertDialogProvider>.');
  }
  return context;
}

export default AlertDialogProvider;
