
import React from 'react';

export const COLORS = {
  white: '#FFFFFF',
  green: '#0F9D58',
  greenLight: '#E8F5E9',
  orange: '#FF9800',
  orangeDark: '#F57C00',
  text: '#1F2937',
};

export const MOCK_BOOKS: any[] = [
  {
    id: '1',
    title: 'A Arte da Sabedoria',
    author: 'Baltasar Gracián',
    category: 'Filosofia',
    summary: 'Um guia prático para a vida e os costumes sociais.',
    coverUrl: 'https://picsum.photos/seed/wisdom/400/600',
    pdfUrl: 'https://www.gutenberg.org/ebooks/search/?query=wisdom',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Código Limpo',
    author: 'Robert C. Martin',
    category: 'Tecnologia',
    summary: 'Habilidades práticas do software Agile.',
    coverUrl: 'https://picsum.photos/seed/code/400/600',
    pdfUrl: 'https://archive.org/details/clean-code-a-handbook-of-agile-software-craftsmanship-by-robert-c.-martin',
    createdAt: Date.now(),
  }
];

export const MOCK_CATEGORIES = [
  { id: 'cat1', name: 'Tecnologia' },
  { id: 'cat2', name: 'Filosofia' },
  { id: 'cat3', name: 'Literatura' },
  { id: 'cat4', name: 'Artes' },
];

export const APP_INFO = {
  name: 'Biblioteca JIMUI',
  creator: 'Comissão de Cultura da JIMUI',
  purpose: 'A Biblioteca JIMUI foi criada para democratizar o acesso ao conhecimento e à cultura para todos os membros da nossa comunidade. Este aplicativo permite que você leve seus livros favoritos para qualquer lugar, funcionando inclusive sem conexão com a internet.',
  version: '1.0.0',
};

export const ICONS = {
  Search: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  Heart: ({ filled }: { filled?: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${filled ? 'text-orange-500' : ''}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  Admin: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Wifi: ({ online }: { online: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${online ? 'text-green-500' : 'text-gray-400'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 1 1-1.06 1.06.75.75 0 0 1 1.06-1.06Z" />
    </svg>
  ),
  Info: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 12L12 16.5m0 0L16.5 12M12 16.5V3" />
    </svg>
  ),
  BookOpen: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
    </svg>
  ),
};
