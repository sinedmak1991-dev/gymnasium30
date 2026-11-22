import React from 'react';
import { Apple, FileCheck, GraduationCap, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from './Reveal';

interface StatItem {
  value: string;
  label: string;
  icon: LucideIcon;
  compactTitle?: boolean;
}

const STATS: StatItem[] = [
  {
    value: '1–9 класи',
    label: 'Початкова та базова середня освіта (НУШ та проєкт «Інтелект України»)',
    icon: GraduationCap,
  },
  {
    value: '100%',
    label: 'Забезпеченість місцями в облаштованому укритті',
    icon: ShieldCheck,
  },
  {
    value: 'Здорове харчування',
    label:
      'Збалансоване чотиритижневе сезонне меню відповідно до сучасних державних норм та стандартів безпечності харчування',
    icon: Apple,
    compactTitle: true,
  },
  {
    value: 'Відкритість',
    label: 'Публічна звітність та діалог з батьківською громадою',
    icon: FileCheck,
  },
];

export const StatsBar: React.FC = () => {
  return (
    <section id="about" className="py-10 sm:py-12 bg-white border-b border-slate-200/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Reveal key={stat.value} delay={index * 0.07} className="h-full">
                <div className="group h-full flex flex-col p-4 sm:p-5 rounded-2xl bg-offwhite border border-emerald-900/10 shadow-sm text-center sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-forest/25">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold/30 text-forest flex items-center justify-center mx-auto sm:mx-0 mb-3 shrink-0 transition-colors duration-300 group-hover:bg-forest group-hover:border-forest group-hover:text-gold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-h-[1.75rem] flex items-center justify-center sm:justify-start">
                    <div
                      className={`font-heading font-extrabold text-forest leading-tight tracking-tight tabular-nums ${
                        stat.compactTitle
                          ? 'text-lg sm:text-[19px] lg:text-[17px] xl:text-[20px] xl:whitespace-nowrap'
                          : 'text-xl sm:text-2xl lg:text-[21px] xl:text-2xl whitespace-nowrap'
                      }`}
                    >
                      {stat.value}
                    </div>
                  </div>
                  <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-slate-600 mt-1.5 font-medium">
                    {stat.label}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
