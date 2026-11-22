import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown, ChevronUp, Maximize2, Users, X } from 'lucide-react';
import type { TeamCategory, TeamMember } from '../types/school';
import { GENTLE_EASE, Reveal } from './Reveal';

interface TeamSectionProps {
  members: TeamMember[];
  isLoading?: boolean;
}

const INITIAL_VISIBLE_MEMBERS = 6;

const TEAM_FILTERS: { id: TeamCategory; label: string }[] = [
  { id: 'all', label: 'Усі педагоги' },
  { id: 'admin', label: 'Адміністрація' },
  { id: 'primary', label: 'Початкова школа' },
  { id: 'stem', label: 'Природничо-математичний цикл' },
  { id: 'humanities', label: 'Гуманітарний цикл' },
];

const TeamPortraitHeader: React.FC<{
  photoUrl?: string;
  name: string;
  role: string;
  initials: string;
  featured: boolean;
  onPreview: (photoUrl: string, name: string, role: string) => void;
}> = ({ photoUrl, name, role, initials, featured, onPreview }) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [photoUrl]);

  const backdropClass = featured ? 'bg-black/20' : 'bg-[#163A2E]/10';

  if (photoUrl && !imgError) {
    return (
      <button
        type="button"
        onClick={() => onPreview(photoUrl, name, role)}
        title="Переглянути фото повністю"
        className={`group/photo relative w-full h-72 overflow-hidden flex items-center justify-center cursor-pointer border-b ${
          featured ? 'border-white/10' : 'border-slate-200/70'
        } ${backdropClass}`}
      >
        <img
          src={photoUrl}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain group-hover/photo:scale-105 transition-transform duration-500 ease-out"
        />
        <span className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-forest/80 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 shadow-sm">
          <Maximize2 className="w-4 h-4" />
        </span>
      </button>
    );
  }

  return (
    <div
      className={`w-full h-72 flex items-center justify-center border-b ${
        featured ? 'border-white/10' : 'border-slate-200/70'
      } ${backdropClass}`}
    >
      <div
        className={`w-24 h-24 rounded-3xl font-heading font-extrabold text-3xl flex items-center justify-center shadow-md ${
          featured
            ? 'bg-gold text-forest ring-4 ring-gold/25'
            : 'bg-forest text-gold ring-4 ring-forest/10'
        }`}
      >
        {initials}
      </div>
    </div>
  );
};

