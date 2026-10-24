import { describe, expect, it } from "vitest";
import {
  birthdayConfig,
  getBirthdayInfo,
  getCountdown,
  getUnlockDate,
} from "@/birthday-config";

describe("getBirthdayInfo", () => {
  it("keeps the gift available without the coming-soon timer page", () => {
    expect(birthdayConfig.comingSoon).toBe(false);
  });
  it("counts down to this year's birthday when it is still ahead", () => {
    const info = getBirthdayInfo(new Date(2026, 9, 14));
    expect(info.isToday).toBe(false);
    expect(info.dateLabel).toBe("October 31");
    expect(info.nextBirthday.getFullYear()).toBe(2026);
    expect(info.turningAge).toBe(17);
  });

  it("rolls over to next year once the birthday has passed", () => {
    const info = getBirthdayInfo(new Date(2026, 10, 5));
    expect(info.isToday).toBe(false);
    expect(info.nextBirthday.getFullYear()).toBe(2027);
    expect(info.turningAge).toBe(18);
  });

  it("detects the birthday itself", () => {
    const info = getBirthdayInfo(new Date(2026, 9, 31, 15, 0));
    expect(info.isToday).toBe(true);
    expect(info.turningAge).toBe(17);
  });

  it("uses the configured name and birth date", () => {
    expect(birthdayConfig.name.length).toBeGreaterThan(0);
    expect(birthdayConfig.birthDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("getCountdown", () => {
  it("splits the remaining time into days, hours, minutes and seconds", () => {
    const now = new Date(2026, 9, 14, 12, 0, 0);
    const target = new Date(2026, 9, 31);
    const countdown = getCountdown(target, now);
    expect(countdown.days).toBe(16);
    expect(countdown.hours).toBe(12);
    expect(countdown.minutes).toBe(0);
    expect(countdown.seconds).toBe(0);
  });

  it("never returns negative values once the date has passed", () => {
    const countdown = getCountdown(
      new Date(2026, 9, 31),
      new Date(2026, 10, 1),
    );
    expect(countdown.days).toBe(0);
    expect(countdown.hours).toBe(0);
    expect(countdown.minutes).toBe(0);
    expect(countdown.seconds).toBe(0);
  });
});

describe("getUnlockDate", () => {
  it("reads the configured time as Syria time (Damascus, UTC+3)", () => {
    expect(birthdayConfig.unlockTimeZone).toBe("Asia/Damascus");
    expect(birthdayConfig.unlockAt).toBe("2026-10-31T12:00:00");
    expect(getUnlockDate().toISOString()).toBe("2026-10-31T09:00:00.000Z");
  });
});
