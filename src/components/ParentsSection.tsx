import React, { useEffect, useState } from 'react';
import {
  BookOpenCheck,
  Clock,
  ExternalLink,
  Globe,
  HeartHandshake,
  Info,
  Landmark,
  Lock,
  Maximize2,
  ShieldAlert,
  ShieldCheck,
  User,
  UserPlus,
  Utensils,
  X,
} from 'lucide-react';
import { BELL_SCHEDULE_GROUPS, DEFAULT_SOB_INSPECTOR, SCHOOL_INFO } from '../data/schoolData';
import type { BellGroupId, ParentTabId, SobInspectorInfo } from '../types/school';
import { CrestLogo } from './CrestLogo';
import { SafeImage } from './SafeImage';

interface ParentsSectionProps {
  onOpenContact: (subject?: string) => void;
  sobInspector?: SobInspectorInfo;
}

const PARENT_TABS: {
  id: ParentTabId;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'bells',
    title: 'Розклад дзвінків',
    subtitle: 'Уроки та перерви',
    icon: Clock,
  },
  {
    id: 'diary',
    title: 'Е-щоденник',
    subtitle: 'Державна платформа «Мрія»',
    icon: BookOpenCheck,
  },
  {
    id: 'food',
    title: 'Харчування',
    subtitle: 'Організація та меню',
    icon: Utensils,
  },
  {
    id: 'safety',
    title: 'Безпека та укриття',
    subtitle: 'Дії під час тривоги',
    icon: ShieldAlert,
  },
  {
    id: 'admissions',
    title: 'Правила прийому',
    subtitle: 'Зарахування до школи',
    icon: UserPlus,
  },
  {
    id: 'language',
    title: 'Мова освітнього процесу',
    subtitle: 'Державна мова навчання',
    icon: Globe,
  },
  {
    id: 'sob',
    title: 'Служба освітньої безпеки',
    subtitle: 'Інспектор СОБ гімназії',
    icon: ShieldCheck,
  },
  {
    id: 'history',
    title: 'Історія та символіка',
    subtitle: 'Історія, візія та гімн',
    icon: Landmark,
  },
];

const BELL_FILTERS: { id: BellGroupId; label: string }[] = [
  { id: 'all', label: 'Зведена таблиця' },
  { id: 'grade1', label: '1-ші класи (35 хв)' },
  { id: 'grade2_4', label: '2–4-ті класи (40 хв)' },
  { id: 'grade5_9', label: '5–9-ті класи (45 хв)' },
];