export const TeamSection: React.FC<TeamSectionProps> = ({ members, isLoading = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<TeamCategory>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [previewPhoto, setPreviewPhoto] = useState<{
    url: string;
    name: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    if (!previewPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewPhoto]);

  const filteredMembers =
    selectedCategory === 'all'
      ? members
      : members.filter((member) => member.category === selectedCategory);

  const hasMoreMembers = filteredMembers.length > INITIAL_VISIBLE_MEMBERS;
  const visibleMembers =
    isExpanded || !hasMoreMembers
      ? filteredMembers
      : filteredMembers.slice(0, INITIAL_VISIBLE_MEMBERS);

  const handleCategoryChange = (category: TeamCategory) => {
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
      id="team"
      ref={sectionRef}
      className="py-16 sm:py-20 bg-white border-t border-slate-200/70 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-dark">
            Наша команда
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-forest mt-1">
            Педагогічний колектив гімназії
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Досвідчені наставники, новатори та фахівці своєї справи, які щодня створюють атмосферу
            підтримки, довіри та пізнання.
          </p>
        </Reveal>

        {/* Фільтр кафедр / підрозділів */}
        <Reveal delay={0.08} className="flex flex-wrap gap-2 mb-8">
          {TEAM_FILTERS.map((filter) => {
            const isActive = selectedCategory === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => handleCategoryChange(filter.id)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all duration-300 active:scale-95 cursor-pointer ${
                  isActive
                    ? 'font-semibold bg-forest text-white shadow-sm'
                    : 'font-medium bg-offwhite text-slate-700 border border-slate-200 hover:border-forest/40 hover:bg-forest-50/40'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </Reveal>

        {/* Стан завантаження, порожній стан кафедри або сітка карток педагогів */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden border border-slate-200/90 bg-offwhite animate-pulse"
              >
                <div className="h-72 bg-slate-200/70" />
                <div className="p-6 space-y-3">
                  <div className="h-6 w-28 rounded-full bg-slate-200" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                  <div className="h-4 w-1/2 bg-slate-200/70 rounded" />
                  <div className="h-12 w-full bg-slate-200/60 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-offwhite rounded-2xl border border-slate-200/90 p-10 sm:p-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-forest text-gold flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Users className="w-7 h-7" />
            </div>
            <p className="text-slate-700 font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Інформація про склад кафедри оновлюється
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleMembers.map((member, index) => (
              <motion.div
                key={`${selectedCategory}-${member.id}`}
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
                <article
                  className={`h-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                    member.featured
                      ? 'bg-forest text-white border-forest shadow-lg hover:shadow-2xl'
                      : 'bg-offwhite text-slate-800 border-slate-200/90 hover:border-forest/40 hover:shadow-lg'
                  }`}
                >
                {/* Верхній портретний блок */}
                <TeamPortraitHeader
                  photoUrl={member.photoUrl}
                  name={member.name}
                  role={member.role}
                  initials={member.initials}
                  featured={member.featured}
                  onPreview={(url, name, role) => setPreviewPhoto({ url, name, role })}
                />

                {/* Текстова частина під фото */}
                <div className="p-6 flex-1 flex flex-col justify-start">
                  <div>
                    <div className="mb-3">
                      <span
                        className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          member.featured
                            ? 'bg-white/15 text-gold border border-gold/30'
                            : 'bg-white text-forest border border-slate-200'
                        }`}
                      >
                        {member.categoryLabel}
                      </span>
                    </div>

                    <h3
                      className={`font-heading font-bold text-lg leading-snug ${
                        member.featured ? 'text-white' : 'text-forest'
                      }`}
                    >
                      {member.name}
                    </h3>
                    {member.role && (
                      <div
                        className={`text-sm font-semibold mt-1 ${
                          member.featured ? 'text-gold' : 'text-gold-dark'
                        }`}
                      >
                        {member.role}
                      </div>
                    )}
                    {member.qualification && (
                      <div
                        className={`text-xs mt-1.5 ${
                          member.featured ? 'text-white/75' : 'text-slate-500'
                        }`}
                      >
                        {member.qualification}
                      </div>
                    )}
                  </div>

                  {member.credo && (
                    <div
                      className={`mt-4 pt-4 border-t text-xs italic leading-relaxed ${
                        member.featured
                          ? 'border-white/15 text-white/85'
                          : 'border-slate-200/80 text-slate-600'
                      }`}
                    >
                      «{member.credo}»
                    </div>
                  )}
                </div>
                </article>
              </motion.div>
            ))}
          </div>
        )}

        {/* Кнопка розгортання / згортання списку педагогів */}
        {!isLoading && hasMoreMembers && (
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
                  <span>Показати всіх педагогів ({filteredMembers.length})</span>
                  <ChevronDown className="w-4 h-4 text-gold shrink-0" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Модальне вікно повного перегляду портрета педагога */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
            onClick={() => setPreviewPhoto(null)}
            role="dialog"
            aria-modal="true"
            aria-label={previewPhoto.name}
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: GENTLE_EASE }}
              className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 text-slate-700 hover:text-forest flex items-center justify-center shadow transition-all duration-300 active:scale-95 cursor-pointer"
                aria-label="Закрити"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="bg-[#F8F9F5] border-b border-slate-200/70">
                <img
                  src={previewPhoto.url}
                  alt={previewPhoto.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[75vh] object-contain mx-auto"
                />
              </div>
              <div className="p-5 text-center">
                <h4 className="font-heading font-bold text-lg text-forest">{previewPhoto.name}</h4>
                {previewPhoto.role && (
                  <p className="text-sm text-gold-dark font-medium mt-0.5">{previewPhoto.role}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
