import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActivityEvent } from '../types';
import { X, Calendar, Clock, MapPin, User, Mail, CheckCircle2, Heart } from 'lucide-react';
import { DataService } from '../lib/supabase';

interface EventRegistrationModalProps {
  event: ActivityEvent | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [tickets, setTickets] = useState(1);
  const [type, setType] = useState<'attendance' | 'volunteer'>('attendance');
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setLoading(true);
    try {
      await DataService.addRegistration({
        eventName: event.title,
        userName: name,
        userEmail: email,
        tickets,
        type
      });

      onSuccess(`¡Te has registrado con éxito en "${event.title}"!`);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#fff8f6] rounded-3xl shadow-2xl border border-[#e9e1df] p-6 sm:p-8 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#504441] hover:text-[#1e1b1a] rounded-full hover:bg-[#efe6e4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-block px-3 py-1 rounded-full bg-[#faf2f0] border border-[#e9e1df] text-xs font-semibold text-[#D4AF37] mb-2 uppercase tracking-wide">
            {event.category}
          </span>

          <h3 className="font-serif text-2xl font-bold text-[#442a22] mb-1">
            Registro en Evento
          </h3>
          <p className="text-sm font-semibold text-[#1e1b1a] mb-4">
            {event.title}
          </p>

          <div className="p-3 rounded-xl bg-[#faf2f0] border border-[#e9e1df] space-y-1.5 text-xs text-[#504441] mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{event.location}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-[#75584d]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Carlos Mendoza"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#75584d]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1">
                  Lugares / Asistentes
                </label>
                <select
                  value={tickets}
                  onChange={(e) => setTickets(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
                >
                  <option value={1}>1 persona</option>
                  <option value={2}>2 personas</option>
                  <option value={3}>3 personas</option>
                  <option value={4}>4 personas (Familia)</option>
                  <option value={5}>5+ personas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1e1b1a] uppercase tracking-wider mb-1">
                  Modalidad
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22]"
                >
                  <option value="attendance">Asistente</option>
                  <option value="volunteer">Voluntario / Servidor</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#442a22] text-[#fff8f6] font-semibold text-sm hover:bg-[#5d4037] shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              {loading ? 'Registrando...' : 'Confirmar Registro'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
