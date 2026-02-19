
import React, { useState, useEffect, useMemo } from 'react';
import { Book, Category, User, UserRole } from './types';
import { db } from './services/db';
import { ICONS, APP_INFO } from './constants';
import BookCard from './components/BookCard';
import BookDetailModal from './components/BookDetailModal';
import AdminDashboard from './components/AdminDashboard';
import AboutView from './components/AboutView';
import AuthView from './components/AuthView';
import HistoryView from './components/HistoryView';
import ReaderView from './components/ReaderView';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [view, setView] = useState<'home' | 'admin' | 'favorites' | 'about' | 'history'>('home');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      await db.init();
      const loadedUser = await db.getCurrentUser();
      const loadedBooks = await db.getBooks();
      const loadedCats = await db.getCategories();
      
      setUser(loadedUser);
      setBooks(loadedBooks);
      setCategories(loadedCats);
      setIsAppReady(true);
    };

    initApp();

    const handleOnline = () => { setIsOnline(true); handleSync(); };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setTimeout(async () => {
      setBooks(await db.getBooks());
      setCategories(await db.getCategories());
      setIsSyncing(false);
    }, 1000);
  };

  const handleLogout = async () => {
    await db.logout();
    setUser(null);
    setView('home');
  };

  const filteredBooks = useMemo(() => {
    let result = books;
    if (view === 'favorites' && user) {
      result = result.filter(b => user.favorites.includes(b.id));
    }
    if (selectedCategory !== 'All' && view === 'home') {
      result = result.filter(b => b.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [books, searchQuery, selectedCategory, view, user]);

  const toggleFavorite = async (bookId: string) => {
    if (!user) return;
    const isFav = user.favorites.includes(bookId);
    const updatedUser = {
      ...user,
      favorites: isFav 
        ? user.favorites.filter(id => id !== bookId)
        : [...user.favorites, bookId]
    };
    setUser(updatedUser);
    await db.updateUser(updatedUser);
  };

  const refreshUserData = async () => {
    const updated = await db.getCurrentUser();
    setUser(updated);
  };

  if (!isAppReady) return null;

  if (!user) {
    return <AuthView onAuthSuccess={setUser} />;
  }

  // Se estiver lendo, mostrar o ReaderView em tela cheia
  if (readingBook) {
    return <ReaderView book={readingBook} onBack={() => setReadingBook(null)} />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-0 bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-green-100">
            <img 
              src="/biblioteca-jimui/logo.jpeg" 
              alt="Logo JIMUA" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-black text-gray-800 tracking-tight">
            Biblioteca <span className="text-[#FF9800]">JIMUI</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400">
            <ICONS.Wifi online={isOnline} />
            {isOnline ? 'SINCRO' : 'OFFLINE'}
          </div>
          <button 
            onClick={() => setView('about')}
            className={`p-2 rounded-xl transition-all ${view === 'about' ? 'bg-green-50 text-[#0F9D58]' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <ICONS.Info />
          </button>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Sair"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {view === 'admin' && user?.role === UserRole.ADMIN ? (
          <AdminDashboard 
            books={books} 
            categories={categories} 
            onUpdate={async () => {
              setBooks(await db.getBooks());
              setCategories(await db.getCategories());
            }} 
          />
        ) : view === 'about' ? (
          <AboutView />
        ) : view === 'history' ? (
          <HistoryView history={user.readingHistory} books={books} onBookClick={setSelectedBook} />
        ) : (
          <>
            <div className="mb-8 space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0F9D58] transition-colors">
                  <ICONS.Search />
                </div>
                <input 
                  type="text" 
                  placeholder="Busque por título, autor ou categoria..."
                  className="w-full pl-12 pr-4 py-4 bg-white border-none shadow-md rounded-2xl focus:ring-2 focus:ring-[#0F9D58] transition-all outline-none text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {view === 'home' && (
                <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide no-scrollbar">
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === 'All' ? 'bg-[#0F9D58] text-white shadow-lg shadow-green-100' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                  >
                    Todos
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat.name ? 'bg-[#0F9D58] text-white shadow-lg shadow-green-100' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  isFavorite={user?.favorites.includes(book.id) || false}
                  isCached={user?.cachedBookIds.includes(book.id) || false}
                  onToggleFavorite={() => toggleFavorite(book.id)}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 flex-1 ${view === 'home' ? 'text-[#0F9D58]' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          <span className="text-[9px] font-black tracking-widest uppercase">Explorar</span>
        </button>
        <button onClick={() => setView('favorites')} className={`flex flex-col items-center gap-1 flex-1 ${view === 'favorites' ? 'text-[#0F9D58]' : 'text-gray-400'}`}>
          <ICONS.Heart filled={view === 'favorites'} />
          <span className="text-[9px] font-black tracking-widest uppercase">Favoritos</span>
        </button>
        <button onClick={() => setView('history')} className={`flex flex-col items-center gap-1 flex-1 ${view === 'history' ? 'text-[#0F9D58]' : 'text-gray-400'}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[9px] font-black tracking-widest uppercase">Lidos</span>
        </button>
        {user?.role === UserRole.ADMIN && (
          <button onClick={() => setView('admin')} className={`flex flex-col items-center gap-1 flex-1 ${view === 'admin' ? 'text-[#0F9D58]' : 'text-gray-400'}`}>
            <ICONS.Admin />
            <span className="text-[9px] font-black tracking-widest uppercase">Painel</span>
          </button>
        )}
      </nav>

      {selectedBook && (
        <BookDetailModal 
          book={selectedBook} 
          onClose={() => setSelectedBook(null)} 
          isFavorite={user?.favorites.includes(selectedBook.id) || false}
          isCached={user?.cachedBookIds.includes(selectedBook.id) || false}
          onToggleFavorite={() => toggleFavorite(selectedBook.id)}
          userId={user.id}
          onRead={(book) => {
            setReadingBook(book);
            setSelectedBook(null);
            refreshUserData();
          }}
          onDownloadComplete={refreshUserData}
        />
      )}
    </div>
  );
};

export default App;
