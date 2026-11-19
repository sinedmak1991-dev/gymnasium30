import { DEFAULT_SOB_INSPECTOR } from '../data/schoolData';
import type {
  DocumentCategory,
  DocumentItem,
  GalleryCategory,
  GalleryItem,
  NewsItem,
  SobInspectorInfo,
  TeamCategory,
  TeamMember,
} from '../types/school';

const SPREADSHEET_ID = '1eImOZ0I6jttq4HDRIfk0ywJ9htZRxb8V4S7pai1mHBE';
const SHEETS_BASE_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

export interface SchoolSheetData {
  news: NewsItem[];
  gallery: GalleryItem[];
  team: TeamMember[];
  documents: DocumentItem[];
  sobInspector: SobInspectorInfo;
}

type SheetRow = Record<string, string>;

let cachedSheetLoadPromise: Promise<SchoolSheetData> | null = null;

function parseCsvMatrix(csvText: string): string[][] {
  const cleanText = csvText.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i += 1) {
    const char = cleanText[i];

    if (inQuotes) {
      if (char === '"') {
        if (cleanText[i + 1] === '"') {
          currentCell += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      currentRow.push(currentCell);
      currentCell = '';
    } else if (char === '\r') {
      if (cleanText[i + 1] === '\n') {
        i += 1;
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else if (char === '\n') {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function parseCsvRows(csvText: string): SheetRow[] {
  const matrix = parseCsvMatrix(csvText);
  if (matrix.length < 2) return [];

  const headers = matrix[0].map((header) => header.trim());
  const result: SheetRow[] = [];

  for (let i = 1; i < matrix.length; i += 1) {
    const cells = matrix[i];
    const hasAnyValue = cells.some((cell) => cell.trim() !== '');
    if (!hasAnyValue) continue;

    const row: SheetRow = {};
    for (let col = 0; col < headers.length; col += 1) {
      const key = headers[col];
      if (!key) continue;
      row[key] = (cells[col] ?? '').trim();
    }
    result.push(row);
  }

  return result;
}

function isTruthyFlag(value?: string): boolean {
  const normalized = (value ?? '').trim().toUpperCase();
  return normalized === 'ТАК' || normalized === 'YES' || normalized === 'TRUE' || normalized === '1';
}

export function extractGoogleDriveFileId(rawUrl: string): string | null {
  const url = rawUrl.trim();
  if (!url) return null;

  const filePathMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (filePathMatch?.[1]) {
    return filePathMatch[1];
  }

  const idParamMatch = url.match(/(?:drive|docs)\.google\.com\/[^\s]*[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idParamMatch?.[1]) {
    return idParamMatch[1];
  }

  return null;
}

export function normalizePhotoUrl(rawUrl?: string): string {
  const url = (rawUrl ?? '').trim();
  if (!url) return '';
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  return url;
}

export function normalizePdfUrl(rawUrl?: string): string {
  const url = (rawUrl ?? '').trim();
  if (!url) return '';
  const fileId = extractGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  return url;
}

function parseFileUrls(rawValue?: string): string[] {
  const trimmed = (rawValue ?? '').trim();
  if (!trimmed) return [];
  return trimmed
    .split(/[\n\r;,]+/)
    .map((entry) => normalizePdfUrl(entry))
    .filter(Boolean);
}

function parseNumericId(rawId: string | undefined, fallback: number): number {
  const parsed = Number.parseInt((rawId ?? '').trim(), 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseDateTimestamp(dateStr: string): number {
  const trimmed = dateStr.trim();
  const dmy = trimmed.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (dmy) {
    return new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])).getTime();
  }
  const ymd = trimmed.match(/^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/);
  if (ymd) {
    return new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3])).getTime();
  }
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function buildInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'Г30';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function normalizeGalleryCategory(raw?: string): Exclude<GalleryCategory, 'all'> {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'safety' || value.includes('безпек')) return 'safety';
  if (value === 'events' || value.includes('под') || value.includes('свят')) return 'events';
  return 'study';
}

function defaultGalleryCategoryLabel(category: Exclude<GalleryCategory, 'all'>): string {
  if (category === 'safety') return 'Безпека та простір';
  if (category === 'events') return 'Події та свята';
  return 'Навчальний процес';
}

function normalizeTeamCategory(raw?: string): Exclude<TeamCategory, 'all'> {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'primary' || value.includes('початков')) return 'primary';
  if (value === 'stem' || value.includes('природ') || value.includes('матем')) return 'stem';
  if (value === 'humanities' || value.includes('гуманіт')) return 'humanities';
  return 'admin';
}

function defaultTeamCategoryLabel(category: Exclude<TeamCategory, 'all'>): string {
  if (category === 'primary') return 'Початкова школа';
  if (category === 'stem') return 'Природничо-математичний цикл';
  if (category === 'humanities') return 'Гуманітарний цикл';
  return 'Адміністрація';
}

function normalizeDocumentCategory(raw?: string): Exclude<DocumentCategory, 'all'> {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'finance' || value.includes('фінанс') || value.includes('кошторис')) return 'finance';
  if (
    value === 'hr' ||
    value.includes('кадр') ||
    value.includes('ваканс') ||
    value.includes('територ') ||
    value.includes('вступ')
  ) {
    return 'hr';
  }
  return 'statute';
}

function defaultDocumentCategoryLabel(category: Exclude<DocumentCategory, 'all'>): string {
  if (category === 'finance') return 'Фінансова звітність';
  if (category === 'hr') return 'Кадрові питання';
  return 'Установчі документи';
}

async function fetchSheetRows(sheetName: string): Promise<SheetRow[]> {
  const url = `${SHEETS_BASE_URL}${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити аркуш "${sheetName}" (${response.status})`);
  }
  const csvText = await response.text();
  return parseCsvRows(csvText);
}

