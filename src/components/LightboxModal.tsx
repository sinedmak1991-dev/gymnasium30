import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '../types/school';
import { GENTLE_EASE } from './Reveal';
import { SafeImage } from './SafeImage';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onPrev,
  onNext,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Закрити"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-gold hover:text-forest text-white flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Попереднє фото"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={item.id}
                initial={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 8 }
                }
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.24, ease: GENTLE_EASE }}
                className="w-full flex flex-col items-center"
              >
                <div className="relative w-full rounded-2xl overflow-hidden bg-offwhite shadow-2xl border border-white/15">
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto max-h-[75vh] object-contain mx-auto bg-[#163A2E]/5"
                  />
                </div>
                <div className="mt-4 text-center text-white max-w-2xl px-4">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-gold mb-1">
                    {item.categoryLabel}
                  </span>
                  <h4 id="lightbox-title" className="font-heading font-bold text-lg sm:text-xl">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/75 mt-1">{item.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-gold hover:text-forest text-white flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Наступне фото"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
