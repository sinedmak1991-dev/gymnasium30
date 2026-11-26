import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coffee,
  Info,
  MoreVertical,
  Share,
  X,
} from 'lucide-react';
import { BELL_SCHEDULE_GROUPS } from '../data/schoolData';
import { usePWAInstall } from '../hooks/usePWAInstall';
import type { BellGroupId } from '../types/school';
import {
  FIRST_LESSON_START_SECONDS,
  SCHOOL_DAY_END_SECONDS,
  formatCountdown,
  getBellGroupLiveStatus,
  getKyivClock,
  isWithinSchoolDayWindow,
  type BellGroupLiveStatus,
  type ConcreteBellGroupId,
  type KyivClock,
} from '../utils/bellSchedule';
import { GENTLE_EASE } from './Reveal';

const BELL_FILTERS: { id: BellGroupId; label: string }[] = [
  { id: 'all', label: 'Зведена таблиця' },
  { id: 'grade1', label: '1-ші класи (35 хв)' },
  { id: 'grade2_4', label: '2–4-ті класи (40 хв)' },
  { id: 'grade5_9', label: '5–9-ті класи (45 хв)' },
];

const MAX_LESSONS_COUNT = Math.max(...BELL_SCHEDULE_GROUPS.map((g) => g.rows.length));
const LESSON_NUMBERS = Array.from({ length: MAX_LESSONS_COUNT }, (_, index) => index + 1);

