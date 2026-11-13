export const MIN_SYNC_MINUTES = 1;
export const MAX_SYNC_MINUTES = 1440;
export const DEFAULT_SYNC_MINUTES = 10;

export const secondsToMinutes = (seconds: number): number =>
  Math.round(seconds / 60);

export const minutesToSeconds = (minutes: number): number =>
  Math.round(minutes * 60);

export const isValidSyncMinutes = (minutes: number): boolean =>
  Number.isInteger(minutes) &&
  minutes >= MIN_SYNC_MINUTES &&
  minutes <= MAX_SYNC_MINUTES;
