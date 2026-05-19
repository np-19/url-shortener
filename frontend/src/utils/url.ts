import constants from '../configs/constants';

const defaultDateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const formatDate = (
  dateString: string | number,
  options: Intl.DateTimeFormatOptions = defaultDateOptions,
) => {
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const isNeverExpires = (expiresAt: string) => expiresAt === constants.neverExpiresAt;

export const isExpired = (expiresAt: string) => {
  if (isNeverExpires(expiresAt)) {
    return false;
  }

  return new Date(expiresAt) < new Date();
};