import React from 'react';
import { showToast } from '@editora/ui-core';

export type ToastOptions = {
  duration?: number;
};

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

const prefixByVariant: Record<ToastVariant, string> = {
  default: '',
  success: 'Success: ',
  error: 'Error: ',
  warning: 'Warning: ',
  info: 'Info: '
};

export function toast(message: string, options: ToastOptions = {}) {
  return showToast(message, options);
}

export const toastApi = {
  show(message: string, options: ToastOptions = {}) {
    return showToast(message, options);
  },
  success(message: string, options: ToastOptions = {}) {
    return showToast(`${prefixByVariant.success}${message}`, options);
  },
  error(message: string, options: ToastOptions = {}) {
    return showToast(`${prefixByVariant.error}${message}`, options);
  },
  warning(message: string, options: ToastOptions = {}) {
    return showToast(`${prefixByVariant.warning}${message}`, options);
  },
  info(message: string, options: ToastOptions = {}) {
    return showToast(`${prefixByVariant.info}${message}`, options);
  }
};

export function ToastAPI() {
  return null;
}

export default ToastAPI;
