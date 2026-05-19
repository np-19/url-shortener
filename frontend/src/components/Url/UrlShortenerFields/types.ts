import type { expiresOptions } from '../../../hooks/useUrlShortenerForm';

export type ExpirationValue = (typeof expiresOptions)[number]['value'];

export interface UrlShortenerFieldsProps {
  url: string;
  setUrl: (value: string) => void;
  customAlias: string;
  setCustomAlias: (value: string) => void;
  showCustomAlias: boolean;
  setShowCustomAlias: (value: boolean) => void;
  expiresIn: ExpirationValue;
  setExpiresIn: (value: ExpirationValue) => void;
  customExpiresDate: string;
  setCustomExpiresDate: (value: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}
