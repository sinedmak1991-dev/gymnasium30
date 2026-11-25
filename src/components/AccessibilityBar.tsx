import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff, Image as ImageIcon, RotateCcw, X } from 'lucide-react';
import type {
  A11yColorScheme,
  A11yFontSize,
  A11yImagesMode,
  AccessibilitySettings,
} from '../hooks/useAccessibility';
import { GENTLE_EASE } from './Reveal';

interface AccessibilityBarProps {
  isOpen: boolean;
  settings: AccessibilitySettings;
  isCustomActive: boolean;
  onFontSizeChange: (size: A11yFontSize) => void;
  onColorSchemeChange: (scheme: A11yColorScheme) => void;
  onImagesModeChange: (mode: A11yImagesMode) => void;
  onReset: () => void;
  onClose: () => void;
}

const FONT_OPTIONS: { value: A11yFontSize; label: string; title: string }[] = [
  { value: '100', label: 'А', title: 'Стандартний розмір шрифту (100%)' },
  { value: '115', label: 'А+', title: 'Збільшений розмір шрифту (115%)' },
  { value: '130', label: 'А++', title: 'Великий розмір шрифту (130%)' },
];

const SCHEME_OPTIONS: { value: A11yColorScheme; label: string; previewClass: string }[] = [
  {
    value: 'default',
    label: 'Стандартна',
    previewClass: 'bg-forest text-gold border-forest',
  },
  {
    value: 'light-contrast',
    label: 'Чорно-біла',
    previewClass: 'bg-white text-black border-black',
  },
  {
    value: 'dark-contrast',
    label: 'Темна контрастна',
    previewClass: 'bg-black text-[#FFE600] border-[#FFE600]',
  },
];

const IMAGE_OPTIONS: {
  value: A11yImagesMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: 'show', label: 'Показати', icon: ImageIcon },
  { value: 'grayscale', label: 'Ч/Б', icon: Eye },
  { value: 'hide', label: 'Приховати', icon: EyeOff },
];

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({
  isOpen,
  settings,
  isCustomActive,
  onFontSizeChange,
  onColorSchemeChange,
  onImagesModeChange,
  onReset,
  onClose,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="region"
          aria-label="Налаштування доступності для людей із порушеннями зору"
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.22, ease: GENTLE_EASE }}
          className="overflow-hidden bg-offwhite border-t border-slate-200 shadow-md"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              {/* Заголовок панелі на малих екранах + кнопка закриття */}
              <div className="w-full xl:w-auto flex items-center justify-between gap-2 pb-2 xl:pb-0 border-b xl:border-b-0 border-slate-200/80">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-heading font-bold text-forest">
                  <Eye className="w-4 h-4 text-gold-dark shrink-0" />
                  <span>Режим доступності</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Закрити панель доступності"
                  className="xl:hidden inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-forest transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Групи налаштувань */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 flex-1">
                {/* 1. Розмір шрифту */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Розмір шрифту:
                  </span>
                  <div className="inline-flex items-center gap-1" role="group" aria-label="Розмір шрифту">
                    {FONT_OPTIONS.map((option) => {
                      const isActive = settings.fontSize === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          title={option.title}
                          aria-pressed={isActive}
                          onClick={() => onFontSizeChange(option.value)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-heading font-extrabold border transition-all duration-200 active:scale-95 cursor-pointer ${
                            isActive
                              ? 'bg-forest text-white border-forest shadow-sm'
                              : 'bg-white text-forest border-slate-300 hover:border-forest'
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Колірна схема */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Колірна схема:
                  </span>
                  <div className="inline-flex flex-wrap items-center gap-1.5" role="group" aria-label="Колірна схема">
                    {SCHEME_OPTIONS.map((option) => {
                      const isActive = settings.colorScheme === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => onColorSchemeChange(option.value)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer ${
                            isActive
                              ? 'bg-forest text-white border-forest shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-forest'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`w-3.5 h-3.5 rounded-full border shrink-0 ${option.previewClass}`}
                          />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Зображення */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">
                    Зображення:
                  </span>
                  <div className="inline-flex items-center gap-1" role="group" aria-label="Відображення зображень">
                    {IMAGE_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      const isActive = settings.imagesMode === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => onImagesModeChange(option.value)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 active:scale-95 cursor-pointer ${
                            isActive
                              ? 'bg-forest text-white border-forest shadow-sm'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-forest'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Кнопка скидання та закриття */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={onReset}
                  disabled={!isCustomActive}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-forest hover:bg-forest-50 hover:border-forest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                  <span>Скинути налаштування</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Закрити панель доступності"
                  className="hidden xl:inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-forest hover:border-forest transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
