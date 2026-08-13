import React, { useState, useEffect, useRef } from 'react';
import { BiblicalBook, CreateBiblicalBookInput, UpdateBiblicalBookInput } from '../../types';
import { DataService } from '../../lib/supabase';
import { Plus, Edit, Trash2, BookOpen, ToggleLeft, ToggleRight, Check, X, Upload } from 'lucide-react';

interface BiblicalBooksAdminProps {
  onSuccessToast: (msg: string) => void;
}

export const BiblicalBooksAdmin: React.FC<BiblicalBooksAdminProps> = ({ onSuccessToast }) => {
  const [books, setBooks] = useState<BiblicalBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [category, setCategory] = useState('Todos');
  const [audience, setAudience] = useState('Todos');
  const [ageRange, setAgeRange] = useState('');
  const [quarter, setQuarter] = useState<number | ''>('');
  const [year, setYear] = useState<number | ''>(new Date().getFullYear());
  const [lessonCount, setLessonCount] = useState<number | ''>('');
  const [coverUrl, setCoverUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setIsLoading(true);
    const data = await DataService.getBiblicalBooks(true); // true = include inactive
    setBooks(data);
    setIsLoading(false);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle('');
    setDescription('');
    setAuthor('');
    setPublisher('');
    setCategory('Todos');
    setAudience('Todos');
    setAgeRange('');
    setQuarter('');
    setYear(new Date().getFullYear());
    setLessonCount('');
    setCoverUrl('');
    setFileUrl('');
    setIsActive(true);
    setSortOrder(0);
  };

  const handleEdit = (book: BiblicalBook) => {
    setIsEditing(true);
    setEditingId(book.id);
    setTitle(book.title);
    setDescription(book.description || '');
    setAuthor(book.author || '');
    setPublisher(book.publisher || '');
    setCategory(book.category || '');
    setAudience(book.audience || '');
    setAgeRange(book.ageRange || '');
    setQuarter(book.quarter || '');
    setYear(book.year || '');
    setLessonCount(book.lessonCount || '');
    setCoverUrl(book.coverUrl || '');
    setFileUrl(book.fileUrl || '');
    setIsActive(book.isActive);
    setSortOrder(book.sortOrder);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el libro "${name}"? Esta acción no se puede deshacer.`)) {
      await DataService.deleteBiblicalBook(id);
      setBooks(books.filter(b => b.id !== id));
      onSuccessToast('Libro eliminado correctamente.');
    }
  };

  const handleToggleStatus = async (book: BiblicalBook) => {
    const updatedBook = await DataService.updateBiblicalBook(book.id, { isActive: !book.isActive });
    if (updatedBook) {
      setBooks(books.map(b => b.id === book.id ? updatedBook : b));
      onSuccessToast(`El libro ha sido ${!book.isActive ? 'activado' : 'desactivado'}.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const bookData = {
      title,
      description,
      author,
      publisher,
      category: category === 'Todos' ? '' : category,
      audience: audience === 'Todos' ? '' : audience,
      ageRange,
      quarter: quarter === '' ? undefined : Number(quarter),
      year: year === '' ? undefined : Number(year),
      lessonCount: lessonCount === '' ? undefined : Number(lessonCount),
      coverUrl,
      fileUrl,
      isActive,
      sortOrder
    };

    if (isEditing && editingId) {
      const updated = await DataService.updateBiblicalBook(editingId, bookData);
      if (updated) {
        setBooks(books.map(b => b.id === editingId ? updated : b));
        onSuccessToast('Libro actualizado exitosamente.');
        resetForm();
      }
    } else {
      const newBook = await DataService.addBiblicalBook(bookData);
      if (newBook) {
        setBooks([newBook, ...books]);
        onSuccessToast('Libro creado exitosamente.');
        resetForm();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'covers' | 'documents') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'covers') setIsUploadingCover(true);
    else setIsUploadingFile(true);

    const result = await DataService.uploadBiblicalBookMedia(file, type);
    
    if (result) {
      if (type === 'covers') setCoverUrl(result.url);
      else setFileUrl(result.url);
      onSuccessToast('Archivo subido correctamente.');
    } else {
      alert('Hubo un error al subir el archivo.');
    }

    if (type === 'covers') setIsUploadingCover(false);
    else setIsUploadingFile(false);
  };

  return (
    <div className="space-y-8">
      {/* Form Section */}
      <div className="rounded-3xl bg-[#faf2f0] border border-[#e9e1df] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#442a22] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D4AF37]" />
            {isEditing ? 'Editar Libro' : 'Agregar Nuevo Libro'}
          </h3>
          {isEditing && (
            <button 
              onClick={resetForm}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800"
            >
              Cancelar Edición
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Título *</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]" placeholder="Ej: Principios de la Fe" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Descripción *</label>
                <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Autor</label>
                  <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Editorial</label>
                  <input type="text" value={publisher} onChange={e => setPublisher(e.target.value)} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Categoría</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]">
                    <option value="Todos">Ninguna</option>
                    <option value="Niños">Niños</option>
                    <option value="Adolescentes">Adolescentes</option>
                    <option value="Jóvenes">Jóvenes</option>
                    <option value="Adultos">Adultos</option>
                    <option value="Maestros">Maestros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Público (Audience)</label>
                  <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]">
                    <option value="Todos">Todos</option>
                    <option value="Niños">Niños</option>
                    <option value="Adolescentes">Adolescentes</option>
                    <option value="Jóvenes">Jóvenes</option>
                    <option value="Adultos">Adultos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Año</label>
                  <input type="number" value={year} onChange={e => setYear(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Trimestre</label>
                  <input type="number" value={quarter} min={1} max={4} onChange={e => setQuarter(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Lecciones</label>
                  <input type="number" value={lessonCount} onChange={e => setLessonCount(e.target.value ? Number(e.target.value) : '')} className="w-full px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a] focus:ring-2 focus:ring-[#442a22]" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Portada (URL o Archivo)</label>
                <div className="flex gap-2">
                  <input type="text" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} className="flex-1 px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a]" placeholder="https://..." />
                  <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'covers')} />
                  <button type="button" onClick={() => coverInputRef.current?.click()} className="px-4 py-2 bg-[#efe6e4] text-[#442a22] rounded-xl font-bold flex items-center justify-center min-w-[100px]">
                    {isUploadingCover ? 'Subiendo...' : <Upload className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-[#1e1b1a] mb-1">Documento PDF (URL o Archivo)</label>
                <div className="flex gap-2">
                  <input type="text" value={fileUrl} onChange={e => setFileUrl(e.target.value)} className="flex-1 px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-[#1e1b1a]" placeholder="https://..." />
                  <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={e => handleFileUpload(e, 'documents')} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-[#efe6e4] text-[#442a22] rounded-xl font-bold flex items-center justify-center min-w-[100px]">
                    {isUploadingFile ? 'Subiendo...' : <Upload className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-5 h-5 text-[#442a22] rounded border-[#e9e1df] focus:ring-[#442a22]" />
                  <span className="font-semibold text-[#504441]">Libro Activo (Público)</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#1e1b1a] uppercase">Orden:</span>
                  <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} className="w-20 px-3 py-2 bg-[#fff8f6] border border-[#e9e1df] rounded-xl text-xs text-center" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#75584d] uppercase">* Campos obligatorios</span>
            <button type="submit" className="px-8 py-3 bg-[#442a22] text-[#fff8f6] font-bold rounded-xl shadow-md hover:bg-[#321f19] flex items-center gap-2">
              {isEditing ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {isEditing ? 'Guardar Cambios' : 'Crear Libro'}
            </button>
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#e9e1df] overflow-hidden">
        <div className="p-4 bg-[#fdfaf9] border-b border-[#e9e1df]">
          <h3 className="font-serif text-xl font-bold text-[#442a22]">Catálogo de Libros</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8f5f4] border-b border-[#e9e1df] text-[#75584d] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-4">Portada</th>
                <th className="p-4">Libro</th>
                <th className="p-4">Clasificación</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e1df]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#75584d]">Cargando libros...</td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#75584d]">No hay libros registrados.</td>
                </tr>
              ) : books.map((book) => (
                <tr key={book.id} className="hover:bg-[#fdfaf9]">
                  <td className="p-4">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} className="w-12 h-16 object-cover rounded shadow-sm" alt="portada" />
                    ) : (
                      <div className="w-12 h-16 bg-[#e9e1df] rounded flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-[#a8958e]" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-[#1e1b1a]">{book.title}</p>
                    <p className="text-xs text-[#75584d] truncate max-w-[200px]">{book.author || 'Sin autor'}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-[#504441]">{book.category || '-'}</p>
                    <p className="text-xs text-[#75584d]">
                      {book.year ? book.year : ''} {book.quarter ? `T${book.quarter}` : ''}
                    </p>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleToggleStatus(book)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        book.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-[#e9e1df] text-[#75584d]'
                      }`}
                    >
                      {book.isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {book.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(book)}
                        className="p-2 rounded-lg bg-[#f5ebe9] text-[#442a22] hover:bg-[#e9e1df]"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(book.id, book.title)}
                        className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
