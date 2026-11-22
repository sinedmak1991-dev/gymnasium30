import React from 'react';
import { BookOpenCheck, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { FacebookIcon } from './FacebookIcon';

interface TopBarProps {
  onOpenContact: (subject?: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenContact }) => {
  return (
    <div className="bg-forest-dark text-white/90 text-xs sm:text-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>{SCHOOL_INFO.topAddress}</span>
          </span>
          <a
            href={SCHOOL_INFO.topPhoneHref}
            className="inline-flex items-center gap-1.5 hover:text-gold transition"
          >
            <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
            <span className="tabular-nums">{SCHOOL_INFO.topPhone}</span>
          </a>
          <a
            href={SCHOOL_INFO.topEmailHref}
            className="hidden md:inline-flex items-center gap-1.5 hover:text-gold transition"
          >
            <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
            <span>{SCHOOL_INFO.topEmail}</span>
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto sm:ml-0">
          <a
            href={SCHOOL_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Офіційна сторінка у Facebook"
            title="Офіційна сторінка у Facebook"
            className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-gold text-white hover:text-forest font-medium px-2.5 sm:px-3 py-1 rounded-full border border-white/15 hover:border-gold transition-all duration-300 active:scale-95 whitespace-nowrap shrink-0"
          >
            <FacebookIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Facebook</span>
          </a>
          <a
            href={SCHOOL_INFO.diaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-gold text-forest hover:bg-gold-light font-heading font-bold px-3.5 py-1 rounded-full transition-all duration-300 active:scale-95 shadow-sm whitespace-nowrap shrink-0"
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Е-щоденник</span>
          </a>
          <button
            type="button"
            onClick={() => onOpenContact()}
            className="inline-flex items-center gap-1.5 bg-gold/15 hover:bg-gold text-gold hover:text-forest font-medium px-3 py-1 rounded-full border border-gold/40 transition-all duration-300 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Зворотний зв&apos;язок</span>
          </button>
        </div>
      </div>
    </div>
  );
};
