import React, { useState } from 'react';
import { NavTab, UserSession, SystemSettings } from '../types';
import { 
  Church, 
  Menu, 
  X, 
  Lock, 
  UserCheck, 
  LogOut, 
  Heart, 
  Settings,
  Sparkles,
  Youtube,
  Facebook,
  Instagram,
  MessageCircle,
  Radio,
  Home,
  BookOpen,
  Calendar,
  Users,
  MapPin,
  MessageSquareQuote,
  HelpCircle
} from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  session: UserSession;
  onOpenAuth: () => void;
  onLogout: () => void;
  favoriteCount: number;
  onOpenFavorites: () => void;
  settings?: SystemSettings;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  session,
  onOpenAuth,
  onLogout,
  favoriteCount,
  onOpenFavorites,
  settings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ElementType; isProtected?: boolean }[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'sermons', label: 'Sermones', icon: BookOpen },
    { id: 'activities', label: 'Actividades', icon: Calendar },
    { id: 'leaders', label: 'Líderes', icon: Users },
    { id: 'location', label: 'Ubicación', icon: MapPin },
    { id: 'interactions', label: 'Testimonios', icon: MessageSquareQuote },
    { id: 'help', label: 'Ayuda', icon: HelpCircle },
    { id: 'admin', label: 'Admin', icon: Settings, isProtected: true }
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const churchName = settings?.churchName || 'Grace & Truth';
  const logoUrl = settings?.logoUrl;

  const hasSocials = Boolean(
    settings?.youtubeUrl || settings?.facebookUrl || settings?.instagramUrl || settings?.whatsappUrl
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e9e1df] bg-[#fff8f6]/95 backdrop-blur-md transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Container */}
        <div className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Name */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left focus:outline-none shrink-0"
          >
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={`Logo de ${churchName}`} 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-[#D4AF37]/50 shadow-sm group-hover:scale-105 transition-transform bg-[#442a22]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#442a22] text-[#fff8f6] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-[#D4AF37]/30">
                <Church className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" strokeWidth={1.5} />
              </div>
            )}
            <div className="min-w-0">
              <span className="block font-serif text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-[#442a22] leading-snug">
                {churchName}
              </span>
              <span className="block text-[10px] sm:text-[11px] uppercase tracking-widest text-[#75584d] font-semibold -mt-0.5 hidden sm:block">
                Iglesia Cristiana
              </span>
            </div>
          </button>

          {/* Right Header Controls (Desktop & Tablet) */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Live Indicator or Social Media Quick Links */}
            {settings?.isLiveStreaming ? (
              <button
                onClick={() => handleNavClick('home')}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold animate-pulse shadow-sm hover:bg-red-700 transition-colors"
                title="Transmisión en vivo activa"
              >
                <Radio className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>EN VIVO</span>
              </button>
            ) : hasSocials ? (
              <div className="flex items-center gap-1 pr-2 border-r border-[#e9e1df]">
                {settings?.youtubeUrl && (
                  <a
                    href={settings.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-[#efe6e4] text-red-600 transition-colors"
                    title="YouTube"
                  >
                    <Youtube className="w-4 h-4 fill-current" strokeWidth={1.5} />
                  </a>
                )}
                {settings?.facebookUrl && (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-[#efe6e4] text-blue-600 transition-colors"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4 fill-current" strokeWidth={1.5} />
                  </a>
                )}
                {settings?.instagramUrl && (
                  <a
                    href={settings.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-[#efe6e4] text-pink-600 transition-colors"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                )}
                {settings?.whatsappUrl && (
                  <a
                    href={settings.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full hover:bg-[#efe6e4] text-emerald-600 transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  </a>
                )}
              </div>
            ) : null}

            {/* Saved / Favorites Counter Button */}
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-full bg-[#faf2f0] border border-[#e9e1df] text-[#504441] hover:text-[#442a22] hover:bg-[#efe6e4] transition-colors"
              title="Sermones guardados"
              aria-label="Sermones guardados"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#442a22] text-[#fff8f6] text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-[#fff8f6]">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Admin / User Action Button */}
            {session.user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf2f0] border border-[#D4AF37]/50 text-xs font-semibold text-[#442a22] hover:bg-[#efe6e4] transition-all"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="truncate max-w-[100px]">{session.user.name || 'Admin'}</span>
                  <Settings className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-full text-[#504441] hover:text-rose-700 hover:bg-[#efe6e4] transition-colors"
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-semibold hover:bg-[#5d4037] shadow-sm transition-all whitespace-nowrap"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Navigation Menu Toggle */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onOpenFavorites}
              className="relative p-2 rounded-full text-[#504441] bg-[#faf2f0] border border-[#e9e1df]"
              aria-label="Sermones guardados"
            >
              <Heart className="w-4 h-4" strokeWidth={1.5} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#442a22] text-[#fff8f6] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#442a22] bg-[#faf2f0] border border-[#e9e1df] hover:bg-[#efe6e4] focus:outline-none"
              aria-label="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Tab Bar (Identical on both Tablet and Desktop) */}
        <div className="hidden md:flex items-center justify-center overflow-x-auto py-2 border-t border-[#e9e1df]/70 scrollbar-none gap-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#442a22] text-[#fff8f6] shadow-sm'
                    : 'text-[#504441] hover:text-[#1e1b1a] hover:bg-[#efe6e4]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4AF37]' : 'text-[#75584d]'}`} strokeWidth={1.5} />
                <span>{item.label}</span>
                {item.isProtected && !session.isAdmin && (
                  <Lock className={`w-3 h-3 ${isActive ? 'text-[#D4AF37]' : 'text-[#75584d]'}`} strokeWidth={1.5} />
                )}
                {item.isProtected && session.isAdmin && (
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" strokeWidth={1.5} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e9e1df] bg-[#fff8f6] px-4 pt-3 pb-6 shadow-2xl animate-fadeIn space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    isActive
                      ? 'bg-[#442a22] text-[#fff8f6] shadow-sm'
                      : 'bg-[#faf2f0] text-[#504441] hover:bg-[#efe6e4]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#75584d]'}`} strokeWidth={1.5} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#e9e1df] flex items-center justify-between px-1">
            {session.user ? (
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1e1b1a]">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={1.5} />
                  <span className="truncate max-w-[160px]">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-700 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold text-xs shadow-sm"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" strokeWidth={1.5} />
                <span>Acceso a Administración (Admin)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

