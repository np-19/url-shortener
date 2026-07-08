import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import urlService from '../services/urlService';
import { urlDataSchema } from '../schemas/apiSchemas';

const dayInSeconds = 24 * 60 * 60;

export const expiresOptions = [
  { value: 'never', label: 'Never' },
  { value: 'custom', label: 'Custom date' },
  { value: '1', label: '1 day' },
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '365', label: '1 year' },
] as const;

export const useUrlShortenerForm = (onUrlCreated: () => void) => {
  const queryClient = useQueryClient();
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showCustomAlias, setShowCustomAlias] = useState(false);
  const [expiresIn, setExpiresIn] = useState<(typeof expiresOptions)[number]['value']>('never');
  const [customExpiresDate, setCustomExpiresDate] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setUrl('');
    setCustomAlias('');
    setShowCustomAlias(false);
    setExpiresIn('never');
    setCustomExpiresDate('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setShortUrl('');

    let expiresAtSeconds = 0;

    if (expiresIn === 'custom') {
      if (!customExpiresDate) {
        setError('Please select a custom expiration date');
        return;
      }

      const customExpirationDate = new Date(`${customExpiresDate}T23:59:59.999`);
      if (Number.isNaN(customExpirationDate.getTime()) || customExpirationDate.getTime() <= Date.now()) {
        setError('Please choose a future expiration date');
        return;
      }

      expiresAtSeconds = Math.ceil((customExpirationDate.getTime() - Date.now()) / 1000);
    } else if (expiresIn !== 'never') {
      expiresAtSeconds = Number.parseInt(expiresIn, 10) * dayInSeconds;
    }

    const validatedData = urlDataSchema.safeParse({
      originalUrl: url,
      expiresAt: expiresAtSeconds,
      ...(customAlias ? { customAlias } : {}),
    });

    if (!validatedData.success) {
      setError(validatedData.error.issues[0]?.message ?? 'Please enter valid URL details');
      return;
    }

    setLoading(true);

    try {
      const data = await urlService.createUrl(validatedData.data);
      setShortUrl(urlService.getShortUrl(data.shortId));

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-urls'] }),
        queryClient.invalidateQueries({ queryKey: ['analytics'] }),
      ]);

      resetForm();
      onUrlCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  return {
    url,
    setUrl,
    customAlias,
    setCustomAlias,
    showCustomAlias,
    setShowCustomAlias,
    expiresIn,
    setExpiresIn,
    customExpiresDate,
    setCustomExpiresDate,
    shortUrl,
    loading,
    error,
    handleSubmit,
  };
};