export const LiveBellSchedule: React.FC = () => {
  const [selectedBellGroup, setSelectedBellGroup] = useState<BellGroupId>('all');
  const [clock, setClock] = useState<KyivClock>(() => getKyivClock());
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const { isInstallable, isInstalled, platform, install } = usePWAInstall();
  const prefersReducedMotion = useReducedMotion();

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowInstallGuide(false);
      }
      return;
    }
    setShowInstallGuide((prev) => !prev);
  };

  useEffect(() => {
    const updateClock = () => {
      setClock(getKyivClock());
    };
    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const statusesByGroup = useMemo<Record<ConcreteBellGroupId, BellGroupLiveStatus>>(
    () => ({
      grade1: getBellGroupLiveStatus('grade1', clock),
      grade2_4: getBellGroupLiveStatus('grade2_4', clock),
      grade5_9: getBellGroupLiveStatus('grade5_9', clock),
    }),
    [clock]
  );

  const activeSingleGroup =
    selectedBellGroup === 'all'
      ? null
      : BELL_SCHEDULE_GROUPS.find((group) => group.id === selectedBellGroup) ?? null;

  const isSchoolDayWindow = isWithinSchoolDayWindow(clock);
  const isBeforeSchoolDay = !clock.isWeekend && clock.totalSeconds < FIRST_LESSON_START_SECONDS;
  const isAfterSchoolDay = !clock.isWeekend && clock.totalSeconds >= SCHOOL_DAY_END_SECONDS;

  const renderCombinedStatusBoard = () => {
    if (clock.isWeekend) {
      return (
        <div className="rounded-2xl border border-slate-200/90 bg-offwhite px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm sm:text-base text-forest">
                Вихідний день
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Початок занять — у понеділок о 08:30.
              </p>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-500 tabular-nums sm:text-right pl-13 sm:pl-0">
            Київський час: <span className="font-semibold text-forest">{clock.formattedTime}</span>
          </div>
        </div>
      );
    }

    if (isSchoolDayWindow) {
      return (
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-forest">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span>Зараз у гімназії</span>
            </div>
            <div className="text-xs text-slate-500 tabular-nums">
              Київський час: <span className="font-semibold text-forest">{clock.formattedTime}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {BELL_SCHEDULE_GROUPS.map((group) => {
              const status = statusesByGroup[group.id];

              if (status.kind === 'lesson') {
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedBellGroup(group.id)}
                    title={`Відкрити розклад: ${group.title}`}
                    className="text-left rounded-2xl border border-emerald-200 bg-emerald-50/75 hover:border-emerald-300 hover:bg-emerald-50 p-3.5 sm:p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-bold text-sm text-forest">
                        {group.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                        <Bell className="w-3 h-3" />
                        <span>{status.lessonNumber}-й урок</span>
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-emerald-800">
                        Триває {status.lessonNumber}-й урок
                      </div>
                      <div className="flex items-baseline justify-between gap-2 mt-1">
                        <span className="font-heading font-extrabold text-xl text-forest tabular-nums">
                          {formatCountdown(status.remainingSeconds)}
                        </span>
                        <span className="text-[11px] text-emerald-700 font-medium">
                          {status.isLastLesson ? 'до кінця уроку' : 'до перерви'}
                        </span>
                      </div>
                    </div>

                    <div className="h-1 w-full rounded-full bg-emerald-200/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                        style={{ width: `${status.progressPercent}%` }}
                      />
                    </div>
                  </button>
                );
              }

              if (status.kind === 'break') {
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedBellGroup(group.id)}
                    title={`Відкрити розклад: ${group.title}`}
                    className="text-left rounded-2xl border border-amber-200 bg-amber-50/80 hover:border-amber-300 hover:bg-amber-50 p-3.5 sm:p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-bold text-sm text-forest">
                        {group.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                        <Coffee className="w-3 h-3" />
                        <span>Перерва</span>
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-amber-900">
                        Перерва після {status.afterLessonNumber}-го уроку
                      </div>
                      <div className="flex items-baseline justify-between gap-2 mt-1">
                        <span className="font-heading font-extrabold text-xl text-amber-950 tabular-nums">
                          {formatCountdown(status.remainingSeconds)}
                        </span>
                        <span className="text-[11px] text-amber-800 font-medium">
                          до {status.nextLessonNumber}-го уроку
                        </span>
                      </div>
                    </div>

                    <div className="h-1 w-full rounded-full bg-amber-200/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-700"
                        style={{ width: `${status.progressPercent}%` }}
                      />
                    </div>
                  </button>
                );
              }

              if (status.kind === 'before_school') {
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setSelectedBellGroup(group.id)}
                    title={`Відкрити розклад: ${group.title}`}
                    className="text-left rounded-2xl border border-forest/20 bg-forest-50/80 hover:border-forest/35 p-3.5 sm:p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-bold text-sm text-forest">
                        {group.title}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gold-50 text-gold-dark border border-gold/40">
                        {group.durationLabel}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-forest">
                        До 1-го уроку ({status.firstStartLabel})
                      </div>
                      <div className="flex items-baseline justify-between gap-2 mt-1">
                        <span className="font-heading font-extrabold text-xl text-forest tabular-nums">
                          {formatCountdown(status.remainingSeconds)}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">до дзвінка</span>
                      </div>
                    </div>

                    <div className="h-1 w-full rounded-full bg-forest/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-forest transition-all duration-700"
                        style={{ width: `${status.progressPercent}%` }}
                      />
                    </div>
                  </button>
                );
              }

              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedBellGroup(group.id)}
                  title={`Відкрити розклад: ${group.title}`}
                  className="text-left rounded-2xl border border-slate-200 bg-offwhite hover:border-slate-300 p-3.5 sm:p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading font-bold text-sm text-slate-700">
                      {group.title}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Завершено</span>
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600">Уроки завершено</div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Останній дзвінок пролунав о{' '}
                      {status.kind === 'finished' ? status.lastEndLabel : '—'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (isBeforeSchoolDay) {
      const remaining = FIRST_LESSON_START_SECONDS - clock.totalSeconds;
      return (
        <div className="rounded-2xl border border-forest/20 bg-gradient-to-br from-forest-50/90 to-white px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm sm:text-base text-forest">
                До початку 1-го уроку (08:30)
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Заняття розпочнуться о 08:30 за київським часом ({clock.formattedTime}).
              </p>
            </div>
          </div>
          <div className="sm:text-right pl-13 sm:pl-0">
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-forest tabular-nums leading-none">
              {formatCountdown(remaining)}
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">до першого дзвінка</div>
          </div>
        </div>
      );
    }

    if (isAfterSchoolDay) {
      return (
        <div className="rounded-2xl border border-slate-200/90 bg-offwhite px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm sm:text-base text-forest">
                Навчальний день завершено
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {clock.isFriday
                  ? 'Наступний навчальний день — у понеділок о 08:30.'
                  : 'Початок занять завтра о 08:30.'}
              </p>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-500 tabular-nums sm:text-right pl-13 sm:pl-0">
            Київський час: <span className="font-semibold text-forest">{clock.formattedTime}</span>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSingleGroupStatusBanner = (groupId: ConcreteBellGroupId, groupTitle: string) => {
    const status = statusesByGroup[groupId];

    if (status.kind === 'weekend') {
      return (
        <div className="rounded-2xl border border-slate-200/90 bg-offwhite px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm sm:text-base text-forest">
                Вихідний день
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Початок занять — у понеділок о 08:30.
              </p>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-500 tabular-nums sm:text-right pl-13 sm:pl-0">
            Київський час: <span className="font-semibold text-forest">{clock.formattedTime}</span>
          </div>
        </div>
      );
    }

    if (status.kind === 'finished') {
      return (
        <div className="rounded-2xl border border-slate-200/90 bg-offwhite px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm sm:text-base text-forest">
                Навчальний день завершено
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Для групи «{groupTitle}» уроки закінчилися о {status.lastEndLabel}.{' '}
                {clock.isFriday
                  ? 'Початок занять — у понеділок о 08:30.'
                  : 'Початок занять завтра о 08:30.'}
              </p>
            </div>
          </div>
          <div className="text-xs font-medium text-slate-500 tabular-nums sm:text-right pl-13 sm:pl-0">
            Київський час: <span className="font-semibold text-forest">{clock.formattedTime}</span>
          </div>
        </div>
      );
    }

    if (status.kind === 'before_school') {
      return (
        <div className="rounded-2xl border border-forest/20 bg-gradient-to-br from-forest-50/90 to-white p-4 sm:p-5 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-forest text-gold">
                  <Clock className="w-3 h-3" />
                  <span>До початку занять</span>
                </span>
                <span className="text-xs font-medium text-slate-500 tabular-nums">
                  {groupTitle} · Київ {clock.formattedTime}
                </span>
              </div>
              <div className="font-heading font-bold text-base sm:text-lg text-forest">
                До початку 1-го уроку ({status.firstStartLabel}) залишилося
              </div>
            </div>

            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-forest tabular-nums tracking-tight leading-none">
              {formatCountdown(status.remainingSeconds)}
            </div>
          </div>

          {status.progressPercent > 0 && (
            <div className="space-y-1">
              <div className="h-1.5 w-full rounded-full bg-forest/15 overflow-hidden">
                <div
                  className="h-full rounded-full bg-forest transition-all duration-700"
                  style={{ width: `${status.progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 tabular-nums">
                <span>08:00</span>
                <span>Початок 1-го уроку — {status.firstStartLabel}</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (status.kind === 'lesson') {
      return (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/90 to-white p-4 sm:p-5 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Зараз</span>
                </span>
                <span className="text-xs font-semibold text-emerald-800 tabular-nums">
                  {groupTitle} · {status.startTime} – {status.endTime}
                </span>
                <span className="text-xs text-slate-500 tabular-nums">
                  · Київ {clock.formattedTime}
                </span>
              </div>
              <div className="font-heading font-bold text-base sm:text-lg text-forest">
                Зараз триває {status.lessonNumber}-й урок •{' '}
                <span className="text-emerald-700">
                  {status.isLastLesson
                    ? 'До завершення уроку залишилося'
                    : 'До перерви залишилося'}
                </span>
              </div>
            </div>

            <div className="font-heading font-extrabold text-3xl sm:text-4xl text-forest tabular-nums tracking-tight leading-none">
              {formatCountdown(status.remainingSeconds)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-emerald-200/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                style={{ width: `${status.progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-800/80 font-medium tabular-nums">
              <span>{status.startTime}</span>
              <span>{status.endTime}</span>
            </div>
          </div>
        </div>
      );
    }

    // status.kind === 'break'
    return (
      <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/90 to-gold-50/40 p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500 text-white">
                <Coffee className="w-3 h-3" />
                <span>Перерва</span>
              </span>
              <span className="text-xs font-semibold text-amber-900 tabular-nums">
                {groupTitle} · {status.startTime} – {status.endTime}
              </span>
              <span className="text-xs text-slate-500 tabular-nums">
                · Київ {clock.formattedTime}
              </span>
            </div>
            <div className="font-heading font-bold text-base sm:text-lg text-forest">
              Зараз перерва після {status.afterLessonNumber}-го уроку •{' '}
              <span className="text-amber-800">
                До початку {status.nextLessonNumber}-го уроку залишилося
              </span>
            </div>
          </div>

          <div className="font-heading font-extrabold text-3xl sm:text-4xl text-amber-950 tabular-nums tracking-tight leading-none">
            {formatCountdown(status.remainingSeconds)}
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-1.5 w-full rounded-full bg-amber-200/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-700"
              style={{ width: `${status.progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-900/80 font-medium tabular-nums">
            <span>{status.startTime}</span>
            <span>{status.endTime}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-heading font-bold text-xl text-forest">Розклад дзвінків</h3>
          <p className="text-sm text-slate-500 mt-1">
            Початок занять — о 08:30. Просимо учнів приходити до закладу за 10–15 хвилин до початку
            першого уроку.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gold-50 text-gold-dark border border-gold/40 px-3 py-1.5 rounded-full">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>1-ші класи — 35 хв · 2–4-ті класи — 40 хв · 5–9-ті класи — 45 хв</span>
        </span>
      </div>

      {/* Перемикач між паралелями та кнопка додавання ярлика на смартфон */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap gap-2">
            {BELL_FILTERS.map((filter) => {
              const isActive = selectedBellGroup === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedBellGroup(filter.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'font-semibold bg-forest text-white shadow-sm'
                      : 'font-medium bg-offwhite text-slate-700 border border-slate-200 hover:border-forest/40'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {!isInstalled && (
            <button
              type="button"
              onClick={handleInstallClick}
              aria-expanded={!isInstallable ? showInstallGuide : undefined}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-gold-50 hover:bg-gold/25 text-forest border border-gold/60 transition-all duration-200 active:scale-95 cursor-pointer whitespace-nowrap shadow-xs"
            >
              <span aria-hidden="true">📲</span>
              <span>Додати розклад на екран смартфона</span>
            </button>
          )}
        </div>

        <AnimatePresence initial={false}>
          {!isInstalled && !isInstallable && showInstallGuide && (
            <motion.div
              key="pwa-install-guide"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: GENTLE_EASE }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl border border-gold/50 bg-gradient-to-br from-forest-50/90 via-white to-gold-50/50 p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-heading font-bold text-sm sm:text-base text-forest">
                      Як додати ярлик «Дзвінки 30» на головний екран
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Ярлик відкриватиме живий розклад дзвінків в один дотик як окремий застосунок.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInstallGuide(false)}
                    aria-label="Закрити підказку"
                    className="w-7 h-7 rounded-lg text-slate-400 hover:text-forest hover:bg-forest-50 flex items-center justify-center transition cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {/* iPhone (Safari) */}
                  <div
                    className={`rounded-xl p-3.5 border text-xs sm:text-sm space-y-2 ${
                      platform === 'ios'
                        ? 'bg-white border-forest/35 ring-1 ring-forest/15'
                        : 'bg-white/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-bold text-forest">
                        Для iPhone (Safari)
                      </span>
                      <Share className="w-4 h-4 text-gold-dark shrink-0" aria-hidden="true" />
                    </div>
                    <ol className="space-y-1.5 text-slate-700 leading-relaxed">
                      <li>
                        <span className="font-bold text-forest">1.</span> Натисніть кнопку{' '}
                        <strong className="text-forest">«Поділитися»</strong> (квадрат зі стрілкою
                        вгору внизу екрана).
                      </li>
                      <li>
                        <span className="font-bold text-forest">2.</span> Оберіть{' '}
                        <strong className="text-forest">«На Початковий екран»</strong> (Add to
                        Home Screen).
                      </li>
                    </ol>
                  </div>

                  {/* Android (Chrome) */}
                  <div
                    className={`rounded-xl p-3.5 border text-xs sm:text-sm space-y-2 ${
                      platform === 'android'
                        ? 'bg-white border-forest/35 ring-1 ring-forest/15'
                        : 'bg-white/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-bold text-forest">
                        Для Android (Chrome)
                      </span>
                      <MoreVertical
                        className="w-4 h-4 text-gold-dark shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                    <ol className="space-y-1.5 text-slate-700 leading-relaxed">
                      <li>
                        <span className="font-bold text-forest">1.</span> Натисніть меню{' '}
                        <strong className="text-forest">«⋮»</strong> у правому верхньому кутку.
                      </li>
                      <li>
                        <span className="font-bold text-forest">2.</span> Оберіть{' '}
                        <strong className="text-forest">«Додати на головний екран»</strong>.
                      </li>
                    </ol>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Якщо сайт відкрито у вбудованому браузері Telegram або Viber, спершу відкрийте
                  його у Safari чи Chrome.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Табло статусу «Зараз» */}
      {activeSingleGroup
        ? renderSingleGroupStatusBanner(activeSingleGroup.id, activeSingleGroup.title)
        : renderCombinedStatusBoard()}

      {/* Окрема таблиця обраної паралелі */}
      {activeSingleGroup ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="font-heading font-bold text-base text-forest">
              {activeSingleGroup.title}
            </div>
            <div className="text-xs font-medium text-slate-500">
              {activeSingleGroup.lessonsCountLabel} · тривалість уроку{' '}
              {activeSingleGroup.durationLabel}
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-forest/15 text-xs uppercase tracking-wider text-slate-600 bg-offwhite">
                  <th className="py-3.5 px-4">№ уроку</th>
                  <th className="py-3.5 px-4">Час уроку</th>
                  <th className="py-3.5 px-4">Перерва після уроку</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {activeSingleGroup.rows.map((row) => {
                  const groupStatus = statusesByGroup[activeSingleGroup.id];
                  const isActiveLesson =
                    groupStatus.kind === 'lesson' &&
                    groupStatus.lessonNumber === row.lessonNumber;
                  const isActiveBreak =
                    groupStatus.kind === 'break' &&
                    groupStatus.afterLessonNumber === row.lessonNumber;

                  return (
                    <tr
                      key={row.lessonNumber}
                      className={`transition ${
                        isActiveLesson
                          ? 'bg-emerald-50/90 hover:bg-emerald-50'
                          : isActiveBreak
                            ? 'bg-amber-50/65 hover:bg-amber-50/90'
                            : 'hover:bg-forest-50/40'
                      }`}
                    >
                      <td
                        className={`py-3.5 px-4 font-bold whitespace-nowrap ${
                          isActiveLesson
                            ? 'text-emerald-900 border-l-4 border-l-emerald-600'
                            : isActiveBreak
                              ? 'text-amber-950 border-l-4 border-l-amber-500'
                              : 'text-forest'
                        }`}
                      >
                        <div className="inline-flex items-center gap-2">
                          <span>{row.lesson}</span>
                          {isActiveLesson && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                              <span>Зараз</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td
                        className={`py-3.5 px-4 font-semibold tabular-nums whitespace-nowrap ${
                          isActiveLesson ? 'text-emerald-950' : 'text-slate-800'
                        }`}
                      >
                        {row.time}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 tabular-nums whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <span className={isActiveBreak ? 'font-semibold text-amber-900' : ''}>
                            {row.breakDuration}
                          </span>
                          {isActiveBreak && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-white">
                              <span>Зараз перерва</span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* Десктопна зведена таблиця для всіх трьох груп класів */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-forest/15 bg-offwhite">
                  <th className="py-3.5 px-4 text-xs uppercase tracking-wider text-slate-600">
                    № уроку
                  </th>
                  {BELL_SCHEDULE_GROUPS.map((group) => (
                    <th key={group.id} className="py-3.5 px-4">
                      <div className="font-heading font-bold text-sm text-forest">
                        {group.title}
                      </div>
                      <div className="text-[11px] font-medium text-gold-dark mt-0.5">
                        {group.lessonsCountLabel} · {group.durationLabel}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {LESSON_NUMBERS.map((num) => {
                  const hasAnyActiveLessonInRow = BELL_SCHEDULE_GROUPS.some((group) => {
                    const status = statusesByGroup[group.id];
                    return status.kind === 'lesson' && status.lessonNumber === num;
                  });

                  return (
                    <tr key={num} className="hover:bg-forest-50/30 transition">
                      <td
                        className={`py-3.5 px-4 font-bold whitespace-nowrap ${
                          hasAnyActiveLessonInRow
                            ? 'text-emerald-900 bg-emerald-50/40'
                            : 'text-forest'
                        }`}
                      >
                        <div className="inline-flex items-center gap-2">
                          <span>{num} урок</span>
                          {hasAnyActiveLessonInRow && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                          )}
                        </div>
                      </td>
                      {BELL_SCHEDULE_GROUPS.map((group) => {
                        const row = group.rows.find((r) => r.lessonNumber === num);
                        if (!row) {
                          return (
                            <td
                              key={group.id}
                              className="py-3.5 px-4 text-slate-300 font-medium"
                            >
                              —
                            </td>
                          );
                        }

                        const groupStatus = statusesByGroup[group.id];
                        const isActiveLesson =
                          groupStatus.kind === 'lesson' && groupStatus.lessonNumber === num;
                        const isActiveBreak =
                          groupStatus.kind === 'break' && groupStatus.afterLessonNumber === num;

                        return (
                          <td
                            key={group.id}
                            className={`py-3.5 px-4 whitespace-nowrap transition-colors ${
                              isActiveLesson
                                ? 'bg-emerald-50/95 ring-1 ring-inset ring-emerald-300/80'
                                : isActiveBreak
                                  ? 'bg-amber-50/85 ring-1 ring-inset ring-amber-300/75'
                                  : ''
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-semibold tabular-nums ${
                                  isActiveLesson ? 'text-emerald-950' : 'text-slate-800'
                                }`}
                              >
                                {row.time}
                              </span>
                              {isActiveLesson && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  <span>Зараз</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs mt-0.5 tabular-nums">
                              <span
                                className={
                                  isActiveBreak
                                    ? 'font-semibold text-amber-900'
                                    : 'text-slate-500'
                                }
                              >
                                перерва: {row.breakDuration}
                              </span>
                              {isActiveBreak && (
                                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                                  Перерва
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Мобільний вигляд: три охайні блоки окремо для кожної групи класів */}
          <div className="md:hidden space-y-5">
            {BELL_SCHEDULE_GROUPS.map((group) => {
              const groupStatus = statusesByGroup[group.id];
              return (
                <div
                  key={group.id}
                  className="rounded-xl border border-slate-200/80 overflow-hidden"
                >
                  <div className="bg-forest text-white px-4 py-3 flex items-center justify-between gap-2">
                    <span className="font-heading font-bold text-sm">{group.title}</span>
                    <span className="text-xs font-semibold text-gold">
                      {group.lessonsCountLabel} · {group.durationLabel}
                    </span>
                  </div>
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-offwhite border-b border-slate-200/70 text-[11px] uppercase tracking-wider text-slate-500">
                        <th className="py-2.5 px-3">Урок</th>
                        <th className="py-2.5 px-3">Час</th>
                        <th className="py-2.5 px-3 text-right">Перерва</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {group.rows.map((row) => {
                        const isActiveLesson =
                          groupStatus.kind === 'lesson' &&
                          groupStatus.lessonNumber === row.lessonNumber;
                        const isActiveBreak =
                          groupStatus.kind === 'break' &&
                          groupStatus.afterLessonNumber === row.lessonNumber;

                        return (
                          <tr
                            key={row.lessonNumber}
                            className={
                              isActiveLesson
                                ? 'bg-emerald-50/90'
                                : isActiveBreak
                                  ? 'bg-amber-50/75'
                                  : 'hover:bg-forest-50/40'
                            }
                          >
                            <td
                              className={`py-2.5 px-3 font-bold whitespace-nowrap ${
                                isActiveLesson
                                  ? 'text-emerald-900 border-l-3 border-l-emerald-600'
                                  : isActiveBreak
                                    ? 'text-amber-950 border-l-3 border-l-amber-500'
                                    : 'text-forest'
                              }`}
                            >
                              <div className="inline-flex items-center gap-1.5">
                                <span>{row.lesson}</span>
                                {isActiveLesson && (
                                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                                    Зараз
                                  </span>
                                )}
                              </div>
                            </td>
                            <td
                              className={`py-2.5 px-3 font-medium tabular-nums whitespace-nowrap ${
                                isActiveLesson ? 'text-emerald-950 font-semibold' : 'text-slate-800'
                              }`}
                            >
                              {row.time}
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums whitespace-nowrap">
                              <div className="inline-flex items-center justify-end gap-1.5">
                                <span
                                  className={isActiveBreak ? 'font-semibold text-amber-900' : ''}
                                >
                                  {row.breakDuration}
                                </span>
                                {isActiveBreak && (
                                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-500 text-white">
                                    Зараз
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
