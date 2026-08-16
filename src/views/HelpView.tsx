import React, { useState } from 'react';
import { Heart, Send, MapPin, Phone, Mail, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { DataService } from '../lib/supabase';
import { SystemSettings } from '../types';

interface HelpViewProps {
  onSuccessToast: (message: string) => void;
  settings: SystemSettings;
}

export const HelpView: React.FC<HelpViewProps> = ({ onSuccessToast, settings }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await DataService.addPrayerRequest({ name, email, phone, message });
      onSuccessToast('¡Tu petición de oración ha sido enviada con éxito y será tratada con amor y confidencialidad!');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-12">
      
      {/* Header Banner */}
      <div className="border-b border-[#e9e1df] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Atención Pastoral & Acompañamiento
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#442a22] mt-1">
          ¿Cómo podemos ayudarte u orar por ti?
        </h1>
        <p className="text-sm text-[#504441] mt-2 max-w-2xl leading-relaxed">
          En Grace & Truth creemos en la oración activa y el apoyo mutuo. Envíanos tu petición confidencial o contáctanos para consejería pastoral.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Prayer Request Form (Spans 7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#442a22] text-[#D4AF37] flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#442a22]">
                Enviar Petición de Oración
              </h3>
              <p className="text-xs text-[#75584d]">
                Mensaje recibido de forma directa y confidencial
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmitPrayer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1.5">
                Tu Nombre / Seudónimo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María o Anónimo"
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1.5">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1.5">
                  Número de Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. +1 (555) 000-0000"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1.5">
                Escribe tu Petición o Necesidad
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe aquí con libertad tus inquietudes o necesidades de oración..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#fff8f6] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22] resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#75584d] bg-[#efe6e4] p-3 rounded-xl">
              <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Tus datos son privados y sólo serán compartidos con el equipo de oración de la iglesia.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold text-sm hover:bg-[#5d4037] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
              {isSubmitting ? 'Enviando...' : 'Enviar Petición de Oración'}
            </button>
          </form>
        </div>

        {/* Location & Contact Info (Spans 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Map Preview Card */}
          <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4 shadow-sm">
            <h4 className="font-serif text-xl font-bold text-[#442a22]">
              Nuestra Ubicación
            </h4>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#e9e1df] border border-[#e9e1df]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4ryokVFX-tyHvhXX4fKcJlpU4fdg7ePzRZS1Tn-hGRqCQs67edLC85JV_qdMzdKmI4jp125oL-XYfRTAS1ukbKh2eBomJ0AVEX38RZNWyW-_mko4YpvrT85lQL9hnuUOKVH0mldfyNDCtQCRS5_2n9iFW3CDxz93cFQLUg5gv9izRkqVFI8jdPYieJDUnJN-rgjB5DCzXnzi9qDRtSoynDdDzFkm4OQY9BRfWxvVqGXh5sAh7kTS3"
                alt="Mapa Cathedral City"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                <div className="px-3 py-1.5 rounded-full bg-[#442a22] text-[#fff8f6] text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{settings.churchName}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-[#504441] pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.churchAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{settings.churchPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{settings.churchEmail}</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div className="rounded-3xl bg-[#442a22] text-[#fff8f6] p-6 space-y-3 shadow-md">
            <h4 className="font-serif text-lg font-bold text-[#D4AF37] flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Horarios de Atención Pastoral</span>
            </h4>
            <ul className="text-xs text-[#e9e1df] space-y-1.5 font-light">
              <li className="flex justify-between border-b border-[#5d4037] pb-1">
                <span>Lunes a Viernes:</span>
                <span className="font-semibold text-[#fff8f6]">09:00 - 17:00</span>
              </li>
              <li className="flex justify-between border-b border-[#5d4037] pb-1">
                <span>Sábados:</span>
                <span className="font-semibold text-[#fff8f6]">10:00 - 14:00</span>
              </li>
              <li className="flex justify-between">
                <span>Domingos:</span>
                <span className="font-semibold text-[#D4AF37]">Día de Servicios</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