function mapNewsRows(rows: SheetRow[]): NewsItem[] {
  return rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => isTruthyFlag(row['Опубліковано']) && Boolean(row['Заголовок']))
    .map(({ row, index }) => {
      const id = parseNumericId(row['ID'], index + 1);
      const summary = row['Короткий_опис'] || '';
      const fullText = row['Повний_текст'] || summary;
      const files = parseFileUrls(row['Посилання_на_файл'] || row['fileUrl']);
      return {
        item: {
          id,
          date: row['Дата'] || '',
          category: row['Рубрика'] || 'Новини закладу',
          title: row['Заголовок'] || '',
          summary,
          fullText,
          image: normalizePhotoUrl(row['Фото_URL']),
          files,
        } satisfies NewsItem,
        timestamp: parseDateTimestamp(row['Дата'] || ''),
        rowIndex: index,
      };
    })
    .sort((a, b) => {
      if (b.timestamp !== a.timestamp) return b.timestamp - a.timestamp;
      if (b.item.id !== a.item.id) return b.item.id - a.item.id;
      return b.rowIndex - a.rowIndex;
    })
    .map(({ item }) => item);
}

function mapGalleryRows(rows: SheetRow[]): GalleryItem[] {
  return rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => isTruthyFlag(row['Опубліковано']))
    .map(({ row, index }) => {
      const image = normalizePhotoUrl(row['Фото_URL']);
      const category = normalizeGalleryCategory(row['Категорія']);
      return {
        item: {
          id: parseNumericId(row['ID'], index + 1),
          category,
          categoryLabel: row['Назва_категорії'] || defaultGalleryCategoryLabel(category),
          title: row['Заголовок'] || 'Життя гімназії',
          description: row['Опис'] || '',
          image,
        } satisfies GalleryItem,
        timestamp: parseDateTimestamp(row['Дата'] || ''),
        rowIndex: index,
      };
    })
    .filter(({ item }) => item.image !== '')
    .sort((a, b) => {
      if (b.timestamp !== a.timestamp) return b.timestamp - a.timestamp;
      if (b.item.id !== a.item.id) return b.item.id - a.item.id;
      return b.rowIndex - a.rowIndex;
    })
    .map(({ item }) => item);
}

