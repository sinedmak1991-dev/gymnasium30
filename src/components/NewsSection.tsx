import React, { useRef, useState } from 'react';
import { ArrowRight, Calendar, ChevronDown, ChevronUp, Newspaper, Paperclip } from 'lucide-react';
import type { NewsItem } from '../types/school';
import { SafeImage } from './SafeImage';

interface NewsSectionProps {
  news: NewsItem[];
  isLoading?: boolean;
  onOpenNews: (id: number) => void;
}

const INITIAL_VISIBLE_NEWS = 3;

export const NewsSection: React.FC<NewsSectionProps> = ({
  news,
  isLoading = false,
  onOpenNews,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const hasMoreNews = news.length > INITIAL_VISIBLE_NEWS;
  const visibleNews =
    isExpanded || !hasMoreNews ? news : news.slice(0, INITIAL_VISIBLE_NEWS);

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
      id="news"
      ref={sectionRef}
      className="py-16 sm:py-20 bg-white border-y border-slate-200/70 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
            Життя гімназії
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest mt-1">
            Останні новини та події
          </h2>
        </div>

        {/* Стан завантаження, порожній стан або сітка новин */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="bg-offwhite rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-slate-200/70" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-5 w-4/5 bg-slate-200 rounded" />
                  <div className="h-4 w-full bg-slate-200/70 rounded" />
                  <div className="h-4 w-2/3 bg-slate-200/70 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="bg-offwhite rounded-2xl border border-slate-200/90 p-10 sm:p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-forest text-gold flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Newspaper className="w-7 h-7" />
            </div>
            <p className="text-slate-700 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Стрічка новин готується до публікації. Актуальні події та оголошення гімназії
              з&apos;являться найближчим часом
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {visibleNews.map((item) => {
              const hasImage = Boolean(item.image && item.image.trim() !== '');
              const fileCount = item.files?.length ?? 0;
              return (
                <article
                  key={item.id}
                  className="bg-offwhite rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col hover:shadow-lg hover:border-forest/30 transition duration-300 group"
                >
                  <div
                    className={`relative aspect-video overflow-hidden border-b border-slate-200/60 ${
                      hasImage ? 'bg-[#F8F9F5]' : 'bg-forest'
                    }`}
                  >
                    <SafeImage
                      src={item.image}
                      alt={item.title}
                      className={`w-full h-full ${
                        hasImage
                          ? 'object-contain group-hover:scale-[1.02] transition duration-500'
                          : ''
                      }`}
                    />
                    <span className="absolute top-3 left-3 bg-forest/90 backdrop-blur-sm text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/25">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                        <span>{item.date}</span>
                      </div>
                      {fileCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-forest-50 text-forest border border-forest/15">
                          <Paperclip className="w-3 h-3 text-gold-dark shrink-0" />
                          <span>{fileCount === 1 ? 'Додано документ' : 'Є документи'}</span>
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-forest leading-snug mb-2.5 group-hover:text-forest-light transition">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5 flex-1">
                      {item.summary}
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenNews(item.id)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-forest hover:text-gold-dark transition self-start cursor-pointer"
                    >
                      <span>Читати далі</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Кнопка розгортання / згортання новин */}
        {!isLoading && hasMoreNews && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleToggleExpand}
              aria-expanded={isExpanded}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#163A2E] hover:bg-[#1E4D3D] text-white text-sm font-semibold shadow-sm transition cursor-pointer"
            >
              {isExpanded ? (
                <>
                  <span>Згорнути</span>
                  <ChevronUp className="w-4 h-4 text-gold shrink-0" />
                </>
              ) : (
                <>
                  <span>Показати всі новини ({news.length})</span>
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
