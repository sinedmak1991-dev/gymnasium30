import React, { useState } from 'react';
import {
  Check,
  HeartHandshake,
  Loader2,
  Lock,
  Send,
  ShieldCheck,
  UserCheck,
  UserX,
} from 'lucide-react';
import { submitFeedbackRequest } from '../services/feedback';

type SenderRole = 'Учень' | 'Батьки' | 'Педагог' | 'Інше';
type SubmissionMode = 'anonymous' | 'with_contacts';

const SENDER_ROLES: SenderRole[] = ['Учень', 'Батьки', 'Педагог', 'Інше'];
const TRUST_BOX_TOPIC = '[Е-СКРИНЬКА ДОВІРИ — БУЛІНГ]';

export const TrustBoxPanel: React.FC = () => {
  const [senderRole, setSenderRole] = useState<SenderRole>('Учень');
  const [mode, setMode] = useState<SubmissionMode>('anonymous');
  const [contactDetails, setContactDetails] = useState('');
  const [situation, setSituation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedSituation = situation.trim();
    const trimmedContact = contactDetails.trim();

    if (!trimmedSituation) {
      setErrorMessage('Будь ласка, опишіть ситуацію перед надсиланням звернення.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const isAnonymous = mode === 'anonymous';
    const formattedMessage = [
      `Хто звертається: ${senderRole}`,
      `Формат звернення: ${isAnonymous ? 'Анонімно' : 'Залишити контакти для зв’язку'}`,
      !isAnonymous && trimmedContact ? `Ім'я, клас або контакти: ${trimmedContact}` : null,
      '',
      trimmedSituation,
    ]
      .filter((line): line is string => line !== null)
      .join('\n');

    try {
      await submitFeedbackRequest({
        name: isAnonymous ? `Анонімно (${senderRole})` : `${senderRole} (конфіденційно)`,
        contact: isAnonymous ? 'Анонімне звернення' : trimmedContact || 'Не вказано',
        topic: TRUST_BOX_TOPIC,
        message: formattedMessage,
      });

      setContactDetails('');
      setSituation('');
      setMode('anonymous');
      setSenderRole('Учень');
      setSubmitted(true);
    } catch {
      setErrorMessage('Не вдалося надіслати звернення. Спробуйте, будь ласка, ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Ліва колонка: Пояснення та гарантія конфіденційності */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-50 border border-forest/15 text-forest text-xs font-bold uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-gold-dark shrink-0" />
            <span>Безпечний простір та підтримка</span>
          </div>

          <div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-forest">
              Е-скринька довіри
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
              Тут ви можете конфіденційно або повністю анонімно повідомити про випадки булінгу,
              цькування чи потребу в психологічній підтримці. Повідомлення отримують лише директор
              та психологічна служба гімназії.
            </p>
          </div>

          <div className="bg-offwhite rounded-2xl p-5 border border-emerald-900/10 space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-forest text-gold flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-forest">
                  Повна конфіденційність
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  За замовчуванням звернення надсилається анонімно — вам не потрібно вказувати
                  ім&apos;я чи телефон, якщо ви цього не бажаєте.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-slate-200/70">
              <div className="w-9 h-9 rounded-xl bg-gold-50 border border-gold/30 text-forest flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-forest">
                  Безпечне реагування
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Кожне повідомлення уважно опрацьовується для захисту прав дитини та створення
                  безпечної атмосфери у гімназії.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Права колонка: Вбудована форма звернення */}
        <div className="lg:col-span-7">
          <div className="bg-offwhite rounded-2xl border border-slate-200/90 p-5 sm:p-7">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Хто звертається */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-forest mb-2">
                    Хто звертається
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SENDER_ROLES.map((role) => {
                      const isSelected = senderRole === role;
                      return (
                        <button
                          key={role}
                          type="button"
                          disabled={isSubmitting}
                          onClick={() => setSenderRole(role)}
                          className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-60 ${
                            isSelected
                              ? 'bg-forest text-white border-forest shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-forest/40'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Формат звернення */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-forest mb-2">
                    Формат звернення
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setMode('anonymous')}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60 ${
                        mode === 'anonymous'
                          ? 'bg-forest text-white border-forest shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-forest/40'
                      }`}
                    >
                      <UserX
                        className={`w-4 h-4 shrink-0 ${
                          mode === 'anonymous' ? 'text-gold' : 'text-forest'
                        }`}
                      />
                      <span>Анонімно</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setMode('with_contacts')}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60 ${
                        mode === 'with_contacts'
                          ? 'bg-forest text-white border-forest shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-forest/40'
                      }`}
                    >
                      <UserCheck
                        className={`w-4 h-4 shrink-0 ${
                          mode === 'with_contacts' ? 'text-gold' : 'text-forest'
                        }`}
                      />
                      <span>Залишити контакти для зв&apos;язку</span>
                    </button>
                  </div>
                </div>

                {/* Необов'язкові контакти (лише якщо обрано режим із контактами) */}
                {mode === 'with_contacts' && (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <label
                        htmlFor="trustbox-contact"
                        className="block text-xs sm:text-sm font-semibold text-forest"
                      >
                        Ім&apos;я, клас або контакти
                      </label>
                      <span className="text-xs text-slate-500">Необов&apos;язково</span>
                    </div>
                    <input
                      id="trustbox-contact"
                      type="text"
                      disabled={isSubmitting}
                      value={contactDetails}
                      onChange={(e) => setContactDetails(e.target.value)}
                      placeholder="Наприклад: 7-А клас, телефон або email (необов'язково)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:border-forest disabled:bg-slate-50 transition-colors"
                    />
                  </div>
                )}

                {/* Опис ситуації */}
                <div>
                  <label
                    htmlFor="trustbox-situation"
                    className="block text-xs sm:text-sm font-semibold text-forest mb-1.5"
                  >
                    Опис ситуації *
                  </label>
                  <textarea
                    id="trustbox-situation"
                    rows={5}
                    required
                    disabled={isSubmitting}
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="Опишіть ситуацію: що трапилося, де, коли та яка допомога потрібна..."
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 leading-relaxed focus:outline-none focus:border-forest disabled:bg-slate-50 transition-colors"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-light text-white font-heading font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-sm transition-all duration-300 active:scale-95 disabled:active:scale-100 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  ) : (
                    <Send className="w-4 h-4 text-gold" />
                  )}
                  <span>{isSubmitting ? 'Надсилання...' : 'Надіслати повідомлення конфіденційно'}</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-8 px-2 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-7 h-7" />
                </div>
                <h4 className="font-heading font-extrabold text-xl text-forest">
                  Повідомлення надіслано
                </h4>
                <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                  Дякуємо за довіру! Ваше повідомлення успішно надіслано та буде розглянуте
                  конфіденційно.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-forest-50 text-forest border border-forest/20 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    Надіслати ще одне звернення
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
