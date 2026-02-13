
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface ReadingHistoryItem {
  bookId: string;
  readAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  favorites: string[]; 
  readingHistory: ReadingHistoryItem[];
  cachedBookIds: string[]; // IDs dos livros baixados para uso offline
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  coverUrl: string;
  pdfUrl?: string;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
}
