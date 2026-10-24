export const CANDLE_COUNT = 5;
export const HOLD_DURATION_MS = 1800;

export function candlesAfterProgress(progress: number): number {
  return Math.max(0, CANDLE_COUNT - Math.floor(Math.max(0, Math.min(1, progress)) * CANDLE_COUNT));
}

export function breathStrength(samples: Uint8Array): number {
  if (samples.length === 0) return 0;
  return Math.sqrt(samples.reduce((sum, sample) => sum + ((sample - 128) / 128) ** 2, 0) / samples.length);
}