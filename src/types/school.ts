export type ParentTabId =
  | 'bells'
  | 'diary'
  | 'food'
  | 'safety'
  | 'admissions'
  | 'language'
  | 'sob'
  | 'history';

export interface SobInspectorInfo {
  badge: string;
  fullName: string;
  position: string;
  schedule: string;
  photoUrl?: string;
  description?: string;
}

export type TeamCategory = 'all' | 'admin' | 'primary' | 'stem' | 'humanities';

export type GalleryCategory = 'all' | 'study' | 'safety' | 'events';

export type DocumentCategory = 'all' | 'statute' | 'finance' | 'hr';

export interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  summary: string;
  fullText: string;
  files?: string[];
}

export interface DocumentItem {
  id: number;
  title: string;
  category: Exclude<DocumentCategory, 'all'>;
  categoryLabel: string;
  date: string;
  description: string;
  pdfUrl?: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: Exclude<TeamCategory, 'all'>;
  categoryLabel: string;
  qualification: string;
  credo: string;
  initials: string;
  featured: boolean;
  photoUrl?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: Exclude<GalleryCategory, 'all'>;
  categoryLabel: string;
  image: string;
  description: string;
}

export type BellGroupId = 'all' | 'grade1' | 'grade2_4' | 'grade5_9';

export interface BellScheduleRow {
  lessonNumber: number;
  lesson: string;
  time: string;
  breakDuration: string;
}

export interface BellScheduleGroup {
  id: Exclude<BellGroupId, 'all'>;
  title: string;
  durationLabel: string;
  lessonsCountLabel: string;
  rows: BellScheduleRow[];
}
