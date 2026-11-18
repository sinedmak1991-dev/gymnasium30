import type { BellScheduleGroup, SobInspectorInfo } from '../types/school';

export const DEFAULT_SOB_INSPECTOR: SobInspectorInfo = {
  badge: 'Інспектор Служби освітньої безпеки',
  fullName: 'Чижовка Віталій Володимирович',
  position:
    'Інспектор сектору Служби освітньої безпеки Хмельницького РУП ГУНП в Хмельницькій області',
  schedule: 'Пн–Пт, під час освітнього процесу',
  photoUrl: '',
  description:
    'Інспектор СОБ постійно перебуває у закладі освіти, дбає про безпеку учнів і працівників та допомагає створювати комфортну атмосферу без булінгу та правопорушень.',
};

export const SCHOOL_INFO = {
  shortName: 'ГІМНАЗІЯ № 30',
  cityLabel: 'ХМЕЛЬНИЦЬКИЙ',
  fullName: 'КЗЗСО «Гімназія № 30 Хмельницької міської ради»',
  topAddress: 'м. Хмельницький, вул. Заводська, 33',
  topPhone: '(0382) 65-62-02',
  topPhoneHref: 'tel:+380382656202',
  topEmail: 'khmgym30@ukr.net',
  topEmailHref: 'mailto:khmgym30@ukr.net',
  footerAddress: '29000, Хмельницька область, м. Хмельницький, вул. Заводська, 33',
  footerPhone: '(0382) 65-62-02 (приймальня)',
  footerPhoneHref: 'tel:+380382656202',
  footerEmail: 'khmgym30@ukr.net',
  footerEmailHref: 'mailto:khmgym30@ukr.net',
  workHours: 'Пн–Пт: 08:00 – 17:00',
  academicYear: '2026 / 2027 н.р.',
  diaryUrl: 'https://mriia.gov.ua/',
  facebookUrl: 'https://www.facebook.com/share/g/1Et9Pzwoax/?mibextid=wwXIfr',
};

export const BELL_SCHEDULE_GROUPS: BellScheduleGroup[] = [
  {
    id: 'grade1',
    title: '1-ші класи',
    durationLabel: '35 хв',
    lessonsCountLabel: '5 уроків',
    rows: [
      { lessonNumber: 1, lesson: '1 урок', time: '08:30 – 09:05', breakDuration: '20 хв' },
      { lessonNumber: 2, lesson: '2 урок', time: '09:25 – 10:00', breakDuration: '30 хв' },
      { lessonNumber: 3, lesson: '3 урок', time: '10:30 – 11:05', breakDuration: '30 хв' },
      { lessonNumber: 4, lesson: '4 урок', time: '11:35 – 12:10', breakDuration: '30 хв' },
      { lessonNumber: 5, lesson: '5 урок', time: '12:40 – 13:15', breakDuration: '—' },
    ],
  },
  {
    id: 'grade2_4',
    title: '2–4-ті класи',
    durationLabel: '40 хв',
    lessonsCountLabel: '6 уроків',
    rows: [
      { lessonNumber: 1, lesson: '1 урок', time: '08:30 – 09:10', breakDuration: '15 хв' },
      { lessonNumber: 2, lesson: '2 урок', time: '09:25 – 10:05', breakDuration: '25 хв' },
      { lessonNumber: 3, lesson: '3 урок', time: '10:30 – 11:10', breakDuration: '25 хв' },
      { lessonNumber: 4, lesson: '4 урок', time: '11:35 – 12:15', breakDuration: '25 хв' },
      { lessonNumber: 5, lesson: '5 урок', time: '12:40 – 13:20', breakDuration: '15 хв' },
      { lessonNumber: 6, lesson: '6 урок', time: '13:35 – 14:15', breakDuration: '—' },
    ],
  },
  {
    id: 'grade5_9',
    title: '5–9-ті класи',
    durationLabel: '45 хв',
    lessonsCountLabel: '8 уроків',
    rows: [
      { lessonNumber: 1, lesson: '1 урок', time: '08:30 – 09:15', breakDuration: '10 хв' },
      { lessonNumber: 2, lesson: '2 урок', time: '09:25 – 10:10', breakDuration: '20 хв' },
      { lessonNumber: 3, lesson: '3 урок', time: '10:30 – 11:15', breakDuration: '20 хв' },
      { lessonNumber: 4, lesson: '4 урок', time: '11:35 – 12:20', breakDuration: '20 хв' },
      { lessonNumber: 5, lesson: '5 урок', time: '12:40 – 13:25', breakDuration: '10 хв' },
      { lessonNumber: 6, lesson: '6 урок', time: '13:35 – 14:20', breakDuration: '10 хв' },
      { lessonNumber: 7, lesson: '7 урок', time: '14:30 – 15:15', breakDuration: '10 хв' },
      { lessonNumber: 8, lesson: '8 урок', time: '15:25 – 16:10', breakDuration: '—' },
    ],
  },
];
