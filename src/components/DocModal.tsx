import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Clock, ExternalLink, FileCheck2, X } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import type { DocumentItem } from '../types/school';
import { GENTLE_EASE } from './Reveal';

interface DocModalProps {
  doc: DocumentItem | null;
  onClose: () => void;
}

export const DocModal: React.FC<DocModalProps> = ({ doc, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const hasPdf = Boolean(doc?.pdfUrl && doc.pdfUrl.trim() !== '');

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-modal-title"
        >
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.25, ease: GENTLE_EASE }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-all duration-300 active:scale-95 cursor-pointer"
              aria-label="Закрити"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-forest-50 text-forest flex items-center justify-center flex-shrink-0">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider">
                  Офіційний документ
                </span>
                <h3
                  id="doc-modal-title"
                  className="font-heading font-bold text-lg text-forest leading-tight"
                >
                  {doc.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">{doc.description}</p>

            <div className="bg-offwhite p-4 rounded-xl border border-slate-200/80 text-xs text-slate-500 space-y-1 mb-6">
              <div>
                <strong>Заклад:</strong> {SCHOOL_INFO.fullName}
              </div>
              <div>
                <strong>Формат файлу:</strong> PDF
              </div>
              <div>
                <strong>Статус:</strong> {doc.date}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Закрити
              </button>
              {hasPdf ? (
                <a
                  href={doc.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-forest hover:bg-forest-light text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95"
                >
                  <ExternalLink className="w-4 h-4 text-gold" />
                  <span>Завантажити PDF</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 font-medium text-sm px-4 py-2.5 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Файл готується до публікації</span>
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
