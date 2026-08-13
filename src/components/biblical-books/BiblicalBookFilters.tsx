import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { BiblicalBookFilters as FiltersType } from '../../types';

interface BiblicalBookFiltersProps {
  filters: FiltersType;
  onFilterChange: (filters: FiltersType) => void;
  availableYears: number[];
}

export const BiblicalBookFilters: React.FC<BiblicalBookFiltersProps> = ({ 
  filters, 
  onFilterChange,
  availableYears 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateFilter = (key: keyof FiltersType, value: any) => {
    onFilterChange({ ...filters, [key]: value === '' ? undefined : value });
  };

  const categories = ['Todos', 'Niños', 'Adolescentes', 'Jóvenes', 'Adultos', 'Maestros'];
  const quarters = [1, 2, 3, 4];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#e9e1df] mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#a8958e]" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] placeholder-[#a8958e] focus:outline-none focus:ring-2 focus:ring-[#442a22] focus:border-transparent transition-shadow"
            placeholder="Buscar libros por título o autor..."
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex gap-3">
          <select
            className="px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] font-medium focus:outline-none focus:ring-2 focus:ring-[#442a22]"
            value={filters.category || 'Todos'}
            onChange={(e) => updateFilter('category', e.target.value === 'Todos' ? undefined : e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'Todos' ? 'Categoría ▼' : cat}</option>
            ))}
          </select>
          
          <select
            className="px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] font-medium focus:outline-none focus:ring-2 focus:ring-[#442a22]"
            value={filters.year || ''}
            onChange={(e) => updateFilter('year', e.target.value === '' ? undefined : parseInt(e.target.value))}
          >
            <option value="">Año ▼</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Mobile Filter Toggle */}
        <button 
          className="md:hidden flex items-center justify-center gap-2 py-3 px-4 bg-[#f5ebe9] text-[#442a22] rounded-xl font-semibold border border-[#e9e1df]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          Filtros
        </button>
      </div>

      {/* Mobile Filters Expanded */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[#e9e1df] flex flex-col gap-3 md:hidden">
          <select
            className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] font-medium"
            value={filters.category || 'Todos'}
            onChange={(e) => updateFilter('category', e.target.value === 'Todos' ? undefined : e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'Todos' ? 'Todas las categorías' : cat}</option>
            ))}
          </select>

          <select
            className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] font-medium"
            value={filters.year || ''}
            onChange={(e) => updateFilter('year', e.target.value === '' ? undefined : parseInt(e.target.value))}
          >
            <option value="">Todos los años</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <select
            className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] font-medium"
            value={filters.quarter || ''}
            onChange={(e) => updateFilter('quarter', e.target.value === '' ? undefined : parseInt(e.target.value))}
          >
            <option value="">Todos los trimestres</option>
            {quarters.map(q => (
              <option key={q} value={q}>Trimestre {q}</option>
            ))}
          </select>
        </div>
      )}

      {/* Categories Pills (Desktop & Tablet) */}
      <div className="hidden md:flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#e9e1df]">
        <span className="text-sm font-semibold text-[#75584d] mr-2">Público:</span>
        <button
          onClick={() => updateFilter('audience', undefined)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!filters.audience ? 'bg-[#442a22] text-white shadow-md' : 'bg-[#f5ebe9] text-[#75584d] hover:bg-[#e9e1df]'}`}
        >
          Todos
        </button>
        {['Niños', 'Adolescentes', 'Jóvenes', 'Adultos'].map(aud => (
          <button
            key={aud}
            onClick={() => updateFilter('audience', aud)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filters.audience === aud ? 'bg-[#442a22] text-white shadow-md' : 'bg-[#f5ebe9] text-[#75584d] hover:bg-[#e9e1df]'}`}
          >
            {aud}
          </button>
        ))}
      </div>
    </div>
  );
};
