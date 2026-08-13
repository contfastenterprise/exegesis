import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BiblicalBook } from '../../types';
import { X, Download, Eye, BookOpen, Calendar, Layers, User, Tag, HardDrive } from 'lucide-react';
import { DataService } from '../../lib/supabase';

interface BiblicalBookDetailsModalProps {
  book: BiblicalBook | null;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export const BiblicalBookDetailsModal: React.FC<BiblicalBookDetailsModalProps> = ({ 
  book, 
  onClose,
  onSuccessToast,
  onErrorToast
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!book) return null;

  const handleDownload = async () => {
    if (!book.fileUrl) return;
    setIsDownloading(true);
    
    try {
      // In this setup, fileUrl is likely the path in the bucket or a public URL.
      // If it's a path like "documents/...", we need the download URL or public URL.
      let urlToDownload = book.fileUrl;
      
      // We assume fileUrl stored in DB is the full public URL for simplicity in this SPA, 
      // as handled by DataService.uploadBiblicalBookMedia
      const response = await fetch(urlToDownload);
      
      if (!response.ok) throw new Error('No se pudo descargar el archivo.');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // Define a nice filename
      const extension = book.fileType?.split('/').pop() || 'pdf';
      a.download = `${book.slug}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      if (onSuccessToast) onSuccessToast('Descarga completada');
    } catch (err) {
      console.error(err);
      if (onErrorToast) onErrorToast('Ocurrió un error al descargar el archivo.');
    } finally {
      setIsDownloading(false);
    }
  };

  const hasPreview = book.fileType?.includes('pdf') || book.fileUrl?.endsWith('.pdf');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#fff8f6] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Close button (mobile absolute) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full text-[#442a22] hover:bg-white hover:text-rose-600 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Cover */}
          <div className="md:w-2/5 bg-[#f5ebe9] flex-shrink-0 relative overflow-hidden flex flex-col justify-center items-center p-6 md:p-8">
            {/* Background Blur */}
            {book.coverUrl && (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 blur-xl scale-110"
                style={{ backgroundImage: `url(${book.coverUrl})` }}
              />
            )}
            
            <div className="relative z-10 w-full max-w-[240px] aspect-[3/4] bg-white rounded-xl shadow-xl overflow-hidden ring-1 ring-black/5">
              {book.coverUrl ? (
                <img 
                  src={book.coverUrl} 
                  alt={`Portada de ${book.title}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#75584d] bg-[#fdfaf9]">
                  <BookOpen className="w-20 h-20 opacity-20 mb-4" />
                </div>
              )}
            </div>
            
            {book.category && (
              <div className="relative z-10 mt-6 bg-[#442a22] text-[#fff8f6] text-sm font-semibold px-4 py-1.5 rounded-full shadow-md">
                {book.category}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="md:w-3/5 flex flex-col h-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 md:p-8 flex-grow">
              
              <h2 className="font-serif text-3xl font-bold text-[#1e1b1a] mb-2 pr-8 leading-tight">
                {book.title}
              </h2>
              
              {book.audience && (
                <p className="text-[#D4AF37] font-semibold text-lg mb-6">
                  {book.audience} {book.ageRange ? `(${book.ageRange})` : ''}
                </p>
              )}

              {book.description && (
                <div className="prose prose-[#504441] max-w-none mb-8">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-white p-5 rounded-2xl border border-[#e9e1df] shadow-sm">
                {book.author && (
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-[#442a22] mr-3 mt-0.5 opacity-70" />
                    <div>
                      <p className="text-xs text-[#75584d] font-medium uppercase tracking-wider">Autor</p>
                      <p className="text-[#1e1b1a] font-semibold">{book.author}</p>
                    </div>
                  </div>
                )}
                
                {book.publisher && (
                  <div className="flex items-start">
                    <BookOpen className="w-5 h-5 text-[#442a22] mr-3 mt-0.5 opacity-70" />
                    <div>
                      <p className="text-xs text-[#75584d] font-medium uppercase tracking-wider">Editorial</p>
                      <p className="text-[#1e1b1a] font-semibold">{book.publisher}</p>
                    </div>
                  </div>
                )}

                {(book.quarter || book.year) && (
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-[#442a22] mr-3 mt-0.5 opacity-70" />
                    <div>
                      <p className="text-xs text-[#75584d] font-medium uppercase tracking-wider">Período</p>
                      <p className="text-[#1e1b1a] font-semibold">
                        {book.quarter ? `Trimestre ${book.quarter}` : ''} 
                        {book.quarter && book.year ? ' - ' : ''}
                        {book.year ? book.year : ''}
                      </p>
                    </div>
                  </div>
                )}

                {book.lessonCount && (
                  <div className="flex items-start">
                    <Layers className="w-5 h-5 text-[#442a22] mr-3 mt-0.5 opacity-70" />
                    <div>
                      <p className="text-xs text-[#75584d] font-medium uppercase tracking-wider">Lecciones</p>
                      <p className="text-[#1e1b1a] font-semibold">{book.lessonCount}</p>
                    </div>
                  </div>
                )}
                
                {book.fileSize && (
                  <div className="flex items-start">
                    <HardDrive className="w-5 h-5 text-[#442a22] mr-3 mt-0.5 opacity-70" />
                    <div>
                      <p className="text-xs text-[#75584d] font-medium uppercase tracking-wider">Tamaño</p>
                      <p className="text-[#1e1b1a] font-semibold">{(book.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Footer */}
            {book.fileUrl && (
              <div className="p-6 md:p-8 bg-white border-t border-[#e9e1df] flex flex-col sm:flex-row gap-3">
                {hasPreview && (
                  <a 
                    href={book.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 px-4 rounded-xl border-2 border-[#442a22] text-[#442a22] font-semibold flex items-center justify-center gap-2 hover:bg-[#442a22]/5 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Vista previa</span>
                  </a>
                )}
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-[#442a22] text-[#fff8f6] font-bold flex items-center justify-center gap-2 hover:bg-[#321f19] hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  <span>{isDownloading ? 'Descargando...' : 'Descargar libro'}</span>
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
