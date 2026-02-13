
import React from 'react';
import { Book, ReadingHistoryItem } from '../types';

interface HistoryViewProps {
  history: ReadingHistoryItem[];
  books: Book[];
  onBookClick: (book: Book) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ history, books, onBookClick }) => {
  const historyItems = history.map(h => {
    const book = books.find(b => b.id === h.bookId);
    return { ...h, book };
  }).filter(item => item.book !== undefined);

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Histórico de Leitura</h2>
        <p className="text-gray-400 font-medium">Revisite os livros que você já explorou.</p>
      </div>

      {historyItems.length === 0 ? (
        <div className="py-20 text-center text-gray-400 bg-white rounded-[2.5rem] border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-xl font-bold">Nenhum livro lido ainda</p>
          <p className="mt-1">Comece sua jornada literária explorando a biblioteca!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item, idx) => (
            <div 
              key={`${item.bookId}-${idx}`}
              onClick={() => item.book && onBookClick(item.book)}
              className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group active:scale-[0.98]"
            >
              <img src={item.book?.coverUrl} className="w-16 h-20 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform" alt="" />
              <div className="flex-1">
                <h3 className="font-black text-gray-800 line-clamp-1">{item.book?.title}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{item.book?.category}</p>
                <p className="text-[10px] text-[#0F9D58] font-bold mt-1">Lido em {new Date(item.readAt).toLocaleDateString()}</p>
              </div>
              <div className="p-3 text-[#0F9D58] opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
