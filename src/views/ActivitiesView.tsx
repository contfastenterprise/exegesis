import React, { useState } from 'react';
import { ActivityEvent } from '../types';
import { Calendar, Clock, MapPin, Users, CheckCircle2, ArrowRight, HeartHandshake, Sparkles, User, Phone } from 'lucide-react';

interface ActivitiesViewProps {
  events: ActivityEvent[];
  onOpenRegisterModal: (event: ActivityEvent) => void;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ events, onOpenRegisterModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(events.map(e => e.category)))];

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(e => e.category === selectedCategory);

  const featuredEvent = events.find(e => e.isFeatured) || events[0];

  return (
    <div className="space-y-10 pb-12">
      
      {/* Header Banner */}
      <div className="border-b border-[#e9e1df] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Calendario de la Iglesia
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#442a22] mt-1">
          Nuestras Actividades y Eventos
        </h1>
        <p className="text-sm text-[#504441] mt-2 max-w-2xl leading-relaxed">
          Participa activamente en la vida congregacional. Encuentra grupos de estudio, proyectos de voluntariado comunitario y reuniones de jóvenes.
        </p>
      </div>

      {/* Featured Weekly Activity (Bento Hero) */}
      {featuredEvent && (
        <div className="relative rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-10 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{featuredEvent.category}</span>
            </div>

            <h2 className="font-serif text-3xl font-bold text-[#442a22]">
              {featuredEvent.title}
            </h2>

            <p className="text-sm text-[#504441] leading-relaxed">
              {featuredEvent.description}
            </p>

            <div className="flex flex-wrap gap-4 py-2 text-xs font-semibold text-[#75584d]">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efe6e4]">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>{featuredEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efe6e4]">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>{featuredEvent.time}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efe6e4]">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{featuredEvent.location}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenRegisterModal(featuredEvent)}
                className="px-6 py-3 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold hover:bg-[#5d4037] shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Registrar Asistencia o Voluntariado</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-4/3 rounded-2xl overflow-hidden shadow-md bg-[#442a22]">
            <img
              src={featuredEvent.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV66J83yeUdKXBvNk_gscaXGjbjBCmRr613BHyv7IsP5Efd_Urr8ZmJ3Km17Fxeygrnq8JYM468TPwICQh0HQnrLQ_uvuiqjfuYj_exLDb6yAU6x1unM7DN1Riz5RdeS5DrN68jlJ-aoz_S1enINRwVhRsDbPlMCeYikHLr3mOernDfli1QKWzGyj4sy9iJr8gMpGEgQYb6ueieLHrlQ1IPr6UZmOccMbyRDMPU9S65tADH9x_H1ST'}
              alt={featuredEvent.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#442a22] text-[#fff8f6] shadow-sm'
                : 'bg-[#faf2f0] text-[#504441] border border-[#e9e1df] hover:bg-[#efe6e4]'
            }`}
          >
            {cat === 'all' ? 'Todas las Categorías' : cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl bg-[#faf2f0] border border-[#e9e1df] p-6 flex flex-col justify-between space-y-4 hover:border-[#442a22]/30 transition-all ambient-shadow-hover"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#efe6e4] text-[#D4AF37] text-[11px] font-bold uppercase tracking-wider">
                  {event.category}
                </span>
                <span className="text-xs font-bold text-[#442a22]">{event.date}</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#442a22]">
                {event.title}
              </h3>

              <p className="text-xs text-[#504441] leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-1.5 text-xs text-[#75584d] pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{event.location}</span>
                </div>
                {event.leaderName && (
                  <div className="flex items-center gap-2 text-blue-900 mt-2 bg-blue-50/80 px-2 py-1 rounded-md border border-blue-100 w-fit">
                    <User className="w-3 h-3 text-blue-600" />
                    <span className="font-semibold">Líder: {event.leaderName}</span>
                  </div>
                )}
                {event.contactPhone && (
                  <div className="flex items-center gap-2 text-blue-900 bg-blue-50/80 px-2 py-1 rounded-md border border-blue-100 w-fit">
                    <Phone className="w-3 h-3 text-blue-600" />
                    <span className="font-semibold">{event.contactPhone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-[#e9e1df] flex items-center justify-between">
              <span className="text-[11px] text-[#75584d] font-medium">Abierto a todo público</span>
              <button
                onClick={() => onOpenRegisterModal(event)}
                className="px-4 py-2 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold hover:bg-[#5d4037] transition-all flex items-center gap-1.5"
              >
                <span>Inscribirme</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
