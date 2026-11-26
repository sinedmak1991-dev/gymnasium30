import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ChevronDown,
  ExternalLink,
  Info,
  MapPin,
  Phone,
  Search,
  X,
} from 'lucide-react';
import { ASSIGNED_ADDRESSES, searchAssignedAddresses } from '../data/assignedAddresses';
import { SCHOOL_INFO } from '../data/schoolData';
import { GENTLE_EASE } from './Reveal';

const E_REGISTRATION_URL = 'https://school.isuo.org/';

export const AddressChecker: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showFullList, setShowFullList] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { meaningfulQuery, matches } = useMemo(
    () => searchAssignedAddresses(query),
    [query]
  );

  const hasTyped = query.trim().length > 0;
  const showNotFound = meaningfulQuery.length >= 3 && matches.length === 0;
  const showKeepTypingHint =
    hasTyped && matches.length === 0 && meaningfulQuery.length < 3;

  return (
    <div className="rounded-2xl border border-forest/20 bg-gradient-to-br from-forest-50/80 via-white to-gold-50/40 p-5 sm:p-6 space-y-5 shadow-sm">
      {/* Заголовок блоку */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-heading font-extrabold text-base sm:text-lg text-forest leading-snug">
            Перевірте, чи закріплений ваш будинок за Гімназією № 30
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Перевірка території обслуговування закладу для першочергового зарахування
          </p>
        </div>
      </div>

      {/* Рядок пошуку */}
      <div className="relative">
        <Search
          className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введіть назву вулиці або провулку (наприклад: Заводська, Шевченка, Прибузька)..."
          aria-label="Пошук вулиці або провулку для першочергового зарахування"
          className="w-full bg-white border border-slate-300 focus:border-forest focus:ring-2 focus:ring-forest/15 rounded-xl pl-11 pr-10 py-3 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none transition"
        />
        {hasTyped && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Очистити пошук"
            title="Очистити"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg text-slate-400 hover:text-forest hover:bg-forest-50 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Результати пошуку */}
      {matches.length > 0 && (
        <div className="space-y-3" role="status" aria-live="polite">
          <div className="text-xs font-semibold text-emerald-800 px-0.5">
            Знайдено збігів: {matches.length}
          </div>
          <div className="grid gap-3">
            {matches.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-emerald-200 bg-emerald-50/75 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                    ✓ Закріплено за Гімназією № 30 (першочергове зарахування)
                  </span>
                </div>

                <div>
                  <div className="font-heading font-bold text-base text-forest">
                    {item.street}
                  </div>
                  {item.oldName && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      Попередня назва:{' '}
                      <span className="font-medium text-slate-700">{item.oldName}</span>
                    </div>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-emerald-950/90 bg-white/80 border border-emerald-200/70 rounded-lg px-3 py-2">
                  <span className="font-semibold text-forest">Номери будинків: </span>
                  {item.note}
                </div>

                <div>
                  <a
                    href={E_REGISTRATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-forest hover:bg-forest-light text-white px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <span>Подати електронну заяву (school.isuo.org) ↗</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showKeepTypingHint && (
        <p className="text-xs text-slate-500 px-1">
          Введіть щонайменше 3 літери назви вулиці або провулку (можна шукати як за новою, так і за попередньою назвою).
        </p>
      )}

      {showNotFound && (
        <div
          className="rounded-xl border border-gold/50 bg-gold-50/80 p-4 sm:p-5 space-y-3.5"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/25 text-forest flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Ця адреса не входить до закріпленої території обслуговування Гімназії № 30. Проте ви
              можете подати заяву на зарахування на вільні місця через портал електронної
              реєстрації.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:pl-12">
            <a
              href={E_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-forest hover:bg-forest-light text-white px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
            >
              <span>Подати електронну заяву (school.isuo.org) ↗</span>
            </a>
            <a
              href={SCHOOL_INFO.topPhoneHref}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white hover:bg-forest-50 text-forest border border-forest/25 px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Phone className="w-4 h-4 text-gold-dark shrink-0" />
              <span>Приймальня: {SCHOOL_INFO.topPhone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Постійна кнопка електронної реєстрації та спойлер повного переліку */}
      <div className="pt-3 border-t border-forest/10 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            aria-expanded={showFullList}
            onClick={() => setShowFullList((prev) => !prev)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-forest hover:text-forest-light transition cursor-pointer py-1 self-start"
          >
            <ChevronDown
              className={`w-4 h-4 text-gold-dark transition-transform duration-300 shrink-0 ${
                showFullList ? 'rotate-180' : ''
              }`}
            />
            <span>
              {showFullList
                ? `Приховати повний перелік закріплених вулиць (${ASSIGNED_ADDRESSES.length})`
                : `Показати повний перелік закріплених вулиць (${ASSIGNED_ADDRESSES.length})`}
            </span>
          </button>

          <a
            href={E_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold bg-gold-50 hover:bg-gold/25 text-forest border border-gold/60 px-4 py-2 rounded-xl transition-all duration-200 active:scale-95 shrink-0"
          >
            <ExternalLink className="w-4 h-4 text-gold-dark shrink-0" />
            <span>Портал електронної реєстрації (school.isuo.org)</span>
          </a>
        </div>

        <AnimatePresence initial={false}>
          {showFullList && (
            <motion.div
              key="full-address-list"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: GENTLE_EASE }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                {/* Десктопна таблиця */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/90 bg-white">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-offwhite border-b-2 border-forest/15 text-xs uppercase tracking-wider text-slate-600">
                        <th className="py-3 px-4 w-12">№</th>
                        <th className="py-3 px-4">Вулиця / провулок</th>
                        <th className="py-3 px-4">Примітка (номери будинків)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {ASSIGNED_ADDRESSES.map((item) => (
                        <tr key={item.id} className="hover:bg-forest-50/40 transition">
                          <td className="py-3 px-4 text-xs font-bold text-slate-400 tabular-nums align-top">
                            {item.id}
                          </td>
                          <td className="py-3 px-4 align-top">
                            <div className="font-semibold text-forest">{item.street}</div>
                            {item.oldName && (
                              <div className="text-xs text-slate-500 mt-0.5">
                                стара назва: {item.oldName}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 align-top leading-relaxed">
                            {item.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Мобільний список */}
                <div className="md:hidden space-y-2.5">
                  {ASSIGNED_ADDRESSES.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200/80 bg-white p-3.5 space-y-1"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-bold text-gold-dark tabular-nums shrink-0">
                          {item.id}.
                        </span>
                        <span className="font-heading font-bold text-sm text-forest">
                          {item.street}
                        </span>
                      </div>
                      {item.oldName && (
                        <div className="text-xs text-slate-500 pl-5">
                          Стара назва: {item.oldName}
                        </div>
                      )}
                      <div className="text-xs text-slate-600 pl-5 leading-relaxed">
                        {item.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
