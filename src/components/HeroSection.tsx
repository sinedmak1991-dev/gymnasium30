import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowDownRight,
  FileText,
  Laptop,
  Newspaper,
  Shield,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { GENTLE_EASE } from './Reveal';

export const HeroSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const itemMotion = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.55, delay, ease: GENTLE_EASE },
        };

  return (
    <section id="top" className="hero-pattern relative overflow-hidden text-white">
      {/* Декоративне золоте світіння */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Ліва колонка: Текст та заклик до дії */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              {...itemMotion(0.04)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-gold/30 text-gold text-xs sm:text-sm font-medium"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Комунальний заклад загальної середньої освіти</span>
            </motion.div>

            <motion.h1
              {...itemMotion(0.13)}
              className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-[52px] leading-[1.15] tracking-tight text-white [text-wrap:balance]"
            >
              Гімназія № 30 <br className="hidden sm:inline" />
              <span className="text-gold">Хмельницької міської ради</span>
            </motion.h1>

            <motion.p
              {...itemMotion(0.22)}
              className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed"
            >
              Простір безпечного розвитку, якісної освіти та сучасних можливостей для кожної
              дитини. Поєднуємо академічні традиції з інноваційними підходами до навчання.
            </motion.p>

            <motion.div
              {...itemMotion(0.31)}
              className="pt-2 flex flex-wrap lg:flex-nowrap items-center gap-2.5 xl:gap-3.5"
            >
              <a
                href="#news"
                className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-forest font-heading font-bold text-sm xl:text-base px-4 xl:px-6 py-3 xl:py-3.5 rounded-xl shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0"
              >
                <Newspaper className="w-4 h-4 xl:w-5 xl:h-5 shrink-0" />
                <span>Новини</span>
              </a>
              <a
                href="#parents"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/25 font-medium text-sm xl:text-base px-4 xl:px-5 py-3 xl:py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0"
              >
                <span>Для батьків та учнів</span>
                <ArrowDownRight className="w-4 h-4 text-gold shrink-0" />
              </a>
              <a
                href="#transparency"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/25 font-medium text-sm xl:text-base px-4 xl:px-5 py-3 xl:py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap shrink-0"
              >
                <FileText className="w-4 h-4 text-gold shrink-0" />
                <span>Прозорість та відкритість</span>
              </a>
            </motion.div>
          </div>

          {/* Права колонка: Картка пріоритетів закладу */}
          <motion.div {...itemMotion(0.28)} className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="border-b border-white/10 pb-4">
                <span className="font-heading font-bold text-lg text-gold">
                  Наші ключові орієнтири
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      Безпечне середовище та укриття
                    </h3>
                    <p className="text-sm text-white/75 mt-1 leading-relaxed">
                      Облаштоване укриття, контроль доступу, Служба освітньої безпеки та
                      психологічний супровід.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      Сучасні освітні технології
                    </h3>
                    <p className="text-sm text-white/75 mt-1 leading-relaxed">
                      Мультимедійні кабінети, цифрові інструменти та поглиблене вивчення іноземних
                      мов.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">
                      Підтримка та розвиток особистості
                    </h3>
                    <p className="text-sm text-white/75 mt-1 leading-relaxed">
                      Атмосфера взаємоповаги, партнерство родини й школи, гуртки та спортивні секції.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
