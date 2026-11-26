export interface AssignedAddress {
  id: number;
  street: string;
  oldName?: string;
  note: string;
}

export const ASSIGNED_ADDRESSES: AssignedAddress[] = [
  {
    id: 1,
    street: 'вул. Заводська',
    note: 'Всі будинки',
  },
  {
    id: 2,
    street: 'прв. Заводський',
    note: 'Всі будинки',
  },
  {
    id: 3,
    street: 'вул. Калнишевського',
    note: 'Всі будинки',
  },
  {
    id: 4,
    street: 'прв. Петра Калнишевського',
    oldName: 'прв. Головіна',
    note: 'Всі будинки',
  },
  {
    id: 5,
    street: 'вул. Ніни Янчук',
    oldName: 'вул. Горького',
    note: 'Всі будинки — від вул. Проскурівської до вул. Трембовецької',
  },
  {
    id: 6,
    street: 'вул. Ігоря Сікорського',
    oldName: 'вул. Жуковського',
    note: 'Всі будинки',
  },
  {
    id: 7,
    street: 'прв. Ігоря Сікорського',
    oldName: 'прв. Жуковського',
    note: 'Всі будинки',
  },
  {
    id: 8,
    street: 'вул. Лугова',
    note: 'Всі будинки',
  },
  {
    id: 9,
    street: 'вул. 2-а Лугова',
    note: 'Всі будинки',
  },
  {
    id: 10,
    street: 'вул. 3-я Лугова',
    note: 'Всі будинки',
  },
  {
    id: 11,
    street: 'прв. Луговий',
    note: 'Всі будинки',
  },
  {
    id: 12,
    street: 'вул. Уласа Самчука',
    oldName: 'вул. Мересьєва',
    note: 'Всі будинки',
  },
  {
    id: 13,
    street: 'вул. Кобзарів',
    oldName: 'вул. Невського',
    note: 'Всі будинки',
  },
  {
    id: 14,
    street: 'вул. Героїв-прикордонників',
    oldName: 'вул. Некрасова',
    note: 'Всі будинки',
  },
  {
    id: 15,
    street: 'прв. Героїв-прикордонників',
    oldName: 'прв. Некрасова',
    note: 'Всі будинки',
  },
  {
    id: 16,
    street: 'прв. Марини Кіреєвої',
    oldName: 'прв. Осипенко',
    note: 'Всі будинки',
  },
  {
    id: 17,
    street: 'прв. Парковий',
    note: 'Всі будинки — район «за цукрозаводом»',
  },
  {
    id: 18,
    street: 'прв. Олександра Олеся',
    oldName: 'прв. Пугачова',
    note: 'Всі будинки',
  },
  {
    id: 19,
    street: 'прв. Малиновий',
    note: 'Всі будинки — район «за цукрозаводом»',
  },
  {
    id: 20,
    street: 'вул. Катерини Рубчакової',
    note: 'Всі будинки',
  },
  {
    id: 21,
    street: 'прв. Катерини Рубчакової',
    note: 'Всі будинки',
  },
  {
    id: 22,
    street: 'прв. Генріха Фігурського',
    oldName: 'прв. Чкалова',
    note: 'Всі будинки',
  },
  {
    id: 23,
    street: 'вул. Яворницького',
    note: 'Всі будинки',
  },
  {
    id: 24,
    street: 'прв. Яворницького',
    note: 'Всі будинки',
  },
  {
    id: 25,
    street: 'прв. Прибузький',
    note: 'Всі будинки',
  },
  {
    id: 26,
    street: 'вул. Героя України Сергія Кириленка',
    oldName: 'вул. М. Трембовецької',
    note: 'Всі будинки',
  },
  {
    id: 27,
    street: 'вул. Проскурівська',
    note: 'Від Старокостянтинівського шосе до пл. Привокзальної — всі будинки',
  },
  {
    id: 28,
    street: 'вул. Прибузька',
    note: 'Від Старокостянтинівського шосе до прв. Прибузького, будинки № 30–56',
  },
  {
    id: 29,
    street: 'вул. Старокостянтинівське шосе',
    note: 'Від р. Південний Буг до вул. Проскурівської — непарні номери від вул. Прибузької до вул. Проскурівської',
  },
  {
    id: 30,
    street: 'вул. Шевченка',
    note: 'Від Старокостянтинівського шосе до вул. Героя України Дмитра Крамара — всі будинки, № 58–103',
  },
  {
    id: 31,
    street: 'вул. Героя України Дмитра Крамара',
    oldName: 'вул. Трудова',
    note: 'Від Вінницького шосе до р. Південний Буг ліва сторона — всі непарні будинки; від р. Південний Буг до залізничного мосту — всі будинки',
  },
];

const IGNORED_STREET_TOKENS = new Set([
  'вул',
  'вулиця',
  'прв',
  'пров',
  'провулок',
  'шосе',
]);

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’'`]/g, "'")
    .replace(/[.,–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractMeaningfulQuery(rawQuery: string): string {
  const normalized = normalizeText(rawQuery);
  if (!normalized) return '';

  const tokens = normalized.split(' ').filter(Boolean);
  const meaningfulTokens = tokens.filter((token) => !IGNORED_STREET_TOKENS.has(token));

  // Якщо користувач ввів лише слово «шосе», шукаємо його напряму (для «Старокостянтинівське шосе»)
  if (meaningfulTokens.length === 0 && tokens.includes('шосе')) {
    return 'шосе';
  }

  return meaningfulTokens.join(' ');
}

export function searchAssignedAddresses(rawQuery: string): {
  meaningfulQuery: string;
  matches: AssignedAddress[];
} {
  const meaningfulQuery = extractMeaningfulQuery(rawQuery);
  if (!meaningfulQuery) {
    return { meaningfulQuery: '', matches: [] };
  }

  const queryTokens = meaningfulQuery.split(' ').filter(Boolean);

  const matches = ASSIGNED_ADDRESSES.filter((item) => {
    const streetNorm = normalizeText(item.street);
    const oldNorm = item.oldName ? normalizeText(item.oldName) : '';
    const searchable = `${streetNorm} ${oldNorm}`.trim();

    return queryTokens.every((token) => searchable.includes(token));
  });

  return { meaningfulQuery, matches };
}
