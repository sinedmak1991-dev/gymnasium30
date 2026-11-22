import React from 'react';
import { Reveal } from './Reveal';

const STATS = [
  {
    value: '1–9 класи',
    label: 'Початкова та базова середня освіта (НУШ та проєкт «Інтелект України»)',
  },
  {
    value: '100%',
    label: 'Забезпеченість місцями в облаштованому укритті',
  },
  {
    value: 'Здорове харчування',
    label:
      'Збалансоване чотиритижневе сезонне меню відповідно до сучасних державних норм та стандартів безпечності харчування',
  },
  {
    value: 'Відкритість',
    label: 'Публічна звітність та діалог з батьківською громадою',
  },
];

export const StatsBar: React.FC = () => {
  return (
    <section id="about" className="py-12 bg-white border-b border-slate-200/70 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {STATS.map((stat, index) => (
            <Reveal key={stat.value} delay={index * 0.07} className="h-full">
              <div className="h-full p-5 rounded-2xl bg-offwhite border border-slate-100 text-center sm:text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-forest/20">
                <div className="text-2xl sm:text-3xl font-heading font-extrabold text-forest tabular-nums">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 mt-1 font-medium">{stat.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
