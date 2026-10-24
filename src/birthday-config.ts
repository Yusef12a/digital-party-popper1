// ============================================================
//  HIER ALLES ANPASSEN
//  Name und Geburtsdatum des Geburtstagskindes eintragen.
//  Alles andere auf der Seite berechnet sich automatisch:
//  Datums-Badge, Alter (Zahlen-Luftballons) und der Countdown.
// ============================================================

import foto1 from "./assets/foto1.jpg";
import foto2 from "./assets/foto2.jpg";
import foto3 from "./assets/foto3.jpg";
import foto4 from "./assets/foto4.jpg";

export type BirthdayPhoto = { src: string; alt: string; caption?: string };

export const birthdayConfig = {
  // Name des Geburtstagskindes
  name: "سوسو",

  // Geburtsdatum im Format "Jahr-Monat-Tag"
  // Beispiel: "2009-10-31" für den 31. Oktober 2009
  birthDate: "2009-10-31",
  // Eigener Song: Audiodatei in public ablegen und hier "/mein-song.mp3" eintragen.
  // Ohne eigenen Song wird eine instrumentale Happy-Birthday-Melodie gespielt.
  song: { title: "سنة حلوة يا جميل", src: "/birthday-song.wav" },
  // BILDER: beliebig viele Einträge ergänzen; bei [] bleibt das Foto-Kapitel verborgen.
  // Bild in src/assets ablegen und oben importieren:
  // import foto1 from "./assets/mein-foto.jpg";
  // Dann hier eintragen: { src: foto1, alt: "ذكرى جميلة", caption: "لحظة لا تُنسى ♡" },
  // alt = Bildbeschreibung; caption = optionale sichtbare Bildunterschrift.
  photos: [
    {
      src: foto1,
      alt: "صاحبتين عم يضحكوا سوا",
      caption: "أحلى وقت مع أحلى صاحبة ♡",
    },
    {
      src: foto2,
      alt: "مشوار وقت الغروب",
      caption: "يوم حلو بين الورد ♡",
    },
    {
      src: foto3,
      alt: "بسة صغيرة نايمة",
      caption: "أحلى لحظات الراحة ♡",
    },
    {
      src: foto4,
      alt: "كيكة عيد ميلاد",
      caption: "كل سنة وإنتِ بخير ♡",
    },
  ] as BirthdayPhoto[],
  // true = bis zum Freischalt-Zeitpunkt erscheint nur die "Bald"-Seite mit Countdown.
  // Die Überraschung öffnet sich automatisch, wenn der Timer abgelaufen ist.
  comingSoon: false,
  // Freischalt-Zeitpunkt (Jahr-Monat-TagTStunde:Minute:Sekunde)
  // unlockTimeZone = "Asia/Damascus" ist die syrische Zeit (Damaskus).
  // Bitte Jahr-Monat-TagTStunde:Minute:Sekunde ohne Zeitversatz eintragen.
  unlockAt: "2026-10-31T12:00:00",
  unlockTimeZone: "Asia/Damascus",
  // Entwickler-Vorschau: Seite mit ?vorschau=1 am Ende der Adresse öffnen,
  // dann ist alles sofort sichtbar.
};

// --- Ab hier muss nichts mehr geändert werden ---

export type BirthdayInfo = {
  isToday: boolean;
  nextBirthday: Date;
  turningAge: number;
  dateLabel: string;
};

export function getBirthdayInfo(now: Date = new Date()): BirthdayInfo {
  const [birthYearText, monthText, dayText] = birthdayConfig.birthDate.split("-");
  const birthYear = Number(birthYearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const today = startOfDay(now);
  const isToday =
    now.getMonth() === month - 1 && now.getDate() === day;

  let nextBirthday = new Date(today.getFullYear(), month - 1, day);
  if (!isToday && nextBirthday.getTime() < today.getTime()) {
    nextBirthday = new Date(today.getFullYear() + 1, month - 1, day);
  }

  const turningAge = nextBirthday.getFullYear() - birthYear;
  const monthName = nextBirthday.toLocaleDateString("en-US", {
    month: "long",
  });

  return {
    isToday,
    nextBirthday,
    turningAge,
    dateLabel: `${monthName} ${day}`,
  };
}

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getCountdown(target: Date, now: Date): Countdown {
  const totalSeconds = Math.max(
    0,
    Math.floor((target.getTime() - now.getTime()) / 1000),
  );
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Rechnet die eingetragene Uhrzeit in die eingestellte Zeitzone (Syrien).
export function getUnlockDate(): Date {
  const [datePart = "", timePart = "00:00:00"] = birthdayConfig.unlockAt.split("T");
  const [year = 1970, month = 1, day = 1] = (datePart.match(/\d+/g) ?? []).map(Number);
  const [hours = 0, minutes = 0, seconds = 0] = (timePart.match(/\d+/g) ?? []).map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  let utc = wallClock;
  for (let i = 0; i < 3; i += 1) {
    utc = wallClock - timeZoneOffsetMs(utc, birthdayConfig.unlockTimeZone);
  }
  return new Date(utc);
}

function timeZoneOffsetMs(utc: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(utc);
  const value: Record<string, string> = {};
  for (const part of parts) value[part.type] = part.value;
  const wallClock = Date.UTC(
    Number(value["year"]),
    Number(value["month"]) - 1,
    Number(value["day"]),
    Number(value["hour"]) % 24,
    Number(value["minute"]),
    Number(value["second"]),
  );
  return wallClock - utc;
}