export const ParentsSection: React.FC<ParentsSectionProps> = ({
  onOpenContact,
  sobInspector = DEFAULT_SOB_INSPECTOR,
}) => {
  const [activeTab, setActiveTab] = useState<ParentTabId>('bells');
  const [selectedBellGroup, setSelectedBellGroup] = useState<BellGroupId>('all');
  const [sobPhotoOpen, setSobPhotoOpen] = useState(false);

  useEffect(() => {
    if (!sobPhotoOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSobPhotoOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sobPhotoOpen]);

  const activeSingleGroup =
    selectedBellGroup === 'all'
      ? null
      : BELL_SCHEDULE_GROUPS.find((group) => group.id === selectedBellGroup) ?? null;

  const maxLessonsCount = Math.max(...BELL_SCHEDULE_GROUPS.map((g) => g.rows.length));
  const lessonNumbers = Array.from({ length: maxLessonsCount }, (_, index) => index + 1);

  return (
    <section id="parents" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
            Батькам та учням
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest mt-1">
            Швидкий доступ до важливої інформації
          </h2>
          <p className="text-slate-600 mt-2">
            Оберіть потрібний розділ, щоб переглянути актуальний розклад дзвінків, умови
            харчування, правила безпеки або перелік документів для вступу.
          </p>
        </div>

        {/* Кнопки-таби (сітка 4 колонки на десктопі, 2 колонки на мобільному) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8" role="tablist">
          {PARENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition cursor-pointer ${
                  isActive
                    ? 'bg-forest text-white border-forest shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-forest/40'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isActive ? 'bg-gold/20 text-gold' : 'bg-forest-50 text-forest'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-heading font-bold text-sm sm:text-base">{tab.title}</div>
                  <div
                    className={`text-xs hidden sm:block ${
                      isActive ? 'opacity-75' : 'text-slate-500'
                    }`}
                  >
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Контент вкладок */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          {activeTab === 'bells' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-forest">
                    Розклад дзвінків
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Початок занять — о 08:30. Просимо учнів приходити до закладу за 10–15 хвилин до
                    початку першого уроку.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gold-50 text-gold-dark border border-gold/40 px-3 py-1.5 rounded-full">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>1-ші класи — 35 хв · 2–4-ті класи — 40 хв · 5–9-ті класи — 45 хв</span>
                </span>
              </div>

              {/* Перемикач між паралелями */}
              <div className="flex flex-wrap gap-2">
                {BELL_FILTERS.map((filter) => {
                  const isActive = selectedBellGroup === filter.id;
                  return (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedBellGroup(filter.id)}
                      className={`px-4 py-2 rounded-full text-xs sm:text-sm transition cursor-pointer whitespace-nowrap ${
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
                        {activeSingleGroup.rows.map((row) => (
                          <tr key={row.lessonNumber} className="hover:bg-forest-50/40 transition">
                            <td className="py-3.5 px-4 font-bold text-forest whitespace-nowrap">
                              {row.lesson}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-800 tabular-nums whitespace-nowrap">
                              {row.time}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 tabular-nums whitespace-nowrap">
                              {row.breakDuration}
                            </td>
                          </tr>
                        ))}
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
                        {lessonNumbers.map((num) => (
                          <tr key={num} className="hover:bg-forest-50/40 transition">
                            <td className="py-3.5 px-4 font-bold text-forest whitespace-nowrap">
                              {num} урок
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
                              return (
                                <td key={group.id} className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="font-semibold text-slate-800 tabular-nums">
                                    {row.time}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                                    перерва: {row.breakDuration}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Мобільний вигляд: три охайні блоки окремо для кожної групи класів */}
                  <div className="md:hidden space-y-5">
                    {BELL_SCHEDULE_GROUPS.map((group) => (
                      <div
                        key={group.id}
                        className="rounded-xl border border-slate-200/80 overflow-hidden"
                      >
                        <div className="bg-forest text-white px-4 py-3 flex items-center justify-between">
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
                            {group.rows.map((row) => (
                              <tr key={row.lessonNumber} className="hover:bg-forest-50/40">
                                <td className="py-2.5 px-3 font-bold text-forest whitespace-nowrap">
                                  {row.lesson}
                                </td>
                                <td className="py-2.5 px-3 font-medium text-slate-800 tabular-nums whitespace-nowrap">
                                  {row.time}
                                </td>
                                <td className="py-2.5 px-3 text-right text-slate-600 tabular-nums whitespace-nowrap">
                                  {row.breakDuration}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'diary' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-forest">
                    Електронний журнал та щоденник «Мрія»
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Єдина державна освітня платформа для учнів, батьків та вчителів: розклад занять,
                    результати навчання, домашні завдання та відвідуваність.
                  </p>
                </div>
                <a
                  href={SCHOOL_INFO.diaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-forest hover:bg-forest-light text-white font-heading font-bold text-sm px-5 py-3 rounded-xl transition shadow-sm"
                >
                  <ExternalLink className="w-4 h-4 text-gold" />
                  <span>Перейти на портал «Мрія»</span>
                </a>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-offwhite border border-slate-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-forest text-gold font-heading font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <h4 className="font-heading font-bold text-forest text-base">
                    Офіційний застосунок та веб-версія «Мрія»
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Користуйтеся державним мобільним застосунком «Мрія» на смартфоні або відкривайте
                    веб-версію на сайті <span className="font-medium text-forest">mriia.gov.ua</span>{' '}
                    з комп&apos;ютера чи планшета.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-offwhite border border-slate-200/80 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-forest text-gold font-heading font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <h4 className="font-heading font-bold text-forest text-base">
                    Вхід для учнів, батьків та вчителів
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Для підключення до кабінету дитини або батьківського профілю зверніться до
                    класного керівника та авторизуйтеся у застосунку або на веб-порталі «Мрія».
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <div className="space-y-5">
              <h3 className="font-heading font-bold text-xl text-forest">
                Організація шкільного харчування
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Організація харчування у Гімназії № 30 здійснюється відповідно до сучасних державних
                норм та стандартів безпечності харчових продуктів. Учні отримують гарячі страви за
                оновленим чотиритижневим сезонним меню, погодженим Держпродспоживслужбою, зі
                зменшеним вмістом солі та цукру і збільшеною кількістю овочів, фруктів та
                цільнозернових продуктів.
              </p>
              <div className="pt-2">
                <div className="p-4 sm:p-5 rounded-xl bg-offwhite border border-slate-200/70 w-full">
                  <h4 className="font-heading font-bold text-forest text-base mb-1.5">
                    Безкоштовне одноразове харчування
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Відповідно до державних та міських програм безкоштовним гарячим харчуванням
                    забезпечені всі учні 1–9 класів гімназії.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-5">
              <h3 className="font-heading font-bold text-xl text-forest">
                Безпекове середовище та порядок дій під час тривоги
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Безпека учасників освітнього процесу — наш безумовний пріоритет. Усі учні та
                працівники гімназії забезпечені місцями в облаштованих укриттях у пішій доступності
                поруч із закладом.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-forest-50/60 border border-forest/15">
                  <div className="font-heading font-bold text-forest text-sm mb-1">
                    1. Сигнал «Повітряна тривога»
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Учителі разом із працівниками закладу організовано супроводжують класи за
                    затвердженими безпечними маршрутами до укриттів поруч зі школою.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-forest-50/60 border border-forest/15">
                  <div className="font-heading font-bold text-forest text-sm mb-1">
                    2. Перебування в укритті
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    За можливості освітній процес продовжується в укритті. Вхід сторонніх осіб до
                    укриттів під час тривоги обмежений.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-forest-50/60 border border-forest/15">
                  <div className="font-heading font-bold text-forest text-sm mb-1">
                    3. Повернення до класів
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Забирати дітей під час тривоги не рекомендовано. Повернення до закладу та
                    продовження навчання відбувається лише після сигналу «Відбій».
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admissions' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-heading font-bold text-xl text-forest">
                  Зарахування учнів до Гімназії № 30
                </h3>
                <button
                  type="button"
                  onClick={() => onOpenContact('Запис на консультацію щодо вступу')}
                  className="text-sm font-semibold bg-forest text-white hover:bg-forest-light px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Подати онлайн-запит на консультацію
                </button>
              </div>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Прийом заяв до 1-х класів здійснюється відповідно до Порядку зарахування,
                відрахування та переведення учнів до державних та комунальних закладів освіти,
                затвердженого наказом МОН України № 367.
              </p>
              <div className="bg-offwhite p-5 rounded-xl border border-slate-200/80 space-y-2 text-sm text-slate-700">
                <div className="font-heading font-bold text-forest mb-2">
                  Необхідний пакет документів:
                </div>
                <ul className="list-disc list-inside space-y-1.5">
                  <li>
                    Заява одного з батьків або законних представників дитини (подається особисто або
                    через портал <span className="font-medium">school.isuo.org</span>).
                  </li>
                  <li>
                    Копія свідоцтва про народження дитини (під час подання пред&apos;являється
                    оригінал).
                  </li>
                  <li>
                    Оригінал або копія медичної довідки за формою первинної облікової документації №
                    086/о.
                  </li>
                  <li>
                    Документ, що підтверджує місце проживання дитини на території обслуговування
                    гімназії (для першочергового зарахування).
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-5">
              <h3 className="font-heading font-bold text-xl text-forest">
                Мова освітнього процесу — українська
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Відповідно до статті 7 Закону України «Про освіту» та статті 21 Закону України «Про
                забезпечення функціонування української мови як державної», мовою освітнього процесу
                у КЗЗСО «Гімназія № 30 Хмельницької міської ради» є державна (українська) мова.
              </p>
              <div className="pt-2">
                <div className="p-4 sm:p-5 rounded-xl bg-offwhite border border-slate-200/70 w-full">
                  <h4 className="font-heading font-bold text-forest text-base mb-1.5">
                    Вивчення іноземних мов
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Окрім поглибленого вивчення державної мови, учні гімназії вивчають іноземні мови
                    відповідно до затвердженої освітньої програми закладу.
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'sob' && (
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Ліва колонка: Картка інспектора СОБ */}
              <div className="lg:col-span-5 bg-offwhite rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5">
                {/* Місце для офіційного фото інспектора */}
                {sobInspector.photoUrl ? (
                  <button
                    type="button"
                    onClick={() => setSobPhotoOpen(true)}
                    title="Переглянути фото повністю"
                    className="group relative w-full rounded-xl overflow-hidden border border-forest/15 bg-[#F8F9F5] cursor-pointer block"
                  >
                    <SafeImage
                      src={sobInspector.photoUrl}
                      alt={sobInspector.fullName}
                      className="w-full h-auto max-h-96 object-contain mx-auto"
                    />
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-forest/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </span>
                  </button>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-forest/15 bg-gradient-to-br from-forest to-forest-dark aspect-[4/3] flex flex-col items-center justify-center text-center p-5">
                    <div className="w-20 h-20 rounded-full bg-gold/15 border-2 border-gold/50 flex items-center justify-center text-gold mb-3">
                      <User className="w-10 h-10" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold bg-white/10 px-3 py-1 rounded-full border border-gold/30">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Офіційне фото інспектора СОБ</span>
                    </div>
                    <p className="text-[11px] text-white/70 mt-2 max-w-[230px] leading-snug">
                      Стилізований портрет-плейсхолдер (легко замінюється на реальне фото)
                    </p>
                  </div>
                )}

                {/* Дані інспектора */}
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gold-50 text-gold-dark border border-gold/40">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{sobInspector.badge}</span>
                  </span>

                  <h4 className="font-heading font-extrabold text-xl text-forest leading-snug">
                    {sobInspector.fullName}
                  </h4>

                  <p className="text-sm text-slate-600 leading-relaxed">{sobInspector.position}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-forest-50 text-forest flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Графік перебування у закладі
                      </div>
                      <div className="font-medium text-slate-700">{sobInspector.schedule}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Права колонка: Напрямки роботи та взаємодії */}
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-forest">
                    Служба освітньої безпеки в Гімназії № 30
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
                    {sobInspector.description || DEFAULT_SOB_INSPECTOR.description}
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-offwhite border border-slate-200/80">
                    <div className="w-11 h-11 rounded-xl bg-forest text-gold flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-forest text-base">
                        Пропускний режим та правопорядок
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        Контроль безпеки на території гімназії та недопущення сторонніх осіб.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-offwhite border border-slate-200/80">
                    <div className="w-11 h-11 rounded-xl bg-forest text-gold flex items-center justify-center flex-shrink-0 shadow-sm">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-forest text-base">
                        Дії під час повітряної тривоги
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        Супровід учнів до укриття та контроль безпеки під час евакуації.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 sm:p-5 rounded-xl bg-offwhite border border-slate-200/80">
                    <div className="w-11 h-11 rounded-xl bg-forest text-gold flex items-center justify-center flex-shrink-0 shadow-sm">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-forest text-base">
                        Профілактика та підтримка
                      </h4>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                        Інтерактивні заняття з мінної безпеки, кібергігієни, правил дорожнього руху
                        та протидії булінгу; відкритість до спілкування з учнями та батьками.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Верхня акцентна плашка — Девіз закладу */}
              <div className="bg-forest text-white rounded-2xl p-6 sm:p-7 border border-forest shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-gold border border-gold/30">
                    Наш девіз
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white leading-snug">
                    «Знай свої права, виконуй обов’язки»
                  </h3>
                </div>
                <div className="w-12 h-14 shrink-0 opacity-90 hidden sm:block">
                  <CrestLogo variant="header" />
                </div>
              </div>

              {/* Картка «Пріоритетні напрямки діяльності» */}
              <div className="bg-offwhite rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-heading font-bold text-xl text-forest">
                    Пріоритетні напрямки діяльності
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    КЗЗСО «Гімназія № 30 Хмельницької міської ради» визначає такі напрямки:
                  </p>
                </div>
                <ol className="space-y-3 text-sm sm:text-base text-slate-700">
                  {[
                    'Розробка та впровадження нових технологій освіти та виховання, пошуку та розвитку здібних і обдарованих дітей.',
                    'Національно-патріотичне виховання, розвиток здобувачів освіти, пробудження в них духовності.',
                    'Забезпечення гармонійного розвитку, базової освітньої підготовки на підвищеному рівні здобувачів освіти, що включає розвиток дитини як особистості, її нахилів, інтересів, здібностей.',
                    'Забезпечення умов для ранньої професійної орієнтації та професійного самовизначення дитини.',
                    'Ставлення до батьків як суб’єктів освітнього процесу.',
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-200/70"
                    >
                      <span className="w-7 h-7 rounded-lg bg-forest text-gold font-heading font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Двоколонковий блок: Історія закладу та Гімн гімназії */}
              <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                {/* Ліва картка — Історія закладу */}
                <div className="bg-offwhite rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4">
                  <h3 className="font-heading font-bold text-xl text-forest">Історія закладу</h3>
                  <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
                    <p>
                      Відомо, що початкова Проскурівська школа № 7 прийняла перших учнів на початку
                      ХХ століття. Школа починала свою історію на вул. 25 Жовтня (зараз — вул.
                      Проскурівська) у будинку Центру технічної творчості, і це була Проскурівська
                      початкова школа № 7.
                    </p>
                    <p>
                      Фашистська окупація зруйнувала освіту в Україні, школи були перетворені на
                      склади, госпіталі, казарми. Серед шкіл міста, що відновили роботу після
                      звільнення Проскурова, була жіноча середня школа № 7.
                    </p>
                    <p>
                      У 1956 році закінчилося будівництво по вулиці Шевченка. Два верхніх поверхи
                      віддали для школи, яка називалася Залізнична школа № 75 станції Хмельницький
                      Південно-Західної залізниці (центр управління освітою був у м. Жмеринка).
                    </p>
                    <p>
                      Середня школа № 75 на підставі постанови Ради Міністрів СРСР від 24 грудня
                      1960 року була передана у відомство Міністерства освіти УРСР та перейменована
                      в середню школу № 7. У 1967 році був збудований новий будинок школи на вул.
                      Заводській, 33 — у цьому приміщенні Гімназія № 30 знаходиться по сьогоднішній
                      день.
                    </p>
                  </div>
                </div>

                {/* Права картка — Гімн гімназії */}
                <div className="bg-forest text-white rounded-2xl border border-forest p-6 sm:p-7 shadow-md flex flex-col items-center text-center">
                  <div className="w-16 h-[74px] mb-3">
                    <CrestLogo variant="header" />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-gold mb-5">
                    Гімн гімназії
                  </h3>
                  <div className="space-y-4 text-sm sm:text-base leading-relaxed text-white/90 font-medium">
                    <p>
                      На цій землі, як у широкім полі,
                      <br />
                      Де є лани навколо, простір і стежки,
                      <br />
                      Обрали ми життя у сьомій школі,
                      <br />
                      Тут наші друзі, вчителі, книжки.
                    </p>
                    <p>
                      Тут вчать любити маму й тата,
                      <br />
                      Тут вчаться всі читати і писати,
                      <br />
                      Народ любити, рідну Батьківщину.
                      <br />
                      Країна, школа і батьки – родина!
                    </p>
                    <p>
                      Прекрасний колектив педагогічний,
                      <br />
                      Учителі й директор на чолі,
                      <br />
                      Нас всіх в країну знань покличе,
                      <br />
                      Щоб у житті не загубились ми.
                    </p>
                    <p>
                      В цих стінах навчаємось нового,
                      <br />
                      Вивчаємо обов’язки й права.
                      <br />
                      Надасть нам школа шанс і допомогу,
                      <br />І з нас зросте держава правова.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальне вікно повного перегляду фото інспектора СОБ */}
      {sobPhotoOpen && sobInspector.photoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
          onClick={() => setSobPhotoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={sobInspector.fullName}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSobPhotoOpen(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 text-slate-700 hover:text-forest flex items-center justify-center shadow cursor-pointer"
              aria-label="Закрити"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="bg-[#F8F9F5] border-b border-slate-200/70">
              <SafeImage
                src={sobInspector.photoUrl}
                alt={sobInspector.fullName}
                className="w-full h-auto max-h-[75vh] object-contain mx-auto"
              />
            </div>
            <div className="p-5 text-center">
              <h4 className="font-heading font-bold text-lg text-forest">
                {sobInspector.fullName}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{sobInspector.position}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
