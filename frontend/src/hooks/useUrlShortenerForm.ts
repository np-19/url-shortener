import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import urlService from '../services/urlService';
import { urlDataSchema } from '../schemas/apiSchemas';
import { useDebouncedCallback } from './useDebouncedCallback';

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
  const [customAliasError, setCustomAliasError] = useState('');
  const [customAliasChecking, setCustomAliasChecking] = useState(false);
  const [customAliasAvailable, setCustomAliasAvailable] = useState<boolean | null>(null);
  const aliasRequestCounter = useRef(0);

  const isAliasFormatValid = (alias: string): boolean => {
    return /^[A-Za-z0-9-]{2,50}$/.test(alias);
  };

  const runAliasAvailabilityCheck = useCallback(async (candidateAlias: string): Promise<boolean> => {
    const normalized = candidateAlias.trim();

    if (!showCustomAlias || normalized.length === 0) {
      setCustomAliasError('');
      setCustomAliasAvailable(null);
      setCustomAliasChecking(false);
      return true;
    }

    if (!isAliasFormatValid(normalized)) {
      setCustomAliasError('Use 2-50 letters, numbers, or hyphens only.');
      setCustomAliasAvailable(false);
      setCustomAliasChecking(false);
      return false;
    }

    const requestId = ++aliasRequestCounter.current;
    setCustomAliasChecking(true);
    setCustomAliasAvailable(null);

    try {
      const result = await urlService.checkAliasAvailability(normalized);
      if (requestId !== aliasRequestCounter.current) {
        return result.available;
      }

      if (!result.available) {
        setCustomAliasError('This custom alias is already in use.');
        setCustomAliasAvailable(false);
        return false;
      }

      setCustomAliasError('');
      setCustomAliasAvailable(true);
      return true;
    } catch {
      if (requestId === aliasRequestCounter.current) {
        setCustomAliasError('Could not verify alias right now. Please try again.');
        setCustomAliasAvailable(false);
      }
      return false;
    } finally {
      if (requestId === aliasRequestCounter.current) {
        setCustomAliasChecking(false);
      }
    }
  }, [showCustomAlias]);

  const { debounced: debouncedAliasCheck, cancel: cancelDebouncedAliasCheck } = useDebouncedCallback(
    (candidateAlias: string) => {
      void runAliasAvailabilityCheck(candidateAlias);
    },
    500
  );

  useEffect(() => {
    if (!showCustomAlias) {
      cancelDebouncedAliasCheck();
      setCustomAliasError('');
      setCustomAliasChecking(false);
      setCustomAliasAvailable(null);
    }
  }, [cancelDebouncedAliasCheck, showCustomAlias]);

  const handleCustomAliasChange = (value: string) => {
    setCustomAlias(value);
    setCustomAliasError('');
    setCustomAliasAvailable(null);
    if (showCustomAlias) {
      debouncedAliasCheck(value);
    }
  };

  const handleCustomAliasBlur = () => {
    cancelDebouncedAliasCheck();
    void runAliasAvailabilityCheck(customAlias);
  };

  const resetForm = () => {
    setUrl('');
    setCustomAlias('');
    setCustomAliasError('');
    setCustomAliasAvailable(null);
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

    cancelDebouncedAliasCheck();
    const isAliasAvailable = await runAliasAvailabilityCheck(customAlias);
    if (!isAliasAvailable) {
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
    setCustomAlias: handleCustomAliasChange,
    onCustomAliasBlur: handleCustomAliasBlur,
    customAliasError,
    customAliasChecking,
    customAliasAvailable,
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