import React from 'react';
import { NavTab, SystemSettings } from '../types';
import { 
  Church, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  Lock,
  Youtube,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Share2
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenAuth: () => void;
  settings?: SystemSettings;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAuth, settings }) => {
  const churchName = settings?.churchName || 'Grace & Truth';
  const logoUrl = settings?.logoUrl;
  const address = settings?.churchAddress || '123 Sanctuary Way, Cathedral City, CA 92234';
  const phone = settings?.churchPhone || '+1 (555) 123-4567';
  const email = settings?.churchEmail || 'contacto@gracetruth.org';

  const hasSocials = settings?.youtubeUrl || settings?.facebookUrl || settings?.instagramUrl || settings?.whatsappUrl || settings?.twitterUrl || settings?.tiktokUrl;

  return (
    <footer className="bg-[#442a22] text-[#fff8f6] pt-16 pb-12 border-t border-[#5d4037]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#5d4037]">
          
          {/* Brand & Mission & Socials */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`Logo de ${churchName}`} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/50 shadow-md bg-[#5d4037]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#5d4037] text-[#D4AF37] flex items-center justify-center">
                  <Church className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#fff8f6]">
                  {churchName}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#D4AF37]">
                  Iglesia Cristiana
                </span>
              </div>
            </div>
            <p className="text-sm text-[#e9e1df] leading-relaxed font-light">
              Proclamando la verdad del Evangelio y viviendo a la luz de la palabra.
            </p>

            {/* Social Media Links */}
            {hasSocials && (
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
                  Síguenos en Redes
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {settings?.youtubeUrl && (
                    <a
                      href={settings.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#5d4037] hover:bg-red-600 text-[#fff8f6] flex items-center justify-center transition-colors"
                      title="Canal de YouTube"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-4 h-4 fill-current" />
                    </a>
                  )}
                  {settings?.facebookUrl && (
                    <a
                      href={settings.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#5d4037] hover:bg-blue-600 text-[#fff8f6] flex items-center justify-center transition-colors"
                      title="Facebook"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-4 h-4 fill-current" />
                    </a>
                  )}
                  {settings?.instagramUrl && (
                    <a
                      href={settings.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#5d4037] hover:bg-pink-600 text-[#fff8f6] flex items-center justify-center transition-colors"
                      title="Instagram"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {settings?.whatsappUrl && (
                    <a
                      href={settings.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#5d4037] hover:bg-emerald-600 text-[#fff8f6] flex items-center justify-center transition-colors"
                      title="WhatsApp"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  {settings?.twitterUrl && (
                    <a
                      href={settings.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#5d4037] hover:bg-sky-500 text-[#fff8f6] flex items-center justify-center transition-colors"
                      title="Twitter / X"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-4 h-4 fill-current" />
                    </a>
                  )}
                  {settings?.tiktokUrl && (
                    <a
                      href={settings.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#5d4037] hover:bg-purple-600 text-[#fff8f6] flex items-center justify-center transition-colors"
                      title="TikTok"
                      aria-label="TikTok"
                    >
                      <Share2 className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Navegación</h4>
            <ul className="space-y-2.5 text-sm text-[#e9e1df]">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-[#D4AF37] transition-colors">
                  Inicio & Bienvenida
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('sermons')} className="hover:text-[#D4AF37] transition-colors">
                  Sermones y Archivos
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('activities')} className="hover:text-[#D4AF37] transition-colors">
                  Actividades y Eventos
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('help')} className="hover:text-[#D4AF37] transition-colors">
                  Peticiones de Oración
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('interactions')} className="hover:text-[#D4AF37] transition-colors">
                  Testimonios
                </button>
              </li>
            </ul>
          </div>

          {/* Schedule */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Horarios de Reunión</h4>
            <div className="space-y-3 text-sm text-[#e9e1df]">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#fff8f6]">Servicios Dominicales</p>
                  <p className="text-xs text-[#e9e1df] font-light">10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#fff8f6]">Estudio Bíblico</p>
                  <p className="text-xs text-[#e9e1df] font-light">Miércoles 19:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Admin */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#D4AF37] mb-4">Contacto & Ubicación</h4>
            <ul className="space-y-3 text-sm text-[#e9e1df]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-xs">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs">{phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="text-xs">{email}</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-[#5d4037]">
              <button
                onClick={() => {
                  onSelectTab('admin');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Panel de Administración</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright and verse */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#e9e1df]/80">
          <p>© {new Date().getFullYear()} {churchName}. Todos los derechos reservados.</p>
          <p className="font-serif italic text-sm text-[#D4AF37]">
            "Lámpara es a mis pies tu palabra, y lumbrera a mi camino." — Salmos 119:105
          </p>
        </div>
      </div>
    </footer>
  );
};
