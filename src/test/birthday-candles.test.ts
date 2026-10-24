import { describe, expect, it } from "vitest";
import { breathStrength, candlesAfterProgress } from "@/lib/birthday-candles";
describe("birthday candle blowing", () => {
  it("starts with five candles and extinguishes them progressively", () => { expect(candlesAfterProgress(0)).toBe(5); expect(candlesAfterProgress(.4)).toBe(3); expect(candlesAfterProgress(1)).toBe(0); });
  it("detects breath amplitude without recording speech", () => { expect(breathStrength(new Uint8Array([128, 128, 128]))).toBe(0); expect(breathStrength(new Uint8Array([160, 96]))).toBe(.25); });
});