import React from 'react';
import { ChurchLeader, SystemSettings, NavTab } from '../types';
import { Users, Phone, Mail, MessageCircle, Heart, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface LeadersViewProps {
  leaders: ChurchLeader[];
  settings?: SystemSettings;
  onSelectTab: (tab: NavTab) => void;
}

export const LeadersView: React.FC<LeadersViewProps> = ({ leaders, settings, onSelectTab }) => {
  const churchName = settings?.churchName || 'Grace & Truth';

  return (
    <div className="space-y-12 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl bg-[#442a22] text-[#fff8f6] p-8 sm:p-12 overflow-hidden shadow-xl border border-[#5d4037]">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Pastores & Liderazgo</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Nuestros Pastores y Líderes
          </h1>
          <p className="text-sm sm:text-base text-[#e9e1df] leading-relaxed">
            Conoce al equipo pastoral y líderes comprometidos con el servicio de Dios y el cuidado espiritual de la iglesia <span className="text-[#D4AF37] font-semibold">{churchName}</span>.
          </p>
        </div>
      </div>

      {/* Leaders Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e9e1df] pb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#442a22]">
              Equipo Ministerial
            </h2>
            <p className="text-xs text-[#75584d]">
              Pastores, diáconos y directores de ministerios a tu disposición.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('help')}
            className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#faf2f0] border border-[#e9e1df] text-xs font-bold text-[#442a22] hover:bg-[#efe6e4] transition-colors flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Enviar Petición de Oración</span>
          </button>
        </div>

        {leaders.length === 0 ? (
          <div className="text-center py-12 bg-[#faf2f0] rounded-3xl border border-[#e9e1df] space-y-3">
            <ShieldCheck className="w-10 h-10 text-[#D4AF37] mx-auto" />
            <p className="text-sm font-semibold text-[#1e1b1a]">No hay líderes registrados aún.</p>
            <p className="text-xs text-[#75584d]">Puedes agregarlos desde el Panel de Administración.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {leaders.map((leader) => {
              const cleanPhone = leader.phone ? leader.phone.replace(/[^0-9+]/g, '') : '';
              const whatsappUrl = cleanPhone ? `https://wa.me/${cleanPhone.replace('+', '')}` : null;

              return (
                <div
                  key={leader.id}
                  className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6 hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Leader Top Row: Avatar & Details */}
                    <div className="flex items-start gap-4">
                      {leader.imageUrl ? (
                        <img
                          src={leader.imageUrl}
                          alt={leader.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[#D4AF37]/50 shadow-md group-hover:scale-105 transition-transform bg-[#442a22]"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#442a22] text-[#D4AF37] flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#D4AF37]/50 shadow-md">
                          {leader.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1">
                        <span className="inline-block px-3 py-1 rounded-full bg-[#efe6e4] text-[#442a22] text-[11px] font-bold uppercase tracking-wider border border-[#e9e1df]">
                          {leader.role}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1e1b1a] leading-tight">
                          {leader.name}
                        </h3>
                      </div>
                    </div>

                    {/* Bio */}
                    {leader.bio && (
                      <p className="text-xs sm:text-sm text-[#504441] leading-relaxed bg-[#fff8f6] p-4 rounded-2xl border border-[#e9e1df]">
                        {leader.bio}
                      </p>
                    )}
                  </div>

                  {/* Contact Info Bar */}
                  <div className="pt-4 border-t border-[#e9e1df] space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#75584d]">
                      Información de Contacto
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {leader.phone && (
                        <a
                          href={`tel:${cleanPhone}`}
                          className="p-2.5 rounded-xl bg-[#fff8f6] hover:bg-[#efe6e4] border border-[#e9e1df] text-[#1e1b1a] font-semibold flex items-center gap-2 transition-colors group/tel"
                          title="Llamar teléfono"
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Phone className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{leader.phone}</span>
                        </a>
                      )}

                      {leader.email && (
                        <a
                          href={`mailto:${leader.email}`}
                          className="p-2.5 rounded-xl bg-[#fff8f6] hover:bg-[#efe6e4] border border-[#e9e1df] text-[#1e1b1a] font-semibold flex items-center gap-2 transition-colors"
                          title="Enviar correo"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate">{leader.email}</span>
                        </a>
                      )}
                    </div>

                    {/* Direct WhatsApp Action if phone is available */}
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Enviar mensaje por WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspirational Bottom Banner */}
      <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-8 text-center space-y-4">
        <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-[#442a22]">
          ¿Necesitas consejería o atención pastoral?
        </h3>
        <p className="text-xs text-[#504441] max-w-xl mx-auto leading-relaxed">
          Nuestros pastores y líderes están disponibles para orar contigo, escucharte y acompañarte en tu proceso espiritual. No dudes en contactar a cualquiera de nuestros líderes directamente.
        </p>
        <button
          onClick={() => onSelectTab('help')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold hover:bg-[#5d4037] shadow-md transition-all"
        >
          <span>Escribir al equipo de ayuda</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
