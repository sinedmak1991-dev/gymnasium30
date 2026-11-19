import React, { useState } from 'react';
import { BookOpenCheck, Menu, X } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { CrestLogo } from './CrestLogo';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:gap-4 h-20">
          {/* Логотип та офіційна назва */}
          <a
            href="#top"
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
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-[13px] xl:text-sm font-medium text-slate-700">
            <a
              href="#top"
              className="text-forest font-semibold hover:text-gold-dark transition whitespace-nowrap shrink-0"
            >
              Головна
            </a>
            <a href="#parents" className="hover:text-forest transition whitespace-nowrap shrink-0">
              Батькам та учням
            </a>
            <a href="#team" className="hover:text-forest transition whitespace-nowrap shrink-0">
              Педагогічний колектив
            </a>
            <a href="#gallery" className="hover:text-forest transition whitespace-nowrap shrink-0">
              Фотогалерея
            </a>
            <a href="#news" className="hover:text-forest transition whitespace-nowrap shrink-0">
              Новини
            </a>
            <a
              href="#transparency"
              className="hover:text-forest transition inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Прозорість та відкритість</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
            </a>
          </nav>

          {/* Кнопка мобільного меню */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden p-2.5 rounded-xl text-forest hover:bg-forest-50 focus:outline-none transition cursor-pointer"
            aria-label={mobileMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Випадаюче мобільне меню */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <a
            href="#top"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-xl bg-forest-50 text-forest font-semibold"
          >
            Головна
          </a>
          <a
            href="#parents"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
          >
            Батькам та учням
          </a>
          <a
            href="#team"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
          >
            Педагогічний колектив
          </a>
          <a
            href="#gallery"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
          >
            Фотогалерея
          </a>
          <a
            href="#news"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
          >
            Новини та події
          </a>
          <a
            href="#transparency"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
          >
            Прозорість та відкритість
          </a>
          <a
            href="#contacts"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 font-medium"
          >
            Контакти
          </a>
          <a
            href={SCHOOL_INFO.diaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-forest text-gold font-heading font-bold"
          >
            <BookOpenCheck className="w-4 h-4" />
            <span>Увійти в Електронний щоденник</span>
          </a>
        </div>
      )}
    </header>
  );
};
