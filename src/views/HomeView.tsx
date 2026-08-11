import React, { useState, useEffect } from 'react';
import { NavTab, Sermon, SystemSettings, ChurchLeader } from '../types';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Heart, 
  Users, 
  MessageSquare,
  Church,
  MapPin,
  Clock,
  Youtube,
  Radio,
  ExternalLink,
  VolumeX,
  Volume2,
  Tv,
  Facebook,
  Instagram,
  Twitter,
  Share2,
  Navigation,
  Phone,
  ChevronLeft,
  ChevronRight,
  Quote
} from 'lucide-react';
import { extractYouTubeVideoId } from '../lib/youtube';

interface HomeViewProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenSermonModal: (sermon: Sermon) => void;
  featuredSermon: Sermon | null;
  settings?: SystemSettings;
  leaders?: ChurchLeader[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  onOpenSermonModal,
  featuredSermon,
  settings,
  leaders = []
}) => {
  // YouTube / Live Stream settings helpers
  const isYouTubeConfigured = Boolean(
    settings?.youtubeUrl || settings?.liveStreamVideoId || settings?.youtubeChannelCoverUrl
  );
  const isLive = Boolean(settings?.isLiveStreaming);
  const rawVideoId = settings?.liveStreamVideoId || 'jfKfPfyJRdk';
  const videoId = extractYouTubeVideoId(rawVideoId);
  const liveTitle = settings?.liveStreamTitle || 'Transmisión en Vivo — Servicio de Adoración Dominical';
  
  // Use video thumbnail if available, otherwise channel cover, otherwise fallback
  const videoThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  const channelCover = videoThumbnail || settings?.youtubeChannelCoverUrl || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1200&auto=format&fit=crop&q=80';
  const youtubeChannelUrl = settings?.youtubeUrl || 'https://www.youtube.com';

  const hasSocials = Boolean(
    settings?.facebookUrl || settings?.instagramUrl || settings?.whatsappUrl || settings?.twitterUrl || settings?.tiktokUrl
  );

  // Dynamic Bible Verses List
  const defaultVerses = [
    'Salmos 119:105 — Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
    'Juan 8:12 — Yo soy la luz del mundo; el que me sigue, no andará en tinieblas.',
    'Filipenses 4:13 — Todo lo puedo en Cristo que me fortalece.'
  ];

  const versesList = (settings?.heroVerses && settings.heroVerses.filter(v => v.trim().length > 0).length > 0)
    ? settings.heroVerses.filter(v => v.trim().length > 0)
    : (settings?.heroVerse ? [settings.heroVerse, ...defaultVerses.slice(1)] : defaultVerses);

  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (versesList.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setActiveVerseIndex((prev) => (prev + 1) % versesList.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [versesList.length, isPaused]);

  const handleNextVerse = () => {
    setActiveVerseIndex((prev) => (prev + 1) % versesList.length);
  };

  const handlePrevVerse = () => {
    setActiveVerseIndex((prev) => (prev - 1 + versesList.length) % versesList.length);
  };

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#2c1a14] text-[#fff8f6] shadow-xl border border-[#5d4037]">
        {/* Background Bible image overlay with enhanced visibility */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
          style={{
            backgroundImage: `url('${settings?.heroBackgroundImageUrl || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&auto=format&fit=crop&q=80'}')`,
            opacity: (settings?.heroBgOpacity ?? 45) / 100
          }} 
        />
        {/* Dark subtle gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#2c1a14]/90 via-[#3a221a]/80 to-[#2c1a14]/60 pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-14 lg:p-20 max-w-4xl space-y-6">
          {/* Dynamic Bible Verse Container (Full Verse Display) */}
          {(() => {
            const currentVerse = versesList[activeVerseIndex] || '';
            let refPart = '';
            let textPart = currentVerse;

            if (currentVerse.includes(' — ')) {
              const parts = currentVerse.split(' — ');
              refPart = parts[0];
              textPart = parts.slice(1).join(' — ');
            } else if (currentVerse.includes(' - ')) {
              const parts = currentVerse.split(' - ');
              refPart = parts[0];
              textPart = parts.slice(1).join(' - ');
            }

            return (
              <div 
                className="inline-flex flex-col sm:flex-row sm:items-center justify-between gap-3 max-w-3xl w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#5d4037]/85 border border-[#D4AF37]/50 text-xs sm:text-sm text-[#fff8f6] backdrop-blur-md shadow-lg transition-all"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-medium">
                    {refPart && (
                      <span className="font-bold text-[#D4AF37] tracking-wider uppercase text-xs mr-2 inline-block">
                        {refPart}:
                      </span>
                    )}
                    <span className="text-[#fff8f6] italic">
                      {refPart ? `"${textPart}"` : textPart}
                    </span>
                  </div>
                </div>

                {versesList.length > 1 && (
                  <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#D4AF37]/30 sm:pl-3 shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handlePrevVerse}
                        className="p-1 sm:p-1.5 rounded-full hover:bg-white/20 text-[#D4AF37] transition-colors"
                        title="Versículo anterior"
                        aria-label="Versículo anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-[#D4AF37] font-mono px-1 font-bold">
                        {activeVerseIndex + 1}/{versesList.length}
                      </span>
                      <button
                        onClick={handleNextVerse}
                        className="p-1 sm:p-1.5 rounded-full hover:bg-white/20 text-[#D4AF37] transition-colors"
                        title="Siguiente versículo"
                        aria-label="Siguiente versículo"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#fff8f6] leading-[1.15] tracking-tight">
            {settings?.heroTitle || 'Bienvenidos a Casa.'}<br />
            <span className="italic font-normal text-[#D4AF37]">{settings?.heroSubtitle || 'Gracia y Verdad en Cristo.'}</span>
          </h1>

          <p className="text-base sm:text-lg text-[#e9e1df] font-light leading-relaxed max-w-2xl drop-shadow-sm">
            {settings?.heroDescription || 'Un espacio donde adorar, aprender de las Escrituras y crecer juntos como una familia de fe acogedora en Cathedral City. Todos son bienvenidos a acompañarnos este domingo.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectTab('activities')}
              className="px-6 py-3.5 rounded-full bg-[#D4AF37] text-[#1e1b1a] font-semibold text-sm hover:bg-[#e0be4d] shadow-lg transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#1e1b1a]" />
              <span>Asistir este Domingo</span>
            </button>

            <button
              onClick={() => onSelectTab('sermons')}
              className="px-6 py-3.5 rounded-full bg-[#5d4037]/80 text-[#fff8f6] font-semibold text-sm border border-[#fff8f6]/30 hover:bg-[#5d4037] transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span>Escuchar Sermones</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>

          {/* Quick Sunday Info Pills */}
          <div className="pt-8 border-t border-[#5d4037]/80 flex flex-wrap gap-6 text-xs text-[#e9e1df]">
            <div className="flex items-center gap-2 bg-[#1e1b1a]/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-xs">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>{settings?.locationSchedule || 'Domingos 10:00 AM & 18:00 PM'}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1e1b1a]/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-xs">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{settings?.churchAddress || '123 Sanctuary Way, Cathedral City'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Channel & Live Stream Section (Only if configured) */}
      {isYouTubeConfigured && (
        <section className="space-y-4">
          {isLive ? (
            /* ACTIVE LIVE STREAM DISPLAY - Large Screen with Muted Autoplay Video */
            <div className="rounded-3xl bg-[#1e1b1a] text-[#fff8f6] border-2 border-red-600/60 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Top Live Badge Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-full bg-red-600 text-white font-bold text-xs flex items-center gap-2 animate-pulse shadow-lg">
                    <Radio className="w-4 h-4 animate-spin" />
                    <span className="uppercase tracking-wider">Transmisión en Vivo Activa</span>
                  </div>
                  <span className="text-xs text-red-400 font-medium hidden sm:inline-block">
                    ● En Directo desde la Iglesia
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#e9e1df]">
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold flex items-center gap-2 transition-all"
                  >
                    <Youtube className="w-4 h-4 text-red-500 fill-current" />
                    <span>Abrir en YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/70" />
                  </a>
                </div>
              </div>

              {/* Live Video Title */}
              <div className="space-y-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                  <span>{liveTitle}</span>
                </h2>
                <p className="text-xs text-gray-300">
                  {settings?.churchName || 'Iglesia Grace & Truth'} — Canal Oficial de Transmisión
                </p>
              </div>

              {/* Large Video Player with Autoplay & Mute */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10 group">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&rel=0`}
                  title={liveTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Audio hint banner */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-300">
                <div className="flex items-center gap-2.5">
                  <VolumeX className="w-4 h-4 text-red-400 shrink-0" />
                  <p>
                    <strong>Nota de reproducción:</strong> El video está inicializado en silencio (MUTE) para reproducción automática fluida. Haz clic en el ícono de volumen del reproductor para activar el audio.
                  </p>
                </div>
                {youtubeChannelUrl && (
                  <a
                    href={youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#D4AF37] hover:underline shrink-0"
                  >
                    Ir al Canal Oficial →
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* YOUTUBE CHANNEL COVER DISPLAY (When not streaming live) */
            <div className="relative rounded-3xl overflow-hidden border border-[#e9e1df] bg-[#faf2f0] shadow-md group">
              {/* Channel Banner Cover Background */}
              <div
                className="h-48 sm:h-64 w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${channelCover}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b1a] via-[#1e1b1a]/60 to-transparent" />
                <div className="absolute top-4 right-4 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                  <Youtube className="w-4 h-4 fill-current" />
                  <span>Último Video</span>
                </div>
                {videoId && (
                  <button 
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
                    className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center backdrop-blur-sm shadow-xl hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 ml-1 fill-current" />
                    </div>
                  </button>
                )}
              </div>

              {/* Channel Info Overlay */}
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12">
                  {/* Photo overlapping the cover */}
                  {settings?.logoUrl ? (
                    <img
                      src={settings.logoUrl}
                      alt="Logo iglesia"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-[#faf2f0] shadow-md bg-[#442a22] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#442a22] text-[#D4AF37] flex items-center justify-center border-4 border-[#faf2f0] shadow-md shrink-0">
                      <Tv className="w-10 h-10" />
                    </div>
                  )}

                  {/* Buttons aligned to the right (desktop) or below photo (mobile) */}
                  <div className="flex flex-wrap items-center gap-3 pb-1 sm:pb-2">
                    {youtubeChannelUrl && (
                      <a
                        href={youtubeChannelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
                      >
                        <Youtube className="w-4 h-4 fill-current" />
                        <span>Suscribirse</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => onSelectTab('sermons')}
                      className="px-5 py-2.5 rounded-full bg-[#442a22] text-[#fff8f6] hover:bg-[#5d4037] font-semibold text-xs transition-all"
                    >
                      Ver Mensajes
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#442a22] flex items-center gap-2">
                    <Youtube className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 shrink-0" />
                    <span>{settings?.churchName || 'Grace & Truth'} en YouTube</span>
                  </h3>
                  <p className="text-xs text-[#75584d] font-semibold mt-1 uppercase tracking-wider">
                    Transmisiones, Sermones & Estudios Bíblicos
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#e9e1df]">
                  <p className="text-xs text-[#504441] leading-relaxed max-w-3xl">
                    Accede a la biblioteca completa de prédicas en video, servicios dominicales grabados y contenido especial. Suscríbete y activa la campana para recibir notificaciones de nuestras próximas transmisiones en vivo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Main Bento Grid Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#e9e1df] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Vida de la Iglesia
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#442a22]">
              Explora las Secciones Públicas
            </h2>
          </div>
          <p className="text-xs text-[#504441] max-w-sm">
            Toda la congregación y visitantes pueden explorar libremente los sermones, eventos, peticiones de oración y testimonios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Featured Recent Sermon (Spans 2 cols on desktop) */}
          <div className="md:col-span-2 relative rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 overflow-hidden flex flex-col justify-between group hover:border-[#442a22]/30 transition-all shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold uppercase tracking-wider">
                Sermón Reciente
              </span>
              {featuredSermon && (
                <div className="w-8 h-8 rounded-full bg-[#e9e1df] flex items-center justify-center text-xs font-bold text-[#442a22]">
                  {featuredSermon.pastorInitials || 'JD'}
                </div>
              )}
            </div>

            {!featuredSermon ? (
              <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                <BookOpen className="w-12 h-12 text-[#e9e1df] mb-4" />
                <p className="text-sm text-[#75584d] max-w-xs">Aún no hay sermones registrados. Pronto publicaremos el próximo mensaje.</p>
              </div>
            ) : (() => {
              const hasYoutube = featuredSermon.youtubeUrl && extractYouTubeVideoId(featuredSermon.youtubeUrl);
              const featuredImageUrl = hasYoutube 
                ? `https://img.youtube.com/vi/${extractYouTubeVideoId(featuredSermon.youtubeUrl)}/hqdefault.jpg`
                : featuredSermon.imageUrl;
              
              const handlePlay = () => {
                if (hasYoutube) {
                  const vId = extractYouTubeVideoId(featuredSermon.youtubeUrl);
                  const tParam = featuredSermon.youtubeStartMinute ? `&t=${featuredSermon.youtubeStartMinute}m` : '';
                  window.open(`https://www.youtube.com/watch?v=${vId}${tParam}`, '_blank');
                } else {
                  onOpenSermonModal(featuredSermon);
                }
              };

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center my-4">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={featuredImageUrl}
                      alt={featuredSermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      onClick={handlePlay}
                      className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition-colors"
                      aria-label="Reproducir sermón"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#fff8f6] text-[#442a22] flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </button>
                    {hasYoutube && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-md text-[10px] font-bold shadow-md flex items-center gap-1 backdrop-blur-sm">
                        <Youtube className="w-3 h-3 fill-current" />
                        <span>Ver en YouTube</span>
                      </div>
                    )}
                    {/* Add likes count indicator on the thumbnail */}
                    <div className="absolute top-3 left-3 bg-black/40 text-[#fff8f6] px-2.5 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 backdrop-blur-sm">
                      <Heart className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                      <span>{featuredSermon.likesCount || 0}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                      {featuredSermon.series}
                    </p>
                    <h3 className="font-serif text-2xl font-bold text-[#442a22]">
                      {featuredSermon.title}
                    </h3>
                    <p className="text-xs text-[#504441] line-clamp-3 leading-relaxed">
                      {featuredSermon.description}
                    </p>
                    <button
                      onClick={handlePlay}
                      className="mt-2 text-xs font-bold text-[#442a22] hover:text-[#D4AF37] transition-colors flex items-center gap-1 uppercase tracking-widest"
                    >
                      {hasYoutube ? 'Ver completo' : 'Escuchar ahora'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}

            {featuredSermon && (
              <div className="pt-4 border-t border-[#e9e1df] flex items-center justify-between text-xs text-[#75584d]">
                <span>{featuredSermon.pastor}</span>
                <span>{featuredSermon.date}</span>
              </div>
            )}
          </div>

          {/* Bento Card 2: Life Groups & Activities */}
          <div className="rounded-3xl bg-[#442a22] text-[#fff8f6] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-md">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#5d4037] text-[#D4AF37] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                Comunidad
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#fff8f6] mt-1 mb-2">
                Grupos de Vida
              </h3>
              <p className="text-xs text-[#e9e1df] font-light leading-relaxed">
                Conéctate durante la semana en grupos reducidos de estudio bíblico, oración y apoyo mutuo.
              </p>
            </div>

            <button
              onClick={() => onSelectTab('activities')}
              className="w-full py-3 px-4 rounded-xl bg-[#5d4037] text-[#fff8f6] text-xs font-semibold hover:bg-[#75584d] transition-all flex items-center justify-center gap-2 border border-[#fff8f6]/10"
            >
              <span>Ver Calendario de Actividades</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>

          {/* Bento Card 3: Prayer Requests */}
          <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#efe6e4] text-[#442a22] flex items-center justify-center mb-4">
                <Heart className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                Acompañamiento
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#442a22] mt-1 mb-2">
                Peticiones de Oración
              </h3>
              <p className="text-xs text-[#504441] leading-relaxed">
                ¿Estás atravesando un momento difícil? Nuestro equipo de oradores está listo para interceder por ti con total confidencialidad.
              </p>
            </div>

            <button
              onClick={() => onSelectTab('help')}
              className="w-full py-3 px-4 rounded-xl bg-[#442a22] text-[#fff8f6] text-xs font-semibold hover:bg-[#5d4037] transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Enviar Petición de Oración</span>
            </button>
          </div>

          {/* Bento Card 4: Community Reflections & Testimonies (Spans 2 cols) */}
          <div className="md:col-span-2 rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                  Fe en Acción
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#442a22] mt-0.5">
                  Testimonios & Muro de la Comunidad
                </h3>
              </div>
              <BookOpen className="w-6 h-6 text-[#75584d]" />
            </div>

            <p className="text-xs text-[#504441] leading-relaxed max-w-xl">
              Descubre cómo Dios trabaja diariamente en la vida de nuestros hermanos. Comparte tus testimonios y palabras de edificación en un entorno público y acogedor.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#442a22] text-[#D4AF37] text-xs font-bold flex items-center justify-center border-2 border-[#faf2f0]">
                  MG
                </div>
                <div className="w-8 h-8 rounded-full bg-[#5d4037] text-[#fff8f6] text-xs font-bold flex items-center justify-center border-2 border-[#faf2f0]">
                  DC
                </div>
                <div className="w-8 h-8 rounded-full bg-[#75584d] text-[#fff8f6] text-xs font-bold flex items-center justify-center border-2 border-[#faf2f0]">
                  SJ
                </div>
              </div>

              <button
                onClick={() => onSelectTab('interactions')}
                className="px-4 py-2.5 rounded-full bg-[#efe6e4] text-[#442a22] text-xs font-bold hover:bg-[#e9e1df] transition-colors flex items-center gap-1.5"
              >
                <span>Ver Muro de Testimonios</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Church Location & Schedules Preview Section */}
      <section className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e9e1df] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Encuéntranos & Visítanos
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#442a22]">
              Ubicación & Horarios de Servicio
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('location')}
            className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold hover:bg-[#5d4037] shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Ver Mapa Interactivo & Detalles</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Map Preview Container */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#e9e1df] bg-white h-[260px] sm:h-[300px] relative">
            <iframe
              src={settings?.googleMapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(settings?.churchAddress || '123 Sanctuary Way, Cathedral City')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de la iglesia"
              className="w-full h-full"
            />
          </div>

          {/* Location Quick Info Box */}
          <div className="lg:col-span-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-xs text-[#1e1b1a]">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#442a22]">Dirección</p>
                  <p className="text-[#504441]">{settings?.churchAddress || '123 Sanctuary Way, Cathedral City, CA 92234'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-[#1e1b1a]">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#442a22]">Horarios Principales</p>
                  <p className="text-[#504441]">
                    {settings?.locationSchedule || 'Domingos: 10:00 AM | Miércoles: 7:00 PM | Sábados: 6:00 PM'}
                  </p>
                </div>
              </div>

              {settings?.churchPhone && (
                <div className="flex items-start gap-2.5 text-xs text-[#1e1b1a]">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#442a22]">Teléfono</p>
                    <p className="text-[#504441]">{settings.churchPhone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#e9e1df] flex items-center gap-2">
              <a
                href={settings?.googleMapsDirectionsUrl || `https://maps.google.com/?q=${encodeURIComponent(settings?.churchAddress || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Cómo Llegar en GPS</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pastors & Leaders Section */}
      <section className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e9e1df] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Equipo Ministerial
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#442a22]">
              Pastores y Líderes de la Iglesia
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('leaders')}
            className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold hover:bg-[#5d4037] shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Ver Todos los Líderes ({leaders.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaders.slice(0, 4).map((leader) => (
            <div
              key={leader.id}
              onClick={() => onSelectTab('leaders')}
              className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] hover:border-[#D4AF37]/60 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {leader.imageUrl ? (
                    <img
                      src={leader.imageUrl}
                      alt={leader.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#D4AF37] bg-[#442a22] group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-[#442a22] text-[#D4AF37] flex items-center justify-center font-bold text-base border border-[#D4AF37]">
                      {leader.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-[#efe6e4] text-[#442a22] text-[10px] font-bold uppercase tracking-wider">
                      {leader.role}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-[#1e1b1a] leading-snug mt-0.5">
                      {leader.name}
                    </h4>
                  </div>
                </div>

                {leader.bio && (
                  <p className="text-xs text-[#504441] line-clamp-2 leading-relaxed">
                    {leader.bio}
                  </p>
                )}
              </div>

              {leader.phone && (
                <div className="pt-2 border-t border-[#e9e1df] flex items-center justify-between text-[11px] font-semibold text-[#75584d]">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{leader.phone}</span>
                  </span>
                  <span className="text-[#442a22] group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Social Media Networks Section */}
      {hasSocials && (
        <section className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e9e1df] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Comunidad Digital
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#442a22]">
                Conéctate en Redes Sociales
              </h3>
            </div>
            <p className="text-xs text-[#504441] max-w-sm">
              Sigue las cuentas oficiales para avisos diarios, transmisiones en directo, inspiraciones y eventos.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {settings?.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] hover:border-red-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Youtube className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1e1b1a]">YouTube</p>
                  <p className="text-[10px] text-[#75584d]">Canal Oficial</p>
                </div>
              </a>
            )}

            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] hover:border-blue-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1e1b1a]">Facebook</p>
                  <p className="text-[10px] text-[#75584d]">Página Oficial</p>
                </div>
              </a>
            )}

            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] hover:border-pink-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1e1b1a]">Instagram</p>
                  <p className="text-[10px] text-[#75584d]">Comunidad & Fotos</p>
                </div>
              </a>
            )}

            {settings?.whatsappUrl && (
              <a
                href={settings.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1e1b1a]">WhatsApp</p>
                  <p className="text-[10px] text-[#75584d]">Contacto Directo</p>
                </div>
              </a>
            )}

            {settings?.twitterUrl && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] hover:border-sky-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1e1b1a]">X / Twitter</p>
                  <p className="text-[10px] text-[#75584d]">Avisos & Citas</p>
                </div>
              </a>
            )}

            {settings?.tiktokUrl && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] hover:border-purple-500 hover:shadow-md transition-all flex flex-col items-center text-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#1e1b1a]">TikTok</p>
                  <p className="text-[10px] text-[#75584d]">Videos Cortos</p>
                </div>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Inspirational Callout Banner */}
      <section className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-8 sm:p-12 text-center space-y-4">
        <Church className="w-8 h-8 text-[#D4AF37] mx-auto" />
        <p className="font-serif italic text-xl sm:text-2xl text-[#442a22] max-w-2xl mx-auto leading-relaxed">
          "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos."
        </p>
        <p className="text-xs uppercase tracking-widest text-[#75584d] font-bold">
          Mateo 18:20
        </p>
      </section>

    </div>
  );
};
