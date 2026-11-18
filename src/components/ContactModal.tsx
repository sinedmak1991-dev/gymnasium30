import React, { useEffect, useState } from 'react';
import { Check, Loader2, Mail, X } from 'lucide-react';

const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxMw1G-fREEe4VNRMYA7G0WjJ0GI4T4biY8EOv3envjoC6Ql7FcuRGQJzYs3Kp2BuOcFw/exec';

interface ContactModalProps {
  isOpen: boolean;
  initialSubject: string;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  initialSubject,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubject(initialSubject);
      setSubmitted(false);
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [isOpen, initialSubject]);

  useEffect(() => {
    if (!isOpen || !submitted) return;
    const timer = window.setTimeout(() => {
      onClose();
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [isOpen, submitted, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    const trimmedTopic = subject.trim() || 'Загальне питання';
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedContact || !trimmedMessage) {
      setErrorMessage("Будь ласка, заповніть усі обов'язкові поля форми.");
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const payloadBody = JSON.stringify({
      name: trimmedName,
      contact: trimmedContact,
      topic: trimmedTopic,
      message: trimmedMessage,
    });

    console.log('Надсилання запиту зворотного зв’язку:', payloadBody);

    try {
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: payloadBody,
      });

      setName('');
      setContact('');
      setMessage('');
      setSubmitted(true);
    } catch {
      setErrorMessage('Не вдалося надіслати звернення. Спробуйте, будь ласка, ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 cursor-pointer"
          aria-label="Закрити"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-[#163A2E]/10 text-[#163A2E] border border-[#163A2E]/15 flex items-center justify-center mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h3 id="contact-modal-title" className="font-heading font-bold text-xl text-forest">
          Зворотний зв&apos;язок
        </h3>
        <p className="text-sm text-slate-600 mt-1 mb-5">
          Маєте запитання щодо навчання, вступу чи організації безпеки? Напишіть нам — адміністрація
          надасть відповідь.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ваше ім&apos;я та прізвище *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Олена Ковальчук"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-forest disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Телефон або Email для відповіді *
              </label>
              <input
                type="text"
                required
                disabled={isSubmitting}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+38 (0__) ___-__-__"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-forest disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Тема звернення
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-forest disabled:bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Повідомлення *
              </label>
              <textarea
                rows={3}
                required
                disabled={isSubmitting}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишіть ваше запитання або пропозицію..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-forest disabled:bg-slate-50"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-light text-white font-heading font-bold py-3 rounded-xl transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSubmitting ? 'Надсилання...' : 'Надіслати повідомлення'}</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-lg text-forest">Звернення прийнято!</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Дякуємо! Ваше звернення успішно надіслано адміністрації гімназії.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 bg-offwhite hover:bg-slate-200 text-forest font-semibold text-sm px-5 py-2 rounded-xl transition cursor-pointer"
            >
              Закрити
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
