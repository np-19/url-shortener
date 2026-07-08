import { useToast } from '../context/ToastContext';

export const useCopyToast = () => {
  const toast = useToast();

  const copyText = async (text: string, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMessage);
    } catch {
      toast.error('Unable to copy to clipboard');
    }
  };

  return { copyText };
};