import React from 'react';
import { SystemSettings, NavTab } from '../types';
import { MapPin, Navigation, Clock, Phone, Mail, Church, Car, Heart, ShieldCheck, ExternalLink, Calendar } from 'lucide-react';

interface LocationViewProps {
  settings?: SystemSettings;
  onSelectTab: (tab: NavTab) => void;
}

export const LocationView: React.FC<LocationViewProps> = ({ settings, onSelectTab }) => {
  const churchName = settings?.churchName || 'Grace & Truth';
  const address = settings?.churchAddress || '123 Sanctuary Way, Cathedral City, CA 92234';
  const phone = settings?.churchPhone || '+1 (555) 123-4567';
  const email = settings?.churchEmail || 'contacto@gracetruth.org';
  const embedUrl = settings?.googleMapsEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105912.42080373809!2d-116.51730097721245!3d33.81180258066597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80db1cb9e72ef79f%3A0x86708605ee715f5a!2sCathedral%20City%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus';
  const directionsUrl = settings?.googleMapsDirectionsUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  const customSchedule = settings?.locationSchedule;

  return (
    <div className="space-y-12 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-[#442a22] text-[#fff8f6] p-8 sm:p-12 overflow-hidden shadow-xl border border-[#5d4037]">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Visítanos en Persona</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Ubicación & Horarios de Servicio
          </h1>
          <p className="text-sm sm:text-base text-[#e9e1df] leading-relaxed">
            Te esperamos con los brazos abiertos en la iglesia <span className="text-[#D4AF37] font-semibold">{churchName}</span>. Ven a compartir un tiempo de adoración, comunión y crecimiento espiritual en familia.
          </p>
        </div>
      </div>

      {/* Main Map & Address Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Map Embed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl overflow-hidden border-2 border-[#e9e1df] shadow-lg bg-[#faf2f0] h-[380px] sm:h-[480px] relative">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa de ubicación de ${churchName}`}
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#faf2f0] border border-[#e9e1df]">
            <div className="flex items-center gap-2 text-xs text-[#504441]">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span className="font-semibold">{address}</span>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors w-full sm:w-auto justify-center"
            >
              <Navigation className="w-4 h-4" />
              <span>Cómo Llegar (Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Right Side: Address & Schedules Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Info Card */}
          <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-1 border-b border-[#e9e1df] pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                Información de contacto
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#442a22]">
                Datos de la Iglesia
              </h2>
            </div>

            <div className="space-y-4 text-xs text-[#1e1b1a]">
              <div className="p-3.5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#442a22]">Dirección Física</p>
                  <p className="text-[#504441] mt-0.5">{address}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#442a22]">Teléfono Principal</p>
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-[#504441] hover:underline font-semibold mt-0.5 block">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#442a22]">Correo Electrónico</p>
                  <a href={`mailto:${email}`} className="text-[#504441] hover:underline font-semibold mt-0.5 block">
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Schedules Card */}
          <div className="rounded-3xl bg-[#442a22] text-[#fff8f6] border border-[#5d4037] p-6 sm:p-8 space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-serif text-xl font-bold">Horarios de Reuniones</h3>
            </div>

            {customSchedule ? (
              <p className="text-xs text-[#e9e1df] leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                {customSchedule}
              </p>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white">Servicio Dominical</span>
                  </div>
                  <span className="font-semibold text-emerald-400">10:00 AM</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white">Estudio Bíblico (Miércoles)</span>
                  </div>
                  <span className="font-semibold text-emerald-400">7:00 PM</span>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-bold text-white">Reunión de Jóvenes (Sábados)</span>
                  </div>
                  <span className="font-semibold text-emerald-400">6:00 PM</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Facilities & Services Grid */}
      <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6">
        <h3 className="font-serif text-2xl font-bold text-[#442a22]">
          Información para tus Visitas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-2">
            <Car className="w-6 h-6 text-[#D4AF37]" />
            <h4 className="font-bold text-sm text-[#1e1b1a]">Estacionamiento Gratuito</h4>
            <p className="text-xs text-[#504441] leading-relaxed">
              Contamos con amplio estacionamiento interno y áreas reservadas para personas con discapacidad o familias con cochecitos.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-2">
            <Heart className="w-6 h-6 text-rose-600" />
            <h4 className="font-bold text-sm text-[#1e1b1a]">Cuidado de Niños</h4>
            <p className="text-xs text-[#504441] leading-relaxed">
              Escuela dominical con maestros capacitados en cada servicio para que tus hijos aprendan de la Biblia mientras disfrutas de la reunión.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#fff8f6] border border-[#e9e1df] space-y-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <h4 className="font-bold text-sm text-[#1e1b1a]">Ambiente Acogedor</h4>
            <p className="text-xs text-[#504441] leading-relaxed">
              No importa de dónde vengas, te recibirán líderes y ujieres con amor y calidez. ¡Siéntete libre de venir tal como eres!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
