
import React, { useState, useEffect } from 'react';
import { Book } from '../types';
import { db } from '../services/db';

interface ReaderViewProps {
  book: Book;
  onBack: () => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ book, onBack }) => {
  const [progress, setProgress] = useState(0);
  const [localContent, setLocalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleConnectivity = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleConnectivity);
    window.addEventListener('offline', handleConnectivity);

    const loadContent = async () => {
      // Tenta buscar no armazenamento local físico primeiro
      const stored = await db.getLocalFile(book.id);
      setLocalContent(stored);
      setIsLoading(false);
    };
    loadContent();

    return () => {
      window.removeEventListener('online', handleConnectivity);
      window.removeEventListener('offline', handleConnectivity);
    };
  }, [book.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0F9D58] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Acessando arquivo...</p>
        </div>
      </div>
    );
  }

  // Se estiver offline e NÃO tiver conteúdo local, avisar
  if (!isOnline && !localContent) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center text-red-500 mb-6">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Sem Conexão</h2>
        <p className="text-gray-500 max-w-sm mb-8">
          Você está offline e este livro não foi guardado no dispositivo. Conecte-se à internet para ler ou guarde-o para acesso offline posterior.
        </p>
        <button onClick={onBack} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all hover:scale-105 active:scale-95">
          VOLTAR À BIBLIOTECA
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="px-4 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="font-black text-gray-900 text-sm line-clamp-1">{book.title}</h2>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${localContent ? 'bg-[#0F9D58] animate-pulse' : 'bg-orange-400'}`}></span>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                {localContent ? 'Arquivo Local Persistido' : 'Lendo da Nuvem'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Progresso</p>
            <p className="text-sm font-black text-gray-800">{progress}%</p>
          </div>
          <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-gray-50 overflow-hidden">
        <div className="h-full bg-[#0F9D58] transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="flex-1 bg-[#FDFBF7] overflow-y-auto p-6 md:p-20 relative no-scrollbar">
        <div className="max-w-2xl mx-auto bg-white shadow-xl shadow-gray-200/50 p-10 md:p-16 rounded-[2.5rem] border border-gray-100 min-h-full">
          <div className="mb-12 border-b border-gray-50 pb-8 text-center">
             <h1 className="text-3xl font-black text-gray-900 mb-2">{book.title}</h1>
             <p className="text-orange-500 font-bold uppercase tracking-widest text-[10px]">Página atual: {Math.floor(progress * 3.2) + 1}</p>
          </div>
          
          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-8 font-medium">
             {localContent ? (
               <div className="whitespace-pre-wrap">{localContent}</div>
             ) : (
               <>
                 <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#0F9D58] first-letter:mr-3 first-letter:float-left">
                   Esta obra está sendo carregada via conexão ativa.
                 </p>
                 <p>
                   Para garantir que este conteúdo esteja sempre acessível, mesmo sem internet, utilize a função "GUARDAR NO APP" nos detalhes do livro.
                 </p>
                 <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100 mt-10">
                    <p className="text-orange-800 text-sm font-bold">Aviso de Modo Nuvem:</p>
                    <p className="text-orange-700 text-xs mt-1">Você está lendo a versão online. O progresso de leitura é sincronizado, mas o acesso depende da sua estabilidade de rede.</p>
                 </div>
               </>
             )}
             
             {/* Texto de preenchimento para simular o corpo do livro */}
             <p>A cultura é o que nos define como seres humanos. Através de obras como esta, a Comissão de Cultura da JIMUI busca elevar o espírito de cada membro da nossa comunidade.</p>
             <p>A jornada do conhecimento não tem fim, e cada página virada é um passo em direção a um futuro mais brilhante.</p>
          </div>
          
          <div className="mt-20 pt-10 border-t border-gray-50 text-center text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">
             Fim da Visualização de Amostra • Biblioteca JIMUI
          </div>
        </div>

        {/* Floating Reader Controls */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-900 text-white p-1.5 rounded-2xl shadow-2xl z-50">
           <button className="p-3 hover:bg-white/10 rounded-xl transition-all">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </button>
           <div className="px-4 border-l border-white/10 flex flex-col items-center">
             <span className="text-[8px] font-black text-gray-500 uppercase">Capítulo 01</span>
             <span className="text-xs font-black">Pág. {Math.floor(progress * 3.2) + 1}</span>
           </div>
           <button className="p-3 hover:bg-white/10 rounded-xl transition-all border-l border-white/10">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H7m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </button>
        </div>
      </div>
    </div>
  );
};

export default ReaderView;
