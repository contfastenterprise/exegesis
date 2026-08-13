import React from 'react';
import { BiblicalBook } from '../../types';
import { BookOpen, Calendar, Layers } from 'lucide-react';

interface BiblicalBookCardProps {
  book: BiblicalBook;
  onClick: (book: BiblicalBook) => void;
}

export const BiblicalBookCard: React.FC<BiblicalBookCardProps> = ({ book, onClick }) => {
  return (
    <div 
      className="group flex flex-col bg-white rounded-2xl border border-[#e9e1df] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
      onClick={() => onClick(book)}
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full bg-[#f8f5f4] overflow-hidden border-b border-[#e9e1df]">
        {book.coverUrl ? (
          <img 
            src={book.coverUrl} 
            alt={`Portada de ${book.title}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#75584d] bg-[#fdfaf9]">
            <BookOpen className="w-16 h-16 opacity-30 mb-4" />
            <span className="text-sm font-medium opacity-50 px-4 text-center">{book.title}</span>
          </div>
        )}
        
        {/* Category Badge overlay */}
        {book.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#442a22] text-[#fff8f6] text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
              {book.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-serif text-lg font-bold text-[#1e1b1a] mb-1 line-clamp-2 leading-tight group-hover:text-[#D4AF37] transition-colors">
          {book.title}
        </h3>
        
        {book.audience && (
          <p className="text-sm font-medium text-[#75584d] mb-3">
            {book.audience}
          </p>
        )}

        <div className="mt-auto space-y-1.5">
          {book.lessonCount && (
            <div className="flex items-center text-xs text-[#504441]">
              <Layers className="w-3.5 h-3.5 mr-1.5 opacity-70" />
              <span>{book.lessonCount} lecciones</span>
            </div>
          )}
          
          {(book.quarter || book.year) && (
            <div className="flex items-center text-xs text-[#504441]">
              <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
              <span>
                {book.quarter ? `Trimestre ${book.quarter}` : ''} 
                {book.quarter && book.year ? ' · ' : ''}
                {book.year ? book.year : ''}
              </span>
            </div>
          )}
        </div>

        <button 
          className="mt-4 w-full py-2 px-4 rounded-xl border border-[#e9e1df] text-sm font-semibold text-[#442a22] bg-[#fdfaf9] group-hover:bg-[#442a22] group-hover:text-[#fff8f6] transition-colors"
          aria-label={`Ver detalles de ${book.title}`}
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};
