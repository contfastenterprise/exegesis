import React, { useState } from 'react';
import { Sermon } from '../types';
import { Play, Search, Filter, Calendar, BookOpen, Share2, Heart, Bookmark, User } from 'lucide-react';
import { motion } from 'motion/react';
import { usePageTransition } from '../components/transitions/hooks/usePageTransition';
import { RevealOnScroll } from '../components/transitions/RevealOnScroll';

interface SermonsViewProps {
  sermons: Sermon[];
  onOpenSermonModal: (sermon: Sermon) => void;
  favorites: string[];
  likedIds: string[];
  onToggleSave: (sermon: Sermon) => void;
  onToggleLike: (sermon: Sermon) => void;
  onShare: (title: string) => void;
}

export const SermonsView: React.FC<SermonsViewProps> = ({
  sermons,
  onOpenSermonModal,
  favorites,
  likedIds,
  onToggleSave,
  onToggleLike,
  onShare,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');

  // Extract unique series
  const seriesList = ['all', ...Array.from(new Set(sermons.map(s => s.series)))];

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = 
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sermon.passage && sermon.passage.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSeries = selectedSeries === 'all' || sermon.series === selectedSeries;

    return matchesSearch && matchesSeries;
  });

  const featuredSermon = sermons.find(s => s.isFeatured) || sermons[0];

  const { staggerContainer, fadeInUp } = usePageTransition();

  return (
    <motion.div 
      className="space-y-10 pb-12"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      
      {/* Header Banner */}
      <motion.div variants={fadeInUp} className="border-b border-[#e9e1df] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
          Archivo de Prédicas
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#442a22] mt-1">
          Sermones y Enseñanzas
        </h1>
        <p className="text-sm text-[#504441] mt-2 max-w-2xl leading-relaxed">
          Explora la colección de mensajes dominicales y estudios expositivos. Escucha en línea, guarda tus sermones favoritos o comparte con seres queridos.
        </p>
      </motion.div>

      {/* Search and Filters Bar */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#75584d]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, pastor o pasaje..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#faf2f0] border border-[#e9e1df] text-sm text-[#1e1b1a] focus:outline-none focus:ring-2 focus:ring-[#442a22] focus:bg-[#fff8f6] transition-all"
          />
        </div>

        {/* Series Chips Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-[#75584d] shrink-0 hidden sm:block" />
          {seriesList.map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSeries === series
                  ? 'bg-[#442a22] text-[#fff8f6] shadow-sm'
                  : 'bg-[#faf2f0] text-[#504441] border border-[#e9e1df] hover:bg-[#efe6e4]'
              }`}
            >
              {series === 'all' ? 'Todas las Series' : series}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Featured Sermon Highlight (if no search filter applied) */}
      {!searchTerm && selectedSeries === 'all' && featuredSermon && (
        <RevealOnScroll>
          <div className="relative rounded-3xl bg-[#442a22] text-[#fff8f6] overflow-hidden shadow-xl border border-[#5d4037] grid grid-cols-1 md:grid-cols-2">
          <div className="relative min-h-[260px] md:min-h-[360px]">
            <img
              src={featuredSermon.imageUrl}
              alt={featuredSermon.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            
            <button
              onClick={() => onOpenSermonModal(featuredSermon)}
              className="absolute inset-0 flex items-center justify-center group"
              aria-label="Escuchar sermón destacado"
            >
              <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-[#1e1b1a] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 ml-1 fill-current" />
              </div>
            </button>
          </div>

          <div className="p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#5d4037] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
                Serie Destacada: {featuredSermon.series}
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#fff8f6] mb-3">
                {featuredSermon.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#e9e1df] font-light leading-relaxed line-clamp-4">
                {featuredSermon.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#5d4037]">
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#e9e1df]">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#D4AF37]" />
                  <span>{featuredSermon.pastor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span>{featuredSermon.date}</span>
                </div>
                {featuredSermon.passage && (
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                    <span>{featuredSermon.passage}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => onOpenSermonModal(featuredSermon)}
                  className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-[#1e1b1a] text-xs font-bold hover:bg-[#e0be4d] transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Ver / Escuchar Mensaje</span>
                </button>

                <button
                  onClick={() => onToggleSave(featuredSermon)}
                  className="p-2.5 rounded-full bg-[#5d4037] text-[#fff8f6] hover:bg-[#75584d] transition-colors flex items-center justify-center"
                  aria-label="Guardar sermón"
                  title="Guardar sermón"
                >
                  <Bookmark className={`w-4 h-4 ${favorites.includes(featuredSermon.id) ? 'fill-current text-[#D4AF37]' : ''}`} />
                </button>

                <button
                  onClick={() => onToggleLike(featuredSermon)}
                  className="p-2.5 rounded-full bg-[#5d4037] text-[#fff8f6] hover:bg-[#75584d] transition-colors flex items-center gap-1.5"
                  aria-label="Me gusta"
                  title="Me gusta"
                >
                  <Heart className={`w-4 h-4 ${likedIds.includes(featuredSermon.id) ? 'fill-current text-[#D4AF37]' : ''}`} />
                  <span className="text-xs font-semibold">{featuredSermon.likesCount || 0}</span>
                </button>
              </div>
            </div>
          </div>
          </div>
        </RevealOnScroll>
      )}

      {/* Sermons Grid */}
      <RevealOnScroll delay={0.1}>
        <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#442a22]">
          {selectedSeries === 'all' ? 'Todos los Sermones' : `Serie: ${selectedSeries}`}
          <span className="text-xs font-sans font-normal text-[#75584d] ml-2">
            ({filteredSermons.length} disponibles)
          </span>
        </h3>

        {filteredSermons.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl bg-[#faf2f0] border border-[#e9e1df]">
            <BookOpen className="w-8 h-8 text-[#75584d] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-[#1e1b1a]">No se encontraron sermones</p>
            <p className="text-xs text-[#504441] mt-1">Prueba cambiando el término de búsqueda o el filtro de serie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => {
              const isFav = favorites.includes(sermon.id);
              return (
                <div
                  key={sermon.id}
                  className="rounded-2xl bg-[#faf2f0] border border-[#e9e1df] overflow-hidden flex flex-col justify-between group hover:border-[#442a22]/40 transition-all ambient-shadow-hover"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-[#442a22]">
                      <img
                        src={sermon.imageUrl}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      
                      <button
                        onClick={() => onOpenSermonModal(sermon)}
                        className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity"
                        aria-label={`Reproducir ${sermon.title}`}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#fff8f6] text-[#442a22] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5 fill-current" />
                        </div>
                      </button>

                      {/* Like and Save Badges */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(sermon);
                          }}
                          className="px-2.5 py-1.5 rounded-full bg-black/40 text-[#fff8f6] hover:bg-black/60 backdrop-blur-sm transition-colors flex items-center justify-center"
                          aria-label="Guardar a favoritos"
                          title="Guardar sermón"
                        >
                          <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current text-[#D4AF37]' : ''}`} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(sermon);
                          }}
                          className="px-2.5 py-1.5 rounded-full bg-black/40 text-[#fff8f6] hover:bg-black/60 backdrop-blur-sm transition-colors flex items-center gap-1"
                          aria-label="Me gusta"
                          title="Me gusta"
                        >
                          <Heart className={`w-4 h-4 ${likedIds.includes(sermon.id) ? 'fill-current text-[#D4AF37]' : ''}`} />
                          <span className="text-xs font-semibold">{sermon.likesCount || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        <span>{sermon.series}</span>
                        <span>{sermon.year}</span>
                      </div>

                      <h4 className="font-serif text-xl font-bold text-[#442a22] group-hover:text-[#5d4037] transition-colors">
                        {sermon.title}
                      </h4>

                      {sermon.passage && (
                        <div className="flex items-center gap-1.5 text-xs text-[#75584d] font-semibold">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{sermon.passage}</span>
                        </div>
                      )}

                      <p className="text-xs text-[#504441] line-clamp-2 leading-relaxed">
                        {sermon.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 pt-0 border-t border-[#e9e1df] mt-4 flex items-center justify-between text-xs text-[#75584d]">
                    <span className="font-medium">{sermon.pastor}</span>
                    <button
                      onClick={() => onShare(sermon.title)}
                      className="p-1.5 rounded-full hover:bg-[#efe6e4] text-[#504441] transition-colors"
                      aria-label="Compartir sermón"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </RevealOnScroll>

    </motion.div>
  );
};
