import React, { useState, useRef } from 'react';
import { 
  UserSession, 
  PrayerRequest, 
  Sermon, 
  ActivityEvent, 
  EventRegistration, 
  SystemSettings,
  ChurchLeader,
  AdminUser,
  Devotional
} from '../types';
import { 
  Lock, 
  ShieldCheck, 
  Heart, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Settings, 
  Database, 
  LogOut, 
  Calendar, 
  BookOpen, 
  Users, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Upload,
  Image as ImageIcon,
  Church,
  Check,
  X,
  Youtube,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Radio,
  Video,
  Globe,
  Share2,
  Tv,
  UserPlus,
  Edit,
  Phone,
  MapPin,
  Mail,
  Sun,
  Play,
  ChevronDown
} from 'lucide-react';
import { DataService, isSupabaseConfigured } from '../lib/supabase';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../lib/youtube';
import { BiblicalBooksAdmin } from '../components/biblical-books/BiblicalBooksAdmin';

interface AdminViewProps {
  session: UserSession;
  onOpenAuth: () => void;
  onLogout: () => void;
  prayerRequests: PrayerRequest[];
  onPrayerRequestsUpdated: (prayers: PrayerRequest[]) => void;
  sermons: Sermon[];
  onSermonsUpdated: (sermons: Sermon[]) => void;
  events: ActivityEvent[];
  onEventsUpdated: (events: ActivityEvent[]) => void;
  registrations: EventRegistration[];
  leaders: ChurchLeader[];
  onLeadersUpdated: (leaders: ChurchLeader[]) => void;
  devotionals: Devotional[];
  onDevotionalsUpdated: (devotionals: Devotional[]) => void;
  settings: SystemSettings;
  onSettingsUpdated: (settings: SystemSettings) => void;
  onSuccessToast: (msg: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  session,
  onOpenAuth,
  onLogout,
  prayerRequests,
  onPrayerRequestsUpdated,
  sermons,
  onSermonsUpdated,
  events,
  onEventsUpdated,
  registrations,
  leaders,
  onLeadersUpdated,
  devotionals,
  onDevotionalsUpdated,
  settings,
  onSettingsUpdated,
  onSuccessToast
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'prayers' | 'sermons' | 'devotionals' | 'events' | 'leaders' | 'biblical-books' | 'settings' | 'admins'>('dashboard');

  // Form states for adding devotional
  const [devotionalTitle, setDevotionalTitle] = useState('');
  const [devotionalType, setDevotionalType] = useState<'text' | 'image' | 'video' | 'youtube'>('text');
  const [devotionalContent, setDevotionalContent] = useState('');
  const [devotionalMediaUrl, setDevotionalMediaUrl] = useState('');
  const [devotionalYoutubeUrl, setDevotionalYoutubeUrl] = useState('');
  const [devotionalAuthor, setDevotionalAuthor] = useState('');
  const [devotionalDate, setDevotionalDate] = useState('');
  const [isUploadingDevotionalMedia, setIsUploadingDevotionalMedia] = useState(false);
  const [isSavingDevotional, setIsSavingDevotional] = useState(false);
  const devotionalMediaFileInputRef = useRef<HTMLInputElement>(null);

  // Form states for managing admin users
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [isSavingAdmin, setIsSavingAdmin] = useState(false);

  React.useEffect(() => {
    setIsLoadingAdmins(true);
    DataService.getAdminUsers().then((users) => {
      setAdminUsers(users);
      setIsLoadingAdmins(false);
    });
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminName || !newAdminPassword) return;
    
    if (newAdminPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSavingAdmin(true);
    const result = await DataService.addAdminUser(newAdminEmail, newAdminName, newAdminPassword);
    if (result.success && result.data) {
      setAdminUsers([result.data, ...adminUsers]);
      setNewAdminEmail('');
      setNewAdminName('');
      setNewAdminPassword('');
      onSuccessToast('Administrador agregado con éxito. Ya puede iniciar sesión.');
    } else {
      alert(result.error || 'Error al agregar administrador.');
    }
    
    setIsSavingAdmin(false);
  };

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (confirm(`¿Estás seguro de revocar el acceso a ${email}?`)) {
      await DataService.deleteAdminUser(id);
      setAdminUsers(adminUsers.filter(a => a.id !== id));
      onSuccessToast('Acceso revocado');
    }
  };

  // Form states for adding sermon
  const [sermonTitle, setSermonTitle] = useState('');
  const [sermonSeries, setSermonSeries] = useState('');
  const [sermonPastor, setSermonPastor] = useState('');
  const [sermonPassage, setSermonPassage] = useState('');
  const [sermonDescription, setSermonDescription] = useState('');
  const [sermonImageUrl, setSermonImageUrl] = useState('');
  const [sermonYoutubeUrl, setSermonYoutubeUrl] = useState('');
  const [sermonYoutubeStartMinute, setSermonYoutubeStartMinute] = useState(0);
  const [isSavingSermon, setIsSavingSermon] = useState(false);

  // Form states for adding event
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLeaderName, setEventLeaderName] = useState('');
  const [eventContactPhone, setEventContactPhone] = useState('');
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Form states for managing leaders
  const [leaderName, setLeaderName] = useState('');
  const [leaderRole, setLeaderRole] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderTwitterUrl, setLeaderTwitterUrl] = useState('');
  const [leaderYoutubeUrl, setLeaderYoutubeUrl] = useState('');
  const [isSavingLeader, setIsSavingLeader] = useState(false);
  const [leaderImageUrl, setLeaderImageUrl] = useState('');
  const [leaderBio, setLeaderBio] = useState('');
  const [editingLeaderId, setEditingLeaderId] = useState<string | null>(null);
  const leaderFileInputRef = useRef<HTMLInputElement>(null);

  // Settings form states
  const [maintMode, setMaintMode] = useState(settings.maintenanceMode);
  const [churchName, setChurchName] = useState(settings.churchName);
  const [churchAddr, setChurchAddr] = useState(settings.churchAddress);
  const [churchPhone, setChurchPhone] = useState(settings.churchPhone);
  const [churchEmail, setChurchEmail] = useState(settings.churchEmail || 'contacto@gracetruth.org');
  const [churchLogoUrl, setChurchLogoUrl] = useState(settings.logoUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // Hero & Bible Background Customizable Settings
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || 'Bienvenidos a Casa.');
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || 'Gracia y Verdad en Cristo.');
  const [heroVerse, setHeroVerse] = useState(settings.heroVerse || 'Salmos 119:105 — Lámpara es a mis pies tu palabra');
  
  const defaultVerses = [
    'Salmos 119:105 — Lámpara es a mis pies tu palabra, y lumbrera a mi camino.',
    'Juan 8:12 — Yo soy la luz del mundo; el que me sigue, no andará en tinieblas.',
    'Filipenses 4:13 — Todo lo puedo en Cristo que me fortalece.'
  ];
  const initialVersesList = (settings.heroVerses && settings.heroVerses.length > 0)
    ? settings.heroVerses
    : [settings.heroVerse || defaultVerses[0], defaultVerses[1], defaultVerses[2]];
  const [heroVersesList, setHeroVersesList] = useState<string[]>(initialVersesList);

  const [heroDescription, setHeroDescription] = useState(settings.heroDescription || 'Un espacio donde adorar, aprender de las Escrituras y crecer juntos como una familia de fe acogedora en Cathedral City. Todos son bienvenidos a acompañarnos este domingo.');
  const [heroBgUrl, setHeroBgUrl] = useState(settings.heroBackgroundImageUrl || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&auto=format&fit=crop&q=80');
  const [heroBgOpacity, setHeroBgOpacity] = useState(settings.heroBgOpacity ?? 45);
  // YouTube & Live Stream settings
  const [youtubeUrl, setYoutubeUrl] = useState(settings.youtubeUrl || '');
  const [youtubeCoverUrl, setYoutubeCoverUrl] = useState(settings.youtubeChannelCoverUrl || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(settings.isLiveStreaming || false);
  const [liveStreamVideoId, setLiveStreamVideoId] = useState(settings.liveStreamVideoId || '');
  const [liveStreamTitle, setLiveStreamTitle] = useState(settings.liveStreamTitle || '');

  // Social Media links
  const [facebookUrl, setFacebookUrl] = useState(settings.facebookUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(settings.instagramUrl || '');
  const [whatsappUrl, setWhatsappUrl] = useState(settings.whatsappUrl || '');
  const [twitterUrl, setTwitterUrl] = useState(settings.twitterUrl || '');
  const [tiktokUrl, setTiktokUrl] = useState(settings.tiktokUrl || '');

  // Google Maps & Location schedule settings
  const [mapsEmbedUrl, setMapsEmbedUrl] = useState(settings.googleMapsEmbedUrl || '');
  const [mapsDirectionsUrl, setMapsDirectionsUrl] = useState(settings.googleMapsDirectionsUrl || '');
  const [locationSchedule, setLocationSchedule] = useState(settings.locationSchedule || '');

  const sampleLogos = [
    { name: 'Cruz Clásica Dorada', url: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?w=150&auto=format&fit=crop&q=80' },
    { name: 'Vitral Sagrado', url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=150&auto=format&fit=crop&q=80' },
    { name: 'Cáliz & Luz', url: 'https://images.unsplash.com/photo-1543702160-31804c102a0a?w=150&auto=format&fit=crop&q=80' },
    { name: 'Paloma de Paz', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=80' }
  ];

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Por favor selecciona una imagen de logo menor a 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setChurchLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Por favor selecciona una portada menor a 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setYoutubeCoverUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Por favor selecciona una imagen menor a 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setHeroBgUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 1. Unauthenticated Security Guard Screen
  if (!session.isAdmin) {
    return (
      <div className="py-12 max-w-2xl mx-auto">
        <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-8 sm:p-12 text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#442a22] text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#efe6e4] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              Área Privada Protegida
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#442a22]">
              Pantalla de Configuración
            </h1>
            <p className="text-sm text-[#504441] leading-relaxed max-w-lg mx-auto">
              Esta sección está reservada exclusivamente para administradores. La navegación por todas las demás secciones (Sermones, Actividades, Peticiones y Testimonios) es completamente pública y libre.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#75584d] space-y-1">
            <p className="font-semibold text-[#1e1b1a]">Autenticación con Supabase Auth</p>
            <p>Ingresa con tus credenciales administrativas para gestionar los datos privados.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold hover:bg-[#5d4037] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4 text-[#D4AF37]" />
              <span>Iniciar Sesión como Administrador</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  const handleTogglePrayerStatus = async (id: string, currentStatus: 'Pending' | 'Prayed') => {
    const nextStatus = currentStatus === 'Pending' ? 'Prayed' : 'Pending';
    await DataService.updatePrayerStatus(id, nextStatus);
    const freshPrayers = await DataService.getPrayerRequests();
    onPrayerRequestsUpdated(freshPrayers);
    onSuccessToast(`Estado de la petición actualizado a "${nextStatus === 'Prayed' ? 'Orado' : 'Pendiente'}"`);
  };

  const handleDeletePrayer = async (id: string) => {
    if (confirm('¿Deseas eliminar esta petición de oración?')) {
      await DataService.deletePrayerRequest(id);
      const freshPrayers = await DataService.getPrayerRequests();
      onPrayerRequestsUpdated(freshPrayers);
      onSuccessToast('Petición eliminada');
    }
  };

  const handleAddSermonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sermonTitle.trim() || !sermonDescription.trim()) return;

    setIsSavingSermon(true);
    try {
      await DataService.addSermon({
        title: sermonTitle,
        series: sermonSeries,
        year: new Date().getFullYear().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        pastor: sermonPastor,
        pastorInitials: sermonPastor.split(' ').map(n => n[0]).join('').substring(0, 2),
        passage: sermonPassage,
        description: sermonDescription,
        imageUrl: sermonImageUrl,
        youtubeUrl: sermonYoutubeUrl.trim() || undefined,
        youtubeStartMinute: sermonYoutubeStartMinute > 0 ? sermonYoutubeStartMinute : undefined
      });

      const freshSermons = await DataService.getSermons();
      onSermonsUpdated(freshSermons);
      onSuccessToast('¡Sermón agregado con éxito!');
      setSermonTitle('');
      setSermonSeries('');
      setSermonPastor('');
      setSermonPassage('');
      setSermonDescription('');
      setSermonImageUrl('');
      setSermonYoutubeUrl('');
      setSermonYoutubeStartMinute(0);
    } finally {
      setIsSavingSermon(false);
    }
  };

  const handleDeleteSermon = async (id: string, title: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el sermón "${title}"?`)) {
      await DataService.deleteSermon(id);
      const freshSermons = await DataService.getSermons();
      onSermonsUpdated(freshSermons);
      onSuccessToast('Sermón eliminado exitosamente');
    }
  };

  const handleAddEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDescription.trim()) return;

    setIsSavingEvent(true);
    try {
      await DataService.addEvent({
        title: eventTitle,
        category: eventCategory,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        description: eventDescription,
        leaderName: eventLeaderName || undefined,
        contactPhone: eventContactPhone || undefined,
        registrationOpen: true
      });

      const freshEvents = await DataService.getEvents();
      onEventsUpdated(freshEvents);
      setEventTitle('');
      setEventCategory('');
      setEventDate('');
      setEventTime('');
      setEventLocation('');
      setEventDescription('');
      setEventLeaderName('');
      setEventContactPhone('');
      onSuccessToast('¡Evento publicado con éxito!');
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string, title: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el evento "${title}"?`)) {
      await DataService.deleteEvent(id);
      const freshEvents = await DataService.getEvents();
      onEventsUpdated(freshEvents);
      onSuccessToast('Evento eliminado exitosamente');
    }
  };

  const handleAddOrUpdateLeaderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaderName.trim() || !leaderRole.trim()) return;

    setIsSavingLeader(true);
    try {
      if (editingLeaderId) {
        await DataService.updateLeader({
          id: editingLeaderId,
          name: leaderName,
          role: leaderRole,
          phone: leaderPhone,
          email: leaderEmail,
          imageUrl: leaderImageUrl,
          bio: leaderBio
        });
        onSuccessToast('¡Información del líder actualizada!');
      } else {
        await DataService.addLeader({
          name: leaderName,
          role: leaderRole,
          phone: leaderPhone,
          email: leaderEmail,
          imageUrl: leaderImageUrl,
          bio: leaderBio
        });
        onSuccessToast('¡Nuevo líder/pastor agregado!');
      }

      const freshLeaders = await DataService.getLeaders();
      onLeadersUpdated(freshLeaders);

      // Reset form
      setLeaderName('');
      setLeaderRole('');
      setLeaderPhone('');
      setLeaderEmail('');
      setLeaderTwitterUrl('');
      setLeaderYoutubeUrl('');
      setLeaderImageUrl('');
      setLeaderBio('');
      setEditingLeaderId(null);
    } finally {
      setIsSavingLeader(false);
    }
  };

  const handleEditLeader = (leader: ChurchLeader) => {
    setEditingLeaderId(leader.id);
    setLeaderName(leader.name);
    setLeaderRole(leader.role);
    setLeaderPhone(leader.phone || '');
    setLeaderEmail(leader.email || '');
    setLeaderImageUrl(leader.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80');
    setLeaderBio(leader.bio || '');
  };

  const handleDeleteLeader = async (id: string) => {
    if (confirm('¿Deseas eliminar a este líder/pastor?')) {
      await DataService.deleteLeader(id);
      const freshLeaders = await DataService.getLeaders();
      onLeadersUpdated(freshLeaders);
      onSuccessToast('Líder eliminado');
    }
  };

  const handleLeaderFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLeaderImageUrl(event.target.result as string);
          onSuccessToast('Foto cargada');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updated = await DataService.saveSettings({
        ...settings,
        maintenanceMode: maintMode,
        churchName,
        churchAddress: churchAddr,
        churchPhone,
        churchEmail,
        logoUrl: churchLogoUrl,
        heroTitle,
        heroSubtitle,
        heroVerse: heroVersesList[0] || '',
        heroVerses: heroVersesList.filter(v => v.trim().length > 0),
        heroDescription,
        heroBackgroundImageUrl: heroBgUrl,
        heroBgOpacity,
        youtubeUrl,
        youtubeChannelCoverUrl: youtubeCoverUrl,
        isLiveStreaming,
        liveStreamVideoId,
        liveStreamTitle,
        facebookUrl,
        instagramUrl,
        whatsappUrl,
        twitterUrl,
        tiktokUrl,
        googleMapsEmbedUrl: mapsEmbedUrl,
        googleMapsDirectionsUrl: mapsDirectionsUrl,
        locationSchedule
      });
      onSettingsUpdated(updated);
      onSuccessToast('Configuración guardada con éxito.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Admin Header */}
      <div className="p-6 rounded-3xl bg-[#442a22] text-[#fff8f6] border border-[#5d4037] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#5d4037] text-[#D4AF37] flex items-center justify-center border border-[#D4AF37]/40 shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#fff8f6]">
                Panel de Administración
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                Autenticado
              </span>
            </div>
            <p className="text-xs text-[#e9e1df] font-light">
              Conectado como <strong className="font-semibold text-[#D4AF37]">{session.user?.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-full bg-[#5d4037] text-xs font-semibold text-[#e9e1df] border border-[#fff8f6]/10 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{isSupabaseConfigured ? 'Supabase Activo' : 'Supabase Local Sync'}</span>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-full bg-rose-900/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold border border-rose-700/50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#e9e1df]">
        {[
          { id: 'dashboard', label: 'Resumen', icon: Sparkles },
          { id: 'prayers', label: 'Peticiones', icon: Heart },
          { id: 'sermons', label: 'Sermones', icon: BookOpen },
          { id: 'biblical-books', label: 'Biblioteca', icon: BookOpen },
          { id: 'devotionals', label: 'Devocionales', icon: Sun },
          { id: 'events', label: 'Eventos', icon: Calendar },
          { id: 'leaders', label: 'Líderes', icon: Users },
          { id: 'admins', label: 'Admins', icon: ShieldCheck },
          { id: 'settings', label: 'Ajustes', icon: Settings }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeAdminTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveAdminTab(item.id as any)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-[#442a22] text-[#fff8f6] shadow-sm'
                  : 'bg-[#faf2f0] text-[#504441] border border-[#e9e1df] hover:bg-[#efe6e4]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#75584d]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Dashboard */}
      {activeAdminTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#faf2f0] border border-[#e9e1df]">
              <div className="flex items-center justify-between text-[#75584d] mb-2">
                <span className="text-xs font-bold uppercase">Peticiones de Oración</span>
                <Heart className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#442a22]">
                {prayerRequests.length}
              </p>
              <p className="text-[11px] text-[#75584d] mt-1">
                {prayerRequests.filter(p => p.status === 'Pending').length} pendientes de intercesión
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf2f0] border border-[#e9e1df]">
              <div className="flex items-center justify-between text-[#75584d] mb-2">
                <span className="text-xs font-bold uppercase">Registros de Eventos</span>
                <Users className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#442a22]">
                {registrations.length}
              </p>
              <p className="text-[11px] text-[#75584d] mt-1">Inscripciones registradas</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf2f0] border border-[#e9e1df]">
              <div className="flex items-center justify-between text-[#75584d] mb-2">
                <span className="text-xs font-bold uppercase">Sermones Publicados</span>
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-serif text-3xl font-bold text-[#442a22]">
                {sermons.length}
              </p>
              <p className="text-[11px] text-[#75584d] mt-1">Archivo de audio y video</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf2f0] border border-[#e9e1df]">
              <div className="flex items-center justify-between text-[#75584d] mb-2">
                <span className="text-xs font-bold uppercase">Estado del Sistema</span>
                <Settings className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <p className="font-serif text-xl font-bold text-[#442a22]">
                {settings.maintenanceMode ? 'Mantenimiento' : 'En Línea'}
              </p>
              <p className="text-[11px] text-[#75584d] mt-1">Supabase DB conectado</p>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#442a22]">
              Inscripciones Recientes a Eventos
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1e1b1a] min-w-[600px] whitespace-nowrap">
                <thead className="bg-[#efe6e4] text-[#75584d] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl">Evento</th>
                    <th className="p-3">Nombre</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Cupos</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3 rounded-r-xl">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e9e1df]">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#fff8f6]/60">
                      <td className="p-3 font-semibold text-[#442a22]">{reg.eventName}</td>
                      <td className="p-3">{reg.userName}</td>
                      <td className="p-3 text-[#75584d]">{reg.userEmail}</td>
                      <td className="p-3 font-bold">{reg.tickets}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          reg.type === 'volunteer' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {reg.type === 'volunteer' ? 'Voluntario' : 'Asistente'}
                        </span>
                      </td>
                      <td className="p-3 text-[#75584d]">{reg.registeredAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular Sermons Statistics Table */}
          <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#442a22] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#D4AF37] fill-current" />
              Sermones Más Populares
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#1e1b1a] min-w-[500px] whitespace-nowrap">
                <thead className="bg-[#efe6e4] text-[#75584d] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 rounded-l-xl w-16">Rank</th>
                    <th className="p-3">Título</th>
                    <th className="p-3">Pastor</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3 rounded-r-xl text-right">Me Gusta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e9e1df]">
                  {[...sermons]
                    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
                    .slice(0, 10)
                    .map((sermon, index) => (
                    <tr key={sermon.id} className="hover:bg-[#fff8f6]/60">
                      <td className="p-3 font-bold text-[#D4AF37]">#{index + 1}</td>
                      <td className="p-3 font-semibold text-[#442a22]">{sermon.title}</td>
                      <td className="p-3 text-[#75584d]">{sermon.pastor}</td>
                      <td className="p-3 text-[#75584d]">{sermon.date}</td>
                      <td className="p-3 text-right font-bold text-[#442a22] flex items-center justify-end gap-1.5">
                        {sermon.likesCount || 0}
                        <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                      </td>
                    </tr>
                  ))}
                  {sermons.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-[#75584d]">
                        No hay sermones publicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Devotionals */}
      {activeAdminTab === 'devotionals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#442a22]">Gestión de Devocionales</h2>
              <p className="text-sm text-[#75584d] mt-1">Sube texto, imágenes, video, o enlaces a YouTube.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!devotionalTitle) {
                    alert('El título es requerido');
                    return;
                  }

                  setIsSavingDevotional(true);
                  try {
                    let finalMediaUrl = devotionalMediaUrl;
                    if (devotionalType === 'image' || devotionalType === 'video') {
                      if (devotionalMediaFileInputRef.current?.files?.[0]) {
                        setIsUploadingDevotionalMedia(true);
                        const uploadedUrl = await DataService.uploadDevotionalMedia(devotionalMediaFileInputRef.current.files[0]);
                        setIsUploadingDevotionalMedia(false);
                        if (uploadedUrl) {
                          finalMediaUrl = uploadedUrl;
                        } else {
                          alert('Error al subir el archivo multimedia.');
                          return;
                        }
                      } else if (!finalMediaUrl) {
                        alert('Selecciona un archivo para el devocional.');
                        return;
                      }
                    }

                    const newDevo = await DataService.addDevotional({
                      title: devotionalTitle,
                      type: devotionalType,
                      content: devotionalContent,
                      mediaUrl: finalMediaUrl,
                      youtubeUrl: devotionalYoutubeUrl,
                      author: devotionalAuthor,
                      date: devotionalDate || new Date().toISOString().split('T')[0]
                    });
                    onDevotionalsUpdated([newDevo, ...devotionals]);
                    
                    // Reset form
                    setDevotionalTitle('');
                    setDevotionalContent('');
                    setDevotionalMediaUrl('');
                    setDevotionalYoutubeUrl('');
                    setDevotionalAuthor('');
                    if (devotionalMediaFileInputRef.current) {
                      devotionalMediaFileInputRef.current.value = '';
                    }
                    onSuccessToast('Devocional agregado exitosamente.');
                  } finally {
                    setIsSavingDevotional(false);
                  }
                }} 
                className="bg-[#faf2f0] border border-[#e9e1df] rounded-2xl p-6 shadow-sm space-y-4"
              >
                <h3 className="font-serif text-lg font-bold text-[#442a22] flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#D4AF37]" />
                  Nuevo Devocional
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#75584d] mb-1">Título *</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-[#e9e1df] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                      placeholder="Ej. La fe que mueve montañas"
                      value={devotionalTitle}
                      onChange={(e) => setDevotionalTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#75584d] mb-1">Tipo de Devocional *</label>
                    <select
                      className="w-full bg-white border border-[#e9e1df] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                      value={devotionalType}
                      onChange={(e) => setDevotionalType(e.target.value as any)}
                    >
                      <option value="text">Texto</option>
                      <option value="image">Imagen</option>
                      <option value="video">Video (Subida directa)</option>
                      <option value="youtube">Video (YouTube)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#75584d] mb-1">Autor (Opcional)</label>
                    <input 
                      type="text" 
                      className="w-full bg-white border border-[#e9e1df] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                      placeholder="Nombre del autor"
                      value={devotionalAuthor}
                      onChange={(e) => setDevotionalAuthor(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#75584d] mb-1">Fecha</label>
                    <input 
                      type="date" 
                      className="w-full bg-white border border-[#e9e1df] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                      value={devotionalDate}
                      onChange={(e) => setDevotionalDate(e.target.value)}
                    />
                  </div>

                  {devotionalType === 'text' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#75584d] mb-1">Contenido *</label>
                      <textarea 
                        required
                        className="w-full bg-white border border-[#e9e1df] rounded-xl px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:border-[#D4AF37]"
                        placeholder="Escribe el devocional aquí..."
                        value={devotionalContent}
                        onChange={(e) => setDevotionalContent(e.target.value)}
                      />
                    </div>
                  )}

                  {(devotionalType === 'image' || devotionalType === 'video') && (
                    <div>
                      <label className="block text-xs font-semibold text-[#75584d] mb-1">Subir Archivo *</label>
                      <input 
                        type="file" 
                        accept={devotionalType === 'image' ? "image/*" : "video/*"}
                        ref={devotionalMediaFileInputRef}
                        className="w-full text-sm text-[#75584d] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#442a22] file:text-[#fff8f6] hover:file:bg-[#5d4037] transition-all"
                      />
                    </div>
                  )}

                  {devotionalType === 'youtube' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#75584d] mb-1">URL de YouTube *</label>
                      <input 
                        type="url" 
                        required
                        className="w-full bg-white border border-[#e9e1df] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D4AF37]"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={devotionalYoutubeUrl}
                        onChange={(e) => setDevotionalYoutubeUrl(e.target.value)}
                      />
                      {devotionalYoutubeUrl && extractYouTubeVideoId(devotionalYoutubeUrl) && (
                        <div className="mt-3 rounded-xl overflow-hidden shadow-sm aspect-video bg-black">
                          <iframe 
                            src={`https://www.youtube.com/embed/${extractYouTubeVideoId(devotionalYoutubeUrl)}`}
                            className="w-full h-full"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isUploadingDevotionalMedia}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#b08d24] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  {isUploadingDevotionalMedia ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isUploadingDevotionalMedia ? 'Subiendo...' : 'Publicar Devocional'}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devotionals.map((devo) => (
                  <div key={devo.id} className="bg-white rounded-2xl border border-[#e9e1df] p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif font-bold text-[#442a22] leading-tight line-clamp-2">
                        {devo.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#efe6e4] text-[#75584d] ml-2 shrink-0">
                        {devo.type}
                      </span>
                    </div>
                    {devo.type === 'youtube' && devo.youtubeUrl && (
                      <div className="w-full h-32 rounded-xl mb-3 overflow-hidden bg-black/5 relative">
                        <img 
                          src={getYouTubeThumbnailUrl(devo.youtubeUrl)} 
                          alt="Thumbnail"
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center text-white backdrop-blur-sm">
                            <Play className="w-4 h-4 ml-0.5 fill-current" />
                          </div>
                        </div>
                      </div>
                    )}
                    {devo.type === 'image' && devo.mediaUrl && (
                      <div className="w-full h-32 rounded-xl mb-3 overflow-hidden bg-black/5 relative">
                         <img src={devo.mediaUrl} alt="Devotional media" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-[#75584d]">
                        {devo.author && <span className="font-semibold block">{devo.author}</span>}
                        {devo.date}
                      </div>
                      <button 
                        onClick={async () => {
                          if(confirm('¿Eliminar este devocional?')) {
                            await DataService.deleteDevotional(devo.id);
                            onDevotionalsUpdated(devotionals.filter(d => d.id !== devo.id));
                            onSuccessToast('Devocional eliminado.');
                          }
                        }}
                        className="p-2 text-[#75584d] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                        title="Eliminar devocional"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {devotionals.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-[#75584d] bg-[#faf2f0] rounded-2xl border border-dashed border-[#e9e1df]">
                    <Sun className="w-12 h-12 mx-auto text-[#D4AF37]/50 mb-3" />
                    <p className="font-medium text-[#442a22]">Aún no hay devocionales publicados.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Admins */}
      {activeAdminTab === 'biblical-books' && (
        <BiblicalBooksAdmin onSuccessToast={onSuccessToast} />
      )}

      {activeAdminTab === 'admins' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#442a22]">Gestión de Administradores</h2>
              <p className="text-sm text-[#75584d] mt-1">Controla quién tiene acceso a este panel de control.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <form onSubmit={handleAddAdmin} className="bg-[#faf2f0] border border-[#e9e1df] rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-[#442a22]">
                  <UserPlus className="w-5 h-5" />
                  <h3 className="font-bold">Agregar Administrador</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#75584d] uppercase mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e1df] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm text-[#1e1b1a]"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#75584d] uppercase mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e1df] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm text-[#1e1b1a]"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#75584d] uppercase mb-1">Contraseña Temporal</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e9e1df] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-sm text-[#1e1b1a]"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSavingAdmin}
                  className="w-full mt-4 py-2.5 rounded-xl bg-[#442a22] text-[#fff8f6] text-sm font-semibold hover:bg-[#5d4037] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingAdmin ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span>{isSavingAdmin ? 'Guardando...' : 'Otorgar Acceso'}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#faf2f0] border border-[#e9e1df] rounded-2xl p-6 shadow-sm overflow-hidden">
                <h3 className="font-bold text-[#442a22] mb-4">Usuarios Autorizados</h3>
                
                {isLoadingAdmins ? (
                  <div className="text-center py-8 text-[#75584d] flex flex-col items-center justify-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37] mb-3" />
                    <p>Cargando administradores...</p>
                  </div>
                ) : adminUsers.length === 0 ? (
                  <div className="text-center py-8 text-[#75584d]">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No hay administradores registrados.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminUsers.map(admin => (
                      <div key={admin.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white rounded-xl border border-[#e9e1df] gap-4 hover:border-[#D4AF37]/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#efe6e4] text-[#442a22] flex items-center justify-center font-bold">
                            {admin.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#442a22]">{admin.name}</p>
                            <p className="text-xs text-[#75584d]">{admin.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] uppercase font-bold text-[#75584d] bg-[#efe6e4] px-2 py-1 rounded-md">
                            Agregado: {admin.createdAt}
                          </span>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Revocar Acceso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Prayer Requests */}
      {activeAdminTab === 'prayers' && (
        <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#442a22]">
                Peticiones de Oración
              </h3>
              <p className="text-xs text-[#75584d]">
                Gestiona las intenciones recibidas desde la sección pública.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {prayerRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-[#1e1b1a]">{req.name}</span>
                    {req.email && <span className="text-xs text-[#75584d]">({req.email})</span>}
                    {req.phone && (
                      <span className="text-xs font-semibold text-[#442a22] bg-[#efe6e4] px-2 py-0.5 rounded-md flex items-center gap-1 border border-[#e9e1df]">
                        <Phone className="w-3 h-3 text-[#D4AF37]" />
                        <span>{req.phone}</span>
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'Prayed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status === 'Prayed' ? 'Orado' : 'Pendiente'}
                    </span>
                  </div>
                  <p className="text-xs text-[#504441] leading-relaxed italic">
                    "{req.message}"
                  </p>
                  <span className="text-[10px] text-[#75584d] block">Fecha: {req.createdAt}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleTogglePrayerStatus(req.id, req.status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                      req.status === 'Prayed'
                        ? 'bg-[#efe6e4] text-[#442a22]'
                        : 'bg-emerald-800 text-white hover:bg-emerald-900'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{req.status === 'Prayed' ? 'Marcar Pendiente' : 'Marcar Orado'}</span>
                  </button>

                  <button
                    onClick={() => handleDeletePrayer(req.id)}
                    className="p-1.5 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Sermons Management */}
      {activeAdminTab === 'sermons' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Sermon Form (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#442a22]">
              Agregar Nuevo Sermón
            </h3>

            <form onSubmit={handleAddSermonSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={sermonTitle}
                  onChange={(e) => setSermonTitle(e.target.value)}
                  placeholder="Ej. La Gracia del Evangelio"
                  className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Serie</label>
                <input
                  type="text"
                  required
                  value={sermonSeries}
                  onChange={(e) => setSermonSeries(e.target.value)}
                  placeholder="Ej. San Juan"
                  className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Pastor</label>
                <input
                  type="text"
                  required
                  value={sermonPastor}
                  onChange={(e) => setSermonPastor(e.target.value)}
                  placeholder="Ej. Pastor John Doe"
                  className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Pasaje Bíblico</label>
                <input
                  type="text"
                  value={sermonPassage}
                  onChange={(e) => setSermonPassage(e.target.value)}
                  placeholder="Ej. Juan 3:16"
                  className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Enlace de YouTube (Opcional)</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Youtube className="h-4 w-4 text-red-500" />
                    </div>
                    <input
                      type="url"
                      value={sermonYoutubeUrl}
                      onChange={(e) => setSermonYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      value={sermonYoutubeStartMinute}
                      onChange={(e) => setSermonYoutubeStartMinute(parseInt(e.target.value) || 0)}
                      placeholder="Minuto"
                      title="Minuto de inicio"
                      className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                  </div>
                </div>
                {sermonYoutubeUrl && extractYouTubeVideoId(sermonYoutubeUrl) && (
                  <div className="mt-2 relative rounded-xl overflow-hidden aspect-video border border-[#e9e1df]">
                    <img 
                      src={getYouTubeThumbnailUrl(extractYouTubeVideoId(sermonYoutubeUrl))} 
                      alt="YouTube Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-[10px] backdrop-blur-sm">
                      Previsualización
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Descripción</label>
                <textarea
                  rows={3}
                  required
                  value={sermonDescription}
                  onChange={(e) => setSermonDescription(e.target.value)}
                  placeholder="Resumen del mensaje..."
                  className="w-full p-3 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingSermon}
                className="w-full py-2.5 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold text-xs hover:bg-[#5d4037] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingSermon ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                )}
                <span>{isSavingSermon ? 'Guardando...' : 'Publicar Sermón'}</span>
              </button>
            </form>
          </div>

          {/* Current Sermons List (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#442a22]">
              Sermones Actuales ({sermons.length})
            </h3>

            <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
              {sermons.map((s) => (
                <div key={s.id} className="p-3 rounded-xl bg-[#fff8f6] border border-[#e9e1df] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={s.imageUrl} alt="" className="w-12 h-10 object-cover rounded-lg bg-[#442a22]" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-xs text-[#1e1b1a]">{s.title}</p>
                      <p className="text-[10px] text-[#75584d]">{s.series} • {s.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-[#D4AF37] bg-[#faf2f0] px-2 py-1 rounded-full border border-[#e9e1df]">
                      {s.pastor}
                    </span>
                    <button
                      onClick={() => handleDeleteSermon(s.id, s.title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                      title="Eliminar Sermón"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Events Management */}
      {activeAdminTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#442a22]">
              Crear Nuevo Evento
            </h3>

            <form onSubmit={handleAddEventSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Nombre del Evento</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ej. Retiro de Jóvenes"
                  className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Categoría</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                >
                  <option value="Estudio Bíblico">Estudio Bíblico</option>
                  <option value="Jóvenes">Jóvenes</option>
                  <option value="Damas">Damas</option>
                  <option value="Caballeros">Caballeros</option>
                  <option value="Familia">Familia</option>
                  <option value="Evangelismo">Evangelismo</option>
                  <option value="Servicio Comunitario">Servicio Comunitario</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Fecha</label>
                  <input
                    type="text"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="20 OCT"
                    className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Hora</label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="18:00"
                    className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Lugar</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Salón Principal o Dirección"
                  className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                />
              </div>

              {eventCategory === 'Estudio Bíblico' && (
                <div className="grid grid-cols-2 gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1 text-blue-900">Líder a cargo</label>
                    <input
                      type="text"
                      value={eventLeaderName}
                      onChange={(e) => setEventLeaderName(e.target.value)}
                      placeholder="Ej. Fam. Rodríguez"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs text-[#1e1b1a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1 text-blue-900">Teléfono (WhatsApp)</label>
                    <input
                      type="tel"
                      value={eventContactPhone}
                      onChange={(e) => setEventContactPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs text-[#1e1b1a]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Descripción</label>
                <textarea
                  rows={3}
                  required
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Detalles del evento..."
                  className="w-full p-3 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingEvent}
                className="w-full py-2.5 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold text-xs hover:bg-[#5d4037] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingEvent ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                ) : (
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                )}
                <span>{isSavingEvent ? 'Guardando...' : 'Publicar Evento'}</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#442a22]">
              Eventos en Calendario ({events.length})
            </h3>

            <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
              {events.map((ev) => (
                <div key={ev.id} className="p-3 rounded-xl bg-[#fff8f6] border border-[#e9e1df] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-bold text-xs text-[#1e1b1a]">{ev.title}</p>
                      <p className="text-[10px] text-[#75584d]">{ev.date} • {ev.time} • {ev.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase bg-[#faf2f0] px-2 py-1 rounded-full border border-[#e9e1df]">
                      {ev.category}
                    </span>
                    <button
                      onClick={() => handleDeleteEvent(ev.id, ev.title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-100"
                      title="Eliminar Evento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Leaders & Pastors Management */}
      {activeAdminTab === 'leaders' && (
        <div className="space-y-8">
          {/* Add / Edit Leader Form */}
          <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#e9e1df] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#442a22]">
                  {editingLeaderId ? 'Editar Información del Líder' : 'Agregar Nuevo Pastor o Líder'}
                </h3>
                <p className="text-xs text-[#75584d]">
                  {editingLeaderId 
                    ? 'Modifica los datos del miembro pastoral seleccionado.' 
                    : 'Añade un nuevo pastor, líder o director de ministerio a la sección de Liderazgo.'}
                </p>
              </div>
              {editingLeaderId && (
                <button
                  onClick={() => {
                    setEditingLeaderId(null);
                    setLeaderName('');
                    setLeaderRole('Pastor Co-Líder');
                    setLeaderPhone('');
                    setLeaderEmail('');
                    setLeaderImageUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80');
                    setLeaderBio('');
                  }}
                  className="px-3 py-1.5 rounded-full bg-[#efe6e4] text-[#75584d] hover:text-[#442a22] text-xs font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancelar Edición</span>
                </button>
              )}
            </div>

            <form onSubmit={handleAddOrUpdateLeaderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderName}
                    onChange={(e) => setLeaderName(e.target.value)}
                    placeholder="Ej. Pr. Carlos & María Mendoza"
                    className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Cargo / Rol Pastoral *
                  </label>
                  <input
                    type="text"
                    required
                    value={leaderRole}
                    onChange={(e) => setLeaderRole(e.target.value)}
                    placeholder="Ej. Pastor Principal, Líder de Jóvenes, Alabanza"
                    className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Teléfono de Contacto
                  </label>
                  <input
                    type="tel"
                    value={leaderPhone}
                    onChange={(e) => setLeaderPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={leaderEmail}
                    onChange={(e) => setLeaderEmail(e.target.value)}
                    placeholder="pastor@gracetruth.org"
                    className="w-full px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Foto del Líder (URL o Cargar Archivo)
                  </label>
                  <div className="flex items-center gap-3">
                    {leaderImageUrl && (
                      <img
                        src={leaderImageUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border-2 border-[#D4AF37] bg-[#442a22] shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    )}
                    <input
                      type="url"
                      value={leaderImageUrl}
                      onChange={(e) => setLeaderImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <input
                      type="file"
                      ref={leaderFileInputRef}
                      onChange={handleLeaderFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => leaderFileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-[#efe6e4] hover:bg-[#e9e1df] text-xs font-semibold text-[#442a22] flex items-center gap-1.5 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Subir Foto</span>
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Reseña / Biografía Corta
                  </label>
                  <textarea
                    rows={3}
                    value={leaderBio}
                    onChange={(e) => setLeaderBio(e.target.value)}
                    placeholder="Breve descripción del ministerio y llamado de este líder..."
                    className="w-full p-3 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingLeader}
                  className="px-6 py-2.5 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold hover:bg-[#5d4037] shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSavingLeader ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-[#D4AF37]" />
                  )}
                  <span>{isSavingLeader ? 'Guardando...' : (editingLeaderId ? 'Guardar Cambios del Líder' : 'Agregar Líder')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Leaders List */}
          <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#442a22]">
              Líderes y Pastores Registrados ({leaders.length})
            </h3>

            {leaders.length === 0 ? (
              <p className="text-xs text-[#75584d] py-4 text-center">No hay líderes registrados en el sistema.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leaders.map((leader) => (
                  <div
                    key={leader.id}
                    className="p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] flex items-start gap-4 justify-between"
                  >
                    <div className="flex items-start gap-3">
                      {leader.imageUrl ? (
                        <img
                          src={leader.imageUrl}
                          alt={leader.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#D4AF37] bg-[#442a22] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#442a22] text-[#D4AF37] flex items-center justify-center font-bold text-lg border border-[#D4AF37]">
                          {(leader.name || 'L').substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded bg-[#efe6e4] text-[#442a22] text-[10px] font-bold">
                          {leader.role}
                        </span>
                        <h4 className="font-bold text-sm text-[#1e1b1a]">{leader.name || 'Líder sin nombre'}</h4>
                        {leader.phone && (
                          <p className="text-[11px] text-[#75584d] flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <span>{leader.phone}</span>
                          </p>
                        )}
                        {leader.email && (
                          <p className="text-[11px] text-[#75584d] flex items-center gap-1">
                            <Mail className="w-3 h-3 text-blue-600" />
                            <span>{leader.email}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEditLeader(leader)}
                        className="p-2 rounded-lg text-[#442a22] hover:bg-[#efe6e4] transition-colors"
                        title="Editar líder"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLeader(leader.id)}
                        className="p-2 rounded-lg text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Eliminar líder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 6: System Settings */}
      {activeAdminTab === 'settings' && (
        <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#442a22]">
                Configuración de la Iglesia
              </h3>
              <p className="text-xs text-[#75584d]">
                Personaliza la identidad visual, el logo oficial y los datos de contacto.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#efe6e4] text-[#D4AF37] text-xs font-bold border border-[#D4AF37]/30">
              Identidad & Marca
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            <details open className="group bg-[#faf2f0] border border-[#e9e1df] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-[#faf2f0] transition-colors outline-none focus:bg-[#faf2f0]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#442a22]">Identidad y Marca</h4>
                  <p className="text-xs text-[#75584d] mt-0.5">Logo, nombre de la iglesia e información de contacto.</p>
                </div>
                <ChevronDown className="w-5 h-5 text-[#75584d] group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="p-5 border-t border-[#e9e1df] space-y-6 bg-[#faf2f0]">
              
              {/* Logo Customization Box */}
            <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#1e1b1a] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Logo Oficial de la Iglesia</span>
                  </h4>
                  <p className="text-xs text-[#75584d]">
                    Sube tu propio logo (PNG, JPG, SVG) o selecciona un emblema prediseñado.
                  </p>
                </div>

                {/* Live Header Logo Preview */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#faf2f0] border border-[#e9e1df]">
                  <span className="text-[10px] font-bold text-[#75584d] uppercase">Vista Previa:</span>
                  {churchLogoUrl ? (
                    <img
                      src={churchLogoUrl}
                      alt="Logo preview"
                      className="w-9 h-9 rounded-full object-cover border-2 border-[#D4AF37] bg-[#442a22]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#442a22] text-[#fff8f6] flex items-center justify-center border border-[#D4AF37]/40">
                      <Church className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Upload or Paste URL options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Subir Imagen de Logo
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#faf2f0] border border-dashed border-[#442a22]/30 hover:border-[#442a22] text-xs font-semibold text-[#442a22] flex items-center justify-center gap-2 transition-all hover:bg-[#efe6e4]"
                  >
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>Seleccionar archivo local</span>
                  </button>
                  <p className="text-[10px] text-[#75584d] mt-1">Soporta PNG, JPG, SVG hasta 3MB</p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    O Pegar URL de Imagen
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={churchLogoUrl}
                      onChange={(e) => setChurchLogoUrl(e.target.value)}
                      placeholder="https://ejemplo.com/logo-iglesia.png"
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    {churchLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setChurchLogoUrl('')}
                        className="absolute right-2 top-2 text-[#75584d] hover:text-rose-700"
                        title="Quitar logo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Pre-made emblems gallery */}
              <div className="pt-2 border-t border-[#e9e1df]">
                <p className="text-[11px] font-bold uppercase text-[#1e1b1a] mb-2">
                  O elige un emblema institucional prediseñado:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sampleLogos.map((preset, idx) => {
                    const isSelected = churchLogoUrl === preset.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setChurchLogoUrl(preset.url)}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-[#442a22] text-[#fff8f6] border-[#D4AF37] shadow-sm'
                            : 'bg-[#faf2f0] text-[#1e1b1a] border-[#e9e1df] hover:bg-[#efe6e4]'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#D4AF37]/50"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold truncate">{preset.name}</p>
                          <p className={`text-[9px] ${isSelected ? 'text-[#D4AF37]' : 'text-[#75584d]'}`}>
                            {isSelected ? 'Seleccionado' : 'Usar emblema'}
                          </p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* General Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#1e1b1a] mb-1">
                  Nombre de la Iglesia
                </label>
                <input
                  type="text"
                  required
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1e1b1a] mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={churchEmail}
                  onChange={(e) => setChurchEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#1e1b1a] mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={churchAddr}
                  onChange={(e) => setChurchAddr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#1e1b1a] mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="text"
                  value={churchPhone}
                  onChange={(e) => setChurchPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a]"
                />
              </div>
            </div>

            
            </div>
            </details>

            <details open className="group bg-[#faf2f0] border border-[#e9e1df] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-[#faf2f0] transition-colors outline-none focus:bg-[#faf2f0]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#442a22]">Diseño de Portada</h4>
                  <p className="text-xs text-[#75584d] mt-0.5">Banner principal y versículos rotativos.</p>
                </div>
                <ChevronDown className="w-5 h-5 text-[#75584d] group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="p-5 border-t border-[#e9e1df] space-y-6 bg-[#faf2f0]">

            {/* Portada Principal / Textos de Bienvenida & Fondo de la Biblia */}
            <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e9e1df] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#efe6e4] text-[#442a22] flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e1b1a]">
                      Portada Principal (Banner de Bienvenida & Fondo de la Biblia)
                    </h4>
                    <p className="text-xs text-[#75584d]">
                      Personaliza el título, versículo, mensaje de bienvenida y la visibilidad de la Biblia de fondo.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dynamic Verses Section */}
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Versículos Bíblicos Dinámicos (Rotativos en la Portada)</span>
                    </label>
                    <span className="text-[10px] text-[#75584d] bg-[#efe6e4] px-2 py-0.5 rounded-full font-medium">
                      {heroVersesList.length} versículo{heroVersesList.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#75584d]">
                    Los versículos ingresados rotarán automáticamente en la tarjeta principal de la página de inicio.
                  </p>

                  <div className="space-y-2">
                    {heroVersesList.map((v, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-6 text-center text-xs font-bold text-[#D4AF37]">
                          #{index + 1}
                        </span>
                        <input
                          type="text"
                          value={v}
                          onChange={(e) => {
                            const newVerses = [...heroVersesList];
                            newVerses[index] = e.target.value;
                            setHeroVersesList(newVerses);
                          }}
                          placeholder="Ej: Salmos 23:1 — Jehová es mi pastor; nada me faltará."
                          className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#e9e1df] text-xs text-[#1e1b1a] focus:outline-none focus:border-[#442a22]"
                        />
                        {heroVersesList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newVerses = heroVersesList.filter((_, i) => i !== index);
                              setHeroVersesList(newVerses);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar este versículo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#e9e1df]">
                    <button
                      type="button"
                      onClick={() => setHeroVersesList([...heroVersesList, ''])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#442a22] hover:bg-[#5d4037] text-white text-xs font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Agregar otro versículo</span>
                    </button>

                    {/* Quick Preset Badges */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] text-[#75584d]">
                      <span className="font-semibold">Sugeridos:</span>
                      {[
                        'Salmos 23:1 — Jehová es mi pastor; nada me faltará.',
                        'Proverbios 3:5 — Fíate de Jehová de todo tu corazón.',
                        'Josué 1:9 — Mira que te mando que te esfuerces y seas valiente.',
                        'Romanos 8:28 — Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.'
                      ].map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => {
                            if (!heroVersesList.includes(preset)) {
                              setHeroVersesList([...heroVersesList, preset]);
                            }
                          }}
                          className="px-2 py-0.5 rounded-md bg-[#efe6e4] hover:bg-[#D4AF37] hover:text-[#1e1b1a] text-[#442a22] transition-colors truncate max-w-[140px]"
                          title={`Añadir "${preset}"`}
                        >
                          + {preset.split(' — ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e9e1df]">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Título Principal de Bienvenida
                  </label>
                  <input
                    type="text"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Bienvenidos a Casa."
                    className="w-full px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Subtítulo / Lema de la Iglesia
                  </label>
                  <input
                    type="text"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Gracia y Verdad en Cristo."
                    className="w-full px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Opacidad de la Biblia de Fondo ({heroBgOpacity}%)
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min="10"
                      max="90"
                      step="5"
                      value={heroBgOpacity}
                      onChange={(e) => setHeroBgOpacity(Number(e.target.value))}
                      className="flex-1 accent-[#442a22]"
                    />
                    <span className="text-xs font-bold text-[#442a22] w-12 text-right">
                      {heroBgOpacity}%
                    </span>
                  </div>
                  <p className="text-[10px] text-[#75584d] mt-1">
                    Aumenta para ver la Biblia de fondo con mayor claridad o reduce para más oscuridad.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Mensaje de Bienvenida / Descripción
                  </label>
                  <textarea
                    rows={2}
                    value={heroDescription}
                    onChange={(e) => setHeroDescription(e.target.value)}
                    placeholder="Un espacio donde adorar, aprender de las Escrituras..."
                    className="w-full p-3 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Imagen de Fondo de la Biblia / Portada (URL o Subir)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={heroBgUrl}
                      onChange={(e) => setHeroBgUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <input
                      type="file"
                      ref={heroFileInputRef}
                      onChange={handleHeroFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => heroFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-[#efe6e4] hover:bg-[#e9e1df] text-xs font-semibold text-[#442a22] flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Subir foto</span>
                    </button>
                  </div>
                </div>

                {/* Preset Bible background options */}
                <div className="sm:col-span-2 pt-2 border-t border-[#e9e1df]">
                  <p className="text-[11px] font-bold uppercase text-[#1e1b1a] mb-2">
                    O selecciona un fondo bíblico / templo sugerido:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { name: 'Biblia Abierta', url: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1600&auto=format&fit=crop&q=80' },
                      { name: 'Escrituras & Luz', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1600&auto=format&fit=crop&q=80' },
                      { name: 'Altar & Cruz', url: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1600&auto=format&fit=crop&q=80' },
                      { name: 'Estudio Bíblico', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfChJO8bWNpDsYe3xtcLIVOg9alSxeAMnNXFyapIyELU5ZxmfyrM-xz3p5sxCKIryOU8O3lxBgr5iI3IrOLVrkQcI8Ozcyy2Z4m3barjQGGy1B2JH0pwbNGLVGG2fCVq7RYyYeeZhKMmwkX0OryaGwy1Q9E8n9mapFWEEvoJOaEcVlN5WfyF-gpNFyRJlx-zz7yXx_WoJhYyGxL6voZ0vVr6GhCRmUjEh_1_BI-SR6OxmM01cE4o_r' }
                    ].map((bg, idx) => {
                      const isSel = heroBgUrl === bg.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setHeroBgUrl(bg.url)}
                          className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            isSel
                              ? 'bg-[#442a22] text-[#fff8f6] border-[#D4AF37] shadow-sm'
                              : 'bg-[#faf2f0] text-[#1e1b1a] border-[#e9e1df] hover:bg-[#efe6e4]'
                          }`}
                        >
                          <img
                            src={bg.url}
                            alt={bg.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#D4AF37]/40"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold truncate">{bg.name}</p>
                            <p className={`text-[9px] ${isSel ? 'text-[#D4AF37]' : 'text-[#75584d]'}`}>
                              {isSel ? 'Seleccionado' : 'Usar fondo'}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            </div>
            </details>

            <details open className="group bg-[#faf2f0] border border-[#e9e1df] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-[#faf2f0] transition-colors outline-none focus:bg-[#faf2f0]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#442a22]">Multimedia</h4>
                  <p className="text-xs text-[#75584d] mt-0.5">Canal de YouTube y Transmisiones en vivo.</p>
                </div>
                <ChevronDown className="w-5 h-5 text-[#75584d] group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="p-5 border-t border-[#e9e1df] space-y-6 bg-[#faf2f0]">

            {/* YouTube & Live Streaming Section Box */}
            <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e9e1df] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Youtube className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e1b1a]">
                      Canal de YouTube y Transmisiones en Vivo
                    </h4>
                    <p className="text-xs text-[#75584d]">
                      Muestra tu canal o el reproductor en vivo directamente en la página principal.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                  YouTube TV
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    URL del Canal de YouTube
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/@gracetruth"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <Youtube className="w-4 h-4 text-red-600 absolute left-3 top-3" />
                  </div>
                  <p className="text-[10px] text-[#75584d] mt-1">
                    Si está configurado, la página principal mostrará la tarjeta oficial del canal cuando no haya en vivo.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Imagen de Portada / Banner del Canal
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={youtubeCoverUrl}
                      onChange={(e) => setYoutubeCoverUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-1438232992991-995b7058bbb3"
                      className="flex-1 px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      onChange={handleCoverFileSelect}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-[#efe6e4] hover:bg-[#e9e1df] text-xs font-semibold text-[#442a22] flex items-center gap-1 shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Subir archivo</span>
                    </button>
                  </div>
                </div>

                {/* Live Stream Active Toggle */}
                <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Radio className={`w-4 h-4 ${isLiveStreaming ? 'text-red-600 animate-pulse' : 'text-[#75584d]'}`} />
                      <p className="font-bold text-xs text-[#1e1b1a]">
                        ¿Transmisión en Vivo Activa Ahora?
                      </p>
                    </div>
                    <p className="text-[10px] text-[#75584d] mt-0.5">
                      Al activar esto, la página principal muestra el video en pantalla grande en MUTE automáticamente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                    className="focus:outline-none"
                  >
                    {isLiveStreaming ? (
                      <ToggleRight className="w-8 h-8 text-red-600" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-[#75584d]" />
                    )}
                  </button>
                </div>

                {/* Live Stream Video ID or URL & Title */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    ID o URL del Video / En Vivo de YouTube
                  </label>
                  <input
                    type="text"
                    value={liveStreamVideoId}
                    onChange={(e) => setLiveStreamVideoId(e.target.value)}
                    placeholder="Ej. jfKfPfyJRdk o URL completa"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Título del Evento / Transmisión
                  </label>
                  <input
                    type="text"
                    value={liveStreamTitle}
                    onChange={(e) => setLiveStreamTitle(e.target.value)}
                    placeholder="Servicio de Adoración en Vivo"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>
              </div>
            </div>

            </div>
            </details>

            <details open className="group bg-[#faf2f0] border border-[#e9e1df] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-[#faf2f0] transition-colors outline-none focus:bg-[#faf2f0]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#442a22]">Redes Sociales</h4>
                  <p className="text-xs text-[#75584d] mt-0.5">Enlaces a canales oficiales y WhatsApp.</p>
                </div>
                <ChevronDown className="w-5 h-5 text-[#75584d] group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="p-5 border-t border-[#e9e1df] space-y-6 bg-[#faf2f0]">

            {/* Social Media Networks Box */}
            <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e9e1df] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#efe6e4] text-[#442a22] flex items-center justify-center">
                    <Share2 className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e1b1a]">
                      Redes Sociales de la Iglesia
                    </h4>
                    <p className="text-xs text-[#75584d]">
                      Agrega los enlaces a tus canales oficial para vincular en el encabezado y pie de página.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Facebook
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/iglesia"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <Facebook className="w-4 h-4 text-blue-600 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Instagram
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/iglesia"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <Instagram className="w-4 h-4 text-pink-600 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    WhatsApp (Enlace o Número)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={whatsappUrl}
                      onChange={(e) => setWhatsappUrl(e.target.value)}
                      placeholder="https://wa.me/15551234567"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    X (Twitter)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="https://twitter.com/iglesia"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <Twitter className="w-4 h-4 text-sky-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    TikTok
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={tiktokUrl}
                      onChange={(e) => setTiktokUrl(e.target.value)}
                      placeholder="https://tiktok.com/@iglesia"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                    />
                    <Share2 className="w-4 h-4 text-purple-600 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>
            </div>

            </div>
            </details>

            <details open className="group bg-[#faf2f0] border border-[#e9e1df] rounded-2xl overflow-hidden shadow-sm">
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-[#faf2f0] transition-colors outline-none focus:bg-[#faf2f0]">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#442a22]">Ubicación y Sistema</h4>
                  <p className="text-xs text-[#75584d] mt-0.5">Mapa, horarios y estado de mantenimiento.</p>
                </div>
                <ChevronDown className="w-5 h-5 text-[#75584d] group-open:rotate-180 transition-transform duration-300" />
              </summary>
              <div className="p-5 border-t border-[#e9e1df] space-y-6 bg-[#faf2f0]">

            {/* Google Maps Location & Schedules Box */}
            <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-4">
              <div className="flex items-center justify-between border-b border-[#e9e1df] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#efe6e4] text-[#442a22] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1e1b1a]">
                      Ubicación de la Iglesia & Google Maps
                    </h4>
                    <p className="text-xs text-[#75584d]">
                      Configura el mapa interactivo y el enlace de navegación para la congregación.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    URL del Mapa Embed (Iframe Google Maps)
                  </label>
                  <input
                    type="url"
                    value={mapsEmbedUrl}
                    onChange={(e) => setMapsEmbedUrl(e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="w-full px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                  <p className="text-[10px] text-[#75584d] mt-1">
                    Para obtenerla: abre Google Maps → Compartir → Insertar mapa y copia el atributo src de iframe.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Enlace Directo de Navegación GPS ("Cómo Llegar")
                  </label>
                  <input
                    type="url"
                    value={mapsDirectionsUrl}
                    onChange={(e) => setMapsDirectionsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">
                    Horarios de Servicios y Reuniones
                  </label>
                  <input
                    type="text"
                    value={locationSchedule}
                    onChange={(e) => setLocationSchedule(e.target.value)}
                    placeholder="Servicios Dominicales: 10:00 AM | Estudio Bíblico: Miércoles 7:00 PM"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs text-[#1e1b1a]"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#fff8f6] border border-[#e9e1df]">
              <div>
                <p className="font-bold text-sm text-[#1e1b1a]">Modo Mantenimiento</p>
                <p className="text-xs text-[#75584d]">Desactiva temporalmente inscripciones públicas</p>
              </div>
              <button
                type="button"
                onClick={() => setMaintMode(!maintMode)}
                className="text-[#442a22] focus:outline-none"
              >
                {maintMode ? (
                  <ToggleRight className="w-8 h-8 text-rose-700" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-[#75584d]" />
                )}
              </button>
            </div>

            </div>
            </details>

            <button
              type="submit"
              disabled={isSavingSettings}
              className="py-3 px-6 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold text-xs hover:bg-[#5d4037] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingSettings ? (
                <RefreshCw className="w-4 h-4 animate-spin text-[#D4AF37]" />
              ) : (
                <Settings className="w-4 h-4 text-[#D4AF37]" />
              )}
              <span>{isSavingSettings ? 'Guardando...' : 'Guardar Configuración y Logo'}</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
