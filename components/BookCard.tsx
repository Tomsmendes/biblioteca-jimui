
import React from 'react';
import { Book } from '../types';
import { ICONS } from '../constants';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  isCached: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isFavorite, isCached, onToggleFavorite, onClick }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
        <img 
          src={book.coverUrl} 
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onClick={onClick}
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all text-gray-400 hover:text-orange-500"
          >
            <ICONS.Heart filled={isFavorite} />
          </button>
          {isCached && (
            <div className="p-2 bg-[#0F9D58]/90 backdrop-blur rounded-full shadow-sm text-white">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
          <p className="text-white text-[10px] font-bold uppercase tracking-wider">{isCached ? 'DISPONÍVEL OFFLINE' : 'DISPONÍVEL ONLINE'}</p>
        </div>
      </div>
      <div className="mt-3" onClick={onClick}>
        <h3 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-[#0F9D58] transition-colors">
          {book.title}
        </h3>
        <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mt-1">{book.category}</p>
      </div>
    </div>
  );
};

export default BookCard;
