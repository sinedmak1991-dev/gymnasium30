import { BELL_SCHEDULE_GROUPS } from '../data/schoolData';
import type { BellGroupId } from '../types/school';

export type ConcreteBellGroupId = Exclude<BellGroupId, 'all'>;

export interface KyivClock {
  weekday: string;
  isWeekend: boolean;
  isFriday: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formattedTime: string;
  formattedShortTime: string;
}

export interface ParsedBellLesson {
  lessonNumber: number;
  startSec: number;
  endSec: number;
  startTime: string;
  endTime: string;
}

export type BellGroupLiveStatus =
  | { kind: 'weekend' }
  | {
      kind: 'before_school';
      remainingSeconds: number;
      progressPercent: number;
      firstStartLabel: string;
    }
  | {
      kind: 'lesson';
      lessonNumber: number;
      remainingSeconds: number;
      totalSeconds: number;
      progressPercent: number;
      startTime: string;
      endTime: string;
      isLastLesson: boolean;
    }
  | {
      kind: 'break';
      afterLessonNumber: number;
      nextLessonNumber: number;
      remainingSeconds: number;
      totalSeconds: number;
      progressPercent: number;
      startTime: string;
      endTime: string;
    }
  | {
      kind: 'finished';
      lastEndLabel: string;
    };

export const SCHOOL_DAY_START_SECONDS = 8 * 3600; // 08:00
export const FIRST_LESSON_START_SECONDS = 8 * 3600 + 30 * 60; // 08:30
export const SCHOOL_DAY_END_SECONDS = 16 * 3600 + 10 * 60; // 16:10

const kyivTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Europe/Kyiv',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function parseTimeToSeconds(timeStr: string): number {
  const [hoursStr, minutesStr] = timeStr.trim().split(':');
  const hours = Number(hoursStr) || 0;
  const minutes = Number(minutesStr) || 0;
  return hours * 3600 + minutes * 60;
}

export const PARSED_LESSONS_BY_GROUP: Record<ConcreteBellGroupId, ParsedBellLesson[]> =
  BELL_SCHEDULE_GROUPS.reduce(
    (acc, group) => {
      acc[group.id] = group.rows.map((row) => {
        const [startRaw = '08:30', endRaw = '09:05'] = row.time.split(/[–-]/).map((s) => s.trim());
        return {
          lessonNumber: row.lessonNumber,
          startSec: parseTimeToSeconds(startRaw),
          endSec: parseTimeToSeconds(endRaw),
          startTime: startRaw,
          endTime: endRaw,
        };
      });
      return acc;
    },
    {} as Record<ConcreteBellGroupId, ParsedBellLesson[]>
  );

export function getKyivClock(now: Date = new Date()): KyivClock {
  const parts = kyivTimeFormatter.formatToParts(now);
  let weekday = 'Mon';
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  for (const part of parts) {
    if (part.type === 'weekday') weekday = part.value;
    else if (part.type === 'hour') hours = Number(part.value) % 24;
    else if (part.type === 'minute') minutes = Number(part.value);
    else if (part.type === 'second') seconds = Number(part.value);
  }

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return {
    weekday,
    isWeekend: weekday === 'Sat' || weekday === 'Sun',
    isFriday: weekday === 'Fri',
    hours,
    minutes,
    seconds,
    totalSeconds: hours * 3600 + minutes * 60 + seconds,
    formattedTime: `${hh}:${mm}:${ss}`,
    formattedShortTime: `${hh}:${mm}`,
  };
}

export function getBellGroupLiveStatus(
  groupId: ConcreteBellGroupId,
  clock: KyivClock
): BellGroupLiveStatus {
  if (clock.isWeekend) {
    return { kind: 'weekend' };
  }

  const lessons = PARSED_LESSONS_BY_GROUP[groupId];
  if (!lessons || lessons.length === 0) {
    return { kind: 'finished', lastEndLabel: '16:10' };
  }

  const firstLesson = lessons[0];
  const lastLesson = lessons[lessons.length - 1];
  const nowSec = clock.totalSeconds;

  if (nowSec < firstLesson.startSec) {
    const remainingSeconds = firstLesson.startSec - nowSec;
    const preWindowDuration = firstLesson.startSec - SCHOOL_DAY_START_SECONDS;
    const progressPercent =
      nowSec >= SCHOOL_DAY_START_SECONDS && preWindowDuration > 0
        ? Math.min(100, Math.max(0, ((nowSec - SCHOOL_DAY_START_SECONDS) / preWindowDuration) * 100))
        : 0;

    return {
      kind: 'before_school',
      remainingSeconds,
      progressPercent,
      firstStartLabel: firstLesson.startTime,
    };
  }

  if (nowSec >= lastLesson.endSec) {
    return {
      kind: 'finished',
      lastEndLabel: lastLesson.endTime,
    };
  }

  for (let i = 0; i < lessons.length; i += 1) {
    const lesson = lessons[i];

    if (nowSec >= lesson.startSec && nowSec < lesson.endSec) {
      const totalSeconds = lesson.endSec - lesson.startSec;
      const remainingSeconds = lesson.endSec - nowSec;
      const progressPercent = Math.min(
        100,
        Math.max(0, ((nowSec - lesson.startSec) / totalSeconds) * 100)
      );

      return {
        kind: 'lesson',
        lessonNumber: lesson.lessonNumber,
        remainingSeconds,
        totalSeconds,
        progressPercent,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        isLastLesson: i === lessons.length - 1,
      };
    }

    const nextLesson = lessons[i + 1];
    if (nextLesson && nowSec >= lesson.endSec && nowSec < nextLesson.startSec) {
      const totalSeconds = nextLesson.startSec - lesson.endSec;
      const remainingSeconds = nextLesson.startSec - nowSec;
      const progressPercent = Math.min(
        100,
        Math.max(0, ((nowSec - lesson.endSec) / totalSeconds) * 100)
      );

      return {
        kind: 'break',
        afterLessonNumber: lesson.lessonNumber,
        nextLessonNumber: nextLesson.lessonNumber,
        remainingSeconds,
        totalSeconds,
        progressPercent,
        startTime: lesson.endTime,
        endTime: nextLesson.startTime,
      };
    }
  }

  return {
    kind: 'finished',
    lastEndLabel: lastLesson.endTime,
  };
}

export function isWithinSchoolDayWindow(clock: KyivClock): boolean {
  return (
    !clock.isWeekend &&
    clock.totalSeconds >= SCHOOL_DAY_START_SECONDS &&
    clock.totalSeconds < SCHOOL_DAY_END_SECONDS
  );
}

export function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
