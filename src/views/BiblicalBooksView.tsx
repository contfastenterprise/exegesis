import React, { useState, useEffect, useMemo } from 'react';
import { BiblicalBook, BiblicalBookFilters as FiltersType } from '../types';
import { DataService } from '../lib/supabase';
import { BiblicalBookCard } from '../components/biblical-books/BiblicalBookCard';
import { BiblicalBookDetailsModal } from '../components/biblical-books/BiblicalBookDetailsModal';
import { BiblicalBookFilters } from '../components/biblical-books/BiblicalBookFilters';
import { BiblicalBookGridSkeleton } from '../components/biblical-books/BiblicalBookGridSkeleton';
import { BiblicalBookEmpty } from '../components/biblical-books/BiblicalBookEmpty';
import { BookOpen } from 'lucide-react';

interface BiblicalBooksViewProps {
  onSuccessToast: (msg: string) => void;
  onErrorToast: (msg: string) => void;
}

export const BiblicalBooksView: React.FC<BiblicalBooksViewProps> = ({ onSuccessToast, onErrorToast }) => {
  const [books, setBooks] = useState<BiblicalBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<FiltersType>({});
  const [selectedBook, setSelectedBook] = useState<BiblicalBook | null>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch only active books
      const fetchedBooks = await DataService.getBiblicalBooks(false);
      setBooks(fetchedBooks);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('No pudimos cargar los libros. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const availableYears = useMemo(() => {
    const years = new Set(books.map(b => b.year).filter((y): y is number => y !== undefined && y !== null));
    return Array.from(years).sort((a, b) => b - a); // Descending
  }, [books]);

  // Debounced search logic for smooth filtering
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.search]);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Text Search (title, description, author)
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author?.toLowerCase().includes(query);
        const matchesDesc = book.description?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesDesc) return false;
      }

      // Exact matches
      if (filters.category && book.category !== filters.category) return false;
      if (filters.audience && book.audience !== filters.audience) return false;
      if (filters.year && book.year !== filters.year) return false;
      if (filters.quarter && book.quarter !== filters.quarter) return false;

      return true;
    });
  }, [books, debouncedSearch, filters.category, filters.audience, filters.year, filters.quarter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-[#442a22]/5 rounded-2xl mb-4">
          <BookOpen className="w-8 h-8 text-[#442a22]" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1e1b1a] mb-4">
          Libros de Escuela Bíblica
        </h1>
        <p className="text-[#75584d] text-lg max-w-2xl mx-auto">
          Materiales para el estudio y enseñanza de la Biblia. Explora nuestra biblioteca digital y descarga los recursos que necesitas.
        </p>
      </div>

      <BiblicalBookFilters 
        filters={filters} 
        onFilterChange={setFilters} 
        availableYears={availableYears} 
      />

      {/* Main Content Area */}
      {isLoading ? (
        <BiblicalBookGridSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-rose-50 rounded-3xl border border-rose-100">
          <p className="text-rose-700 font-semibold mb-4 text-lg">{error}</p>
          <button 
            onClick={loadBooks}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredBooks.map((book) => (
            <BiblicalBookCard 
              key={book.id} 
              book={book} 
              onClick={setSelectedBook} 
            />
          ))}
        </div>
      ) : (
        <BiblicalBookEmpty 
          message={books.length === 0 
            ? "Actualmente no hay materiales de Escuela Bíblica disponibles para descargar." 
            : "No se encontraron libros que coincidan con los filtros seleccionados."}
        />
      )}

      {/* Detail Modal */}
      <BiblicalBookDetailsModal 
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onSuccessToast={onSuccessToast}
        onErrorToast={onErrorToast}
      />
    </div>
  );
};
