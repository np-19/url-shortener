import { useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
}

export const useCopyToast = () => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const copyText = async (text: string, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ message: successMessage, type: 'success' });
    } catch {
      setToast({ message: 'Unable to copy to clipboard', type: 'error' });
    }
  };

  return { toast, setToast, copyText };
};

export type { ToastType, ToastState };