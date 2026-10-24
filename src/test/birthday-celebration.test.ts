import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CONFETTI_DURATION_MS, GIFT_OPEN_DELAY_MS, useBirthdayCelebration } from "@/hooks/use-birthday-celebration";

afterEach(() => vi.useRealTimers());

describe("birthday celebration", () => {
  it("does not celebrate until triggered", () => {
    const { result } = renderHook(useBirthdayCelebration);
    expect(result.current.burst).toBeNull();
    act(() => result.current.celebrate());
    expect(result.current.burst).toBe(1);
  });
  it("ends each burst instead of running continuously", () => {
    vi.useFakeTimers();
    const { result } = renderHook(useBirthdayCelebration);
    act(() => result.current.celebrate());
    act(() => vi.advanceTimersByTime(CONFETTI_DURATION_MS - 1));
    expect(result.current.burst).toBe(1);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.burst).toBeNull();
    act(() => result.current.celebrate());
    expect(result.current.burst).toBe(1);
  });
  it("opens the next chapter exactly two seconds after the gift click", () => {
    vi.useFakeTimers();
    const opened = vi.fn();
    const { result } = renderHook(() => useBirthdayCelebration(opened));
    expect(GIFT_OPEN_DELAY_MS).toBe(2000);
    act(() => result.current.openGift());
    expect(result.current.opening).toBe(true);
    expect(result.current.burst).toBe(1);
    act(() => vi.advanceTimersByTime(1999));
    expect(opened).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(opened).toHaveBeenCalledTimes(1);
    expect(result.current.opening).toBe(false);
  });
  it("keeps the candle shower repeating until explicitly stopped", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useBirthdayCelebration());
    act(() => result.current.celebrate(true));
    act(() => vi.advanceTimersByTime(20000));
    expect(result.current.looping).toBe(true);
    expect(result.current.burst).toBe(1);
    act(() => result.current.stop());
    expect(result.current.burst).toBeNull();
    expect(result.current.looping).toBe(false);
  });
  it("cancels the pending gift transition on unmount", () => {
    vi.useFakeTimers();
    const opened = vi.fn();
    const { result, unmount } = renderHook(() => useBirthdayCelebration(opened));
    act(() => result.current.openGift());
    unmount();
    act(() => vi.advanceTimersByTime(2000));
    expect(opened).not.toHaveBeenCalled();
  });
});