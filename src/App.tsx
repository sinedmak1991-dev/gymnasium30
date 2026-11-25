import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
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
import { SearchModal } from './components/SearchModal';
import { StatsBar } from './components/StatsBar';
import { TeamSection } from './components/TeamSection';
import { TopBar } from './components/TopBar';
import { TransparencySection } from './components/TransparencySection';
import { DEFAULT_SOB_INSPECTOR } from './data/schoolData';
import { useAccessibility } from './hooks/useAccessibility';
import { loadSchoolSheetsData } from './services/googleSheets';
import type {
  DocumentItem,
  GalleryItem,
  NewsItem,
  ParentTabId,
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
  const {
    settings: a11ySettings,
    isCustomActive: isA11yActive,
    setFontSize: setA11yFontSize,
    setColorScheme: setA11yColorScheme,
    setImagesMode: setA11yImagesMode,
    resetSettings: resetA11ySettings,
  } = useAccessibility();

  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [parentTabRequest, setParentTabRequest] = useState<{
    tabId: ParentTabId;
    nonce: number;
  } | null>(null);
  const [teamHighlightRequest, setTeamHighlightRequest] = useState<{
    memberId: number;
    nonce: number;
  } | null>(null);

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

  const navigateNews = useCallback(
    (direction: 1 | -1) => {
      if (news.length <= 1) return;
      setSelectedNewsId((prevId) => {
        if (prevId === null) return null;
        const currentIndex = news.findIndex((item) => item.id === prevId);
        if (currentIndex === -1) return null;
        const nextIndex = (currentIndex + direction + news.length) % news.length;
        return news[nextIndex].id;
      });
    },
    [news]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setSearchOpen(false);
        setLightboxIndex(null);
        setContactState((prev) => ({ ...prev, open: false }));
        setSelectedNewsId(null);
        setSelectedDoc(null);
      }
      if (lightboxIndex !== null) {
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
      } else if (selectedNewsId !== null) {
        if (e.key === 'ArrowRight') navigateNews(1);
        if (e.key === 'ArrowLeft') navigateNews(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, navigateLightbox, selectedNewsId, navigateNews]);

  const selectedNews =
    selectedNewsId !== null ? news.find((item) => item.id === selectedNewsId) ?? null : null;

  const currentLightboxItem =
    lightboxIndex !== null ? gallery[lightboxIndex] ?? null : null;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col bg-offwhite text-slate-800 font-sans antialiased">
      <TopBar onOpenContact={openContactModal} />

      <Header
        onOpenSearch={() => setSearchOpen(true)}
        a11ySettings={a11ySettings}
        isA11yActive={isA11yActive}
        onA11yFontSizeChange={setA11yFontSize}
        onA11yColorSchemeChange={setA11yColorScheme}
        onA11yImagesModeChange={setA11yImagesMode}
        onA11yReset={resetA11ySettings}
      />

      <main className="flex-1">
        <HeroSection />

        <StatsBar />

        <ParentsSection
          onOpenContact={openContactModal}
          sobInspector={sobInspector}
          externalTabRequest={parentTabRequest}
        />

        <TeamSection
          members={team}
          isLoading={isSheetsLoading}
          highlightedMemberRequest={teamHighlightRequest}
        />

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

      <NewsModal
        item={selectedNews}
        onClose={() => setSelectedNewsId(null)}
        onPrev={() => navigateNews(-1)}
        onNext={() => navigateNews(1)}
        hasNavigation={news.length > 1}
      />

        <DocModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />

        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          documents={documents}
          news={news}
          team={team}
          sobInspector={sobInspector}
          onSelectDocument={(doc) => setSelectedDoc(doc)}
          onSelectNews={(newsId) => setSelectedNewsId(newsId)}
          onSelectTeamMember={(memberId) =>
            setTeamHighlightRequest({ memberId, nonce: Date.now() })
          }
          onSelectParentTab={(tabId) => setParentTabRequest({ tabId, nonce: Date.now() })}
        />
      </div>
    </MotionConfig>
  );
}