function mapTeamRows(rows: SheetRow[]): TeamMember[] {
  return rows
    .filter((row) => isTruthyFlag(row['Опубліковано']) && Boolean(row['ПІБ']))
    .map((row, index) => {
      const name = row['ПІБ'] || '';
      const category = normalizeTeamCategory(row['Категорія']);
      return {
        id: parseNumericId(row['ID'], index + 1),
        name,
        role: row['Посада'] || '',
        category,
        categoryLabel: row['Назва_категорії'] || defaultTeamCategoryLabel(category),
        qualification: row['Кваліфікація'] || '',
        credo: row['Кредо'] || '',
        initials: buildInitials(name),
        featured: isTruthyFlag(row['Виділена_картка']),
        photoUrl: normalizePhotoUrl(row['Фото_URL']),
      } satisfies TeamMember;
    });
}

function mapDocumentRows(rows: SheetRow[]): DocumentItem[] {
  return rows
    .filter((row) => isTruthyFlag(row['Опубліковано']) && Boolean(row['Назва_документа']))
    .map((row, index) => {
      const category = normalizeDocumentCategory(row['Категорія']);
      return {
        id: parseNumericId(row['ID'], index + 1),
        title: row['Назва_документа'] || '',
        category,
        categoryLabel: row['Назва_категорії'] || defaultDocumentCategoryLabel(category),
        date: row['Дата_або_статус'] || 'Офіційний документ',
        description: row['Опис'] || '',
        pdfUrl: normalizePdfUrl(row['Посилання_PDF']),
      } satisfies DocumentItem;
    });
}

function mapSobInspectorRows(rows: SheetRow[]): SobInspectorInfo {
  const firstRow = rows[0];
  if (!firstRow) return DEFAULT_SOB_INSPECTOR;

  const sheetPosition = (firstRow['Посада'] || '').trim();
  const isLegacyPosition =
    /сектору\s+Служби\s+освітньої\s+безпеки/i.test(sheetPosition) ||
    /РУП\s+ГУНП/i.test(sheetPosition);

  return {
    badge: DEFAULT_SOB_INSPECTOR.badge,
    fullName: firstRow['ПІБ'] || DEFAULT_SOB_INSPECTOR.fullName,
    position: !sheetPosition || isLegacyPosition ? DEFAULT_SOB_INSPECTOR.position : sheetPosition,
    schedule: firstRow['Графік'] || DEFAULT_SOB_INSPECTOR.schedule,
    photoUrl: normalizePhotoUrl(firstRow['Фото_URL']),
    description: firstRow['Привітання_або_опис'] || DEFAULT_SOB_INSPECTOR.description,
  };
}

export function loadSchoolSheetsData(): Promise<SchoolSheetData> {
  if (cachedSheetLoadPromise) {
    return cachedSheetLoadPromise;
  }

  cachedSheetLoadPromise = Promise.all([
    fetchSheetRows('Новини'),
    fetchSheetRows('Фотогалерея'),
    fetchSheetRows('Педагоги'),
    fetchSheetRows('Документи'),
    fetchSheetRows('Інспектор_СОБ'),
  ])
    .then(([newsRows, galleryRows, teamRows, documentRows, sobRows]) => ({
      news: mapNewsRows(newsRows),
      gallery: mapGalleryRows(galleryRows),
      team: mapTeamRows(teamRows),
      documents: mapDocumentRows(documentRows),
      sobInspector: mapSobInspectorRows(sobRows),
    }))
    .catch((error) => {
      cachedSheetLoadPromise = null;
      throw error;
    });

  return cachedSheetLoadPromise;
}
