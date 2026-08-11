import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sermon } from '../types';
import { Play, Pause, X, Heart, Share2, BookOpen, User, Calendar, Volume2 } from 'lucide-react';

interface SermonPlayerModalProps {
  sermon: Sermon | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (sermon: Sermon) => void;
  onShare: (title: string) => void;
}

export const SermonPlayerModal: React.FC<SermonPlayerModalProps> = ({
  sermon,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShare
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  if (!sermon) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#fff8f6] rounded-3xl shadow-2xl border border-[#e9e1df] overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-[#fff8f6] bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Hero */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-[#442a22]">
            <img
              src={sermon.imageUrl}
              alt={sermon.title}
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fff8f6] via-[#442a22]/40 to-transparent" />
            
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/90 text-[#1e1b1a] text-xs font-bold tracking-wide uppercase mb-2">
                  {sermon.series}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1e1b1a] drop-shadow-sm">
                  {sermon.title}
                </h2>
              </div>
            </div>
          </div>

          {/* Main Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Meta details */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 rounded-xl bg-[#faf2f0] border border-[#e9e1df] text-xs font-semibold text-[#504441]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>{sermon.pastor}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4AF37]" />
                <span>{sermon.date}</span>
              </div>
              {sermon.passage && (
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span>{sermon.passage}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h4 className="font-serif text-lg font-semibold text-[#442a22] mb-2">
                Resumen del Mensaje
              </h4>
              <p className="text-sm text-[#504441] leading-relaxed">
                {sermon.description}
              </p>
            </div>

            {/* Interactive Audio Player Simulation */}
            <div className="p-4 rounded-2xl bg-[#faf2f0] border border-[#e9e1df] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 rounded-full bg-[#442a22] text-[#fff8f6] flex items-center justify-center shadow-md hover:bg-[#5d4037] transition-all"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <div>
                    <p className="text-xs font-semibold text-[#1e1b1a]">Reproducir Audio</p>
                    <p className="text-[11px] text-[#75584d]">
                      {isPlaying ? 'Reproduciendo audio...' : 'Presiona para escuchar'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#75584d]" />
                  <span className="text-xs font-medium text-[#75584d]">24:15</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#e9e1df] rounded-full h-2 cursor-pointer relative" onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = Math.round((clickX / rect.width) * 100);
                setProgress(pct);
              }}>
                <div
                  className="bg-[#442a22] h-2 rounded-full transition-all duration-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#D4AF37] rounded-full shadow" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onToggleFavorite(sermon)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                  isFavorite
                    ? 'bg-[#442a22] text-[#fff8f6] border-[#442a22]'
                    : 'bg-[#faf2f0] text-[#504441] border-[#e9e1df] hover:bg-[#efe6e4]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current text-[#D4AF37]' : ''}`} />
                <span>{isFavorite ? 'Guardado en Favoritos' : 'Guardar Sermón'}</span>
              </button>

              <button
                onClick={() => onShare(sermon.title)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#faf2f0] text-[#504441] border border-[#e9e1df] hover:bg-[#efe6e4] text-xs font-semibold transition-all"
              >
                <Share2 className="w-4 h-4 text-[#75584d]" />
                <span>Compartir</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
