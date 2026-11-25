import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import type { NewsItem } from '../types/school';
import { GENTLE_EASE } from './Reveal';
import { SafeImage } from './SafeImage';

interface NewsModalProps {
  item: NewsItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasNavigation?: boolean;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
  hasNavigation = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasImage = Boolean(item?.image && item.image.trim() !== '');
  const files = item?.files ?? [];

  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  useEffect(() => {
    if (item && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [item?.id]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
        >
          {hasNavigation && onPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="hidden sm:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-gold text-forest shadow-lg border border-slate-200/80 items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
              aria-label="Попередня новина"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {hasNavigation && onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="hidden sm:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 hover:bg-gold text-forest shadow-lg border border-slate-200/80 items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
              aria-label="Наступна новина"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <div className="h-full w-full overflow-y-auto overscroll-contain no-scrollbar">
            <div className="min-h-full flex items-center justify-center p-4 sm:px-16 lg:px-20">
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.25, ease: GENTLE_EASE }}
                className="my-8 bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-forest border border-slate-200/80 flex items-center justify-center shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
                aria-label="Закрити"
              >
                <X className="w-5 h-5" />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain no-scrollbar"
              >
                <div className="max-w-3xl mx-auto p-5 sm:p-8 space-y-6">
                  <div
                    className={
                      hasImage
                        ? 'rounded-xl overflow-hidden bg-offwhite border border-slate-200/70'
                        : 'rounded-xl overflow-hidden bg-forest'
                    }
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      className={
                        hasImage
                          ? 'w-full h-auto max-h-[45vh] sm:max-h-[50vh] object-contain mx-auto'
                          : 'w-full h-44 sm:h-52'
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="text-center space-y-2.5">
                      <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                        <span className="px-2.5 py-1 rounded-full bg-gold-50 text-gold-dark font-semibold border border-gold/30 uppercase tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <h3
                        id="news-modal-title"
                        className="font-heading font-extrabold text-xl sm:text-2xl text-forest leading-snug text-center"
                      >
                        {item.title}
                      </h3>
                    </div>

                    <p className="w-full text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line text-left md:text-justify">
                      {item.fullText}
                    </p>

                    {files.length > 0 && (
                      <div className="pt-4 border-t border-slate-200/80 space-y-3 text-left">
                        <div className="text-xs font-bold uppercase tracking-wider text-forest">
                          Прикріплені документи
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {files.map((fileUrl, index) => (
                            <a
                              key={`${fileUrl}-${index}`}
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-white text-sm font-semibold transition-all duration-300 active:scale-95 shadow-sm"
                            >
                              <FileText className="w-4 h-4 text-gold shrink-0" />
                              <span>
                                {files.length === 1 ? 'Переглянути документ' : `Документ ${index + 1}`}
                              </span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {hasNavigation && onPrev && onNext && (
                <div className="sm:hidden shrink-0 flex items-center justify-between gap-2 px-4 py-3 bg-offwhite border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={onPrev}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-forest text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Попередня</span>
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-forest text-xs font-semibold shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Наступна</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
