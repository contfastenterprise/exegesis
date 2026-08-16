import React, { useState } from 'react';
import { Devotional } from '../types';
import { Play, Sun, Calendar, User } from 'lucide-react';
import { getYouTubeThumbnailUrl, extractYouTubeVideoId } from '../lib/youtube';

interface DevotionalsViewProps {
  devotionals: Devotional[];
}

export const DevotionalsView: React.FC<DevotionalsViewProps> = ({ devotionals }) => {
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="border-b border-[#e9e1df] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
          <Sun className="w-4 h-4" /> Inspiración Diaria
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#442a22] mt-1">
          Devocionales
        </h1>
        <p className="text-sm text-[#504441] mt-2 max-w-2xl leading-relaxed">
          Encuentra palabras de aliento, estudios bíblicos cortos y reflexiones para fortalecer tu caminar con Dios cada día.
        </p>
      </div>

      {devotionals.length === 0 ? (
        <div className="text-center py-20 bg-[#faf2f0] rounded-3xl border border-dashed border-[#e9e1df]">
          <Sun className="w-16 h-16 mx-auto text-[#D4AF37]/50 mb-4" />
          <h3 className="font-serif text-xl font-bold text-[#442a22]">Pronto más devocionales</h3>
          <p className="text-[#75584d] mt-2">Nuestros pastores están preparando nuevas reflexiones.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devotionals.map((devo) => (
            <div 
              key={devo.id} 
              className="bg-white rounded-3xl overflow-hidden border border-[#e9e1df] shadow-sm hover:shadow-lg transition-all flex flex-col cursor-pointer group"
              onClick={() => setSelectedDevotional(devo)}
            >
              {/* Media Preview */}
              {devo.type === 'youtube' && devo.youtubeUrl && (
                <div className="relative aspect-video w-full bg-black/5 overflow-hidden">
                  <img 
                    src={getYouTubeThumbnailUrl(extractYouTubeVideoId(devo.youtubeUrl))} 
                    alt={devo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/90 text-white flex items-center justify-center backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-1 fill-current" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase">
                    Video
                  </div>
                </div>
              )}

              {devo.type === 'image' && devo.mediaUrl && (
                <div className="relative aspect-video w-full bg-black/5 overflow-hidden">
                  <img 
                    src={devo.mediaUrl} 
                    alt={devo.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-[#442a22]/80 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase flex items-center gap-1">
                    Imagen
                  </div>
                </div>
              )}

              {devo.type === 'video' && devo.mediaUrl && (
                <div className="relative aspect-video w-full bg-black/90 overflow-hidden flex items-center justify-center">
                   <video src={devo.mediaUrl} className="w-full h-full object-cover opacity-50 pointer-events-none" />
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#D4AF37]/90 text-white flex items-center justify-center backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-1 fill-current" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase">
                    Clip
                  </div>
                </div>
              )}

              {devo.type === 'text' && (
                <div className="relative h-32 w-full bg-gradient-to-br from-[#faf2f0] to-[#efe6e4] flex items-center justify-center p-6 text-center border-b border-[#e9e1df]">
                  <Sun className="w-12 h-12 text-[#D4AF37]/40 absolute right-4 bottom-4" />
                  <p className="font-serif italic text-[#442a22]/80 text-sm line-clamp-3">
                    "{devo.content}"
                  </p>
                  <div className="absolute top-3 left-3 px-2 py-1 bg-[#fff8f6]/80 backdrop-blur-md rounded-md text-[10px] font-bold text-[#442a22] uppercase border border-[#e9e1df]">
                    Lectura
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#442a22] group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                    {devo.title}
                  </h3>
                  {devo.type !== 'text' && devo.content && (
                    <p className="text-sm text-[#75584d] mt-2 line-clamp-2">
                      {devo.content}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#e9e1df] text-xs text-[#75584d]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{devo.date}</span>
                  </div>
                  {devo.author && (
                    <div className="flex items-center gap-1.5 font-semibold">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[100px]">{devo.author}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Devotional Reader/Player Modal */}
      {selectedDevotional && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedDevotional(null)} />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#e9e1df] bg-[#faf2f0]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                <Sun className="w-4 h-4" /> Devocional
              </span>
              <button 
                onClick={() => setSelectedDevotional(null)}
                className="p-2 bg-white rounded-full text-[#75584d] hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto">
              {/* Media Player */}
              {selectedDevotional.type === 'youtube' && selectedDevotional.youtubeUrl && (
                <div className="w-full aspect-video bg-black">
                  <iframe 
                    src={`https://www.youtube.com/embed/${extractYouTubeVideoId(selectedDevotional.youtubeUrl)}?autoplay=1`}
                    className="w-full h-full"
                    allowFullScreen
                    allow="autoplay"
                  />
                </div>
              )}
              {selectedDevotional.type === 'video' && selectedDevotional.mediaUrl && (
                <div className="w-full bg-black flex items-center justify-center">
                  <video 
                    src={selectedDevotional.mediaUrl} 
                    controls 
                    autoPlay 
                    className="max-h-[60vh] w-full" 
                  />
                </div>
              )}
              {selectedDevotional.type === 'image' && selectedDevotional.mediaUrl && (
                <img 
                  src={selectedDevotional.mediaUrl} 
                  alt={selectedDevotional.title}
                  className="w-full object-cover max-h-[60vh]"
                />
              )}

              {/* Content body */}
              <div className="p-6 md:p-8 space-y-6 bg-white">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#442a22]">
                    {selectedDevotional.title}
                  </h2>
                  <div className="flex items-center gap-4 mt-3 text-sm text-[#75584d] font-medium border-b border-[#e9e1df] pb-4">
                    <span className="flex items-center gap-1.5 bg-[#faf2f0] px-3 py-1 rounded-full"><Calendar className="w-4 h-4"/> {selectedDevotional.date}</span>
                    {selectedDevotional.author && (
                      <span className="flex items-center gap-1.5 bg-[#faf2f0] px-3 py-1 rounded-full"><User className="w-4 h-4"/> {selectedDevotional.author}</span>
                    )}
                  </div>
                </div>

                {selectedDevotional.content && (
                  <div className="prose prose-[#504441] max-w-none text-[15px] md:text-base leading-relaxed whitespace-pre-wrap">
                    {selectedDevotional.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
