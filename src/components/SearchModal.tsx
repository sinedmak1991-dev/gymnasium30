import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Compass,
  FileText,
  Newspaper,
  Search,
  UserRound,
  X,
} from 'lucide-react';
import type {
  DocumentItem,
  NewsItem,
  ParentTabId,
  SobInspectorInfo,
  TeamMember,
} from '../types/school';
import { GENTLE_EASE } from './Reveal';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  news: NewsItem[];
  team: TeamMember[];
  sobInspector: SobInspectorInfo;
  onSelectDocument: (doc: DocumentItem) => void;
  onSelectNews: (newsId: number) => void;
  onSelectTeamMember: (memberId: number) => void;
  onSelectParentTab: (tabId: ParentTabId) => void;
}

type ResultGroupKey = 'section' | 'document' | 'news' | 'team';

interface SearchResultItem {
  uid: string;
  group: ResultGroupKey;
  badge: string;
  title: string;
  subtitle: string;
  meta?: string;
  onSelect: () => void;
}

interface ParentSectionIndexEntry {
  tabId: ParentTabId;
  title: string;
  subtitle: string;
  keywords: string;
}

const QUICK_SUGGESTIONS = [
  'Статут',
  'Розклад',
  'Атестація',
  'Булінг',
  'Харчування',
  'Укриття',
];

const GROUP_META: Record<
  ResultGroupKey,
  {
    label: string;
    badgeClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  section: {
    label: 'Розділи для батьків та учнів',
    badgeClass: 'bg-forest-50 text-forest border-forest/15',
    icon: Compass,
  },
  document: {
    label: 'Прозорість та відкритість (Документи)',
    badgeClass: 'bg-gold-50 text-gold-dark border-gold/35',
    icon: FileText,
  },
  news: {
    label: 'Новини та події',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: Newspaper,
  },
  team: {
    label: 'Педагогічний колектив',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: UserRound,
  },
};

const GROUP_ORDER: ResultGroupKey[] = ['section', 'document', 'news', 'team'];

