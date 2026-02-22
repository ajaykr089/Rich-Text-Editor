import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import {
  DialogManager,
  DialogOptions,
  DialogResult,
  createDialogManager
} from '@editora/ui-core';

export type DialogApi = {
  open: (options?: DialogOptions) => Promise<DialogResult>;
  confirm: (options?: DialogOptions) => Promise<DialogResult>;
};

const DialogContext = createContext<DialogApi | null>(null);

export type DialogProviderProps = {
  children: React.ReactNode;
  hostId?: string;
};

export function DialogProvider({ children, hostId = 'ui-dialog-react-host' }: DialogProviderProps) {
  const managerRef = useRef<DialogManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = createDialogManager();
  }

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let host = document.getElementById(hostId);
    if (!host) {
      host = document.createElement('div');
      host.id = hostId;
      host.setAttribute('data-ui-dialog-react-host', 'true');
      document.body.appendChild(host);
    }

    managerRef.current?.setContainer(host);

    return () => {
      managerRef.current?.destroy('unmount');
      managerRef.current = null;
      if (host && host.parentElement) host.parentElement.removeChild(host);
    };
  }, [hostId]);

  const api = useMemo<DialogApi>(
    () => ({
      open: (options = {}) => managerRef.current?.open(options) ?? Promise.resolve({ id: '', action: 'dismiss' }),
      confirm: (options = {}) => managerRef.current?.confirm(options) ?? Promise.resolve({ id: '', action: 'dismiss' })
    }),
    []
  );

  return <DialogContext.Provider value={api}>{children}</DialogContext.Provider>;
}

export function useDialog(): DialogApi {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within <DialogProvider>.');
  }
  return context;
}

export default DialogProvider;
