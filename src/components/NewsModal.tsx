import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { FileText, X } from 'lucide-react';
import type { NewsItem } from '../types/school';
import { GENTLE_EASE } from './Reveal';
import { SafeImage } from './SafeImage';

interface NewsModalProps {
  item: NewsItem | null;
  onClose: () => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({ item, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const hasImage = Boolean(item?.image && item.image.trim() !== '');
  const files = item?.files ?? [];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: GENTLE_EASE }}
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 text-slate-700 hover:text-forest flex items-center justify-center shadow transition-all duration-300 active:scale-95 cursor-pointer"
              aria-label="Закрити"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="overflow-y-auto">
              <div className={hasImage ? 'bg-offwhite border-b border-slate-200/70' : 'bg-forest'}>
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  className={
                    hasImage
                      ? 'w-full h-auto max-h-[75vh] object-contain mx-auto'
                      : 'w-full h-48 sm:h-52'
                  }
                />
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-gold-50 text-gold-dark font-semibold border border-gold/30">
                    {item.category}
                  </span>
                  <span className="text-slate-400 font-medium">{item.date}</span>
                </div>
                <h3
                  id="news-modal-title"
                  className="font-heading font-extrabold text-xl sm:text-2xl text-forest leading-snug"
                >
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {item.fullText}
                </p>

                {files.length > 0 && (
                  <div className="pt-4 border-t border-slate-200/80 space-y-3">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