function matchesQuery(tokens: string[], haystack: string): boolean {
  if (tokens.length === 0) return false;
  const normalized = haystack.toLowerCase();
  return tokens.every((token) => normalized.includes(token));
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  documents,
  news,
  team,
  sobInspector,
  onSelectDocument,
  onSelectNews,
  onSelectTeamMember,
  onSelectParentTab,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
      return;
    }

    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 20);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const parentSectionIndex = useMemo<ParentSectionIndexEntry[]>(
    () => [
      {
        tabId: 'bells',
        title: 'Розклад дзвінків',
        subtitle: 'Уроки та перерви для 1-х, 2–4-х та 5–9-х класів',
        keywords:
          'розклад дзвінків уроки перерви 08:30 тривалість 35 хв 40 хв 45 хв 1 клас 2-4 класи 5-9 класи зведена таблиця',
      },
      {
        tabId: 'diary',
        title: 'Е-щоденник (платформа «Мрія»)',
        subtitle: 'Державний електронний щоденник, оцінки та завдання',
        keywords:
          'електронний щоденник е-щоденник мрія оцінки домашні завдання журнал батьки учні',
      },
      {
        tabId: 'food',
        title: 'Харчування',
        subtitle: 'Організація шкільного харчування та чотиритижневе меню',
        keywords:
          'харчування здорове харчування їдальня меню чотиритижневе сезонне обід сніданок норми безпечність',
      },
      {
        tabId: 'safety',
        title: 'Безпека та укриття',
        subtitle: 'Порядок дій під час повітряної тривоги та укриття гімназії',
        keywords:
          'безпека укриття сховище повітряна тривога евакуація порядок дій безпекове середовище захист',
      },
      {
        tabId: 'admissions',
        title: 'Правила прийому',
        subtitle: 'Зарахування до гімназії та перелік необхідних документів',
        keywords:
          'правила прийому вступ зарахування 1 клас перший клас документи заява медична довідка свідоцтво',
      },
      {
        tabId: 'language',
        title: 'Мова освітнього процесу',
        subtitle: 'Державна українська мова навчання в гімназії',
        keywords: 'мова освітнього процесу українська державна мова навчання',
      },
      {
        tabId: 'sob',
        title: 'Служба освітньої безпеки',
        subtitle: `Інспектор СОБ гімназії — ${sobInspector.fullName}`,
        keywords: `служба освітньої безпеки інспектор соб поліція патрульна безпека ${sobInspector.fullName} ${sobInspector.position} ${sobInspector.schedule}`,
      },
      {
        tabId: 'history',
        title: 'Історія та символіка',
        subtitle: 'Історія гімназії, девіз, візія та гімн закладу',
        keywords:
          'історія символіка гімн герб візія місія девіз традиції заводська 33 школа 7 школа 75',
      },
      {
        tabId: 'trustbox',
        title: 'Е-скринька довіри',
        subtitle: 'Конфіденційні та анонімні звернення, протидія булінгу й підтримка',
        keywords:
          'е-скринька довіри скринька довіри булінг цькування анонімно конфіденційно психолог психологічна підтримка звернення допомога безпечний простір',
      },
    ],
    [sobInspector]
  );

  const groupedResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const tokens = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];

    const groups: Record<ResultGroupKey, SearchResultItem[]> = {
      section: [],
      document: [],
      news: [],
      team: [],
    };

    if (tokens.length === 0) {
      return groups;
    }

    for (const section of parentSectionIndex) {
      const searchable = `${section.title} ${section.subtitle} ${section.keywords}`;
      if (matchesQuery(tokens, searchable)) {
        groups.section.push({
          uid: `section-${section.tabId}`,
          group: 'section',
          badge: 'Розділ',
          title: section.title,
          subtitle: section.subtitle,
          onSelect: () => {
            onClose();
            onSelectParentTab(section.tabId);
          },
        });
      }
    }

    for (const doc of documents) {
      const searchable = `${doc.title} ${doc.categoryLabel} ${doc.description} ${doc.date}`;
      if (matchesQuery(tokens, searchable)) {
        groups.document.push({
          uid: `doc-${doc.id}`,
          group: 'document',
          badge: 'Документ',
          title: doc.title,
          subtitle: doc.description || doc.categoryLabel,
          meta: doc.categoryLabel,
          onSelect: () => {
            onClose();
            onSelectDocument(doc);
          },
        });
      }
    }

    for (const item of news) {
      const searchable = `${item.title} ${item.category} ${item.summary} ${item.fullText} ${item.date}`;
      if (matchesQuery(tokens, searchable)) {
        groups.news.push({
          uid: `news-${item.id}`,
          group: 'news',
          badge: 'Новина',
          title: item.title,
          subtitle: item.summary || item.fullText,
          meta: `${item.category}${item.date ? ` · ${item.date}` : ''}`,
          onSelect: () => {
            onClose();
            onSelectNews(item.id);
          },
        });
      }
    }

    for (const member of team) {
      const searchable = `${member.name} ${member.role} ${member.categoryLabel} ${member.qualification}`;
      if (matchesQuery(tokens, searchable)) {
        groups.team.push({
          uid: `team-${member.id}`,
          group: 'team',
          badge: 'Педагог',
          title: member.name,
          subtitle: member.role || member.categoryLabel,
          meta: member.categoryLabel,
          onSelect: () => {
            onClose();
            onSelectTeamMember(member.id);
          },
        });
      }
    }

    return groups;
  }, [
    query,
    parentSectionIndex,
    documents,
    news,
    team,
    onClose,
    onSelectParentTab,
    onSelectDocument,
    onSelectNews,
    onSelectTeamMember,
  ]);

  const flatResults = useMemo(
    () => GROUP_ORDER.flatMap((groupKey) => groupedResults[groupKey]),
    [groupedResults]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (flatResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      flatResults[activeIndex]?.onSelect();
    }
  };

  const hasQuery = query.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm overflow-y-auto overscroll-contain no-scrollbar"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Пошук по сайту"
          onKeyDown={handleKeyDown}
        >
          <div className="min-h-full flex items-start justify-center p-4 pt-12 sm:pt-20">
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -10 }}
              transition={{ duration: 0.22, ease: GENTLE_EASE }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Верхня панель поля вводу */}
              <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 sm:py-4 border-b border-slate-200/80 bg-white">
                <Search className="w-5 h-5 text-forest shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Введіть запит (наприклад: Статут, розклад, атестація, булінг, новини)..."
                  className="w-full text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  aria-label="Пошуковий запит"
                />
                {hasQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-forest px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  >
                    Очистити
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-forest hover:bg-forest-50 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
                  aria-label="Закрити пошук"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Область результатів */}
              <div className="max-h-[62vh] overflow-y-auto overscroll-contain no-scrollbar p-4 sm:p-5">
                {!hasQuery ? (
                  <div className="space-y-4 py-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Популярні запити
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => {
                            setQuery(suggestion);
                            inputRef.current?.focus();
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-offwhite hover:bg-forest-50 text-slate-700 hover:text-forest border border-slate-200/90 hover:border-forest/30 text-xs sm:text-sm font-medium transition-all duration-200 active:scale-95 cursor-pointer"
                        >
                          <Search className="w-3.5 h-3.5 text-gold-dark" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      Пошук миттєво знаходить документи розділу «Прозорість та відкритість»,
                      новини, педагогів за ПІБ чи предметом, а також розділи для батьків та учнів.
                    </p>
                  </div>
                ) : flatResults.length === 0 ? (
                  <div className="text-center py-10 px-4 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-offwhite border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="font-heading font-bold text-base text-forest">
                      За запитом «{query.trim()}» нічого не знайдено
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                      Спробуйте змінити формулювання або ввести коротше слово, наприклад:
                      «Статут», «розклад», «харчування» чи прізвище педагога.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {GROUP_ORDER.map((groupKey) => {
                      const items = groupedResults[groupKey];
                      if (items.length === 0) return null;

                      const groupInfo = GROUP_META[groupKey];
                      const GroupIcon = groupInfo.icon;

                      return (
                        <div key={groupKey} className="space-y-2">
                          <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                              <GroupIcon className="w-3.5 h-3.5 text-gold-dark" />
                              <span>{groupInfo.label}</span>
                            </div>
                            <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
                              {items.length}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            {items.map((item) => {
                              const flatIdx = flatResults.findIndex((r) => r.uid === item.uid);
                              const isHighlighted = flatIdx === activeIndex;

                              return (
                                <button
                                  key={item.uid}
                                  type="button"
                                  onMouseEnter={() => setActiveIndex(flatIdx)}
                                  onClick={item.onSelect}
                                  className={`w-full flex items-start justify-between gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer group ${
                                    isHighlighted
                                      ? 'bg-forest-50/80 border-forest/35 shadow-sm'
                                      : 'bg-white border-slate-200/80 hover:border-forest/30 hover:bg-offwhite'
                                  }`}
                                >
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${groupInfo.badgeClass}`}
                                      >
                                        {item.badge}
                                      </span>
                                      {item.meta && (
                                        <span className="text-[11px] text-slate-400 font-medium truncate">
                                          {item.meta}
                                        </span>
                                      )}
                                    </div>
                                    <div className="font-heading font-bold text-sm sm:text-[15px] text-forest leading-snug">
                                      {item.title}
                                    </div>
                                    {item.subtitle && (
                                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                        {item.subtitle}
                                      </p>
                                    )}
                                  </div>
                                  <ArrowRight
                                    className={`w-4 h-4 shrink-0 mt-1 transition-transform duration-200 ${
                                      isHighlighted
                                        ? 'text-forest translate-x-0.5'
                                        : 'text-slate-300 group-hover:text-forest group-hover:translate-x-0.5'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Нижня підказка керування */}
              <div className="px-4 sm:px-5 py-2.5 bg-offwhite border-t border-slate-200/80 flex items-center justify-between gap-3 text-[11px] text-slate-500">
                <div className="hidden sm:flex items-center gap-3">
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans font-semibold text-slate-600">
                      ↑↓
                    </kbd>{' '}
                    навігація
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans font-semibold text-slate-600">
                      Enter
                    </kbd>{' '}
                    перейти
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  {hasQuery && (
                    <span className="font-semibold text-forest tabular-nums">
                      Знайдено: {flatResults.length}
                    </span>
                  )}
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-sans font-semibold text-slate-600">
                      Esc
                    </kbd>{' '}
                    закрити
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
