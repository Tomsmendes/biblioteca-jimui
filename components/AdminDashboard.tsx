
import React, { useState } from 'react';
import { Book, Category } from '../types';
import { db } from '../services/db';
import { ICONS } from '../constants';

interface AdminDashboardProps {
  books: Book[];
  categories: Category[];
  onUpdate: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ books, categories, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'books' | 'categories'>('books');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  const [newBook, setNewBook] = useState<Partial<Book>>({
    title: '',
    author: '',
    category: categories[0]?.name || '',
    summary: '',
    coverUrl: `https://picsum.photos/seed/${Math.random()}/400/600`,
    pdfUrl: 'https://archive.org',
  });

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    const bookToAdd: Book = {
      id: Date.now().toString(),
      title: newBook.title,
      author: newBook.author,
      category: newBook.category || 'Geral',
      summary: newBook.summary || '',
      coverUrl: newBook.coverUrl || '',
      pdfUrl: newBook.pdfUrl,
      createdAt: Date.now(),
    };

    await db.saveBook(bookToAdd);
    setIsAddingBook(false);
    onUpdate();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    await db.saveCategory(newCatName);
    setNewCatName('');
    setIsAddingCategory(false);
    onUpdate();
  };

  const deleteBook = async (id: string) => {
    if (confirm('Deseja realmente remover este livro?')) {
      await db.deleteBook(id);
      onUpdate();
    }
  };

  const deleteCategory = async (id: string) => {
    if (confirm('Deseja remover esta categoria?')) {
      await db.deleteCategory(id);
      onUpdate();
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-top duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Gestão Cultura</h2>
          <p className="text-gray-400 font-medium">Controle total da Biblioteca JIMUI</p>
        </div>
        <button 
          onClick={() => activeTab === 'books' ? setIsAddingBook(true) : setIsAddingCategory(true)}
          className="bg-[#0F9D58] text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all text-sm"
        >
          <ICONS.Plus />
          {activeTab === 'books' ? 'NOVO LIVRO' : 'NOVA CATEGORIA'}
        </button>
      </div>

      <div className="flex gap-6 mb-8 border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('books')}
          className={`pb-4 px-2 font-black transition-all text-xs tracking-widest ${activeTab === 'books' ? 'text-[#0F9D58] border-b-2 border-[#0F9D58]' : 'text-gray-300 hover:text-gray-400'}`}
        >
          LIVROS ({books.length})
        </button>
        <button 
          onClick={() => setActiveTab('categories')}
          className={`pb-4 px-2 font-black transition-all text-xs tracking-widest ${activeTab === 'categories' ? 'text-[#0F9D58] border-b-2 border-[#0F9D58]' : 'text-gray-300 hover:text-gray-400'}`}
        >
          CATEGORIAS ({categories.length})
        </button>
      </div>

      {activeTab === 'books' ? (
        <div className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Informações</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={book.coverUrl} className="w-10 h-14 object-cover rounded-xl shadow-sm" alt="" />
                        <div>
                          <p className="font-black text-gray-800 line-clamp-1">{book.title}</p>
                          <p className="text-xs text-gray-400 font-bold">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-black uppercase">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => deleteBook(book.id)} className="p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <span className="font-black text-gray-800 text-lg">{cat.name}</span>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{books.filter(b => b.category === cat.name).length} Livros</p>
              </div>
              <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-200 hover:text-red-500 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Book Form Modal */}
      {isAddingBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black mb-8 text-gray-900 tracking-tight">Cadastrar Novo Livro</h3>
            <form onSubmit={handleAddBook} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Título do Livro</label>
                  <input required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Autor</label>
                  <input required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Categoria</label>
                  <select className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none font-bold text-sm" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})}>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">URL do PDF (Simulação)</label>
                <input className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none" value={newBook.pdfUrl} onChange={e => setNewBook({...newBook, pdfUrl: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Breve Resumo</label>
                <textarea rows={3} className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none resize-none" value={newBook.summary} onChange={e => setNewBook({...newBook, summary: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddingBook(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 transition-colors">CANCELAR</button>
                <button type="submit" className="flex-1 bg-[#0F9D58] text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all">SALVAR LIVRO</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black mb-6 text-gray-900 tracking-tight">Nova Categoria</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-2">Nome da Categoria</label>
                <input autoFocus required className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#0F9D58] outline-none" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsAddingCategory(false)} className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 transition-colors">CANCELAR</button>
                <button type="submit" className="flex-1 bg-[#0F9D58] text-white py-4 rounded-2xl font-black shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all">CRIAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
