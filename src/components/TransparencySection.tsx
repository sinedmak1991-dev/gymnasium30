import React, { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronUp, FileText, Search } from 'lucide-react';
import type { DocumentCategory, DocumentItem } from '../types/school';
import { GENTLE_EASE, Reveal } from './Reveal';

interface TransparencySectionProps {
  documents: DocumentItem[];
  isLoading?: boolean;
  onOpenDoc: (doc: DocumentItem) => void;
}

const INITIAL_VISIBLE_DOCS = 6;

const DOC_FILTERS: { id: DocumentCategory; label: string }[] = [
  { id: 'all', label: 'Усі документи' },
  { id: 'statute', label: 'Установчі та освітні' },
  { id: 'finance', label: 'Фінанси та кошторис' },
  { id: 'hr', label: 'Вакансії та територія' },
];

export const TransparencySection: React.FC<TransparencySectionProps> = ({
  documents,
  isLoading = false,
  onOpenDoc,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const filteredDocuments = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return documents.filter((doc) => {
      const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
      const matchesSearch =
        !query ||
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [documents, selectedCategory, searchQuery]);

  const hasMoreDocuments = filteredDocuments.length > INITIAL_VISIBLE_DOCS;
  const visibleDocuments =
    isExpanded || !hasMoreDocuments
      ? filteredDocuments
      : filteredDocuments.slice(0, INITIAL_VISIBLE_DOCS);

  const handleCategoryChange = (category: DocumentCategory) => {
    setSelectedCategory(category);
    setIsExpanded(false);
  };

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      setIsExpanded(true);
    }
  };

  return (
    <section id="transparency" ref={sectionRef} className="py-16 sm:py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
              Стаття 30 Закону України «Про освіту»
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest mt-1">
              Прозорість та інформаційна відкритість закладу освіти
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Офіційні установчі документи, освітні програми, фінансова звітність та інформація про
              кадрові потреби гімназії у вільному доступі.
            </p>
          </div>

          {/* Пошук по документах */}
          <div className="w-full lg:w-80 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsExpanded(false);
              }}
              placeholder="Пошук документа (напр. Статут, кошторис)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:border-forest shadow-sm transition-colors duration-200"
            />
          </div>
        </Reveal>

        {/* Фільтри категорій документів */}
        <Reveal delay={0.07} className="flex flex-wrap gap-2 mb-6">
          {DOC_FILTERS.map((filter) => {
            const isActive = selectedCategory === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleCategoryChange(filter.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'font-semibold bg-forest text-white shadow-sm'
                    : 'font-medium bg-white text-slate-600 border border-slate-200 hover:border-forest/40 hover:bg-forest-50/40'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </Reveal>

        {/* Сітка документів */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 animate-pulse space-y-3"
              >
                <div className="h-5 w-28 bg-slate-200 rounded" />
                <div className="h-5 w-4/5 bg-slate-200 rounded" />
                <div className="h-8 w-full bg-slate-200/70 rounded" />
              </div>
            ))
          ) : filteredDocuments.length === 0 ? (
            <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              За вашим запитом документів не знайдено. Спробуйте змінити ключове слово.
            </div>
          ) : (
            visibleDocuments.map((doc, index) => (
              <motion.div
                key={`${selectedCategory}-${doc.id}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  duration: 0.42,
                  delay: (index % 3) * 0.06,
                  ease: GENTLE_EASE,
                }}
                className="h-full"
              >
                <button
                  type="button"
                  onClick={() => onOpenDoc(doc)}
                  className="w-full h-full bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-forest hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-[0.99] cursor-pointer flex flex-col justify-between group text-left"
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-forest-50 text-forest">
                        {doc.categoryLabel}
                      </span>
                      <FileText className="w-4 h-4 text-slate-400 group-hover:text-gold-dark transition-colors duration-300 shrink-0" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-800 group-hover:text-forest transition-colors duration-200 leading-snug mb-2">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>
                  <div className="w-full pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{doc.date}</span>
                    <span className="font-semibold text-forest group-hover:underline">Відкрити →</span>
                  </div>
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Кнопка розгортання / згортання списку документів */}
        {!isLoading && hasMoreDocuments && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleToggleExpand}
              aria-expanded={isExpanded}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#163A2E] hover:bg-[#1E4D3D] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <span>Згорнути список</span>
                  <ChevronUp className="w-4 h-4 text-gold shrink-0" />
                </>
              ) : (
                <>
                  <span>Показати всі документи ({filteredDocuments.length})</span>
                  <ChevronDown className="w-4 h-4 text-gold shrink-0" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
