import React, { useState, useEffect } from 'react';
import { NavTab, Sermon, ActivityEvent, PrayerRequest, EventRegistration, CommunityPost, SystemSettings, UserSession, ChurchLeader, Devotional } from './types';
import { DataService, AuthService } from './lib/supabase';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { SermonPlayerModal } from './components/SermonPlayerModal';
import { EventRegistrationModal } from './components/EventRegistrationModal';
import { ToastContainer, ToastMessage } from './components/Toast';

import { HomeView } from './views/HomeView';
import { SermonsView } from './views/SermonsView';
import { ActivitiesView } from './views/ActivitiesView';
import { HelpView } from './views/HelpView';
import { InteractionsView } from './views/InteractionsView';
import { LeadersView } from './views/LeadersView';
import { LocationView } from './views/LocationView';
import { DevotionalsView } from './views/DevotionalsView';
import { AdminView } from './views/AdminView';

import { Heart, Play, X, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [session, setSession] = useState<UserSession>({ user: null, isAdmin: false });
  
  // Data state
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [leaders, setLeaders] = useState<ChurchLeader[]>([]);
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    primaryColor: '#5D4037',
    churchName: 'Grace & Truth',
    churchAddress: '123 Sanctuary Way, Cathedral City, CA 92234',
    churchPhone: '+1 (555) 123-4567',
    churchEmail: 'contacto@gracetruth.org'
  });

  // Favorites state
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('gt_favorites_v1');
      return stored ? JSON.parse(stored) : ['sermon-1'];
    } catch {
      return ['sermon-1'];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedSermonForPlayer, setSelectedSermonForPlayer] = useState<Sermon | null>(null);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState<ActivityEvent | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial Data Load
  useEffect(() => {
    async function loadAllData() {
      try {
        const [
          fetchedSermons,
          fetchedEvents,
          fetchedPrayers,
          fetchedRegs,
          fetchedPosts,
          fetchedLeaders,
          fetchedDevotionals,
          fetchedSettings,
          userSession
        ] = await Promise.all([
          DataService.getSermons(),
          DataService.getEvents(),
          DataService.getPrayerRequests(),
          DataService.getRegistrations(),
          DataService.getPosts(),
          DataService.getLeaders(),
          DataService.getDevotionals(),
          DataService.getSettings(),
          AuthService.getCurrentUserSession()
        ]);

        setSermons(fetchedSermons);
        setEvents(fetchedEvents);
        setPrayerRequests(fetchedPrayers);
        setRegistrations(fetchedRegs);
        setPosts(fetchedPosts);
        setLeaders(fetchedLeaders);
        setDevotionals(fetchedDevotionals);
        setSettings(fetchedSettings);
        setSession(userSession);
      } catch (err) {
        console.error('Error loading initial app data:', err);
      }
    }

    loadAllData();
  }, []);

  // Save favorites to localStorage and update DB
  const toggleFavorite = async (sermon: Sermon) => {
    let isAdding = false;
    
    setFavoriteIds((prev) => {
      const isFav = prev.includes(sermon.id);
      isAdding = !isFav;
      const updated = isFav ? prev.filter((id) => id !== sermon.id) : [...prev, sermon.id];
      try {
        localStorage.setItem('gt_favorites_v1', JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving favorites', e);
      }

      if (isAdding) {
        addToast('Sermón guardado', `"${sermon.title}" se agregó a tus sermones guardados.`, 'info');
      } else {
        addToast('Sermón eliminado de guardados', `"${sermon.title}" fue removido.`, 'info');
      }

      return updated;
    });

    // Update local state optimistic UI for likes count
    setSermons((prev) => prev.map(s => {
      if (s.id === sermon.id) {
        const currentLikes = s.likesCount || 0;
        return {
          ...s,
          likesCount: isAdding ? currentLikes + 1 : Math.max(0, currentLikes - 1)
        };
      }
      return s;
    }));

    // If using Supabase, hit the API
    if (sermon.id.startsWith('sermon-') === false) {
      await DataService.toggleSermonLike(sermon.id, isAdding);
    }
  };

  const handleShare = (title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.href} - ${title}`);
      addToast('Enlace copiado', 'El enlace del sermón se ha copiado al portapapeles.', 'success');
    } else {
      addToast('Compartir sermón', `Compartiendo: ${title}`, 'info');
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setSession({ user: null, isAdmin: false });
    addToast('Sesión cerrada', 'Has salido del área de administración.', 'info');
    if (currentTab === 'admin') {
      setCurrentTab('home');
    }
  };

  const featuredSermon = sermons.find((s) => s.isFeatured) || sermons[0] || null;

  const savedSermonsList = sermons.filter((s) => favoriteIds.includes(s.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f6] text-[#1e1b1a]">
      {/* Header Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        session={session}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        favoriteCount={savedSermonsList.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        settings={settings}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HomeView
            onSelectTab={setCurrentTab}
            onOpenSermonModal={(sermon) => setSelectedSermonForPlayer(sermon)}
            featuredSermon={featuredSermon}
            settings={settings}
            leaders={leaders}
          />
        )}

        {currentTab === 'sermons' && (
          <SermonsView
            sermons={sermons}
            onOpenSermonModal={(sermon) => setSelectedSermonForPlayer(sermon)}
            favorites={favoriteIds}
            onToggleFavorite={toggleFavorite}
            onShare={handleShare}
          />
        )}

        {currentTab === 'activities' && (
          <ActivitiesView
            events={events}
            onOpenRegisterModal={(event) => setSelectedEventForRegistration(event)}
          />
        )}

        {currentTab === 'devotionals' && (
          <DevotionalsView devotionals={devotionals} />
        )}

        {currentTab === 'leaders' && (
          <LeadersView
            leaders={leaders}
          />
        )}

        {currentTab === 'location' && (
          <LocationView
            settings={settings}
          />
        )}

        {currentTab === 'help' && (
          <HelpView
            onSuccessToast={(msg) => addToast('Petición recibida', msg, 'success')}
          />
        )}

        {currentTab === 'interactions' && (
          <InteractionsView
            posts={posts}
            onPostsUpdated={setPosts}
            onSuccessToast={(msg) => addToast('Publicación realizada', msg, 'success')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            session={session}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            prayerRequests={prayerRequests}
            onPrayerRequestsUpdated={setPrayerRequests}
            sermons={sermons}
            onSermonsUpdated={setSermons}
            events={events}
            onEventsUpdated={setEvents}
            registrations={registrations}
            leaders={leaders}
            onLeadersUpdated={setLeaders}
            devotionals={devotionals}
            onDevotionalsUpdated={setDevotionals}
            settings={settings}
            onSettingsUpdated={setSettings}
            onSuccessToast={(msg) => addToast('Éxito', msg, 'success')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setCurrentTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        settings={settings}
      />

      {/* Modals & Popups */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newSession) => {
          setSession(newSession);
          addToast('Bienvenido', 'Has iniciado sesión como Administrador de Grace & Truth.', 'success');
          setCurrentTab('admin');
        }}
      />

      <SermonPlayerModal
        sermon={selectedSermonForPlayer}
        onClose={() => setSelectedSermonForPlayer(null)}
        isFavorite={selectedSermonForPlayer ? favoriteIds.includes(selectedSermonForPlayer.id) : false}
        onToggleFavorite={toggleFavorite}
        onShare={handleShare}
      />

      <EventRegistrationModal
        event={selectedEventForRegistration}
        onClose={() => setSelectedEventForRegistration(null)}
        onSuccess={(msg) => addToast('Inscripción Confirmada', msg, 'success')}
      />

      {/* Favorites Drawer Modal */}
      <AnimatePresence>
        {isFavoritesOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#fff8f6] h-full shadow-2xl border-l border-[#e9e1df] p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#e9e1df] mb-6">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-[#D4AF37] fill-current" />
                    <h3 className="font-serif text-2xl font-bold text-[#442a22]">
                      Sermones Guardados
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsFavoritesOpen(false)}
                    className="p-2 rounded-full hover:bg-[#efe6e4] text-[#504441]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {savedSermonsList.length === 0 ? (
                  <div className="text-center py-12 text-[#75584d] space-y-2">
                    <BookOpen className="w-8 h-8 mx-auto opacity-50" />
                    <p className="text-sm font-semibold">No tienes sermones guardados todavía.</p>
                    <p className="text-xs">
                      Haz clic en el ícono del corazón en cualquier sermón para guardarlo aquí.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedSermonsList.map((sermon) => (
                      <div
                        key={sermon.id}
                        className="p-3.5 rounded-2xl bg-[#faf2f0] border border-[#e9e1df] flex items-center justify-between gap-3 hover:border-[#442a22]/30 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={sermon.imageUrl}
                            alt={sermon.title}
                            className="w-14 h-12 object-cover rounded-xl bg-[#442a22]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-[#1e1b1a] truncate">{sermon.title}</p>
                            <p className="text-[10px] text-[#75584d]">{sermon.series} • {sermon.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setSelectedSermonForPlayer(sermon);
                              setIsFavoritesOpen(false);
                            }}
                            className="p-2 rounded-full bg-[#442a22] text-[#fff8f6] hover:bg-[#5d4037]"
                            title="Escuchar"
                          >
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </button>
                          <button
                            onClick={() => toggleFavorite(sermon)}
                            className="p-2 rounded-full hover:bg-[#efe6e4] text-rose-700"
                            title="Remover"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[#e9e1df]">
                <button
                  onClick={() => {
                    setCurrentTab('sermons');
                    setIsFavoritesOpen(false);
                  }}
                  className="w-full py-3 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-semibold hover:bg-[#5d4037] flex items-center justify-center gap-2"
                >
                  <span>Explorar Todo el Archivo</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Feedback Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export default App;
