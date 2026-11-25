import React from 'react';
import { BookOpenCheck, Clock, Mail, MapPin, Phone } from 'lucide-react';
import { SCHOOL_INFO } from '../data/schoolData';
import { CrestLogo } from './CrestLogo';
import { FacebookIcon } from './FacebookIcon';
import { Reveal } from './Reveal';

interface FooterProps {
  onOpenContact: (subject?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
  return (
    <footer id="contacts" className="bg-forest text-white pt-16 pb-10 border-t-4 border-gold scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Колонка 1: Герб та офіційна назва */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-16 flex-shrink-0">
                <CrestLogo variant="footer" className="w-full h-full drop-shadow-sm" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-lg sm:text-xl text-white leading-snug">
                  КЗЗСО «Гімназія № 30 <br />
                  Хмельницької міської ради»
                </div>
              </div>
            </div>
            <p className="text-sm text-white/75 leading-relaxed max-w-md">
              Сучасний освітній простір міста Хмельницького. Формуємо свідомих, освічених та
              впевнених у собі громадян України.
            </p>
          </div>

          {/* Колонка 2: Швидкі посилання */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-gold text-sm uppercase tracking-wider">
              Навігація
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <a
                  href={SCHOOL_INFO.diaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition inline-flex items-center gap-1.5 font-semibold text-gold-light"
                >
                  <BookOpenCheck className="w-4 h-4" />
                  <span>Електронний щоденник</span>
                </a>
              </li>
              <li>
                <a href="#parents" className="hover:text-gold transition">
                  Батькам та учням
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-gold transition">
                  Педагогічний колектив
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-gold transition">
                  Фотогалерея
                </a>
              </li>
              <li>
                <a href="#transparency" className="hover:text-gold transition">
                  Прозорість та відкритість
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-gold transition">
                  Новини та події
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenContact()}
                  className="hover:text-gold transition cursor-pointer text-left"
                >
                  Електронне звернення громадян
                </button>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Контактна інформація */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-heading font-bold text-gold text-sm uppercase tracking-wider">
              Контакти
            </h4>
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
                <a
                  href={SCHOOL_INFO.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Відкрити на Google Картах"
                  className="hover:text-gold transition"
                >
                  {SCHOOL_INFO.footerAddress}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={SCHOOL_INFO.footerPhoneHref} className="hover:text-gold transition tabular-nums">
                  {SCHOOL_INFO.footerPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href={SCHOOL_INFO.footerEmailHref} className="hover:text-gold transition">
                  {SCHOOL_INFO.footerEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5 tabular-nums">
                  <div>{SCHOOL_INFO.workHours}</div>
                  <div className="text-xs text-white/70">{SCHOOL_INFO.directorReceptionHours}</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FacebookIcon className="w-4 h-4 text-gold flex-shrink-0" />
                <a
                  href={SCHOOL_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold transition"
                >
                  Офіційна сторінка у Facebook
                </a>
              </li>
            </ul>
          </div>
          </div>
        </Reveal>

        <div className="pt-8 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center md:justify-between gap-2 text-xs text-white/60 text-center md:text-left">
          <span>© 2026 {SCHOOL_INFO.fullName}. Усі права захищено.</span>
          <span>
            Хостинг та домен надано компанією{' '}
            <a
              href="https://cityhost.ua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-gold transition underline decoration-white/25 hover:decoration-gold underline-offset-2"
            >
              CityHost
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};
