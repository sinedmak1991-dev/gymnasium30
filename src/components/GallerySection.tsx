import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Camera, ChevronDown, ChevronUp, Maximize2 } from 'lucide-react';
import type { GalleryCategory, GalleryItem } from '../types/school';
import { GENTLE_EASE, Reveal } from './Reveal';
import { SafeImage } from './SafeImage';

interface GallerySectionProps {
  items: GalleryItem[];
  isLoading?: boolean;
  onOpenLightbox: (itemId: number) => void;
}

const INITIAL_VISIBLE_PHOTOS = 3;

const GALLERY_FILTERS: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'Усі фото' },
  { id: 'study', label: 'Навчальний процес' },
  { id: 'safety', label: 'Безпека та простір' },
  { id: 'events', label: 'Події та свята' },
];

export const GallerySection: React.FC<GallerySectionProps> = ({
  items,
  isLoading = false,
  onOpenLightbox,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const hasMoreItems = filteredItems.length > INITIAL_VISIBLE_PHOTOS;
  const visibleItems =
    isExpanded || !hasMoreItems ? filteredItems : filteredItems.slice(0, INITIAL_VISIBLE_PHOTOS);

  const handleCategoryChange = (category: GalleryCategory) => {
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
    <section
      id="gallery"
      ref={sectionRef}
      className="py-16 sm:py-20 bg-offwhite border-t border-slate-200/70 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
              Освітній простір у кадрі
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest mt-1">
              Життя гімназії: Фотогалерея
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Натисніть на будь-яку світлину, щоб відкрити повноекранний перегляд.
            </p>
          </div>

          {/* Фільтри галереї */}
          <div className="flex flex-wrap gap-2">
            {GALLERY_FILTERS.map((filter) => {
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
          </div>
        </Reveal>

        {/* Стан завантаження, порожній стан або адаптивна сітка фотографій */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-200/70 aspect-[4/3] animate-pulse border border-slate-200/80"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Reveal className="bg-white rounded-2xl border border-slate-200/90 p-10 sm:p-14 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-forest text-gold flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Camera className="w-7 h-7" />
            </div>
            <p className="text-slate-700 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Фотогалерея оновлюється. Незабаром тут з&apos;являться світлини з життя нашої
              гімназії
            </p>
          </Reveal>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visibleItems.map((item, index) => (
              <motion.div
                key={`${selectedCategory}-${item.id}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                  duration: 0.45,
                  delay: (index % 3) * 0.07,
                  ease: GENTLE_EASE,
                }}
                className="h-full"
              >
                <button
                  type="button"
                  onClick={() => onOpenLightbox(item.id)}
                  className="group w-full h-full rounded-2xl overflow-hidden bg-white cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-forest/40 transition-all duration-300 border border-slate-200/80 text-left flex flex-col"
                >
                  <div className="relative w-full aspect-[4/3] bg-[#F8F9F5] overflow-hidden border-b border-slate-100 flex items-center justify-center">
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute top-3.5 left-3.5 bg-forest/90 backdrop-blur-sm text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/30">
                      {item.categoryLabel}
                    </span>
                    <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-forest/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-base sm:text-lg text-forest leading-snug group-hover:text-forest-light transition-colors duration-200">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Кнопка розгортання / згортання фотогалереї */}
        {!isLoading && hasMoreItems && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleToggleExpand}
              aria-expanded={isExpanded}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#163A2E] hover:bg-[#1E4D3D] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <span>Згорнути</span>
                  <ChevronUp className="w-4 h-4 text-gold shrink-0" />
                </>
              ) : (
                <>
                  <span>Показати всі фото ({filteredItems.length})</span>
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
