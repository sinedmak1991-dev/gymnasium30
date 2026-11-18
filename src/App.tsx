import { useCallback, useEffect, useState } from 'react';
import { ContactModal } from './components/ContactModal';
import { DocModal } from './components/DocModal';
import { Footer } from './components/Footer';
import { GallerySection } from './components/GallerySection';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LightboxModal } from './components/LightboxModal';
import { NewsModal } from './components/NewsModal';
import { NewsSection } from './components/NewsSection';
import { ParentsSection } from './components/ParentsSection';
import { StatsBar } from './components/StatsBar';
import { TeamSection } from './components/TeamSection';
import { TopBar } from './components/TopBar';
import { TransparencySection } from './components/TransparencySection';
import { DEFAULT_SOB_INSPECTOR } from './data/schoolData';
import { loadSchoolSheetsData } from './services/googleSheets';
import type {
  DocumentItem,
  GalleryItem,
  NewsItem,
  SobInspectorInfo,
  TeamMember,
} from './types/school';

export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [sobInspector, setSobInspector] = useState<SobInspectorInfo>(DEFAULT_SOB_INSPECTOR);
  const [isSheetsLoading, setIsSheetsLoading] = useState(true);

  const [contactState, setContactState] = useState<{ open: boolean; subject: string }>({
    open: false,
    subject: 'Загальне питання',
  });
  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadSchoolSheetsData()
      .then((data) => {
        if (!isMounted) return;
        setNews(data.news);
        setGallery(data.gallery);
        setTeam(data.team);
        setDocuments(data.documents);
        setSobInspector(data.sobInspector);
      })
      .catch((error) => {
        console.error('Помилка завантаження даних із Google Таблиці:', error);
      })
      .finally(() => {
        if (isMounted) {
          setIsSheetsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openContactModal = useCallback((subject = 'Загальне питання') => {
    setContactState({ open: true, subject });
  }, []);

  const closeContactModal = useCallback(() => {
    setContactState((prev) => ({ ...prev, open: false }));
  }, []);

  const openLightbox = useCallback(
    (id: number) => {
      const idx = gallery.findIndex((item) => item.id === id);
      if (idx !== -1) {
        setLightboxIndex(idx);
      }
    },
    [gallery]
  );

  const navigateLightbox = useCallback(
    (direction: 1 | -1) => {
      if (gallery.length === 0) return;
      setLightboxIndex((prev) => {
        if (prev === null) return null;
        return (prev + direction + gallery.length) % gallery.length;
      });
    },
    [gallery.length]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
        setContactState((prev) => ({ ...prev, open: false }));
        setSelectedNewsId(null);
        setSelectedDoc(null);
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, navigateLightbox]);

  const selectedNews =
    selectedNewsId !== null ? news.find((item) => item.id === selectedNewsId) ?? null : null;

  const currentLightboxItem =
    lightboxIndex !== null ? gallery[lightboxIndex] ?? null : null;

  return (
    <div className="min-h-screen flex flex-col bg-offwhite text-slate-800 font-sans antialiased">
      <TopBar onOpenContact={openContactModal} />

      <Header />

      <main className="flex-1">
        <HeroSection />

        <StatsBar />

        <ParentsSection onOpenContact={openContactModal} sobInspector={sobInspector} />

        <TeamSection members={team} isLoading={isSheetsLoading} />

        <GallerySection
          items={gallery}
          isLoading={isSheetsLoading}
          onOpenLightbox={openLightbox}
        />

        <NewsSection
          news={news}
          isLoading={isSheetsLoading}
          onOpenNews={(id) => setSelectedNewsId(id)}
        />

        <TransparencySection
          documents={documents}
          isLoading={isSheetsLoading}
          onOpenDoc={(doc) => setSelectedDoc(doc)}
        />
      </main>

      <Footer onOpenContact={openContactModal} />

      <LightboxModal
        item={currentLightboxItem}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => navigateLightbox(-1)}
        onNext={() => navigateLightbox(1)}
      />

      <ContactModal
        isOpen={contactState.open}
        initialSubject={contactState.subject}
        onClose={closeContactModal}
      />

      <NewsModal item={selectedNews} onClose={() => setSelectedNewsId(null)} />

      <DocModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </div>
  );
}
