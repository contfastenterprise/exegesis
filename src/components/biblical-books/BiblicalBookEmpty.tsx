import React from 'react';
import { BookMarked } from 'lucide-react';

interface BiblicalBookEmptyProps {
  message?: string;
}

export const BiblicalBookEmpty: React.FC<BiblicalBookEmptyProps> = ({ 
  message = 'Actualmente no hay materiales de Escuela Bíblica disponibles para descargar.' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-[#e9e1df] shadow-sm">
      <div className="w-20 h-20 bg-[#f8f5f4] rounded-full flex items-center justify-center mb-6">
        <BookMarked className="w-10 h-10 text-[#442a22] opacity-70" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-[#1e1b1a] mb-3">
        No hay libros disponibles
      </h3>
      <p className="text-[#75584d] max-w-md mx-auto text-lg">
        {message}
      </p>
    </div>
  );
};
