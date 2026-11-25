import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BookOpenCheck, Menu, Search, X } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { CrestLogo } from './CrestLogo';
import { GENTLE_EASE } from './Reveal';

interface HeaderProps {
  onOpenSearch: () => void;
}

const NAV_ITEMS = [
  { href: '#home', label: 'Головна', mobileLabel: 'Головна' },
  { href: '#parents', label: 'Батькам та учням', mobileLabel: 'Батькам та учням' },
  { href: '#team', label: 'Педагогічний колектив', mobileLabel: 'Педагогічний колектив' },
  { href: '#gallery', label: 'Фотогалерея', mobileLabel: 'Фотогалерея' },
  { href: '#news', label: 'Новини', mobileLabel: 'Новини та події' },
  {
    href: '#transparency',
    label: 'Прозорість та відкритість',
    mobileLabel: 'Прозорість та відкритість',
    accentDot: true,
  },
];

export const Header: React.FC<HeaderProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const closeMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current !== null) {
        window.clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    fromMobile = false
  ) => {
    e.preventDefault();

    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';
    const targetId = href.replace(/^#/, '');

    const scrollToTarget = () => {
      if (targetId === 'home' || targetId === 'top') {
        window.scrollTo({ top: 0, behavior });
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior, block: 'start' });
        }
      }

      if (window.location.hash !== href) {
        window.history.replaceState(null, '', href);
      }
    };

    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }

    if (fromMobile || mobileMenuOpen) {
      setMobileMenuOpen(false);
      document.body.style.overflow = '';
      scrollTimerRef.current = window.setTimeout(() => {
        scrollTimerRef.current = null;
        scrollToTarget();
      }, 100);
    } else {
      scrollToTarget();
    }
  };

  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            onClick={closeMenu}
            aria-hidden="true"
            className="fixed inset-0 z-30 bg-slate-950/25 backdrop-blur-[1px] lg:hidden"
          />
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 lg:gap-4 h-20">
            {/* Логотип та офіційна назва */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home', mobileMenuOpen)}
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0 shrink-0"
            >
              <div className="w-12 h-14 sm:w-14 sm:h-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                <CrestLogo variant="header" className="w-full h-full drop-shadow-sm" />
              </div>
              <div className="min-w-0">
                <span className="block font-heading font-extrabold text-forest text-lg sm:text-xl leading-tight tracking-tight whitespace-nowrap">
                  {SCHOOL_INFO.shortName}
                </span>
                <span className="block text-[10px] sm:text-[11px] lg:text-[10px] xl:text-[11px] leading-tight text-slate-500 font-medium tracking-[0.025em] uppercase mt-0.5 max-w-[175px] sm:max-w-none">
                  {SCHOOL_INFO.cityLabel}
                </span>
              </div>
            </a>

            {/* Десктопне меню */}
            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-[13px] xl:text-sm font-medium text-slate-700">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={
                    item.href === '#home'
                      ? 'text-forest font-semibold hover:text-gold-dark transition whitespace-nowrap shrink-0'
                      : item.accentDot
                        ? 'hover:text-forest transition inline-flex items-center gap-1.5 whitespace-nowrap shrink-0'
                        : 'hover:text-forest transition whitespace-nowrap shrink-0'
                  }
                >
                  <span>{item.label}</span>
                  {item.accentDot && <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
                </a>
              ))}

              <button
                type="button"
                onClick={onOpenSearch}
                title="Пошук по сайту (Ctrl+K)"
                aria-label="Пошук по сайту"
                className="inline-flex items-center gap-2 px-2.5 xl:px-3 py-1.5 rounded-xl bg-offwhite hover:bg-forest-50 text-forest border border-slate-200/90 hover:border-forest/35 transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
              >
                <Search className="w-4 h-4 text-forest shrink-0" />
                <span className="hidden xl:inline text-xs font-semibold text-slate-600">
                  Пошук
                </span>
                <kbd className="hidden 2xl:inline-flex items-center px-1.5 py-0.5 text-[10px] font-sans font-semibold text-slate-500 bg-white border border-slate-200 rounded">
                  Ctrl+K
                </kbd>
              </button>
            </nav>

            {/* Кнопки мобільної панелі: пошук + меню */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onOpenSearch();
                }}
                title="Пошук по сайту"
                aria-label="Пошук по сайту"
                className="p-2.5 rounded-xl text-forest hover:bg-forest-50 focus:outline-none transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2.5 rounded-xl text-forest hover:bg-forest-50 focus:outline-none transition-all duration-300 active:scale-95 cursor-pointer"
                aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Випадаюче мобільне меню */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              aria-label="Мобільна навігація"
              initial={prefersReducedMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: GENTLE_EASE }}
              className="lg:hidden absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-white border-t border-slate-100 shadow-xl"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, true)}
                    className={
                      item.href === '#home'
                        ? 'block px-3 py-2.5 rounded-xl bg-forest-50 text-forest font-semibold transition-colors duration-200 active:scale-[0.99]'
                        : 'block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors duration-200 active:scale-[0.99]'
                    }
                  >
                    {item.mobileLabel}
                  </a>
                ))}
                <a
                  href="#contacts"
                  onClick={(e) => handleNavClick(e, '#contacts', true)}
                  className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors duration-200 active:scale-[0.99]"
                >
                  Контакти
                </a>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-offwhite hover:bg-forest-50 text-forest border border-slate-200/80 font-semibold transition-all duration-200 active:scale-[0.99] cursor-pointer"
                >
                  <Search className="w-4 h-4 text-gold-dark shrink-0" />
                  <span>Пошук по сайту</span>
                </button>
                <a
                  href={SCHOOL_INFO.diaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-forest hover:bg-forest-light text-gold font-heading font-bold transition-all duration-300 active:scale-95"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  <span>Увійти в Електронний щоденник</span>
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
