
import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { ICONS } from '../constants';
import { db } from '../services/db';
import { generateBookSummary } from '../services/gemini';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  isFavorite: boolean;
  isCached: boolean;
  onToggleFavorite: () => void;
  userId: string;
  onRead: (book: Book) => void;
  onDownloadComplete: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ 
  book, onClose, isFavorite, isCached, onToggleFavorite, userId, onRead, onDownloadComplete 
}) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  const getAiInsights = async () => {
    setLoadingAi(true);
    const summary = await generateBookSummary(book.title, book.author);
    setAiSummary(summary);
    setLoadingAi(false);
  };

  const handleRead = async () => {
    await db.addToHistory(userId, book.id);
    onRead(book);
  };

  const handleDownload = async () => {
    if (isCached) {
      if (confirm("Este livro já está guardado. Deseja remover do dispositivo para liberar espaço?")) {
        await db.removeFileLocally(book.id);
        onDownloadComplete();
      }
      return;
    }

    setDownloadProgress(0);
    
    // Conteúdo simulado que seria baixado (Texto completo do livro)
    const mockBookContent = `CONTEÚDO OFICIAL DA BIBLIOTECA JIMUI\nTítulo: ${book.title}\nAutor: ${book.author}\n\n` + 
      "CAPÍTULO 1\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. " +
      "Este conteúdo está agora persistido no seu dispositivo local. Mesmo que você feche o navegador ou fique sem internet, " +
      "os dados estão gravados na memória reservada para este aplicativo.\n\n" +
      "CAPÍTULO 2\n\n" + book.summary;

    // Simulação de progresso de rede real
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 30);
      });
    }, 400);

    setTimeout(async () => {
      clearInterval(interval);
      setDownloadProgress(100);
      await db.saveFileLocally(book.id, mockBookContent);
      setTimeout(() => {
        setDownloadProgress(null);
        onDownloadComplete();
      }, 500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl h-[95vh] md:h-auto overflow-y-auto rounded-t-[3rem] md:rounded-[3rem] shadow-2xl relative animate-in slide-in-from-bottom duration-300 no-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 bg-gray-100/80 backdrop-blur-md rounded-2xl hover:bg-gray-200 transition-all z-10"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row gap-8 p-8 md:p-12">
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="relative group">
              <img 
                src={book.coverUrl} 
                alt={book.title}
                className="w-full aspect-[3/4.5] object-cover rounded-[2.5rem] shadow-2xl shadow-gray-200"
              />
              {isCached && (
                <div className="absolute top-4 left-4 bg-[#0F9D58] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1 animate-in zoom-in duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  NO DISPOSITIVO
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={handleRead}
                className="col-span-2 py-4.5 bg-[#0F9D58] text-white rounded-2xl font-black text-lg shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <ICONS.BookOpen />
                LER AGORA
              </button>
              
              <button 
                onClick={handleDownload}
                disabled={downloadProgress !== null}
                className={`py-3 rounded-2xl font-black text-[10px] flex flex-col items-center justify-center gap-1 transition-all border relative overflow-hidden ${
                  isCached 
                    ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100' 
                    : 'bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100'
                }`}
              >
                {downloadProgress !== null ? (
                  <>
                    <div className="absolute inset-0 bg-green-100/50" style={{ width: `${downloadProgress}%`, transition: 'width 0.3s ease' }}></div>
                    <span className="relative z-10">{downloadProgress}% GUARDANDO...</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      {isCached ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> : <ICONS.Download />}
                      {isCached ? 'REMOVER DO APP' : 'GUARDAR NO APP'}
                    </div>
                  </>
                )}
              </button>

              <button 
                onClick={onToggleFavorite}
                className={`py-3 rounded-2xl font-black text-[10px] flex items-center justify-center gap-2 transition-all border ${
                  isFavorite ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                }`}
              >
                <ICONS.Heart filled={isFavorite} />
                {isFavorite ? 'FAVORITO' : 'FAVORITAR'}
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div>
              <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {book.category}
              </span>
              <h2 className="text-4xl font-black text-gray-900 mt-4 leading-tight tracking-tight">
                {book.title}
              </h2>
              <p className="text-xl text-[#0F9D58] font-bold mt-2">Por {book.author}</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sinopse da Obra</h4>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                {book.summary}
              </p>
            </div>

            <div className="p-8 bg-green-50/40 rounded-[2.5rem] border border-green-100 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h4 className="text-[10px] font-black text-[#0F9D58] uppercase tracking-widest flex items-center gap-2">
                  AI INSIGHTS (Gemini)
                </h4>
                {!aiSummary && !loadingAi && (
                  <button onClick={getAiInsights} className="text-[10px] font-black text-orange-500 hover:text-orange-600 transition-colors underline">GERAR RESUMO</button>
                )}
              </div>
              
              {loadingAi ? (
                <div className="space-y-3 animate-pulse relative z-10">
                  <div className="h-4 bg-green-200/20 rounded-full w-full"></div>
                  <div className="h-4 bg-green-200/20 rounded-full w-5/6"></div>
                </div>
              ) : aiSummary ? (
                <p className="italic text-gray-700 leading-relaxed relative z-10">"{aiSummary}"</p>
              ) : (
                <p className="text-sm text-gray-400 relative z-10">Use inteligência artificial para resumir esta obra.</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Disponibilidade</p>
                <p className={`text-sm font-black ${isCached ? 'text-[#0F9D58]' : 'text-orange-500'}`}>
                  {isCached ? 'DISPONÍVEL TOTALMENTE OFFLINE' : 'DISPONÍVEL APENAS ONLINE'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                 {isCached ? <ICONS.Wifi online={true} /> : <ICONS.Wifi online={false} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;
